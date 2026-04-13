# 🌿 EcoLearn — Interactive Environmental Education Platform

A gamified environmental education platform built with **Next.js 16**, **React 19**, **Firebase**, and **Framer Motion**. Students learn about sustainability through interactive modules, quizzes, eco-challenges, and games while earning EcoPoints.

## ✨ Features

- 📚 **Interactive Learning Modules** — Video lessons, documents, and interactive content
- ❓ **Quizzes** — Test knowledge with category-based quizzes
- 🎯 **Eco Challenges** — Complete real-world sustainability tasks and submit proof
- 🎮 **Games** — Fun eco-themed games for learning
- 💬 **Community Forum** — Share posts with images/videos, promote content
- 🏆 **Leaderboard** — Compete on school, state, country, or global level
- 🏅 **Achievements & Badges** — Automatically granted based on progress
- 👤 **User Profiles** — Track progress, eco impact, and activity history
- 🛡️ **Admin Dashboard** — Manage users, content, and platform stats
- 🔍 **Search** — Find modules, quizzes, challenges, and forum posts

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Framer Motion, Lucide Icons |
| Styling | Tailwind CSS 4, Glassmorphism Design |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Media | Cloudinary (image/video uploads) |
| Fonts | Inter, Plus Jakarta Sans (Google Fonts) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Auth + Firestore enabled
- Cloudinary account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/eco-learn-nextjs.git
   cd eco-learn-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your credentials in `.env.local` (see `.env.example` for all required variables).

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/             # Authenticated route group
│   │   ├── admin/         # Admin dashboard
│   │   ├── challenges/    # Eco challenges
│   │   ├── dashboard/     # User dashboard
│   │   ├── forum/         # Community forum
│   │   ├── games/         # Eco games
│   │   ├── leaderboard/   # Leaderboard
│   │   ├── modules/       # Learning modules
│   │   ├── profile/       # User profile
│   │   ├── quiz/          # Quizzes
│   │   └── settings/      # User settings
│   ├── api/               # REST API routes
│   │   ├── admin/         # Admin management endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── challenges/    # Challenge & proof endpoints
│   │   ├── forum/         # Forum post endpoints
│   │   ├── leaderboard/   # Leaderboard endpoint
│   │   ├── modules/       # Module endpoints
│   │   ├── quizzes/       # Quiz endpoints
│   │   └── user/          # User profile & activity endpoints
│   ├── page.tsx           # Landing page with auth
│   └── layout.tsx         # Root layout
├── components/
│   ├── Navbar.tsx         # Sidebar + mobile bottom nav
│   └── ui/               # Reusable UI components
├── context/
│   └── AuthContext.tsx    # Firebase Auth context
├── lib/
│   ├── auth.ts           # Server-side token verification
│   ├── badges.ts         # Badge definitions & auto-granting
│   ├── firebase.ts       # Firebase Admin SDK (server)
│   ├── firebase-client.ts# Firebase Client SDK (client)
│   ├── cloudinary.ts     # Cloudinary upload helpers
│   ├── rate-limit.ts     # API rate limiting
│   └── animations.ts     # Framer Motion variants
└── types.ts              # TypeScript type definitions
```

## 🔒 Security

- All API routes verify Firebase ID tokens server-side
- Admin endpoints require admin/superadmin role verification
- Rate limiting on all API endpoints (10 req/min for auth, 60 req/min general)
- Points and activity recording are validated and capped server-side
- Automated badge granting prevents client-side manipulation

## 📄 License

This project was developed for SIH 2025.
