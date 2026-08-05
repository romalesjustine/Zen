'use client';

import { useState } from 'react';
import { signIn } from '@/app/actions/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/Bg.png')] bg-cover bg-center">
      <div className="flex gap-5 relative bg-white rounded-3xl w-[90%] max-w-[850px] min-h-[600px] px-2 shadow-xl items-start">
        <div className="w-[50%] mt-5">
          <Link href="/" className="flex items-center space-x-2 ml-3">
            <Image src="/logo2.png" alt="logo" width={16} height={16} className="rounded-full" />
            <h1 className="text-base font-bold text-black">Zen</h1>
          </Link>

          <div className="text-start ml-15 mt-5">
            <h2 className="text-2xl font-bold text-black text-[28px]">
              Sign In
            </h2>
            <p className="text-[14px] text-black">
              Please login to continue to your account.
            </p>
          </div>

          {error && (
            <div className="mt-4 mx-auto w-[80%] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex justify-center mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                required
                disabled={isLoading}
              />
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Email
              </label>
            </div>

            <div className="relative flex justify-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-16 top-1/2 -translate-y-1/2 ${showPassword ? 'text-gray-700' : 'text-gray-400'} hover:text-gray-700`}
              >
                👁
              </button>
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Password
              </label>
            </div>

            <div className="flex justify-between items-center w-[80%] mx-auto">
              <label className="flex items-center text-sm text-black">
                <input type="checkbox" className="mr-2 rounded" />
                Keep me signed in
              </label>
            </div>

            <div className="flex justify-center m-0">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[radial-gradient(circle,#3b82f6_0%,#1940ac_100%)] text-white px-30 py-2 border-none rounded-xl text-base transition-all duration-300 shadow-[inset_0px_0px_5px_rgba(0,0,0,0.3)] self-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <div className="text-right w-[80%] mx-auto mt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-[#D9D9D9] hover:underline hover:text-black transition duration-300"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Need an account?{' '}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:underline ml-2"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="w-[50%] mt-1.5">
          <Image src="/login-signup-image.png" alt="Zen Image" width={425} height={600} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

