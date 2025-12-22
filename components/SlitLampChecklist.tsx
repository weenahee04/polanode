import React, { useState, useEffect } from 'react';
import { MedicalChecklist, ChecklistItem } from '../types';
import { ClipboardCheck, Check, CheckSquare, Square, AlertCircle, Save } from 'lucide-react';

interface SlitLampChecklistProps {
  data: MedicalChecklist;
  isLoading: boolean;
}

export const SlitLampChecklist: React.FC<SlitLampChecklistProps> = ({ data, isLoading }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (data.items.length > 0) {
      setItems(data.items);
    }
  }, [data]);

  const toggleVerify = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // Toggle state: if verified (true) -> unverified (undefined/false)
        // Note: isObserved is what AI saw. isVerified is user override/confirm.
        // Let's implement simple check logic: Checked means "Confirmed Present"
        return { ...item, isVerified: !item.isVerified };
      }
      return item;
    }));
  };

  const handleSave = () => {
    setLastSaved(new Date());
    // In a real app, this would save to backend
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 bg-slate-50 p-8 text-center animate-fade-in">
         <div className="relative">
             <ClipboardCheck className="h-12 w-12 text-slate-300 animate-pulse" />
             <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
         </div>
         <h3 className="text-xl font-bold text-slate-700 font-kanit">กำลังสร้างรายการตรวจ...</h3>
         <p className="text-sm text-slate-500 font-kanit">AI is preparing the verification checklist</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-4 border border-slate-100">
             <ClipboardCheck className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 font-kanit">ไม่มีรายการตรวจ</h3>
        <p className="text-sm text-slate-500 font-kanit mt-2">อัปโหลดรูปภาพ Slit Lamp เพื่อสร้าง Checklist</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-4 pb-24">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-kanit flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#0056b3]" />
              {data.title || "Slit Lamp Checklist"}
            </h2>
            <p className="text-xs text-slate-500 font-kanit">Verify AI findings by checking items</p>
          </div>
          <button 
             onClick={handleSave}
             className="flex items-center gap-2 px-4 py-2 bg-[#222222] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-lg shadow-slate-200"
          >
             <Save className="h-4 w-4" />
             {lastSaved ? 'Saved!' : 'Save'}
          </button>
        </div>

        {/* Groups */}
        {Object.entries(groupedItems).map(([category, groupItems]: [string, ChecklistItem[]]) => (
          <div key={category} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 font-kanit uppercase tracking-wider">{category}</h3>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-400 font-bold">
                {groupItems.length} items
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {groupItems.map(item => {
                const isChecked = item.isVerified !== undefined ? item.isVerified : item.isObserved;
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleVerify(item.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-slate-50 ${isChecked ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 transition-all duration-300 ${isChecked ? 'text-[#0056b3] scale-110' : 'text-slate-300'}`}>
                        {isChecked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium font-kanit ${isChecked ? 'text-slate-800' : 'text-slate-500'}`}>
                          {item.label}
                        </span>
                        {item.isObserved && (
                          <span className="text-[10px] text-blue-500 flex items-center gap-1 font-medium mt-0.5">
                            <AlertCircle className="h-3 w-3" />
                            AI Detected
                          </span>
                        )}
                      </div>
                    </div>
                    {isChecked && (
                       <Check className="h-4 w-4 text-[#0056b3]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 pb-8">
           <p className="text-xs text-slate-400 font-kanit">
              * รายการนี้สร้างโดย AI สำหรับช่วยตรวจสอบเบื้องต้นเท่านั้น แพทย์ควรวินิจฉัยด้วยตนเองเป็นหลัก
           </p>
        </div>

      </div>
    </div>
  );
};