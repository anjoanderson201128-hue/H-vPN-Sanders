import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface LogsPanelProps {
  logs: string[];
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        <TerminalIcon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Connection Logs</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-950/50 rounded-2xl p-4 font-mono text-xs overflow-y-auto custom-scrollbar border border-slate-800"
      >
        {logs.map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            key={i} 
            className="mb-1.5 flex gap-3"
          >
            <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
            <span className={log.includes('ERROR') ? 'text-rose-400' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-300'}>
              {log}
            </span>
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for connection...</div>
        )}
      </div>
    </div>
  );
};
