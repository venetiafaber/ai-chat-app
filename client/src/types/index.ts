// user types
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// conversation types
export interface Conversation {
  _id: string;
  user: string | User;    // can be ID or populated User
  title: string;
  messageCount: number;
  isActive: boolean;
  createdAt: string,
  updatedAt?: string
}

export interface ConversationResponse {
  success: boolean;
  count: number;
  data: Conversation[];
}

// message types
export interface Message {
  _id: string;
  conversation: string | Conversation;
  role: 'user' | 'ai';    // union types
  content: string;
  metadata: {
    tokensUsed: number;
    responseTime: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface MessageResponse {
  success: boolean;
  count: number;
  data: {
    userMessage: Message;
    aiMessage: Message;
    conversation: {
      _id: string;
      title: string;
      messageCount: number;
    }
  }
}

// api errir types
export interface ApiError {
  success: false;
  error: string;
  message?: string;
}