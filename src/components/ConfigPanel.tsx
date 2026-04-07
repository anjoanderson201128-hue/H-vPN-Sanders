import React, { useState } from 'react';
import { AppConfig, Protocol, Operator } from '../types';
import { Terminal, Cpu, Network, Zap, Globe, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfigPanelProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  operators: Operator[];
  setOperators: (operators: Operator[]) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, operators, setOperators }) => {
  const protocols: Protocol[] = ['TLS', 'SSH', 'V2RAY', 'DNS'];
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [opName, setOpName] = useState('');
  const [opSni, setOpSni] = useState('');
  const [opPayload, setOpPayload] = useState('');
  const [opProtocol, setOpProtocol] = useState<Protocol>('TLS');

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    const newOp: Operator = {
      id: Math.random().toString(36).substr(2, 9),
      name: opName,
      sni: opSni,
      payload: opPayload,
      protocol: opProtocol
    };
    setOperators([...operators, newOp]);
    resetForm();
  };

  const handleUpdateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const updated = operators.map(op => 
      op.id === editingId 
        ? { ...op, name: opName, sni: opSni, payload: opPayload, protocol: opProtocol }
        : op
    );
    setOperators(updated);
    resetForm();
  };

  const handleEdit = (op: Operator) => {
    setEditingId(op.id);
    setOpName(op.name);
    setOpSni(op.sni);
    setOpPayload(op.payload);
    setOpProtocol(op.protocol);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setOperators(operators.filter(op => op.id !== id));
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setOpName('');
    setOpSni('');
    setOpPayload('');
    setOpProtocol('TLS');
  };

  const applyOperator = (op: Operator) => {
    setConfig({
      ...config,
      protocol: op.protocol,
      sni: op.sni,
      payload: op.payload
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Operator Management */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-primary" />
            Operator Profiles
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary/20 transition-all"
          >
            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <form onSubmit={editingId ? handleUpdateOperator : handleAddOperator} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator Name</label>
                    <input 
                      required
                      type="text" 
                      value={opName}
                      onChange={(e) => setOpName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:border-brand-primary text-sm"
                      placeholder="e.g. Unitel Free"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</label>
                    <select 
                      value={opProtocol}
                      onChange={(e) => setOpProtocol(e.target.value as Protocol)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:border-brand-primary text-sm"
                    >
                      {protocols.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SNI / Hostname</label>
                  <input 
                    required
                    type="text" 
                    value={opSni}
                    onChange={(e) => setOpSni(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:border-brand-primary text-sm font-mono"
                    placeholder="m.facebook.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payload</label>
                  <textarea 
                    value={opPayload}
                    onChange={(e) => setOpPayload(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:border-brand-primary text-sm font-mono h-20 resize-none"
                    placeholder="GET / HTTP/1.1..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-400 font-bold text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                    {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? 'Update' : 'Add'} Operator
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-3">
          {operators.map((op) => (
            <div key={op.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Zap className="text-brand-primary w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{op.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{op.protocol} • {op.sni}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800/50 sm:border-none pt-2 sm:pt-0">
                <button 
                  onClick={() => applyOperator(op)}
                  className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
                >
                  Apply
                </button>
                <button onClick={() => handleEdit(op)} className="p-2 text-slate-500 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(op.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Active Tunnel Protocol
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {protocols.map((p) => (
            <button
              key={p}
              onClick={() => setConfig({ ...config, protocol: p })}
              className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                config.protocol === p 
                  ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Active SNI / Hostname</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={config.sni}
              onChange={(e) => setConfig({ ...config, sni: e.target.value })}
              placeholder="m.facebook.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary font-mono text-sm"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Active Payload</label>
          <div className="relative">
            <Terminal className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
            <textarea 
              value={config.payload}
              onChange={(e) => setConfig({ ...config, payload: e.target.value })}
              placeholder="GET / HTTP/1.1..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary font-mono text-sm h-24 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
            <Network className="text-brand-secondary w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold">UDP Forwarding</h4>
            <p className="text-xs text-slate-500">Enable for gaming and VoIP apps.</p>
          </div>
        </div>
        <button 
          onClick={() => setConfig({ ...config, udpForward: !config.udpForward })}
          className={`w-14 h-8 rounded-full transition-colors relative ${config.udpForward ? 'bg-brand-primary' : 'bg-slate-800'}`}
        >
          <motion.div 
            animate={{ x: config.udpForward ? 26 : 4 }}
            className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm" 
          />
        </button>
      </div>
    </div>
  );
};
