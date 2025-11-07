# Stock Sense

Full-stack market analysis and alerting platform built using:
- **Next.js 14**
- **Firebase (Auth, Firestore, Functions)**
- **TailwindCSS**
- **ShadCN UI**
- **OGL Animated Background**

## Features
- Real-time price alerts (crypto + stocks)
- Watchlists with live data
- Analyst marketplace
- News sentiment AI analysis
- Email and in-app notifications
- Dark glassmorphic UI with OGL shader background

## Setup
1. Clone repository  
2. Run `npm install`  
3. Add Firebase environment variables to `.env.local`
4. Start development server:
   ```bash
   npm run dev
   ```

## Build for Production

To build the application for production, run:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Deployment

This application is configured for deployment on Firebase App Hosting and can be integrated with GitHub for CI/CD.
