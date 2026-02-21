# AI Chat Application

> A production-ready, full-stack SaaS application featuring AI-powered conversations

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7+-green.svg)](https://www.mongodb.com/)

## Overview

An AI-powered chat application that enables users to have intelligent conversations with Google's Gemini AI. Features include user authentication, persistent conversation history, and a RESTful API architecture.

## Key Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 💬 **Conversation Management** - Create, read, update, and delete chat threads
- 🤖 **AI Integration** - Powered by Google Gemini 2.0 Flash
- 📊 **Usage Tracking** - Token and response time analytics
- 🗄️ **Data Persistence** - MongoDB with Mongoose ODM

## Architecture
```
├── Backend (Node.js + Express)
│   ├── REST API
│   ├── JWT Authentication
│   └── MongoDB Database
└── Frontend (React) - In Development
    ├── Real-time Chat UI
    └── Socket.io Integration
```

## API Endpoints

### Authentication
```
POST   /api/users/register    - Create new account
POST   /api/users/login       - Login user
GET    /api/users/:id         - Get user profile
```

### Conversations
```
GET    /api/conversations           - Get all conversations
POST   /api/conversations           - Create conversation
GET    /api/conversations/:id       - Get specific conversation
PUT    /api/conversations/:id       - Update conversation
DELETE /api/conversations/:id       - Delete conversation
```

### Messages
```
GET    /api/messages?conversationId=...  - Get messages
POST   /api/messages                     - Send message
DELETE /api/messages/:id                 - Delete message
```

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **AI** | Google Gemini API |
| **Dev Tools** | nodemon, dotenv |

## Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Google AI Studio API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/venetiafaber/ai-chat-app.git
cd ai-chat-app/server
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start development server
```bash
npm run dev
```

## Environment Variables
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Project Status

- [x] Database models and relationships
- [x] User authentication system
- [x] Conversation CRUD operations
- [x] Message handling
- [ ] AI integration (Chapter 6)
- [ ] Real-time features (Chapter 7)
- [ ] React frontend (Chapter 8+)

## Learning Outcomes

This project helped me master:
- RESTful API design patterns
- MongoDB schema design and relationships
- JWT authentication flow
- Error handling middleware
- Async/await patterns
- MVC architecture

## Roadmap

- [ ] Implement Google Gemini AI responses
- [ ] Add real-time messaging with Socket.io
- [ ] Build React frontend
- [ ] Deploy to production
- [ ] Add conversation sharing features
- [ ] Implement rate limiting

## Contact

Venetia Faber
Project Link: https://github.com/venetiafaber/ai-chat-app