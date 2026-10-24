import { useState } from 'react';
import CameraView from './components/CameraView';
import AnalysisPanel from './components/AnalysisPanel';
import { analyzeLeaf, LeafAnalysis } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Trees } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<LeafAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const handleCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setShowMobilePanel(true);
    try {
      const result = await analyzeLeaf(base64);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze leaf:', error);
      // You could add a toast notification here
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="app-container" className="flex flex-col md:flex-row h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden">
      {/* Sidebar/Logo for Desktop */}
      <div className="hidden lg:flex flex-col w-20 bg-emerald-950 border-r border-emerald-800/50 items-center py-8 justify-between">
        <div className="flex flex-col items-center gap-6">
          <div className="p-3 bg-emerald-400 rounded-2xl shadow-lg shadow-emerald-400/20">
            <Leaf className="w-8 h-8 text-emerald-950" />
          </div>
          <div className="writing-vertical-rl rotate-180 flex items-center gap-4 text-emerald-500/50 uppercase tracking-[0.3em] font-black text-xs">
            <span className="text-emerald-400">LeafSense AI</span>
            <span>Est. 2026</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 items-center italic text-emerald-500/30 text-[10px] font-serif">
          <span>AI</span>
          <span>Vision</span>
          <span>Nature</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Panel: Camera */}
        <section className="flex-1 relative z-10">
          <CameraView onCapture={handleCapture} isAnalyzing={isAnalyzing} />
          
          {/* Logo overlay for mobile */}
          <div className="absolute top-6 left-6 flex items-center gap-3 md:hidden">
            <div className="p-2 bg-emerald-400 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-950" />
            </div>
            <span className="font-black tracking-tighter text-white drop-shadow-md">LEAF SENSE</span>
          </div>
        </section>

        {/* Right Panel: Analysis */}
        <section className={`
          ${showMobilePanel ? 'flex' : 'hidden md:flex'} 
          fixed md:relative inset-0 md:inset-auto z-20 
          w-full md:w-[400px] lg:w-[450px] xl:w-[500px] 
          bg-white flex-col
        `}>
          {/* Mobile Back Button */}
          <div className="md:hidden p-4 bg-white border-b border-slate-100 flex items-center justify-between">
             <button 
               onClick={() => setShowMobilePanel(false)}
               className="text-slate-400 p-2 hover:text-slate-900 transition-colors"
             >
               Back to Camera
             </button>
             <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Analysis</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
             <AnalysisPanel data={analysis} isLoading={isAnalyzing} />
          </div>
        </section>
      </main>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-teal-500 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
