# T-Mobile Customer Happiness Hub - Complete Folder Structure

```
frontend/
│
├── 📁 app/                                   # Next.js App Router
│   ├── 📁 api/
│   │   └── 📁 auth/
│   │       └── 📁 [auth0]/
│   │           └── route.ts                  # ✅ Auth0 handler (DO NOT MODIFY)
│   │
│   ├── 📁 dashboard/                         # 🎯 Main Dashboard Section
│   │   ├── layout.tsx                        # Dashboard layout (sidebar + header)
│   │   ├── page.tsx                          # Main dashboard page
│   │   │
│   │   ├── 📁 analytics/
│   │   │   └── page.tsx                      # Analytics & charts page
│   │   │
│   │   └── 📁 settings/
│   │       └── page.tsx                      # Settings & preferences
│   │
│   ├── layout.tsx                            # Root layout (Auth0 UserProvider)
│   ├── page.tsx                              # Landing/Login page
│   └── globals.css                           # Global styles + Tailwind
│
├── 📁 components/                            # ♻️ Reusable Components
│   ├── Header.tsx                            # Dashboard header + theme toggle
│   ├── Sidebar.tsx                           # Navigation sidebar
│   ├── SearchBar.tsx                         # Search & filter controls
│   ├── DashboardTable.tsx                    # Customer records table
│   ├── DetailPanel.tsx                       # Modal for customer details
│   └── Analytics.tsx                         # Charts and metrics display
│
├── 📁 lib/                                   # 📚 Utilities & Data
│   ├── store.ts                              # Zustand state management
│   └── mockData.ts                           # Sample customer data (10 records)
│
├── 📁 public/                                # Static assets
│
├── 📄 .env.local                             # Environment variables (Auth0)
├── 📄 .gitignore                             # Git ignore rules
├── 📄 README.md                              # Complete documentation
├── 📄 QUICK_START.md                         # Quick reference guide
├── 📄 FOLDER_STRUCTURE.md                    # This file
│
├── 📄 package.json                           # Dependencies & scripts
├── 📄 package-lock.json                      # Lock file
├── 📄 tsconfig.json                          # TypeScript configuration
├── 📄 tailwind.config.js                     # Tailwind CSS config (with T-Mobile colors)
├── 📄 postcss.config.js                      # PostCSS configuration
└── 📄 next.config.js                         # Next.js configuration
```

## 📊 Component Relationships

```
App Structure:
┌─────────────────────────────────────────────────────────┐
│ Root Layout (layout.tsx)                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ UserProvider (Auth0)                                │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Home Page (page.tsx)                            │ │ │
│ │ │ - Landing page with login                       │ │ │
│ │ │ - Auto-redirect to /dashboard if authenticated  │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Dashboard Structure:
┌─────────────────────────────────────────────────────────┐
│ Dashboard Layout (dashboard/layout.tsx)                 │
│ ┌───────────┬───────────────────────────────────────┐   │
│ │           │ Header                                │   │
│ │           │ - Title + Theme Toggle                │   │
│ │ Sidebar   ├───────────────────────────────────────┤   │
│ │           │ Main Content Area                     │   │
│ │ - Links   │ ┌───────────────────────────────────┐ │   │
│ │ - Nav     │ │ Dashboard Page (page.tsx)         │ │   │
│ │ - Logout  │ │ - SearchBar                       │ │   │
│ │           │ │ - Analytics (quick view)          │ │   │
│ │           │ │ - DashboardTable                  │ │   │
│ │           │ │ - DetailPanel (modal)             │ │   │
│ │           │ └───────────────────────────────────┘ │   │
│ │           │                                       │   │
│ │           │ OR                                    │   │
│ │           │                                       │   │
│ │           │ ┌───────────────────────────────────┐ │   │
│ │           │ │ Analytics Page                    │ │   │
│ │           │ │ - Stats Cards                     │ │   │
│ │           │ │ - Charts (Recharts)               │ │   │
│ │           │ └───────────────────────────────────┘ │   │
│ │           │                                       │   │
│ │           │ OR                                    │   │
│ │           │                                       │   │
│ │           │ ┌───────────────────────────────────┐ │   │
│ │           │ │ Settings Page                     │ │   │
│ │           │ │ - User preferences                │ │   │
│ │           │ │ - Notifications                   │ │   │
│ │           │ └───────────────────────────────────┘ │   │
│ └───────────┴───────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
State Management (Zustand):
┌──────────────────┐
│  useDashboardStore│
│  ─────────────────│
│  - theme          │ ◄─── Header (theme toggle)
│  - selectedRecord│ ◄─── DashboardTable (click row)
│  - searchQuery   │ ◄─── SearchBar (user input)
│  - filterStatus  │ ◄─── SearchBar (dropdown)
└──────────────────┘
         │
         ▼
    Components read
    and update state

Mock Data Flow:
┌──────────────────┐
│  mockData.ts     │
│  ─────────────────│
│  - 10 customer   │
│    records       │
│  - Helper funcs  │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│ DashboardTable   │ ──► Filter by search & status
│ Analytics        │ ──► Aggregate for charts
│ DetailPanel      │ ──► Show selected record
└──────────────────┘
```

