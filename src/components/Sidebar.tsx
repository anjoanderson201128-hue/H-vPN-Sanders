import React from 'react';
import { Shield, Server, Settings, Activity, Lock, HelpCircle, LogOut, User as UserIcon, Users, Gauge } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userRole?: 'admin' | 'user';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, userRole }) => {
  const menuItems = [
    { id: 'connection', icon: Activity, label: 'Connection' },
    { id: 'servers', icon: Server, label: 'Servers' },
    { id: 'speedtest', icon: Gauge, label: 'Speed Test' },
    { id: 'account', icon: UserIcon, label: 'Account' },
    { id: 'admin', icon: Users, label: 'Admin', adminOnly: true },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'config', icon: Settings, label: 'Config', adminOnly: true },
  ].filter(item => !item.adminOnly || userRole === 'admin');

  return (
    <aside className="w-20 md:w-64 glass-panel h-screen flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center glow-primary">
          <Lock className="text-white w-6 h-6" />
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">H@vPN-Sanders</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <item.icon className={cn("w-6 h-6", activeTab === item.id ? "text-brand-primary" : "group-hover:text-slate-200")} />
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-4 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
          <HelpCircle className="w-6 h-6" />
          <span className="hidden md:block font-medium">Support</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
