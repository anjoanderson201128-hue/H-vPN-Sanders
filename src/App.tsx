import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { ConnectionCard } from './components/ConnectionCard';
import { ServerList } from './components/ServerList';
import { SecurityPanel } from './components/SecurityPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { AdminPanel } from './components/AdminPanel';
import { SpeedTest } from './components/SpeedTest';
import { LogsPanel } from './components/LogsPanel';
import { SERVERS } from './constants';
import { User, Server, ConnectionStats, AppConfig, Operator } from './types';
import { ShieldCheck, ShieldAlert, Cpu, Lock, User as UserIcon, Calendar, Database, Monitor } from 'lucide-react';

// Mock User Database with different limits
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    displayName: 'Admin User',
    dataLimit: 5000, // 5GB
    dataUsed: 1250,
    expiryDate: '2040-12-31',
    maxConnections: 2,
    currentConnections: 1,
    status: 'active',
    role: 'admin'
  },
  {
    id: '2',
    username: 'demo',
    displayName: 'Demo Account',
    dataLimit: 100, // 100MB
    dataUsed: 95,
    expiryDate: '2026-04-10',
    maxConnections: 1,
    currentConnections: 0,
    status: 'active',
    role: 'user'
  }
];

const MOCK_OPERATORS: Operator[] = [
  {
    id: '1',
    name: 'Unitel (Websocket)',
    sni: 'cpemngm.uninet.unitel.co.ao',
    payload: 'GET /v2ray HTTP/1.1\nHost: cpemngm.uninet.unitel.co.ao\nConnection: keep-alive, Upgrade\nUpgrade: websocket\nUser-Agent: Mozilla/5.0 (Linux; Android 13; SM-G780F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36\nSec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==\nSec-WebSocket-Version: 13\nSec-WebSocket-Extensions: permessage-deflate; client_max_window_bits\nOrigin: https://cpemngm.uninet.unitel.co.ao\nReferer: https://cpemngm.uninet.unitel.co.ao/\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8\nAccept-Encoding: gzip, deflate, br\nAccept-Language: en-US,en;q=0.9,pt-BR;q=0.8\nCache-Control: no-cache\nPragma: no-cache\nSec-Fetch-Dest: websocket\nSec-Fetch-Mode: websocket\nSec-Fetch-Site: same-origin\nX-Forwarded-For: 102.64.0.1\nX-Real-IP: 102.64.0.1',
    protocol: 'V2RAY'
  },
  {
    id: '2',
    name: 'Movicel (TLS)',
    sni: 'movicel.co.ao',
    payload: '',
    protocol: 'TLS'
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [operators, setOperators] = useState<Operator[]>(MOCK_OPERATORS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRooted, setIsRooted] = useState(false);
  const [activeTab, setActiveTab] = useState('connection');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(SERVERS[1]); // Default to Brazil
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState<ConnectionStats>({
    download: '0.00 KB/s',
    upload: '0.00 KB/s',
    duration: '00:00:00',
    ip: '192.168.1.1'
  });
  const [config, setConfig] = useState<AppConfig>({
    protocol: 'V2RAY',
    sni: 'cpemngm.uninet.unitel.co.ao',
    payload: 'GET /v2ray HTTP/1.1\nHost: cpemngm.uninet.unitel.co.ao\nConnection: keep-alive, Upgrade\nUpgrade: websocket\nUser-Agent: Mozilla/5.0 (Linux; Android 13; SM-G780F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36\nSec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==\nSec-WebSocket-Version: 13\nSec-WebSocket-Extensions: permessage-deflate; client_max_window_bits\nOrigin: https://cpemngm.uninet.unitel.co.ao\nReferer: https://cpemngm.uninet.unitel.co.ao/\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8\nAccept-Encoding: gzip, deflate, br\nAccept-Language: en-US,en;q=0.9,pt-BR;q=0.8\nCache-Control: no-cache\nPragma: no-cache\nSec-Fetch-Dest: websocket\nSec-Fetch-Mode: websocket\nSec-Fetch-Site: same-origin\nX-Forwarded-For: 102.64.0.1\nX-Real-IP: 102.64.0.1',
    proxyHost: '',
    proxyPort: '8080',
    udpForward: true
  });
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-49), message]);
  }, []);

  // Simulate root detection on mount
  useEffect(() => {
    const checkRoot = () => {
      // In a real Android app, we'd check for su binary, etc.
      // Here we simulate a random check or just set to false for demo
      const simulatedRoot = false; 
      setIsRooted(simulatedRoot);
      if (simulatedRoot) {
        addLog('SECURITY ALERT: ROOT ACCESS DETECTED. SYSTEM LOCKED.');
      }
    };
    checkRoot();
  }, [addLog]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsConnected(false);
    addLog('AUTH: USER LOGGED OUT');
  }, [addLog]);

  // Session Timeout Logic
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    const timeoutCheck = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        handleLogout();
        setShowTimeoutMessage(true);
        addLog('SECURITY: SESSION EXPIRED DUE TO INACTIVITY');
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearInterval(timeoutCheck);
    };
  }, [isLoggedIn, lastActivity, handleLogout, addLog]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    
    if (user && password === '6978') {
      if (user.status !== 'active') {
        addLog(`AUTH ERROR: ACCOUNT ${user.status.toUpperCase()}`);
        return;
      }
      setIsLoggedIn(true);
      setCurrentUser(user);
      setShowTimeoutMessage(false);
      setLastActivity(Date.now());
      addLog(`AUTH: USER ${user.displayName} AUTHORIZED`);
    } else {
      addLog('AUTH ERROR: INVALID CREDENTIALS');
    }
  };

  const toggleConnection = () => {
    if (isRooted) {
      addLog('ERROR: CANNOT CONNECT ON ROOTED DEVICE');
      return;
    }

    if (!isConnected) {
      // Check Limits before connecting
      if (!currentUser) return;

      if (currentUser.dataUsed >= currentUser.dataLimit) {
        addLog('ERROR: DATA LIMIT REACHED (0MB REMAINING)');
        return;
      }

      const expiryDate = new Date(currentUser.expiryDate);
      if (expiryDate < new Date()) {
        addLog('ERROR: ACCOUNT EXPIRED');
        return;
      }

      if (currentUser.currentConnections >= currentUser.maxConnections) {
        addLog('ERROR: MAX SIMULTANEOUS CONNECTIONS REACHED');
        return;
      }

      addLog('INITIALIZING TUNNEL INTERFACE...');
      addLog(`PROTOCOL: ${config.protocol}`);
      addLog(`SNI: [OBFUSCATED] ${config.sni.substring(0, 4)}****`);
      addLog(`PAYLOAD: [CAMOUFLAGED] ${config.payload.substring(0, 15)}...`);
      addLog(`SERVER: ${selectedServer.name}`);
      
      setTimeout(() => addLog('HANDSHAKE: TLS 1.3 CLIENT HELLO'), 500);
      setTimeout(() => addLog('HANDSHAKE: SERVER HELLO / CERTIFICATE VERIFIED'), 1000);
      setTimeout(() => addLog('ENCRYPTION: AES-256-GCM ESTABLISHED'), 1500);
      setTimeout(() => {
        addLog('SUCCESS: TUNNEL CONNECTED');
        setIsConnected(true);
        setStats(prev => ({ ...prev, ip: '104.21.45.12' }));
      }, 2000);
    } else {
      addLog('DISCONNECTING...');
      setIsConnected(false);
      setStats({
        download: '0.00 KB/s',
        upload: '0.00 KB/s',
        duration: '00:00:00',
        ip: '192.168.1.1'
      });
      addLog('SUCCESS: DISCONNECTED');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          download: `${(Math.random() * 500).toFixed(2)} KB/s`,
          upload: `${(Math.random() * 50).toFixed(2)} KB/s`,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    addLog(`ADMIN: NEW USER REGISTERED - ${newUser.username}`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addLog('ADMIN: USER REMOVED FROM DATABASE');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex bg-slate-950 text-slate-50 min-h-screen font-sans items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-3xl w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-brand-primary w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">H@vPN-Sanders</h1>
            <p className="text-slate-500 text-sm">Authorized Access Only</p>
          </div>

          {showTimeoutMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-500 text-xs font-bold"
            >
              <ShieldAlert className="w-4 h-4" />
              Session expired due to inactivity. Please login again.
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary"
                placeholder="Enter password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-primary/20"
            >
              Login to Tunnel
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Anti-Tamper Protection Active
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-slate-50 min-h-screen font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        userRole={currentUser?.role}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="p-4 md:p-6 flex items-center justify-between z-20 border-b border-slate-900 md:border-none">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-500 text-[10px] md:text-sm">SecureTunnel Pro v4.2.0</p>
          </div>

          {/* Data Usage Alert Banner */}
          {currentUser && (currentUser.dataUsed / currentUser.dataLimit) >= 0.8 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border mr-4 ${
                (currentUser.dataUsed / currentUser.dataLimit) >= 0.95 
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <div className="text-[10px] font-bold uppercase tracking-widest">
                {(currentUser.dataUsed / currentUser.dataLimit) >= 0.95 ? 'Critical Data Limit' : 'Low Data Balance'}
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-500">
              <ShieldCheck className="w-3 h-3 md:w-4 h-4" />
              Anti-Tamper Active
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Cpu className="w-4 h-4 md:w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex gap-6">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === 'connection' && (
                  <div className="space-y-6">
                    <ConnectionCard 
                      isConnected={isConnected} 
                      onToggle={toggleConnection} 
                      stats={stats} 
                      operators={operators}
                      currentConfig={config}
                      onSelectOperator={(op) => setConfig({
                        ...config,
                        protocol: op.protocol,
                        sni: op.sni,
                        payload: op.payload
                      })}
                      isAdmin={currentUser?.role === 'admin'}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center">
                          <Lock className="text-brand-primary w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">Encrypted Tunnel</h4>
                          <p className="text-xs text-slate-500">End-to-end AES-256-GCM encryption active.</p>
                        </div>
                      </div>
                      <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 flex items-center justify-center">
                          <ShieldAlert className="text-brand-secondary w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">Anti-DPI Engine</h4>
                          <p className="text-xs text-slate-500">Bypassing deep packet inspection via TLS.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'servers' && (
                  <ServerList 
                    selectedServer={selectedServer} 
                    onSelect={setSelectedServer} 
                  />
                )}

                {activeTab === 'speedtest' && (
                  <SpeedTest />
                )}

                {activeTab === 'account' && currentUser && (
                  <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center mb-4">
                        <UserIcon className="w-10 h-10 text-brand-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
                      <p className="text-slate-500 text-sm">@{currentUser.username}</p>
                      <div className="mt-4 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                        {currentUser.status} Account
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
                            <Database className="w-5 h-5 text-brand-secondary" />
                          </div>
                          <h4 className="font-bold">Data Limit</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-500">Used: {currentUser.dataUsed} MB</span>
                            <span className="text-slate-200">Total: {currentUser.dataLimit} MB</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                (currentUser.dataUsed / currentUser.dataLimit) >= 0.95 ? 'bg-rose-500' : 
                                (currentUser.dataUsed / currentUser.dataLimit) >= 0.8 ? 'bg-amber-500' : 'bg-brand-secondary'
                              }`}
                              style={{ width: `${(currentUser.dataUsed / currentUser.dataLimit) * 100}%` }}
                            />
                          </div>
                          {(currentUser.dataUsed / currentUser.dataLimit) >= 0.8 && (
                            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mt-2 ${
                              (currentUser.dataUsed / currentUser.dataLimit) >= 0.95 ? 'text-rose-500' : 'text-amber-500'
                            }`}>
                              <ShieldAlert className="w-3 h-3" />
                              {(currentUser.dataUsed / currentUser.dataLimit) >= 0.95 
                                ? 'Critical: 95% data used' 
                                : 'Warning: 80% data used'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-brand-accent" />
                          </div>
                          <h4 className="font-bold">Expiration</h4>
                        </div>
                        <div className="text-sm font-mono text-slate-200">
                          {currentUser.expiryDate}
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                          Renew your plan to avoid service interruption
                        </p>
                      </div>

                      <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-amber-500" />
                          </div>
                          <h4 className="font-bold">Connections</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Simultaneous Devices</span>
                          <span className="text-lg font-bold font-mono">
                            {currentUser.currentConnections} / {currentUser.maxConnections}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'admin' && currentUser?.role === 'admin' && (
                  <AdminPanel 
                    users={users} 
                    onAddUser={handleAddUser} 
                    onDeleteUser={handleDeleteUser} 
                  />
                )}

                {activeTab === 'security' && (
                  <SecurityPanel isRooted={isRooted} />
                )}

                {activeTab === 'config' && currentUser?.role === 'admin' && (
                  <ConfigPanel 
                    config={config} 
                    setConfig={setConfig} 
                    operators={operators}
                    setOperators={setOperators}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Logs (Visible on desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <LogsPanel logs={logs} />
          </div>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/5 blur-[150px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[150px] rounded-full -z-10" />
    </div>
  );
}

