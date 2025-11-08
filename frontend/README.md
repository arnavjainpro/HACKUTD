# HackUTD Frontend

Next.js application with Auth0 authentication and Tailwind CSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Auth0 Authentication
- ✅ Server-side rendering

## Environment Variables

Make sure `.env.local` is configured with your Auth0 credentials:

```
AUTH0_SECRET='...'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='...'
AUTH0_CLIENT_SECRET='...'
```

## Available Routes

- `/` - Home page
- `/api/auth/login` - Login
- `/api/auth/logout` - Logout
- `/api/auth/callback` - Auth0 callback
- `/api/auth/me` - Get current user
