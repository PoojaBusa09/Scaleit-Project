import React, { useState } from "react";
import { UserRole, ALL_ROLES } from "../../../types.ts";
import {
  LogoIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  MailIcon,
} from "../../../components/icons.tsx";

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("demo@pinnacleglobal.com");
  const [password, setPassword] = useState("P!nnacle2025$ecure");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("SC");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Full role names with descriptions - CEO is consolidated (SC includes EC functionality)
  const roleDetails: Record<UserRole, { name: string; description: string; highlighted?: boolean }> = {
    EC: { name: "Elevate Member", description: "Individual membership program", highlighted: false },
    SC: {
      name: "CEO Member",
      description: "Full CEO access with team management",
      highlighted: true,
    },
    STM: { name: "Scale Team Member", description: "Member of a Scale team", highlighted: false },
    M: { name: "Mentor", description: "Individual mentor providing guidance", highlighted: false },
    MM: { name: "Mentor Manager", description: "Manages mentor pod", highlighted: false },
    ST: {
      name: "PGN Staff",
      description: "Support staff in Mentor Department",
      highlighted: false,
    },
    AM: {
      name: "Admin Manager",
      description: "Platform administrator/manager",
      highlighted: false,
    },
    SA: { name: "Super Admin", description: "Highest level administrator", highlighted: true },
  };

  // Primary roles to show prominently
  const primaryRoles: UserRole[] = ["SC", "SA"];
  const otherRoles: UserRole[] = ALL_ROLES.filter(r => !primaryRoles.includes(r) && r !== 'EC' && r !== 'STM');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onLogin(selectedRole);
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Password reset link sent to your email!");
    setIsLoading(false);
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/50 rounded-full filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="p-4 bg-primary rounded-2xl shadow-lg">
                <LogoIcon className="h-12 w-12 text-white" />
              </div>
              <div className="ml-5">
                <h1 className="text-4xl font-serif font-bold tracking-widest text-primary">
                  PINNACLE
                </h1>
                <p className="text-sm text-secondary font-bold uppercase tracking-[0.3em] mt-1">
                  Global Network
                </p>
              </div>
            </div>

            {/* Tagline */}
            <h2 className="text-3xl font-bold mb-4 leading-tight text-gray-800">
              Elevate Your Business to New Heights
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join the premier network of CEOs and business leaders committed to
              scaling their companies through strategic coaching and proven
              methodologies.
            </p>

            {/* Features - Enhanced for legibility */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">
                    Strategic Mentoring
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    1-on-1 guidance from experienced mentors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">
                    SCALEit Framework
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Proven methodology for sustainable growth
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-xl shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">AI-Powered Tools</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Smart analytics to accelerate growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <LogoIcon className="h-12 w-12 text-secondary" />
            <div className="ml-3">
              <h1 className="text-2xl font-serif font-bold text-primary tracking-widest">
                PINNACLE
              </h1>
              <p className="text-[0.6rem] text-secondary font-bold uppercase tracking-[0.25em]">
                Global Network
              </p>
            </div>
          </div>

          {!showForgotPassword ? (
            <>
              {/* Header with logo for desktop */}
              <div className="hidden lg:flex items-center justify-center mb-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">Secure Login</span>
                </div>
              </div>

              {/* Sign In Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Sign in to your account
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter your credentials to continue
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-on-surface-variant group-focus-within:text-secondary transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-white border-2 border-outline rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3.5 bg-white border-2 border-outline rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="group">
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Select Role (Demo)
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as UserRole)
                      }
                      className={`block w-full px-4 py-3.5 bg-white border-2 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none appearance-none transition-all cursor-pointer font-medium ${roleDetails[selectedRole].highlighted
                        ? "border-secondary text-primary bg-secondary/5"
                        : "border-outline text-gray-900"
                        }`}
                    >
                      <optgroup label="━━ Primary Roles ━━">
                        {primaryRoles.map((role) => (
                          <option
                            key={role}
                            value={role}
                            className="text-primary bg-secondary/10 font-bold py-2"
                          >
                            ★ {roleDetails[role].name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="━━ Other Roles ━━">
                        {otherRoles.map((role) => (
                          <option
                            key={role}
                            value={role}
                            className="text-gray-700 bg-white py-2"
                          >
                            {roleDetails[role].name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant">
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ml-1 ${roleDetails[selectedRole].highlighted ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                    {roleDetails[selectedRole].highlighted && "★ "}{roleDetails[selectedRole].description}
                  </p>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Sign in to your account"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-gray-700 font-medium text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-gray-700 font-medium text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  Apple
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs">256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs">SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs">99.9% Uptime</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Sales
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <div className="mb-8">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to login</span>
                </button>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Reset Password
                </h2>
                <p className="text-on-surface-variant">
                  Enter your email to receive a password reset link
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-on-surface-variant group-focus-within:text-secondary transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-white border-2 border-outline rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-[#0A1C33] hover:from-[#0A1C33] hover:to-primary text-white rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
