export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: 'student' | 'teacher' | 'counselor' | 'admin';
  studentId?: string;
  profilePicture?: string;
  avatar?: string;
  grade?: number;
  school?: string;
  province?: string;
  interests?: string[];
  createdAt: string;
}

export interface Major {
  id: string;
  name: string;
  description: string;
  image: string;
  universities: University[];
  careers: string[];
  subjects: string[];
  category: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  logo?: string;
  websiteUrl: string;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  image: string;
  personalityType: string[];
  relatedMajors: string[];
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  lastUpdated: string;
  activeUsers: number;
  totalSessions: number;
  responseTime: number;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  source: string;
}