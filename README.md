# 🎯 T-Mobile Customer Happiness Hub

A comprehensive customer service dashboard with AI-powered recommendations and secure agent integration.

## 📁 Project Structure

```
HackUTD/
├── frontend/              # Next.js 14 Dashboard Application
│   ├── app/              # App Router pages & API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and state management
│   └── package.json      # Frontend dependencies
│
├── backend/              # AI Agent & Backend Scripts
│   ├── agent.js          # Secure AI agent script
│   ├── test-api.sh       # API testing script
│   └── package.json      # Backend dependencies
│
└── Documentation/        # Setup guides
    ├── SETUP_COMPLETE.md
    ├── SECURE_API_SETUP.md
    └── API_INTEGRATION_README.md
```

## 🚀 Quick Start

### Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

Dashboard runs at: `http://localhost:3000`

### Backend Agent

```bash
cd backend
npm install

# Configure your Auth0 credentials
cp .env.agent.example .env.agent
# Edit .env.agent with your M2M credentials

# Run the agent
npm run agent
```

## 🔐 Setup Guide

See **`SETUP_COMPLETE.md`** for complete setup instructions including Auth0 configuration.

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Auth0, Zustand, Recharts  
**Backend:** Node.js, Axios, JWT (jose)

Full-stack application with Next.js frontend and backend services.

## Project Structure

```
HackUTD/
├── frontend/          # Next.js application
│   ├── app/          # Next.js app directory
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Auth0
