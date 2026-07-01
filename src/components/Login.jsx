import React, { useState } from 'react';
import { CreditCard, Loader2, Lock, Mail, User } from 'lucide-react';
import { authService } from '../services/api';

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggles between true (Sign In) and false (Sign Up)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // Sign In Execution Pipeline
        const userData = await authService.login({ username: email, password });
        onLoginSuccess(userData);
      } else {
         // Dual-map every field variant so Spring Boot catches exactly what it needs!
         const registrationPayload = {
           name: name,
           fullName: name,
           username: email,
           email: email,
           password: password
         };

         await authService.register(registrationPayload);
         setSuccessMessage('Account created successfully! Please sign in.');
         setIsLogin(true); // Switch view to sign-in
         setName('');
         setPassword('');
       }
    } catch (err) {
      console.error("Auth pipeline rejection:", err);
      setError(err.message || err.error || 'Security check rejected this request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-sm">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinTrack Pro</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Gateway Security</p>
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 sm:rounded-xl shadow-sm sm:px-10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {isLogin ? 'Sign in to workspace' : 'Create your account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isLogin ? 'Enter your administrative credentials.' : 'Fill in your details to register.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-xs font-medium">
              {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Field - ONLY visible on Sign Up */}
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ayush Prajapati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {/* Username / Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" /> Username / Email
              </label>
              <input
                type="text"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-400" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 border border-transparent rounded-lg text-sm font-medium shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isLogin ? (
                'Authenticate Session'
              ) : (
                'Register Account'
              )}
            </button>
          </form>

          {/* Toggle Button Action link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none outline-none"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;