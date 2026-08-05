"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/auth";
import SubscribeButton from "@/components/dashboard/subscribe-button";
import { useToast } from "@/hooks/use-toast";

// Password strength calculator
const calculatePasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "", color: "", feedback: [] };

  let score = 0;
  const feedback: string[] = [];

  // Length checks
  if (password.length >= 8) score += 20;
  else feedback.push("at least 8 characters");

  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character type checks
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push("lowercase letters");

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push("uppercase letters");

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push("numbers");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
  else feedback.push("special characters");

  // Determine strength level
  let label = "";
  let color = "";

  if (score < 30) {
    label = "Weak";
    color = "bg-red-500";
  } else if (score < 50) {
    label = "Fair";
    color = "bg-yellow-500";
  } else if (score < 75) {
    label = "Good";
    color = "bg-blue-400";
  } else {
    label = "Strong";
    color = "bg-green-500";
  }

  return { score: Math.min(score, 100), label, color, feedback };
};

export default function UpdateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation states
  const hasPassword = formData.password.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordLength = formData.password.length;
  const isPasswordValid = passwordLength >= 8 || passwordLength === 0;
  const showPasswordError = hasPassword && !passwordsMatch;
  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (hasPassword && !passwordsMatch) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (hasPassword && !isPasswordValid) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!formData.username && !formData.email && !formData.password) {
      toast({
        title: "No changes",
        description: "Please fill in at least one field to update",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData: { username?: string; email?: string; password?: string } = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      const result = await updateProfile(updateData);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your profile has been updated successfully!",
          variant: "default",
        });
        // Clear password fields after successful update
        setFormData({
          username: formData.username,
          email: formData.email,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-light mb-1">Account Settings</h2>
        <p className="text-sm text-gray">Update your profile information and security settings</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Username Field */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-medium text-light">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full bg-blue-accent-8/30 p-3 rounded-xl text-light placeholder-gray border border-gray/20 focus:border-pink-accent/50 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-pink-accent/10"
          />
          <p className="text-xs text-gray">Your unique username for the platform</p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-medium text-light">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full bg-blue-accent-8/30 p-3 rounded-xl text-light placeholder-gray border border-gray/20 focus:border-pink-accent/50 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-pink-accent/10"
          />
          <p className="text-xs text-gray">We&apos;ll use this for login and notifications</p>
        </div>

        {/* Divider */}
        <div className="my-2 w-full border-t border-gray/20" />

        {/* Password Section Header */}
        <div>
          <h3 className="text-sm font-medium text-light">Change Password</h3>
          <p className="text-xs text-gray mt-1">Leave empty to keep current password</p>
        </div>

        {/* Password Field */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-medium text-light">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            className={`w-full bg-blue-accent-8/30 p-3 rounded-xl text-light placeholder-gray border transition-all duration-200 focus:outline-none focus:ring-2 ${
              hasPassword && !isPasswordValid
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                : "border-gray/20 focus:border-pink-accent/50 focus:ring-pink-accent/10"
            }`}
          />

          {hasPassword && (
            <div className="w-full flex flex-col gap-3">
              {/* Password Strength Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray">Strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.score < 30 ? "text-red-400" :
                    passwordStrength.score < 50 ? "text-yellow-400" :
                    passwordStrength.score < 75 ? "text-blue-400" :
                    "text-green-400"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>

              {/* Length Validation */}
              <div className="flex items-center gap-2">
                {!isPasswordValid ? (
                  <>
                    <span className="text-red-400">✗</span>
                    <p className="text-xs text-red-400">
                      Password must be at least 8 characters long
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-green-400">✓</span>
                    <p className="text-xs text-green-400">
                      Password length is valid
                    </p>
                  </>
                )}
              </div>

              {/* Password Strength Requirements */}
              {passwordStrength.feedback.length > 0 && (
                <div className="bg-blue-accent-8/20 border border-blue-accent/30 rounded-lg p-3 flex flex-col gap-2">
                  <p className="text-xs text-gray font-medium">Add to strengthen password:</p>
                  <ul className="text-xs text-gray/80 space-y-1">
                    {passwordStrength.feedback.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-accent">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-medium text-light">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className={`w-full bg-blue-accent-8/30 p-3 rounded-xl text-light placeholder-gray border transition-all duration-200 focus:outline-none focus:ring-2 ${
              hasPassword && formData.confirmPassword.length > 0
                ? showPasswordError
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                  : "border-green-500/50 focus:border-green-500/50 focus:ring-green-500/10"
                : "border-gray/20 focus:border-pink-accent/50 focus:ring-pink-accent/10"
            }`}
          />
          <div className="w-full flex flex-col gap-2">
            {hasPassword && formData.confirmPassword.length > 0 && (
              <>
                {showPasswordError ? (
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <p className="text-xs text-red-400">
                      Passwords do not match
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <p className="text-xs text-green-400">
                      Passwords match
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 items-center">
        <SubscribeButton 
          disabled={isLoading || (hasPassword && (!passwordsMatch || !isPasswordValid))} 
          className="mt-2"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </SubscribeButton>
        <p className="text-xs text-gray">Your changes will be saved securely</p>
      </div>
    </form>
  );
}
