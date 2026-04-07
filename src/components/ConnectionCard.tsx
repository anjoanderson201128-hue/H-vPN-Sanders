import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, ArrowUp, ArrowDown, Globe, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConnectionStats, Operator, AppConfig } from '../types';

interface ConnectionCardProps {
  isConnected: boolean;
  onToggle: () => void;
  stats: ConnectionStats;
  operators: Operator[];
  currentConfig: AppConfig;
  onSelectOperator: (op: Operator) => void;
  isAdmin?: boolean;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ 
  isConnected, 
  onToggle, 
  stats, 
  operators, 
  currentConfig, 
  onSelectOperator,
  isAdmin = false
}) => {
  const [showOperators, setShowOperators] = useState(false);

  const activeOperator = operators.find(op => op.sni === currentConfig.sni && op.protocol === currentConfig.protocol);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[350px] md:min-h-[400px]">
        {/* Background Glow */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000 opacity-20",
          isConnected ? "bg-brand-primary blur-[100px]" : "bg-slate-800 blur-[100px]"
        )} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={cn(
            "w-36 h-36 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-500 border-8",
            isConnected 
              ? "bg-brand-primary border-brand-primary/20 glow-primary" 
              : "bg-slate-800 border-slate-700"
          )}
        >
          <Power className={cn("w-12 h-12 md:w-16 md:h-16 mb-2", isConnected ? "text-white" : "text-slate-500")} />
          <span className={cn("font-bold text-xs md:text-sm tracking-widest uppercase", isConnected ? "text-white" : "text-slate-500")}>
            {isConnected ? 'Connected' : 'Connect'}
          </span>
        </motion.button>

        <div className="mt-8 md:mt-12 grid grid-cols-2 gap-6 md:gap-12 w-full max-w-md z-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-brand-primary mb-1">
              <ArrowDown className="w-3 h-3 md:w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter">Download</span>
            </div>
            <span className="text-xl md:text-2xl font-mono font-bold tracking-tight">{stats.download}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-brand-secondary mb-1">
              <ArrowUp className="w-3 h-3 md:w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter">Upload</span>
            </div>
            <span className="text-xl md:text-2xl font-mono font-bold tracking-tight">{stats.upload}</span>
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-3 md:gap-6 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <Globe className="w-3 h-3 md:w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-300">{stats.ip}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <ShieldCheck className="w-3 h-3 md:w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300">{currentConfig.protocol}</span>
          </div>
        </div>
      </div>

      {/* Operator Selector */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500">Select Operator</h3>
          <button 
            onClick={() => setShowOperators(!showOperators)}
            className="text-brand-primary text-xs font-bold hover:underline"
          >
            {showOperators ? 'Hide' : 'Change'}
          </button>
        </div>

        {!showOperators ? (
          <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                <Zap className="text-brand-primary w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">{activeOperator?.name || 'Custom Config'}</p>
                {isAdmin && <p className="text-[10px] text-slate-500 font-mono">{currentConfig.sni}</p>}
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {operators.map((op) => (
              <button
                key={op.id}
                onClick={() => {
                  onSelectOperator(op);
                  setShowOperators(false);
                }}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-2xl transition-all text-left",
                  activeOperator?.id === op.id 
                    ? "bg-brand-primary/10 border-brand-primary/50" 
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    activeOperator?.id === op.id ? "bg-brand-primary" : "bg-slate-800"
                  )}>
                    <Zap className={cn("w-4 h-4", activeOperator?.id === op.id ? "text-white" : "text-slate-500")} />
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold", activeOperator?.id === op.id ? "text-brand-primary" : "text-slate-200")}>
                      {op.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">{op.protocol}{isAdmin ? ` • ${op.sni}` : ''}</p>
                  </div>
                </div>
                {activeOperator?.id === op.id && <ShieldCheck className="w-5 h-5 text-brand-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