## 🎨 Styling Architecture

```
Tailwind CSS:
├── tailwind.config.js
│   ├── Dark mode: 'class'
│   ├── Custom colors (T-Mobile branding)
│   └── Content paths
│
├── globals.css
│   ├── @tailwind base
│   ├── @tailwind components
│   └── @tailwind utilities
│
└── Components use utility classes
    ├── Responsive: sm:, md:, lg:
    ├── Dark mode: dark:
    └── Hover/Focus states
```

## 🔐 Authentication Flow

```
Auth0 Integration:
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ / (Landing Page)    │
│ - Not authenticated │──► Click "Sign In" ──► /api/auth/login
└─────────────────────┘
       │
       │ (Auth0 redirect)
       ▼
┌─────────────────────┐
│ Auth0 Login Page    │──► User enters credentials
└─────────────────────┘
       │
       │ (Success)
       ▼
┌─────────────────────┐
│ /api/auth/callback  │──► Create session
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ /dashboard          │──► Redirect to dashboard
│ - Authenticated     │
└─────────────────────┘
```

## 📦 Key Dependencies

### Production
- `next`: Framework
- `react` & `react-dom`: UI library
- `@auth0/nextjs-auth0`: Authentication
- `zustand`: State management
- `recharts`: Charts
- `lucide-react`: Icons

### Development
- `typescript`: Type safety
- `tailwindcss`: Styling
- `eslint`: Code quality
- `@types/*`: TypeScript definitions

## 🎯 File Responsibilities

### Core Files
- **`lib/store.ts`**: Global state (theme, selected record, filters)
- **`lib/mockData.ts`**: Sample data + utility functions
- **`app/layout.tsx`**: Auth0 wrapper
- **`app/dashboard/layout.tsx`**: Dashboard shell (sidebar + header)

### Page Files
- **`app/page.tsx`**: Landing page → redirects if logged in
- **`app/dashboard/page.tsx`**: Main dashboard
- **`app/dashboard/analytics/page.tsx`**: Charts view
- **`app/dashboard/settings/page.tsx`**: User settings

### Component Files
- **`Header.tsx`**: Title + theme toggle
- **`Sidebar.tsx`**: Navigation menu
- **`SearchBar.tsx`**: Search input + filter dropdown
- **`DashboardTable.tsx`**: Customer records table
- **`DetailPanel.tsx`**: Modal with full customer details
- **`Analytics.tsx`**: Charts and metrics

## 🚀 Quick Navigation

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `lib/mockData.ts` | Add/modify customer data | High |
| `components/*.tsx` | UI modifications | Medium |
| `app/dashboard/*.tsx` | Page content | Medium |
| `lib/store.ts` | State management | Low |
| `.env.local` | Auth0 config | Once |
| `tailwind.config.js` | Styling theme | Low |

---

**Total Files Created**: 20+  
**Lines of Code**: ~2,500+  
**Ready to Run**: ✅ Yes
