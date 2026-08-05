'use client';
import { useState } from 'react';
import Image from 'next/image';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn?: () => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Password validation
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      alert(
        'Password must contain:\n- At least 8 characters\n- Uppercase letter (A-Z)\n- Lowercase letter (a-z)\n- Number (0-9)\n- Special symbol (!@#$%^&*)'
      );
      return;
    }

    console.log('Sign up submitted:', { name, email, password });
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex gap-5 relative bg-white rounded-3xl w-[90%] max-w-[850px] min-h-[600px] px-2 shadow-xl items-start">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="w-[50%] mt-5">
          {/* Logo */}
          <div className="flex items-center space-x-2 ml-3">
            <Image src="/logo2.png" alt="logo" className="rounded-full" width={16} height={16} />
            <h1 className="text-base font-bold text-black">Zen</h1>
          </div>
          {/* Title */}
          <div className="text-start ml-15 mt-5">
            <h2 className="text-2xl font-bold text-black text-[28px]">
              Sign Up
            </h2>
            <p className="text-[14px] text-black">
              Sign up to enjoy the feature of Zen
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex justify-center mt-8">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Name"
                required
              />
              <label className="absolute left-12 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600">
                Your Name
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

            <div className="relative flex justify-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[80%] px-4 py-2 border border-[#D9D9D9] rounded-md text-black placeholder:text-[#D9D9D9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                required
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
                className="bg-[radial-gradient(circle,#3b82f6_0%,#1940ac_100%)] text-white px-30 py-2 border-none rounded-xl text-base transition-all duration-300 shadow-[inset_0px_0px_5px_rgba(0,0,0,0.3)] self-center"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-[80%] border-t border-gray-300 self-center mx-auto"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="w-80% self-center mx-auto text-black py-2 px-14 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            Sign in with Google <Image src="/google.png" alt="Google Logo" width={24} height={24} />
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-blue-600 font-medium hover:underline ml-2"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="w-[50%] mt-1.5">
          <Image src="/login-signup-image.png" alt="Zen Image" width={400} height={300} />
        </div>
      </div>
    </div>
  );
}
