import React, { useState } from 'react';
import { User } from '../types';
import { UserPlus, Trash2, Shield, Calendar, Database, Monitor, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, onAddUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDataLimit, setNewDataLimit] = useState('1000');
  const [newExpiryDays, setNewExpiryDays] = useState('30');
  const [newMaxConnections, setNewMaxConnections] = useState('1');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(newExpiryDays));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      displayName: newDisplayName,
      dataLimit: parseInt(newDataLimit),
      dataUsed: 0,
      expiryDate: expiryDate.toISOString().split('T')[0],
      maxConnections: parseInt(newMaxConnections),
      currentConnections: 0,
      status: 'active',
      role: 'user'
    };
    
    onAddUser(newUser);
    setShowAddForm(false);
    setNewUsername('');
    setNewDisplayName('');
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 md:py-3 pl-10 md:pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20"
        >
          <UserPlus className="w-4 h-4 md:w-5 h-5" />
          <span className="hidden sm:inline text-sm">Add User</span>
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl border-brand-primary/20"
        >
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-primary" />
            Register New VPN User
          </h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
              <input 
                required
                type="text" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
                placeholder="e.g. john_doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
              <input 
                required
                type="text" 
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Limit (MB)</label>
              <input 
                required
                type="number" 
                value={newDataLimit}
                onChange={(e) => setNewDataLimit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Access Duration (Days)</label>
              <input 
                required
                type="number" 
                value={newExpiryDays}
                onChange={(e) => setNewExpiryDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Connections</label>
              <input 
                required
                type="number" 
                value={newMaxConnections}
                onChange={(e) => setNewMaxConnections(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Registered Users ({filteredUsers.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <motion.div 
              layout
              key={user.id}
              className="glass-panel p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-amber-500/20' : 'bg-brand-primary/20'}`}>
                  {user.role === 'admin' ? <Shield className="text-amber-500 w-5 h-5 md:w-6 md:h-6" /> : <Database className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2 text-sm md:text-base">
                    {user.displayName}
                    {user.role === 'admin' && <span className="text-[7px] md:text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">Admin</span>}
                  </h4>
                  <p className="text-[10px] md:text-xs text-slate-500 font-mono">@{user.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 border-t border-slate-800/50 md:border-none pt-3 md:pt-0">
                <div className="space-y-0.5">
                  <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold">Data Limit</p>
                  <p className="text-[10px] md:text-xs font-mono">{user.dataUsed} / {user.dataLimit} MB</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold">Expiry</p>
                  <p className="text-[10px] md:text-xs font-mono">{user.expiryDate}</p>
                </div>
                <div className="space-y-0.5 hidden md:block">
                  <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold">Devices</p>
                  <p className="text-[10px] md:text-xs font-mono">{user.currentConnections} / {user.maxConnections}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {user.role !== 'admin' && (
                  <button 
                    onClick={() => onDeleteUser(user.id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete User"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
