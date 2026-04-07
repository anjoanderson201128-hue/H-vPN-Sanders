import React from 'react';
import { motion } from 'motion/react';
import { Search, Signal, Users, CheckCircle2 } from 'lucide-react';
import { SERVERS } from '../constants';
import { Server } from '../types';
import { cn } from '../lib/utils';

interface ServerListProps {
  selectedServer: Server;
  onSelect: (server: Server) => void;
}

export const ServerList: React.FC<ServerListProps> = ({ selectedServer, onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search servers..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {SERVERS.map((server, index) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={server.id}
            onClick={() => onSelect(server)}
            className={cn(
              "w-full glass-panel p-4 rounded-2xl flex items-center gap-4 transition-all hover:border-brand-primary/50 group text-left",
              selectedServer.id === server.id && "border-brand-primary bg-brand-primary/5"
            )}
          >
            <span className="text-3xl">{server.flag}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{server.name}</span>
                {server.premium && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-wider">Premium</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Signal className={cn("w-3 h-3", server.latency < 100 ? "text-emerald-500" : "text-amber-500")} />
                  <span>{server.latency}ms</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Users className="w-3 h-3" />
                  <span>{server.load}%</span>
                </div>
              </div>
            </div>
            {selectedServer.id === server.id && (
              <CheckCircle2 className="w-6 h-6 text-brand-primary" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
