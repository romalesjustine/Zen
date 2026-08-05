'use client';

import Image from 'next/image';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadProfilePicture } from '@/app/actions/auth';
import { useToast } from '@/hooks/use-toast';

export default function ProfileUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleImageFile = async (file: File) => {
        // Validate file type (only accept images)
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: "Please upload an image file",
                variant: "destructive",
            });
            return;
        }

        // Optional: Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast({
                title: "Error",
                description: "File size must be less than 5MB",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        
        // Create preview URL using FileReader
        const reader = new FileReader();
        reader.onloadend = async () => {
            const previewResult = reader.result as string;
            setPreviewUrl(previewResult);
            
            try {
                // Upload to Supabase
                const formData = new FormData();
                formData.append('file', file);
                
                const result = await uploadProfilePicture(formData);
                
                if (result.error) {
                    toast({
                        title: "Error",
                        description: result.error,
                        variant: "destructive",
                    });
                    setPreviewUrl(null);
                } else {
                    toast({
                        title: "Success",
                        description: "Profile picture updated successfully!",
                        variant: "default",
                    });
                    // Preview URL will automatically update from the server
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                toast({
                    title: "Error",
                    description: "Failed to upload profile picture",
                    variant: "destructive",
                });
                setPreviewUrl(null);
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    /**
     * Handles file selection from file input
     */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageFile(file);
        }
    };

    /**
     * Opens file explorer when container is clicked
     */
    const handleClick = () => {
        if (!isLoading) {
            fileInputRef.current?.click();
        }
    };

    /**
     * Handles drag over event to show visual feedback
     */
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isLoading) setIsDragging(true);
    };

    /**
     * Handles drag leave event to remove visual feedback
     */
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    /**
     * Handles file drop event
     */
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && !isLoading) {
            handleImageFile(file);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold text-light mb-1">Profile Picture</h2>
                <p className="text-sm text-gray">Upload a profile photo to personalize your account</p>
            </div>
            
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile picture"
                disabled={isLoading}
            />

            {/* Upload/Preview Container */}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative flex flex-col justify-center items-center gap-3
                    w-32 h-32 rounded-2xl border-2 
                    cursor-pointer transition-all duration-200 overflow-hidden
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-accent/10'}
                    ${isDragging 
                        ? 'border-pink-accent bg-pink-accent/10 shadow-lg shadow-pink-accent/20' 
                        : previewUrl
                        ? 'border-pink-accent/30 bg-blue-accent-8/30'
                        : 'border-dashed border-gray/40 bg-blue-accent-8/20 hover:border-pink-accent/60 hover:bg-blue-accent-8/40'
                    }
                `}
            >
                {previewUrl ? (
                    /* Preview Mode - Show uploaded image */
                    <>
                        <Image
                            src={previewUrl}
                            alt="Profile preview"
                            fill
                            className="object-cover rounded-xl"
                        />
                        <div className={`absolute inset-0 bg-black/0 ${!isLoading && 'hover:bg-black/20'} rounded-xl transition-all duration-200 flex items-center justify-center`}>
                            <span className="text-white/70 text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                                {isLoading ? 'Uploading...' : 'Click to change'}
                            </span>
                        </div>
                    </>
                ) : (
                    /* Upload Mode - Show upload prompt */
                    <>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3333 26.6667L20 20L26.6667 26.6667M20 20V33.3333M8.66667 30H31.3333C32.7333 30 34 28.7333 34 27.3333V9.33333C34 7.93333 32.7333 6.66667 31.3333 6.66667H8.66667C7.26667 6.66667 6 7.93333 6 9.33333V27.3333C6 28.7333 7.26667 30 8.66667 30Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-accent/60"/>
                        </svg>
                        <div className="text-center">
                            <p className="text-gray text-sm font-medium">
                                {isLoading ? 'Uploading...' : 'Upload photo'}
                            </p>
                            <p className="text-gray/50 text-xs">PNG, JPG up to 5MB</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
