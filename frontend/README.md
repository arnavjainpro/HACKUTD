# T-Mobile Customer Happiness Hub

A modern, responsive Next.js dashboard for T-Mobile customer service representatives to monitor customer satisfaction and access AI-powered insights.

## 🎯 Project Overview

This dashboard is built for two main challenges:
1. **T-Mobile Challenge**: Happiness Index - Real-time customer satisfaction tracking
2. **NVIDIA Challenge**: AI Routing Agent - Intelligent follow-up suggestions using Gemini API

## ✨ Features

- 🔐 **Auth0 Authentication** - Secure login/logout
- 🎨 **Light/Dark Mode** - Toggle between themes
- 📊 **Real-time Dashboard** - Customer interaction monitoring
- 📈 **Analytics** - Charts and performance metrics
- 🔍 **Search & Filter** - Find customers by ID or product
- 💬 **Detail View** - Full transcript and AI insights
- 📱 **Fully Responsive** - Mobile-first design
- 🎯 **T-Mobile Branding** - Magenta, purple, and modern gradients

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Auth0

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [auth0]/
│   │           └── route.ts          # Auth0 API routes
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard layout
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── analytics/
│   │   │   └── page.tsx             # Analytics page
│   │   └── settings/
│   │       └── page.tsx             # Settings page
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home/Login page
│   └── globals.css                  # Global styles
├── components/
│   ├── Header.tsx                   # Dashboard header with theme toggle
│   ├── Sidebar.tsx                  # Navigation sidebar
│   ├── SearchBar.tsx                # Search and filter controls
│   ├── DashboardTable.tsx           # Customer records table
│   ├── DetailPanel.tsx              # Customer detail modal
│   └── Analytics.tsx                # Charts and metrics
├── lib/
│   ├── store.ts                     # Zustand state management
│   └── mockData.ts                  # Mock customer data
├── .env.local                       # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Ensure `.env.local` is set up with your Auth0 credentials:

```env
AUTH0_SECRET='your-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

### 3. Configure Auth0 Dashboard

In your Auth0 dashboard:
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`
- **Application Type**: `Regular Web Application`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Dashboard Features

### Main Dashboard
- **Search Bar**: Search by Customer ID or Product
- **Filter Dropdown**: Filter by Follow-Up Status (Resolved, Pending, Escalated)
- **Customer Records Table**: View all recent interactions
- **Quick Analytics**: Overview of key metrics
- **Detail Panel**: Click any record to view full details

### Analytics Page
- **Stats Cards**: Total interactions, average happiness, resolved/escalated counts
- **Status Distribution**: Pie chart of resolution statuses
- **Happiness Trend**: Line chart showing happiness over time
- **Product Performance**: Bar chart of average happiness by product

### Settings Page
- Profile settings
- Notification preferences
- Privacy & security options

## 🎨 Design System

### Colors
- **Primary**: Magenta (#E20074) - T-Mobile brand color
- **Secondary**: Purple (#9B26B6)
- **Accent**: Pink (#EA0A8E)
- **Background Light**: Gray-50
- **Background Dark**: Gray-950

### Theme Toggle
Click the sun/moon icon in the header to switch between light and dark modes.

## 📝 Key Components

### Happiness Index
- **Color-coded scores**:
  - 🟢 Green (7.5-10): High satisfaction
  - 🟡 Yellow (5-7.4): Neutral
  - 🔴 Red (0-4.9): Low satisfaction
- Real-time tracking from voice calls
- Breakdown by tonality, duration, resolution, network data

### Detail Panel
Shows comprehensive customer interaction details:
- Customer and Rep IDs
- Product information
- Happiness metrics breakdown
- Full call transcript
- **Placeholder sections** for:
  - ElevenLabs voice summary (coming soon)
  - Gemini AI suggested actions (coming soon)

## 🔮 Future Integrations

### ElevenLabs Integration
- AI-generated voice summaries
- Audio playback of key conversation highlights
- Sentiment-aware voice synthesis

### NVIDIA Gemini API (Routing Agent)
- Intelligent follow-up suggestions
- Product upgrade recommendations
- Escalation priority analysis
- Personalized resolution strategies

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "@auth0/nextjs-auth0": "^3.5.0",
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "latest",
    "lucide-react": "latest",
    "recharts": "latest"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "eslint": "^8",
    "eslint-config-next": "^14.2.0"
  }
}
```

## 🎯 Challenge Requirements Met

### T-Mobile Challenge - Happiness Index
✅ Real-time customer satisfaction tracking  
✅ Color-coded happiness indicators  
✅ Detailed breakdown of happiness metrics  
✅ Trend analysis and reporting  

### NVIDIA Challenge - Routing Agent
✅ Placeholder for AI-generated insights  
✅ Architecture ready for Gemini API integration  
✅ Follow-up suggestions framework  
✅ Escalation and resolution tracking  

## 👨‍💻 Development Notes

- Auth0 is fully integrated - **DO NOT MODIFY** authentication
- Mock data is in `lib/mockData.ts`
- State management uses Zustand
- All components are modular and reusable
- TypeScript strict mode enabled
- Fully responsive design tested on mobile, tablet, and desktop

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Branding Guidelines

Following T-Mobile's visual identity:
- Modern, clean interface
- Magenta as primary brand color
- Smooth transitions and hover effects
- Clear typography hierarchy
- Subtle gradients for visual interest

---

**Built for HackUTD** | Powered by Next.js, TypeScript & Tailwind CSS
