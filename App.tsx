import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Gift, 
  MessageCircle, 
  User, 
  Pill, 
  Heart, 
  Activity, 
  Smile, 
  Send,
  Utensils,
  MoreHorizontal,
  Bell,
  LogOut,
  ChevronRight,
  Settings,
  CreditCard,
  Network,
  Brain,
  Check,
  Info,
  Search,
  Sparkles,
  Camera,
  GitMerge,
  Layout,
  ClipboardList
} from 'lucide-react';
import { HeroCard } from './components/HeroCard';
import { QuickNav } from './components/QuickNav';
import { RewardCard } from './components/RewardCard';
import { BannerCarousel } from './components/BannerCarousel';
import { SectionBanner } from './components/SectionBanner';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { MedicalFlowchart } from './components/MedicalFlowchart';
import { SlitLampChecklist } from './components/SlitLampChecklist';
import { AIBrainView } from './components/AIBrainView';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { generateHealthAdvice, extractKnowledgeGraph, generateRandomHealthQuestion, analyzeMedicalImage } from './services/geminiService';
import { QuickNavItem, RewardItem, ChatMessage, Tab, KnowledgeGraphData, FlowchartData, LearnedConcept, MedicalChecklist } from './types';

// --- MOCK DATA ---
const NAV_ITEMS: QuickNavItem[] = [
  { id: '1', label: 'Dental', icon: Smile },
  { id: '2', label: 'Food', icon: Utensils },
  { id: '3', label: 'Cardio', icon: Heart },
  { id: '4', label: 'Pharmacy', icon: Pill },
  { id: '5', label: 'Wellness', icon: Activity },
  { id: '6', label: 'Others', icon: MoreHorizontal },
];

const REWARD_ITEMS: RewardItem[] = [
  {
    id: '1',
    title: 'โปรแกรมกายภาพบำบัด (Physical Therapy)',
    category: 'Clinic',
    points: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500',
    description: '1 hour session'
  },
  {
    id: '2',
    title: 'ชุดอาหารคลีนเพื่อสุขภาพ (Healthy Meal Set)',
    category: 'Food',
    points: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500',
    description: '5 boxes set'
  },
  {
    id: '3',
    title: 'ตรวจสุขภาพประจำปี (Annual Checkup)',
    category: 'Checkup',
    points: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1579684385136-4f8995f52a76?auto=format&fit=crop&q=80&w=500',
    description: 'Basic package'
  },
  {
    id: '4',
    title: 'วิตามินรวม (Multivitamins)',
    category: 'Pharmacy',
    points: 800,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=500',
    description: '30 capsules'
  },
  {
    id: '5',
    title: 'สลัดผักออร์แกนิค (Organic Salad)',
    category: 'Food',
    points: 450,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500',
    description: 'Fresh bowl'
  },
  {
    id: '6',
    title: 'นวดอโรมา (Aromatherapy Spa)',
    category: 'Services',
    points: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500',
    description: '90 mins'
  }
];

const REWARD_CATEGORIES = ['All', 'Clinic', 'Food', 'Checkup', 'Pharmacy', 'Services'];

// Maintenance Mode - ตั้งค่าเป็น true เพื่อเปิดหน้า maintenance
// หรือใช้ environment variable: VITE_MAINTENANCE_MODE=true
const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true' || false;

