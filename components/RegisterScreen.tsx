import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react';

interface RegisterScreenProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-md mx-auto w-full">
        <button 
          onClick={onSwitchToLogin}
          className="mb-4 md:mb-6 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-6 md:mb-8 animate-fade-in-down">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 font-kanit">สร้างบัญชีใหม่ (Create Account)</h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 font-kanit">สมัครสมาชิกเพื่อรับสิทธิพิเศษมากมาย</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 animate-fade-in-up">
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-semibold text-slate-600 font-kanit">ชื่อ-นามสกุล (Full Name)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-xs md:text-sm text-slate-800 outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] font-kanit transition-all"
                  placeholder="สมชาย ใจดี"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-semibold text-slate-600 font-kanit">อีเมล (Email Address)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-xs md:text-sm text-slate-800 outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] font-kanit transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-semibold text-slate-600 font-kanit">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 md:py-3 pl-9 md:pl-10 pr-9 md:pr-10 text-xs md:text-sm text-slate-800 outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] font-kanit transition-all"
                  placeholder="กำหนดรหัสผ่านของคุณ"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" className="mt-0.5 md:mt-1 rounded border-slate-300 text-[#0056b3] focus:ring-[#0056b3]" required />
              <label htmlFor="terms" className="text-[10px] md:text-xs text-slate-500 font-kanit leading-relaxed">
                ฉันยอมรับ <a href="#" className="font-medium text-[#0056b3]">เงื่อนไขการใช้งาน</a> และ <a href="#" className="font-medium text-[#0056b3]">นโยบายความเป็นส่วนตัว</a>
              </label>
            </div>

            <button 
              type="submit"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#0056b3] to-[#00a8e8] py-3 md:py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 font-kanit"
            >
              สมัครสมาชิก (Register)
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-slate-500 font-kanit">
              มีบัญชีอยู่แล้ว? (Already have an account?){' '}
              <button onClick={onSwitchToLogin} className="font-bold text-[#0056b3] hover:underline">
                เข้าสู่ระบบ (Log In)
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};