"use client";

import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Real-time password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (
      !hasMinLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecial
    ) {
      setError(
        "Password must contain:\n- At least 8 characters\n- Uppercase letter (A-Z)\n- Lowercase letter (a-z)\n- Number (0-9)\n- Special symbol (!@#$%^&*)"
      );
      return;
    }

    setIsLoading(true);

    const result = await signUp(email, password, name, username);

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
              Sign Up
            </h2>
            <p className="text-[14px] text-black">
              Sign up to enjoy the feature of Zen
            </p>
          </div>

          {error && (
            <div className="mt-4 mx-auto w-[80%] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex justify-center mt-8">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Name"
                required
                disabled={isLoading}
              />
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Your Name
              </label>
            </div>

            <div className="relative flex justify-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Username"
                required
                disabled={isLoading}
              />
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Username
              </label>
            </div>

            <div className="relative flex justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Email"
                required
                disabled={isLoading}
              />
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Email
              </label>
            </div>

            <div className="relative flex justify-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-16 top-1/2 -translate-y-1/2 ${
                  showPassword ? "text-gray-700" : "text-gray-400"
                } hover:text-gray-700`}
              >
                👁
              </button>
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Password
              </label>

              {showPasswordRequirements && (
                <div className="absolute left-[92%] top-0 z-10 ml-2 w-64 bg-white border-2 border-blue-300 rounded-lg shadow-xl px-4 py-3 text-sm animate-fadeIn">
                  <div className="absolute left-0 top-4 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-blue-300"></div>
                  <p className="font-semibold text-gray-700 mb-2 text-xs">
                    Password must contain:
                  </p>
                  <ul className="space-y-1.5">
                    <li
                      className={`flex items-center gap-2 text-xs ${
                        hasMinLength ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-bold">
                        {hasMinLength ? "✓" : "○"}
                      </span>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${
                        hasUppercase ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-bold">
                        {hasUppercase ? "✓" : "○"}
                      </span>
                      One uppercase letter (A-Z)
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${
                        hasLowercase ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-bold">
                        {hasLowercase ? "✓" : "○"}
                      </span>
                      One lowercase letter (a-z)
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${
                        hasNumber ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-bold">{hasNumber ? "✓" : "○"}</span>
                      One number (0-9)
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${
                        hasSpecial ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-bold">
                        {hasSpecial ? "✓" : "○"}
                      </span>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative flex justify-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-16 top-1/2 -translate-y-1/2 ${
                  showConfirmPassword ? "text-gray-700" : "text-gray-400"
                } hover:text-gray-700`}
              >
                👁
              </button>
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Confirm Password
              </label>
            </div>

            <div className="flex justify-center m-0">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[radial-gradient(circle,#3b82f6_0%,#1940ac_100%)] text-white px-30 py-2 border-none rounded-xl text-base transition-all duration-300 shadow-[inset_0px_0px_5px_rgba(0,0,0,0.3)] self-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
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
