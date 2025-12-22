import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="flex flex-1 flex-col justify-center">
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center animate-fade-in-down">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0056b3] to-[#00a8e8] shadow-lg shadow-blue-500/20">
             <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v20M2 12h20" className="opacity-50" />
               <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" strokeWidth="3" />
             </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-kanit tracking-tight">
            POLA<span className="text-[#00a8e8]">NODE</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-kanit">เข้าสู่ระบบเพื่อใช้งาน (Sign in to continue)</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 font-kanit">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] font-kanit transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 font-kanit">Password</label>
              <button type="button" className="text-xs font-medium text-[#0056b3] hover:underline font-kanit">ลืมรหัสผ่าน? (Forgot Password?)</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] font-kanit transition-all"
                placeholder="Enter your password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0056b3] to-[#00a8e8] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 font-kanit"
          >
            เข้าสู่ระบบ (Login)
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-kanit">
            ยังไม่มีบัญชี? (Don't have an account?){' '}
            <button onClick={onSwitchToRegister} className="font-bold text-[#0056b3] hover:underline">
              สมัครสมาชิก (Sign Up)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};