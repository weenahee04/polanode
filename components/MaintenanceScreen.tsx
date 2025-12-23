import React from 'react';
import { Wrench, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface MaintenanceScreenProps {
  title?: string;
  message?: string;
  estimatedTime?: string;
  contactEmail?: string;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  title = "เว็บไซต์ปิดปรับปรุงชั่วคราว",
  message = "เรากำลังปรับปรุงระบบเพื่อให้บริการที่ดีขึ้นแก่คุณ",
  estimatedTime = "ประมาณ 1-2 ชั่วโมง",
  contactEmail = "support@thailife-rewards.com"
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#0056b3]/10 to-[#00a8e8]/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#00a8e8]/10 to-[#0056b3]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-[#0056b3]/5 to-[#00a8e8]/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* Logo/Icon Section */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-down">
          <div className="relative mb-6">
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0056b3] to-[#00a8e8] opacity-20 blur-2xl animate-pulse"></div>
            
            {/* Icon Container */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0056b3] to-[#00a8e8] shadow-2xl shadow-blue-500/30">
              <Wrench className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-3xl font-bold text-slate-800 font-kanit tracking-tight mb-2">
            POLA<span className="text-[#00a8e8]">NODE</span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="w-full space-y-6 animate-fade-in-up">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-kanit mb-2">
              {title}
            </h2>
            <p className="text-base text-slate-600 font-kanit leading-relaxed">
              {message}
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Estimated Time Card */}
            <div className="flex items-center gap-4 rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-md border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-slate-500 font-kanit mb-1">เวลาที่คาดการณ์</p>
                <p className="text-sm font-bold text-slate-800 font-kanit">{estimatedTime}</p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="flex items-center gap-4 rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-md border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-slate-500 font-kanit mb-1">ติดต่อสอบถาม</p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-sm font-bold text-[#0056b3] font-kanit hover:text-[#00a8e8] transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0056b3]/10 to-[#00a8e8]/10 p-5 border border-blue-200/50">
            <p className="text-sm text-slate-700 font-kanit leading-relaxed">
              ขออภัยในความไม่สะดวก เราจะกลับมาให้บริการเร็วๆ นี้
              <br />
              <span className="text-xs text-slate-500 mt-2 block">
                (We apologize for the inconvenience. We'll be back soon!)
              </span>
            </p>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0056b3] to-[#00a8e8] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 font-kanit"
          >
            <span>ลองใหม่อีกครั้ง</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-kanit">
            © 2025 POLANODE. All rights reserved.
          </p>
        </div>
      </div>

      {/* Wave SVG Decoration */}
      <svg 
        className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none" 
        viewBox="0 0 1440 320" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill="#0056b3" 
          fillOpacity="1" 
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

