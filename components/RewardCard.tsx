import React from 'react';
import { RewardItem } from '../types';

interface RewardCardProps {
  item: RewardItem;
  onRedeem?: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ item, onRedeem }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 h-full">
      {/* Image Section */}
      <div className="relative h-28 md:h-32 lg:h-40 w-full overflow-hidden bg-gray-100">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Category Badge - High visibility style */}
        <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 rounded-full bg-gradient-to-r from-[#0056b3]/90 to-[#00a8e8]/90 px-2 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold text-white backdrop-blur-md shadow-md border border-white/20">
          {item.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-2.5 md:p-3">
        <div>
          <h3 className="line-clamp-2 text-xs md:text-sm font-semibold text-[#222222] font-kanit leading-tight">
            {item.title}
          </h3>
          
          {/* Points Highlight - Blue Gradient Text */}
          <p className="mt-1.5 md:mt-2 text-xs md:text-sm font-bold bg-gradient-to-r from-[#0056b3] to-[#00a8e8] bg-clip-text text-transparent font-kanit">
            ใช้ {item.points.toLocaleString()} คะแนน
          </p>
        </div>

        {/* CTA Button */}
        <button 
          onClick={onRedeem}
          className="mt-2 md:mt-3 w-full rounded-lg bg-[#222222] py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-white transition-opacity active:opacity-90 font-kanit hover:bg-black"
        >
          แลกเลย (Redeem)
        </button>
      </div>
    </div>
  );
};