'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CourseCardProps {
    courseName: string;
    progress?: number; // 0-100, optional
    onClick?: () => void;
    deadline?: string | null;
    iconUrl?: string | null;
}

const calculateDaysLeft = (deadline: string | null | undefined): { text: string; variant: 'urgent' | 'warning' | 'normal' | null } => {
  if (!deadline) return { text: '', variant: null };
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { text: 'Overdue', variant: 'urgent' };
  if (diffDays === 0) return { text: 'Due Today', variant: 'urgent' };
  if (diffDays === 1) return { text: '1 day left', variant: 'urgent' };
  if (diffDays <= 3) return { text: `${diffDays} days left`, variant: 'warning' };
  if (diffDays <= 7) return { text: `${diffDays} days left`, variant: 'normal' };
  return { text: `${diffDays} days left`, variant: 'normal' };
};

export default function CourseCard({ courseName, progress, onClick, deadline, iconUrl }: CourseCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hasProgress = progress !== undefined && progress >= 0;
    const deadlineInfo = calculateDaysLeft(deadline);
    
    const getBadgeStyles = (variant: 'urgent' | 'warning' | 'normal' | null) => {
        if (variant === 'urgent') return 'bg-red-500/20 text-red-400 border border-red-500/30';
        if (variant === 'warning') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        if (variant === 'normal') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        return '';
    };

    return (
        <div
            className="rounded-2xl pr-7 cursor-pointer transition-all duration-300 bg-[#231942] dark:[background:linear-gradient(300deg,var(--color-primary-7)_14.64%,var(--color-secondary-8)_109.56%)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Course Icon */}
                <div
                    className="relative w-[88px] h-[88px] overflow-hidden rounded-2xl flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                >
                    <Image 
                        src={iconUrl || "/cover/cover_1.png"} 
                        alt="Course Icon" 
                        fill
                        sizes="88px"
                        className="object-cover"
                    />
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-light font-medium text-base mb-1 leading-tight">
                        {courseName}
                    </h3>
                    
                    {/* Deadline Badge */}
                    {deadlineInfo.variant && (
                        <div className="mb-2">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${getBadgeStyles(deadlineInfo.variant)}`}>
                                {deadlineInfo.text}
                            </span>
                        </div>
                    )}
                    
                    {/* Progress Info - Only visible on hover if progress exists */}
                    {hasProgress && (
                        <div
                            className="transition-all duration-300 overflow-hidden"
                            style={{
                                opacity: isHovered ? 1 : 0,
                                maxHeight: isHovered ? '50px' : '0px'
                            }}
                        >
                            <div className="text-xs text-gray mb-2">
                                {progress}% completed
                            </div>
                            <div className="w-50 pb-2 bg-blue-accent-7 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${progress}%`,
                                        background: 'var(--color-pink-accent)'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Chevron Icon */}
                <svg 
                    width="12" 
                    height="21" 
                    viewBox="0 0 12 21" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                >
                    <path 
                        d="M1.5 19.5L10.5 10.5L1.5 1.5" 
                        stroke="var(--color-light" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
