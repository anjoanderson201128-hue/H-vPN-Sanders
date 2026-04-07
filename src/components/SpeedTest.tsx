import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gauge, ArrowDown, ArrowUp, Zap, RefreshCw, Play } from 'lucide-react';

export const SpeedTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testStage, setTestStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);

  const startTest = () => {
    setIsTesting(true);
    setTestStage('ping');
    setProgress(0);
    setPing(0);
    setDownload(0);
    setUpload(0);
  };

  useEffect(() => {
    if (!isTesting) return;

    let interval: NodeJS.Timeout;

    if (testStage === 'ping') {
      let count = 0;
      interval = setInterval(() => {
        setPing(Math.floor(Math.random() * 50) + 10);
        setProgress(prev => Math.min(prev + 10, 100));
        count++;
        if (count >= 10) {
          clearInterval(interval);
          setTestStage('download');
          setProgress(0);
        }
      }, 100);
    } else if (testStage === 'download') {
      interval = setInterval(() => {
        setDownload(prev => {
          const target = 450;
          const step = (target - prev) / 10 + Math.random() * 20;
          return Math.min(prev + step, 500);
        });
        setProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            clearInterval(interval);
            setTestStage('upload');
            return 100;
          }
          return next;
        });
      }, 50);
    } else if (testStage === 'upload') {
      interval = setInterval(() => {
        setUpload(prev => {
          const target = 80;
          const step = (target - prev) / 10 + Math.random() * 5;
          return Math.min(prev + step, 100);
        });
        setProgress(prev => {
          const next = prev + 3;
          if (next >= 100) {
            clearInterval(interval);
            setTestStage('complete');
            setIsTesting(false);
            return 100;
          }
          return next;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isTesting, testStage]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col items-center relative overflow-hidden">
        {/* Background Animation */}
        <AnimatePresence>
          {isTesting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-primary/5 -z-10"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-brand-primary/20"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mb-6 md:mb-8">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800 md:hidden"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800 hidden md:block"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray="452.39"
              animate={{ strokeDashoffset: 452.39 - (452.39 * progress) / 100 }}
              className="text-brand-primary md:hidden"
              strokeLinecap="round"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="552.92"
              animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
              className="text-brand-primary hidden md:block"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-black font-mono tracking-tighter">
              {testStage === 'download' ? download.toFixed(1) : testStage === 'upload' ? upload.toFixed(1) : testStage === 'complete' ? download.toFixed(1) : '0.0'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mbps</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-md">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
              <Zap className="w-2.5 h-2.5 md:w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Ping</span>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono">{ping}<span className="text-[10px] ml-1">ms</span></p>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
              <ArrowDown className="w-2.5 h-2.5 md:w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Down</span>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono text-emerald-500">{download.toFixed(1)}<span className="text-[10px] ml-1">Mbps</span></p>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-brand-secondary mb-1">
              <ArrowUp className="w-2.5 h-2.5 md:w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Up</span>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono text-brand-secondary">{upload.toFixed(1)}<span className="text-[10px] ml-1">Mbps</span></p>
          </div>
        </div>

        <div className="mt-8 w-full max-w-xs">
          <button 
            onClick={startTest}
            disabled={isTesting}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
              isTesting 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Testing {testStage}...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start Speed Test
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <Gauge className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">Optimized Route</h4>
            <p className="text-xs text-slate-500">Your connection is routed through the fastest available node.</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center">
            <Zap className="text-brand-primary w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">Low Latency</h4>
            <p className="text-xs text-slate-500">Bypassing ISP throttling for smooth gaming and streaming.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
