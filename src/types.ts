export interface Server {
  id: string;
  name: string;
  country: string;
  flag: string;
  latency: number;
  load: number;
  premium: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  dataLimit: number; // in MB
  dataUsed: number; // in MB
  expiryDate: string;
  maxConnections: number;
  currentConnections: number;
  status: 'active' | 'expired' | 'blocked';
  role: 'admin' | 'user';
}

export interface ConnectionStats {
  download: string;
  upload: string;
  duration: string;
  ip: string;
}

export type Protocol = 'TLS' | 'SSH' | 'V2RAY' | 'DNS';

export interface AppConfig {
  protocol: Protocol;
  sni: string;
  payload: string;
  proxyHost: string;
  proxyPort: string;
  udpForward: boolean;
}

export interface Operator {
  id: string;
  name: string;
  sni: string;
  payload: string;
  protocol: Protocol;
}
