import { Server } from './types';

export const SERVERS: Server[] = [
  { id: '1', name: 'USA - New York', country: 'United States', flag: '🇺🇸', latency: 45, load: 32, premium: false },
  { id: '2', name: 'Brazil - São Paulo', country: 'Brazil', flag: '🇧🇷', latency: 12, load: 65, premium: false },
  { id: '3', name: 'Germany - Frankfurt', country: 'Germany', flag: '🇩🇪', latency: 120, load: 15, premium: false },
  { id: '4', name: 'Japan - Tokyo', country: 'Japan', flag: '🇯🇵', latency: 280, load: 40, premium: true },
  { id: '5', name: 'UK - London', country: 'United Kingdom', flag: '🇬🇧', latency: 95, load: 22, premium: true },
  { id: '6', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', latency: 310, load: 10, premium: true },
];

export const SECURITY_FEATURES = [
  { title: 'Root Detection', description: 'Blocks access on devices with root privileges to prevent system-level tampering.', active: true },
  { title: 'SNI Obfuscation', description: 'Masks the Server Name Indication (SNI) to bypass advanced DPI filters.', active: true },
  { title: 'Payload Camouflage', description: 'Encapsulates the HTTP payload within a secure TLS layer for stealth.', active: true },
  { title: 'Anti-Sniffing', description: 'Detects and blocks packet capture attempts on the device.', active: true },
  { title: 'Hardware ID Lock', description: 'Prevents account sharing and unauthorized access from other devices.', active: true },
  { title: 'Encrypted Configs', description: 'All local configurations are stored with AES-256-GCM encryption.', active: true },
];
