'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { forgotPassword } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMessage(`We have sent a password reset link to ${email}`);
        setEmail('');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/Bg.png')] bg-cover bg-center font-sans">
      <div className="flex gap-5 relative bg-white rounded-3xl w-[90%] max-w-[850px] min-h-[600px] px-2 shadow-xl items-start overflow-hidden">
        <div className="w-full md:w-[50%] mt-8 pl-4 pr-2 flex flex-col h-full pb-8">
          <Link href="/" className="flex items-center space-x-2 ml-1 no-underline">
            <Image src="/logo2.png" alt="logo" width={20} height={20} className="rounded-full" />
            <h1 className="text-lg font-bold text-black">Zen</h1>
          </Link>

          <div className="text-start ml-1 mt-10 mb-2">
            <h2 className="text-[28px] font-bold text-black leading-tight">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 mt-3 pr-4 leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Messages Area */}
          <div className="mt-2 min-h-[20px]">
            {/* Error Notification */}
            {error && (
              <div className="w-[90%] mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center animate-pulse mb-4">
                {error}
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="w-[90%] mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center mb-4">
                {successMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            
            {/* Email Input */}
            <div className="relative w-[90%] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-xl text-black placeholder:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter email"
                required
                disabled={isLoading}
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs font-medium text-gray-500">
                Email
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center w-[90%] mx-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[radial-gradient(circle_at_center,#3b82f6_0%,#1940ac_100%)] text-white py-3 border-none rounded-xl text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? 'Sending...' : 'Send reset password link'}
              </button>
            </div>

            {/* Links Section */}
            <div className="text-center space-y-5 pt-2">
                {/* Back to Login (Direct Link) */}
                <div>
                     <Link
                        href="/login"
                        className="text-sm text-gray-400 hover:text-gray-800 transition-colors duration-300 font-medium no-underline"
                    >
                        Back to Login
                    </Link>
                </div>

                {/* Sign In Prompt */}
                <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link
                        href="/login"
                        className="text-blue-600 font-bold hover:underline ml-1"
                    >
                    Sign in
                    </Link>
                </p>
            </div>
          </form>
        </div>

        <div className="w-[50%] mt-1.5">
          <Image src="/login-signup-image.png" alt="Zen Image" width={425} height={600} className="object-cover" />
        </div>
      </div>
    </div>
  );
}