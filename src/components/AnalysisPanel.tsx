import { LeafAnalysis } from '../services/geminiService';
import { motion } from 'motion/react';
import { TreeDeciduous, Heart, ShieldPlus, Leaf, Search } from 'lucide-react';

interface AnalysisPanelProps {
  data: LeafAnalysis | null;
  isLoading: boolean;
}

export default function AnalysisPanel({ data, isLoading }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <div id="analysis-loading" className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-400">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-6 flex flex-col items-center"
        >
          <Search className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Analyzing Specimen...</h2>
          <p className="text-slate-500 text-sm mt-2">Consulting botanical database</p>
        </motion.div>
        
        <div className="w-full max-w-xs space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-slate-200 rounded-full animate-pulse w-full" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div id="analysis-empty" className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-500 text-center">
        <Leaf className="w-16 h-16 text-slate-200 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready for Analysis</h2>
        <p className="max-w-xs">Point your camera at a leaf and tap the camera button to identify the plant and check its health.</p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-50">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
            <TreeDeciduous className="w-4 h-4" /> Kind
          </div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
            <Heart className="w-4 h-4" /> Health
          </div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
            <ShieldPlus className="w-4 h-4" /> Care
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Stressed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Diseased': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <motion.div
      id="analysis-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-white overflow-y-auto p-6 md:p-8"
    >
      <header className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-black text-slate-900 leading-none">{data.kind}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight border ${getStatusColor(data.healthStatus)}`}>
            {data.healthStatus}
          </span>
        </div>
        <p className="text-lg italic text-slate-500 font-medium font-serif leading-none">{data.scientificName}</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Health Section */}
        <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <Heart className="w-5 h-5 fill-current" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Health Assessment</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">{data.healthDetails}</p>
        </section>

        {/* Structure Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <TreeDeciduous className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Morphology</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Shape', value: data.structure.shape },
              { label: 'Margin', value: data.structure.margin },
              { label: 'Venation', value: data.structure.venation }
            ].map(item => (
              <div key={item.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Care Tips Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <ShieldPlus className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Care Recommendations</h2>
          </div>
          <div className="space-y-3">
            {data.careTips.map((tip, idx) => (
              <div key={idx} className="flex gap-4 items-start group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">
                  {idx + 1}
                </span>
                <p className="text-slate-600 text-sm pt-0.5 leading-relaxed group-hover:text-slate-900 transition-colors">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 opacity-30 grayscale pointer-events-none">
        <Leaf className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Botanical AI Engine</span>
      </footer>
    </motion.div>
  );
}
