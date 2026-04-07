import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Fingerprint, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SECURITY_FEATURES } from '../constants';

interface SecurityPanelProps {
  isRooted?: boolean;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ isRooted = false }) => {
  return (
    <div className="space-y-6">
      {/* Anti-Tamper Status Indicator */}
      <div className={`glass-panel p-6 rounded-3xl border-2 transition-all duration-500 ${
        isRooted 
          ? 'border-rose-500/50 bg-rose-500/5 shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]' 
          : 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              isRooted ? 'bg-rose-500/20' : 'bg-emerald-500/20'
            }`}>
              {isRooted ? (
                <AlertTriangle className="text-rose-500 w-8 h-8 animate-pulse" />
              ) : (
                <ShieldCheck className="text-emerald-500 w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className={`font-bold text-xl transition-colors duration-500 ${
                isRooted ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {isRooted ? 'THREAT DETECTED' : 'SYSTEM SECURE'}
              </h3>
              <p className="text-slate-400 text-sm">
                {isRooted 
                  ? 'Anti-tamper protocol triggered: Device integrity compromised.' 
                  : 'All anti-tamper protocols are active and monitoring.'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
            isRooted ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {isRooted ? 'Critical' : 'Active'}
          </div>
        </div>
        
        <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isRooted ? '40%' : '100%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full transition-colors duration-500 ${
              isRooted ? 'bg-rose-500' : 'bg-emerald-500'
            }`} 
          />
        </div>
        
        {isRooted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold"
          >
            <ShieldAlert className="w-4 h-4" />
            SECURITY ALERT: Root access detected. Connection features disabled.
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECURITY_FEATURES.map((feature, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={feature.title}
            className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-slate-200">{feature.title}</h4>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-brand-primary" />
          Hardware Signature
        </h3>
        <div className="bg-slate-950/50 rounded-xl p-4 font-mono text-xs text-slate-500 break-all border border-slate-800">
          HWID: 8F3A-9B2C-1D4E-7F0G-6H5I-4J3K-2L1M-0N9O-8P7Q
        </div>
        <p className="mt-3 text-[10px] text-slate-500 uppercase tracking-widest text-center">
          Device locked to this signature for maximum security
        </p>
      </div>
    </div>
  );
};
