"use client";

import { useState } from "react";
import { resetPassword } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate password complexity
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const missingRequirements = [];
    if (!hasMinLength) missingRequirements.push("At least 8 characters");
    if (!hasUppercase) missingRequirements.push("Uppercase letter (A-Z)");
    if (!hasLowercase) missingRequirements.push("Lowercase letter (a-z)");
    if (!hasNumber) missingRequirements.push("Number (0-9)");
    if (!hasSpecial) missingRequirements.push("Special symbol (!@#$%^&*)");

    if (missingRequirements.length > 0) {
      setError(
        `Password must contain:\n${missingRequirements.map(req => `- ${req}`).join('\n')}`
      );
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(password);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMessage(
          "Password updated successfully! Redirecting to login..."
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
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
              Reset Password
            </h2>
            <p className="text-[14px] text-black">
              Enter your new password below.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mt-4 mx-auto w-[80%] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded whitespace-pre-line">
              {error}
            </div>
          )}

          {/* Success Notification */}
          {successMessage && (
            <div className="mt-4 mx-auto w-[80%] bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="relative flex justify-center mt-8">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
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
                New Password
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="relative flex justify-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-16 top-1/2 -translate-y-1/2 ${showConfirmPassword ? 'text-gray-700' : 'text-gray-400'} hover:text-gray-700`}
              >
                👁
              </button>
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Confirm Password
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center m-0">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[radial-gradient(circle,#3b82f6_0%,#1940ac_100%)] text-white px-30 py-2 border-none rounded-xl text-base transition-all duration-300 shadow-[inset_0px_0px_5px_rgba(0,0,0,0.3)] self-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </div>

            <div className="text-right w-[80%] mx-auto mt-1">
              <Link
                href="/login"
                className="text-sm text-[#D9D9D9] hover:underline hover:text-black transition duration-300"
              >
                Back to Login
              </Link>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline ml-2"
            >
              Sign in
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
