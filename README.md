# FashioMe Web Project

Fashion recommendation web app built with Next.js (App Router). The product has two main experiences:

- a user-facing styling and shopping dashboard
- an admin dashboard for managing users, clothes, and orders

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod validation |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Express 5, MongoDB (Mongoose), JWT auth |
| AI | Gemini (outfit generation) |

## Product Flow

The app follows one connected fashion journey:

```text
Login
  ↓
User Dashboard
  ↓
Ask for outfit
  ↓
Gemini generates outfit idea
  ↓
Check wardrobe
  ↓
Reuse owned items
  ↓
Match missing items from shop
  ↓
Show final outfit card
  ↓
Wear it or buy it
```

### What each part does

- **Onboarding** collects quick style preferences.
- **Silhouette / Style Profile** stores body shape, height, weight, skin tone, and face shape.
- **AI Stylist** generates outfit suggestions and styling advice.
- **Wardrobe** stores the user’s own clothes.
- **Shop** shows matching items the user can buy.
- **Profile** manages account details, style profile, password, and notifications.
- **Admin Dashboard** manages users, clothes, and orders.

### Dashboard behavior

- **Regular users** go to `/dashboard`
- **Admins** go to `/dashboard/admin`

The two dashboards share the same brand but have different jobs:

- **User dashboard**: styling, wardrobe, shop, and orders
- **Admin dashboard**: user management, catalog management, and order management

### Outfit logic

When a user asks for an outfit:

1. Gemini generates the base outfit idea.
2. The app checks whether the user already owns matching pieces.
3. If the wardrobe has the pieces, the app reuses them.
4. If something is missing, the shop suggests products to buy.
5. The final response includes the outfit card, image, explanation, and shopping suggestions.

This makes the app behave like a real fashion platform instead of a simple chatbot.

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a remote connection string
- The [Fashiome Backend](../Fashiome_Backend) repo set up and running

## Environment Setup

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8089"   # Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:8089"        # Optional alias supported by the app
```

The backend also needs its own `.env` (see `Fashiome_Backend/.env.example`):

```env
PORT=8089
MONGO_URI=mongodb://localhost:27017/fashiome-db
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
PUBLIC_API_URL=https://api.example.com
GEMINI_API_KEY=your-gemini-api-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=no-reply@example.com
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET=your-esewa-secret
```

If you use eSewa checkout, also keep `ESEWA_MERCHANT_CODE` and `ESEWA_SECRET` set in the backend env file.

## Getting Started

### 1. Start the backend

```bash
cd ../Fashiome_Backend
npm install
npm run dev
```

### 2. Start the web app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

- `/` - Welcome (home)
- `/login` - Login
- `/register` - Register
- `/onboarding` - Quick preference setup
- `/silhouette` - Style profile setup
- `/dashboard` - User dashboard
- `/dashboard/profile` - Account and style profile
- `/dashboard/profile/security` - Privacy and security
- `/dashboard/profile/subscription` - Current plan and billing availability
- `/dashboard/profile/notifications` - Notification feature status
- `/dashboard/admin` - Admin dashboard
- `/dashboard/admin/users` - Admin user management
- `/dashboard/admin/clothes` - Admin clothing catalog
- `/dashboard/admin/orders` - Admin order management