const App: React.FC = () => {
  // ถ้าเปิด maintenance mode ให้แสดงหน้า maintenance
  if (MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'สวัสดีครับ มีเรื่องสุขภาพอะไรให้ช่วยดูแลวันนี้ไหมครับ? (Hello! How can I help with your health today?)' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced AI Features State
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], edges: [] });
  const [flowchartData, setFlowchartData] = useState<FlowchartData>({ nodes: [], edges: [] });
  const [checklistData, setChecklistData] = useState<MedicalChecklist>({ title: '', items: [] });
  
  // 'CHAT' | 'GRAPH' | 'FLOWCHART' | 'CHECKLIST'
  const [chatViewMode, setChatViewMode] = useState<'CHAT' | 'GRAPH' | 'FLOWCHART' | 'CHECKLIST'>('CHAT');
  
  const [learnedConcepts, setLearnedConcepts] = useState<LearnedConcept[]>([]);
  const [showBrainView, setShowBrainView] = useState(false);

  // Rewards State
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatViewMode]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // 1. Generate Text Response
      let accumulatedText = '';
      await generateHealthAdvice(userMsg, (text) => {
        accumulatedText = text;
        // Optimization: Don't update state on every chunk for smoother UI on mobile
      });
      
      setMessages(prev => [...prev, { role: 'model', text: accumulatedText }]);

      // 2. Extract Knowledge Graph
      const newGraphData = await extractKnowledgeGraph(userMsg + " " + accumulatedText);
      if (newGraphData.nodes.length > 0) {
        setGraphData(prev => ({
           nodes: [...prev.nodes, ...newGraphData.nodes.filter(n => !prev.nodes.some(pn => pn.id === n.id))],
           edges: [...prev.edges, ...newGraphData.edges]
        }));
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'ขออภัยครับ เกิดข้อผิดพลาด (Error occurred)', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      setMessages(prev => [...prev, { 
          role: 'user', 
          text: 'Uploaded an image', 
          imageUrl: base64String 
      }]);
      setIsLoading(true);
      
      // Auto switch to graph view initially to show "Analysis" state if desired, 
      // but let's stick to chat until we know what it is.
      
      try {
          const result = await analyzeMedicalImage(base64Data, file.type);
          
          setMessages(prev => [...prev, { role: 'model', text: result.text }]);
          
          // Update Graph
          if (result.graphData.nodes.length > 0) {
             setGraphData(prev => ({
                nodes: [...prev.nodes, ...result.graphData.nodes.filter(n => !prev.nodes.some(pn => pn.id === n.id))],
                edges: [...prev.edges, ...result.graphData.edges]
             }));
          }

          // Update Flowchart
          if (result.flowchartData.nodes.length > 0) {
              setFlowchartData(result.flowchartData);
              // If flowchart exists, it's likely a complex diagnosis, hint user to view it
              // setTimeout(() => setChatViewMode('FLOWCHART'), 1000); 
          }

          // Update Checklist
          if (result.checklistData.items.length > 0) {
              setChecklistData(result.checklistData);
              // Automatically switch to checklist view for medical verification
              setTimeout(() => setChatViewMode('CHECKLIST'), 500);
          } else if (result.flowchartData.nodes.length > 0) {
               // Fallback to flowchart if no checklist but flowchart exists
              setTimeout(() => setChatViewMode('FLOWCHART'), 500);
          }

      } catch (error) {
          setMessages(prev => [...prev, { role: 'model', text: 'Failed to analyze image.', isError: true }]);
      } finally {
          setIsLoading(false);
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTrainAI = () => {
    if (graphData.nodes.length === 0) return;

    const newConcepts: LearnedConcept[] = graphData.nodes.map(node => ({
        ...node,
        learnedAt: new Date(),
        confidence: 0.8 + Math.random() * 0.2, // Mock confidence
        sourceInteraction: 'Chat Analysis'
    }));

    // Filter duplicates
    const uniqueNew = newConcepts.filter(n => !learnedConcepts.some(existing => existing.id === n.id));
    
    setLearnedConcepts(prev => [...prev, ...uniqueNew]);
    
    // Clear current graph to simulate "absorption"
    setGraphData({ nodes: [], edges: [] });
    
    // Show confirmation
    setMessages(prev => [...prev, { role: 'model', text: `🧠 เรียนรู้ข้อมูลใหม่ ${uniqueNew.length} รายการเรียบร้อยแล้วครับ! (Learned ${uniqueNew.length} new concepts!)` }]);
  };

  const handleRandomQuestion = async () => {
      setIsLoading(true);
      const question = await generateRandomHealthQuestion();
      setMessages(prev => [...prev, { role: 'model', text: question }]);
      setIsLoading(false);
  };

  const filteredRewards = selectedCategory === 'All' 
    ? REWARD_ITEMS 
    : REWARD_ITEMS.filter(item => item.category === selectedCategory);

  if (!isLoggedIn) {
    if (showRegister) {
      return <RegisterScreen onRegister={() => setIsLoggedIn(true)} onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-slate-50 relative overflow-hidden max-w-7xl mx-auto lg:shadow-lg">
      
      {/* AI Brain Overlay */}
      {showBrainView && (
          <AIBrainView knowledge={learnedConcepts} onClose={() => setShowBrainView(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-20 md:pb-24 lg:pb-6">
        
        {/* HOME TAB */}
        {activeTab === Tab.HOME && (
          <div className="space-y-4 md:space-y-6 pb-6 animate-fade-in max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 px-4 md:px-6 lg:px-8 py-3 md:py-4 backdrop-blur-md border-b border-slate-100">
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 font-kanit">สวัสดี, คุณสมชาย 👋</h1>
                <p className="text-xs md:text-sm text-slate-500 font-kanit">Member Gold Class</p>
              </div>
              <div className="flex gap-2 md:gap-3">
                 <button 
                   onClick={() => setShowBrainView(true)}
                   className="relative rounded-full bg-slate-100 p-2 md:p-2.5 text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#0056b3]"
                 >
                   <Brain className="h-5 w-5 md:h-6 md:w-6" />
                   {learnedConcepts.length > 0 && (
                     <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-bounce">
                       {learnedConcepts.length}
                     </span>
                   )}
                 </button>
                 <button className="rounded-full bg-slate-100 p-2 md:p-2.5 text-slate-600 transition-colors hover:bg-slate-200">
                    <Bell className="h-5 w-5 md:h-6 md:w-6" />
                 </button>
              </div>
            </div>

            {/* Hero Card */}
            <div className="px-4 md:px-5 lg:px-6">
              <HeroCard />
            </div>

            {/* Quick Nav */}
            <div>
              <div className="px-4 md:px-6 lg:px-8 pb-2">
                <h2 className="text-sm md:text-base font-bold text-slate-700 font-kanit">บริการด่วน (Quick Service)</h2>
              </div>
              <QuickNav items={NAV_ITEMS} />
            </div>

            {/* Banners */}
            <BannerCarousel />

            {/* Section Banner */}
            <div className="px-4 md:px-5 lg:px-6 pt-2">
              <SectionBanner />
            </div>

            {/* Recommended Rewards Preview */}
            <div className="px-4 md:px-5 lg:px-6">
               <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-sm md:text-base font-bold text-slate-700 font-kanit">สิทธิพิเศษแนะนำ (Recommended)</h2>
                 <button 
                    onClick={() => setActiveTab(Tab.REWARDS)}
                    className="text-xs md:text-sm font-medium text-[#0056b3] font-kanit hover:underline"
                 >
                    ดูทั้งหมด
                 </button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {REWARD_ITEMS.slice(0, 4).map(item => (
                    <div key={item.id} className="h-56 md:h-64">
                       <RewardCard item={item} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === Tab.REWARDS && (
          <div className="min-h-full bg-slate-50 px-4 md:px-5 lg:px-6 pt-4 md:pt-6 pb-6 animate-fade-in max-w-6xl mx-auto w-full">
             <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 font-kanit">แลกของรางวัล</h1>
                <p className="text-xs md:text-sm text-slate-500 font-kanit">ใช้คะแนนสะสมของคุณแลกรับสิทธิพิเศษ</p>
             </div>

             {/* Categories */}
             <div className="mb-4 md:mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {REWARD_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-colors font-kanit ${
                      selectedCategory === cat 
                      ? 'bg-[#222222] text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0056b3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             {/* Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-20 md:pb-24 lg:pb-6">
                {filteredRewards.map(item => (
                  <div key={item.id} className="h-56 md:h-64 lg:h-72">
                    <RewardCard item={item} />
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === Tab.AI_CHAT && (
          <div className="flex h-full flex-col bg-slate-50 max-w-6xl mx-auto w-full lg:shadow-lg">
            {/* Chat Header with Toggle */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 md:px-4 lg:px-6 py-2 md:py-3 shadow-sm z-20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#0056b3] to-[#00a8e8] shadow-md">
                   <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xs md:text-sm lg:text-base font-bold text-slate-800 font-kanit">AI Health Assistant</h2>
                  <p className="text-[9px] md:text-[10px] text-green-500 flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              
              {/* View Mode Toggles */}
              <div className="flex bg-slate-100 rounded-lg p-0.5 md:p-1 gap-0.5 md:gap-1">
                 <button 
                   onClick={() => setChatViewMode('CHAT')}
                   className={`p-1 md:p-1.5 rounded-md transition-all ${chatViewMode === 'CHAT' ? 'bg-white shadow text-[#0056b3]' : 'text-slate-400'}`}
                   title="Chat"
                 >
                   <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                 </button>
                 <button 
                   onClick={() => setChatViewMode('GRAPH')}
                   className={`p-1 md:p-1.5 rounded-md transition-all ${chatViewMode === 'GRAPH' ? 'bg-white shadow text-[#0056b3]' : 'text-slate-400'}`}
                   title="Knowledge Graph"
                 >
                   <Network className="h-3.5 w-3.5 md:h-4 md:w-4" />
                 </button>
                 <button 
                   onClick={() => setChatViewMode('FLOWCHART')}
                   className={`p-1 md:p-1.5 rounded-md transition-all ${chatViewMode === 'FLOWCHART' ? 'bg-white shadow text-[#0056b3]' : 'text-slate-400'}`}
                   title="Flowchart"
                 >
                   <GitMerge className="h-3.5 w-3.5 md:h-4 md:w-4" />
                 </button>
                 <button 
                   onClick={() => setChatViewMode('CHECKLIST')}
                   className={`p-1 md:p-1.5 rounded-md transition-all ${chatViewMode === 'CHECKLIST' ? 'bg-white shadow text-[#0056b3]' : 'text-slate-400'}`}
                   title="Checklist"
                 >
                   <ClipboardList className="h-3.5 w-3.5 md:h-4 md:w-4" />
                 </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              
              {/* MODE: CHAT */}
              <div className={`absolute inset-0 flex flex-col ${chatViewMode === 'CHAT' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
                 <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4 bg-slate-50">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 shadow-sm font-kanit text-xs md:text-sm lg:text-base leading-relaxed ${
                          msg.role === 'user' 
                          ? 'bg-[#0056b3] text-white rounded-br-none' 
                          : msg.isError 
                            ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-none' 
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                        }`}>
                          {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="User Upload" className="mb-2 rounded-lg max-h-32 md:max-h-48 lg:max-h-64 object-cover w-full border border-white/20" />
                          )}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex justify-start animate-pulse">
                         <div className="rounded-2xl bg-slate-200 px-3 md:px-4 py-2.5 md:py-3 rounded-bl-none">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></div>
                              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                         </div>
                       </div>
                    )}
                    <div ref={messagesEndRef} />
                 </div>
                 
                 {/* Input Area */}
                 <div className="bg-white p-2 md:p-3 border-t border-slate-100 flex items-center gap-1.5 md:gap-2 pb-20 md:pb-24 lg:pb-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-slate-100 p-2 md:p-2.5 text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0"
                      title="Upload Image"
                    >
                      <Camera className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleFileUpload}
                    />
                    
                    <button 
                       onClick={handleRandomQuestion}
                       className="rounded-full bg-slate-100 p-2 md:p-2.5 text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0 hidden md:flex"
                       title="Generate Random Question"
                    >
                       <Brain className="h-4 w-4 md:h-5 md:w-5" />
                    </button>

                    <div className="relative flex-1 min-w-0">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="พิมพ์ข้อความ..."
                        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 md:py-2.5 pl-3 md:pl-4 pr-8 md:pr-10 text-xs md:text-sm font-kanit focus:border-[#0056b3] focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() && !isLoading}
                      className="rounded-full bg-[#0056b3] p-2 md:p-2.5 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 hover:bg-blue-700 transition-colors flex-shrink-0"
                    >
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                 </div>
              </div>

              {/* MODE: GRAPH */}
              <div className={`absolute inset-0 bg-slate-50 ${chatViewMode === 'GRAPH' ? 'z-10' : 'z-0 hidden'}`}>
                  <KnowledgeGraph data={graphData} isLoading={isLoading} onTrain={handleTrainAI} />
                  {/* Legend Overlay */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/90 backdrop-blur p-2 md:p-3 rounded-lg md:rounded-xl shadow-sm border border-slate-100 text-[10px] md:text-xs font-kanit space-y-1 md:space-y-2 pointer-events-none">
                     <div className="flex items-center gap-1.5 md:gap-2"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500"></span> Symptom</div>
                     <div className="flex items-center gap-1.5 md:gap-2"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500"></span> Disease</div>
                     <div className="flex items-center gap-1.5 md:gap-2"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></span> Medicine</div>
                  </div>
              </div>

              {/* MODE: FLOWCHART */}
              <div className={`absolute inset-0 bg-slate-50 ${chatViewMode === 'FLOWCHART' ? 'z-10' : 'z-0 hidden'}`}>
                  <MedicalFlowchart data={flowchartData} isLoading={isLoading} />
              </div>

              {/* MODE: CHECKLIST */}
              <div className={`absolute inset-0 bg-slate-50 ${chatViewMode === 'CHECKLIST' ? 'z-10' : 'z-0 hidden'}`}>
                  <SlitLampChecklist data={checklistData} isLoading={isLoading} />
              </div>

            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === Tab.PROFILE && (
          <div className="p-4 md:p-6 lg:p-8 bg-slate-50 animate-fade-in max-w-2xl mx-auto w-full">
             <div className="flex flex-col items-center mb-6 md:mb-8">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 p-1 mb-3 md:mb-4">
                   <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <User className="h-10 w-10 md:h-12 md:w-12 text-slate-400" />
                   </div>
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 font-kanit">สมชาย ใจดี</h2>
                <p className="text-xs md:text-sm text-slate-500 font-kanit">somchai.j@example.com</p>
             </div>

             <div className="space-y-2 md:space-y-3">
                {[
                  { icon: User, label: 'แก้ไขข้อมูลส่วนตัว' },
                  { icon: CreditCard, label: 'ประวัติการแลกคะแนน' },
                  { icon: Settings, label: 'ตั้งค่าการใช้งาน' },
                  { icon: Info, label: 'เกี่ยวกับเรา' },
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-3 md:p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-full bg-slate-100 text-slate-600">
                           <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-slate-700 font-kanit">{item.label}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-slate-300" />
                  </button>
                ))}
                
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center justify-between p-3 md:p-4 mt-4 md:mt-6 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                >
                   <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 rounded-full bg-red-100 text-red-500">
                         <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-red-500 font-kanit">ออกจากระบบ</span>
                   </div>
                </button>
             </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:max-w-7xl md:mx-auto w-full bg-white border-t border-slate-200 px-4 md:px-6 py-2 md:py-3 pb-6 md:pb-8 lg:pb-3 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button 
           onClick={() => setActiveTab(Tab.HOME)}
           className={`flex flex-col items-center gap-0.5 md:gap-1 transition-colors ${activeTab === Tab.HOME ? 'text-[#0056b3]' : 'text-slate-400'}`}
         >
            <Home className={`h-5 w-5 md:h-6 md:w-6 ${activeTab === Tab.HOME ? 'fill-current' : ''}`} />
            <span className="text-[9px] md:text-[10px] font-medium font-kanit">หน้าหลัก</span>
         </button>
         <button 
           onClick={() => setActiveTab(Tab.REWARDS)}
           className={`flex flex-col items-center gap-0.5 md:gap-1 transition-colors ${activeTab === Tab.REWARDS ? 'text-[#0056b3]' : 'text-slate-400'}`}
         >
            <Gift className={`h-5 w-5 md:h-6 md:w-6 ${activeTab === Tab.REWARDS ? 'fill-current' : ''}`} />
            <span className="text-[9px] md:text-[10px] font-medium font-kanit">แลกของ</span>
         </button>
         
         {/* Floating Center Button for AI Chat */}
         <div className="relative -top-5 md:-top-6">
            <button 
              onClick={() => setActiveTab(Tab.AI_CHAT)}
              className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#222222] flex items-center justify-center shadow-xl shadow-slate-400/50 hover:scale-105 transition-transform ring-2 md:ring-4 ring-slate-50"
            >
               <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white animate-pulse" />
            </button>
         </div>

         <button 
           onClick={() => setActiveTab(Tab.AI_CHAT)}
           className={`flex flex-col items-center gap-0.5 md:gap-1 transition-colors ${activeTab === Tab.AI_CHAT ? 'text-[#0056b3]' : 'text-slate-400'}`}
         >
            <MessageCircle className={`h-5 w-5 md:h-6 md:w-6 ${activeTab === Tab.AI_CHAT ? 'fill-current' : ''}`} />
            <span className="text-[9px] md:text-[10px] font-medium font-kanit">AI Chat</span>
         </button>
         <button 
           onClick={() => setActiveTab(Tab.PROFILE)}
           className={`flex flex-col items-center gap-0.5 md:gap-1 transition-colors ${activeTab === Tab.PROFILE ? 'text-[#0056b3]' : 'text-slate-400'}`}
         >
            <User className={`h-5 w-5 md:h-6 md:w-6 ${activeTab === Tab.PROFILE ? 'fill-current' : ''}`} />
            <span className="text-[9px] md:text-[10px] font-medium font-kanit">โปรไฟล์</span>
         </button>
      </div>
    </div>
  );
};

export default App;