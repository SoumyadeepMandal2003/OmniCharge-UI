<div align="center">

<img src="https://img.shields.io/badge/OmniCharge%20UI-Mobile%20Recharge%20Frontend-6366f1?style=for-the-badge&logo=lightning&logoColor=white" alt="OmniCharge UI"/>

# ⚡ OmniCharge UI

### *Glassmorphic Angular Frontend for the OmniCharge Recharge Platform*

[![Angular](https://img.shields.io/badge/Angular%2021-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS%207-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Node](https://img.shields.io/badge/Node%2020+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<br/>

> **A fully functional, production-ready Angular 21 frontend.**  
> Glassmorphic UI with dark/light themes, live system health monitoring,  
> JWT auth with auto-refresh, role-based access control, and real-time toast notifications.

<br/>

[![Live App](https://img.shields.io/badge/🌐%20Local%20App-localhost:4200-10b981?style=for-the-badge)](http://localhost:4200)
[![Backend API](https://img.shields.io/badge/🔗%20Backend%20API-OmniCharge-6366f1?style=for-the-badge)](https://github.com/SoumyadeepMandal2003/OmniCharge)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎨 UI Showcase](#-ui-showcase)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [📱 Pages & Routes](#-pages--routes)
- [🔐 Auth & Security](#-auth--security)
- [🎨 Design System](#-design-system)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔗 Backend Integration](#-backend-integration)

---

## ✨ Features

<table>
<tr>
<td>

**🎨 Design**
- Glassmorphic UI with `backdrop-filter: blur`
- Dark / Light theme toggle (persists in localStorage)
- Respects OS color scheme preference on first visit
- Inter font, smooth animations & transitions
- Fully responsive — mobile, tablet, desktop
- Custom styled scrollbars & gradient spinners

</td>
<td>

**🔐 Auth & Security**
- JWT access token + refresh token flow
- Auto token refresh via HTTP interceptor
- Token expiry detection (client-side JWT decode)
- Role-based routing (`USER` / `ADMIN`)
- Route guards: `authGuard`, `adminGuard`, `guestGuard`
- Session management — logout all devices

</td>
</tr>
<tr>
<td>

**📊 Dashboard & Data**
- Live system health status on login page
- Stats cards with total recharges, spend, transactions
- Searchable & filterable tables
- Real-time toast notifications (success / error / info / warning)
- Retry logic on failed API calls
- Specific error messages for every failure scenario

</td>
<td>

**⚡ Recharge Flow**
- Operator selection with visual pill buttons
- Plan cards with data / calls / SMS details
- Live summary before confirming
- Success screen with transaction details
- Full recharge history with status badges
- Payment transaction history

</td>
</tr>
<tr>
<td>

**👑 Admin Panel**
- Manage operators (create / edit / deactivate)
- Manage plans (create / deactivate) with type filters
- View all users with role & status
- System-wide transaction overview with revenue stats
- Confirm modals for destructive actions

</td>
<td>

**🛠️ Developer Experience**
- Angular 21 standalone components
- Signals-based state management (`signal()`, `computed()`)
- Lazy-loaded routes for optimal bundle size
- Typed HTTP services for every API endpoint
- `LocalDatePipe` for UTC → local timezone conversion
- Environment-based API URL configuration

</td>
</tr>
</table>

---

## 🎨 UI Showcase

### Login Page — with Live System Status
```
┌─────────────────────────────────────────┐
│  ⚡ OmniCharge                          │  ← Gradient brand header
│  Sign in to your account                │
│                                         │
│  ┌─ System Status ──────────────────┐   │
│  │  ✓ All systems operational       │   │  ← Live health check panel
│  │  🟢 API Gateway  🟢 Auth Service │   │
│  │  🟢 User Service 🟢 Recharge     │   │
│  │  🟢 Payment      🟢 Operator     │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Email ________________________         │
│  Password _____________________         │
│                                         │
│  [        Sign In        ]              │  ← Gradient button
└─────────────────────────────────────────┘
```

### Glassmorphic Sidebar
```
┌──────────────────┐
│ ⚡ OmniCharge    │  ← Gradient logo
├──────────────────┤
│ MAIN             │
│ 🏠 Dashboard     │
│ ⚡ New Recharge  │  ← Active: gradient highlight
│ 📋 History       │
│ 💳 Transactions  │
│ 📡 Operators     │
│ 📦 Plans         │
│ 👤 My Profile    │
├──────────────────┤
│ ADMIN            │
│ 👥 Users         │
│ 🏢 Operators     │
│ 🗂️  Plans         │
│ 📊 Transactions  │
├──────────────────┤
│ ☀️  Light Mode    │  ← Theme toggle
│ 👤 user@mail.com │  ← User avatar + email
│ [🚪 Sign Out]    │
└──────────────────┘
```

---

## 🏗️ Architecture

```
OmniCharge-UI/src/
│
├── app/
│   ├── core/                    # Singleton services, guards, interceptors, models
│   │   ├── guards/              # authGuard · adminGuard · guestGuard
│   │   ├── interceptors/        # JWT attach + auto-refresh on 401
│   │   ├── models/              # TypeScript interfaces for all API types
│   │   └── services/            # HTTP services + ThemeService + HealthService
│   │
│   ├── features/                # Lazy-loaded page components
│   │   ├── auth/                # login · register
│   │   ├── dashboard/           # stats + recent recharges
│   │   ├── recharge/            # new-recharge · recharge-history
│   │   ├── transactions/        # user transaction history
│   │   ├── operators/           # browse operators
│   │   ├── plans/               # browse plans with filters
│   │   ├── profile/             # edit profile · change password
│   │   ├── admin/               # users · operators · plans · transactions
│   │   └── not-found/           # 404 page
│   │
│   ├── layout/                  # Shell components
│   │   ├── main-layout/         # app shell (sidebar + content area)
│   │   ├── sidebar/             # glassmorphic nav sidebar
│   │   └── navbar/              # mobile top bar
│   │
│   └── shared/                  # Reusable components & utilities
│       ├── components/
│       │   ├── toast/           # toast notification system
│       │   ├── spinner/         # gradient loading spinner
│       │   └── confirm-modal/   # glassmorphic confirm dialog
│       └── utils/
│           ├── local-date.pipe  # UTC → local timezone pipe
│           └── status-badge     # status → CSS class mapping
│
├── environments/                # API URL per environment
└── styles.css                   # Global glassmorphic design system
```

---

## 📁 Project Structure

```
OmniCharge-UI/
├── src/
│   ├── app/
│   │   ├── app.ts                    # Root component
│   │   ├── app.config.ts             # provideRouter + provideHttpClient
│   │   ├── app.routes.ts             # All routes with lazy loading
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts     # authGuard · adminGuard · guestGuard
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts  # JWT + auto-refresh
│   │   │   ├── models/
│   │   │   │   ├── auth.models.ts
│   │   │   │   ├── user.models.ts
│   │   │   │   ├── operator.models.ts
│   │   │   │   ├── recharge.models.ts
│   │   │   │   └── payment.models.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── operator.service.ts
│   │   │       ├── recharge.service.ts
│   │   │       ├── payment.service.ts
│   │   │       ├── health.service.ts  # Live service health checks
│   │   │       ├── theme.service.ts   # Dark/light theme
│   │   │       └── toast.service.ts   # Toast notifications
│   │   ├── features/  ...
│   │   ├── layout/    ...
│   │   └── shared/    ...
│   ├── environments/
│   │   ├── environment.ts            # dev: http://localhost:8080
│   │   └── environment.prod.ts       # prod: http://localhost:8080
│   ├── index.html                    # Inter font + data-theme="dark"
│   ├── main.ts                       # bootstrapApplication
│   └── styles.css                    # Full glassmorphic design system
├── angular.json
├── package.json
├── tsconfig.json
└── postcss.config.js
```

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version   # 20+
npm --version    # 9+
```

### Install & Run

```bash
# Clone the repo
git clone https://github.com/SoumyadeepMandal2003/OmniCharge-UI.git
cd OmniCharge-UI

# Install dependencies
npm install

# Start development server
npm start
```

Open **[http://localhost:4200](http://localhost:4200)**

> Make sure the [OmniCharge backend](https://github.com/SoumyadeepMandal2003/OmniCharge) is running at `http://localhost:8080` or update `src/environments/environment.ts` to point to your backend.

### Build for Production

```bash
npm run build
```

Output goes to `dist/omnicharge-ui/` — ready to serve with any static file server (Nginx, Apache, etc.).

---

## ⚙️ Configuration

### API URL

Edit `src/environments/environment.ts` for local development:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'   // ← point to your backend
};
```

Edit `src/environments/environment.prod.ts` for production builds:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080'
};
```

### Theme Default

The default theme is **dark**. It's set on the `<html>` tag in `index.html`:

```html
<html lang="en" data-theme="dark">
```

Change to `data-theme="light"` to default to light mode.

---

## 📱 Pages & Routes

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/auth/login` | `LoginComponent` | Guest only | Login + live system status |
| `/auth/register` | `RegisterComponent` | Guest only | Create account |
| `/dashboard` | `DashboardComponent` | ✅ | Stats, recent recharges, quick actions |
| `/recharge` | `NewRechargeComponent` | ✅ | Initiate a new recharge |
| `/recharge/history` | `RechargeHistoryComponent` | ✅ | Full recharge history with filters |
| `/transactions` | `TransactionsComponent` | ✅ | Payment transaction history |
| `/operators` | `OperatorsComponent` | ✅ | Browse telecom operators |
| `/plans` | `PlansComponent` | ✅ | Browse all recharge plans |
| `/profile` | `ProfileComponent` | ✅ | Edit profile info |
| `/profile/change-password` | `ChangePasswordComponent` | ✅ | Change password |
| `/admin/users` | `AdminUsersComponent` | 👑 | View all registered users |
| `/admin/operators` | `AdminOperatorsComponent` | 👑 | Create / edit / deactivate operators |
| `/admin/plans` | `AdminPlansComponent` | 👑 | Create / deactivate plans |
| `/admin/transactions` | `AdminTransactionsComponent` | 👑 | All transactions + revenue stats |
| `/**` | `NotFoundComponent` | — | 404 page |

> ✅ = Logged in required &nbsp;&nbsp; 👑 = ADMIN role required &nbsp;&nbsp; Guest only = redirects to dashboard if already logged in

---

## 🔐 Auth & Security

### Token Flow

```
Login / Register
      │
      ▼
accessToken (24h) + refreshToken (7d) stored in localStorage
      │
      ▼
Every HTTP request → authInterceptor adds:
  Authorization: Bearer <accessToken>
      │
      ▼
On 401 response → interceptor auto-calls POST /api/auth/refresh
      │
      ├── Success → retry original request with new token
      └── Failure → clear session → redirect to /auth/login
```

### Route Guards

```typescript
authGuard    // blocks unauthenticated users → /auth/login
adminGuard   // blocks non-admin users → /dashboard
guestGuard   // blocks logged-in users → /dashboard (prevents back to login)
```

### Error Messages

Every API error shows a specific human-readable message:

| Scenario | Message shown |
|----------|--------------|
| Wrong password | "Incorrect email or password." |
| Network down | "Cannot reach server. Check your connection." |
| Request timeout | "Request timed out. Please wait and try again." |
| Email taken | "Email or mobile already registered." |
| Validation error | Field-level inline error messages |
| Server error | Backend error message or "Server error. Try again." |

---

## 🎨 Design System

### CSS Custom Properties (Dark Theme)

```css
--bg-gradient:    linear-gradient(135deg, #0f0c29, #302b63, #24243e)
--glass-bg:       rgba(255,255,255,0.08)
--glass-border:   rgba(255,255,255,0.15)
--text-primary:   #f1f5f9
--text-secondary: rgba(255,255,255,0.6)
--accent:         #6366f1
--success:        #10b981
--danger:         #ef4444
--warning:        #f59e0b
--info:           #3b82f6
```

### Key CSS Classes

| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphic card with blur + border |
| `.btn-primary` | Indigo gradient button with shadow |
| `.btn-secondary` | Glass outline button |
| `.btn-danger` | Red gradient button |
| `.input-field` | Glass input with focus glow |
| `.badge-success/warning/danger/info` | Pill badges with colored borders |
| `.stat-card` | Hoverable stat card with lift effect |
| `.sidebar-link-active` | Gradient active nav item |
| `.status-dot.up/down/checking` | Colored health indicator dots |
| `.animate-slide-up` | Entrance animation for cards |
| `.gradient-text` | Indigo → purple gradient text |

### Glassmorphic Effect Recipe

```css
background: rgba(255,255,255,0.08);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.15);
border-radius: 16px;
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| 🏗️ Framework | Angular 21 (standalone components) |
| 🔷 Language | TypeScript 5.9 |
| 🎨 Styling | CSS custom properties + Tailwind CSS 4 |
| ⚡ State | Angular Signals (`signal()`, `computed()`, `effect()`) |
| 🔄 Async | RxJS 7 (`Observable`, `forkJoin`, `catchError`, `retry`) |
| 🌐 HTTP | Angular `HttpClient` with functional interceptors |
| 📋 Forms | Angular Reactive Forms with validators |
| 🧭 Routing | Angular Router with lazy loading |
| 🔨 Build | Angular CLI 21 + esbuild |
| 🎯 Font | Inter (Google Fonts) |

---

## 🔗 Backend Integration

This UI connects to the **OmniCharge microservices backend**. All requests go through the API Gateway at port `8080`.

| Service | Port | What the UI uses it for |
|---------|------|------------------------|
| API Gateway | `8080` | All API calls routed through here |
| Auth Service | `8086` | Health check on login page |
| User Service | `8081` | Health check + profile APIs |
| Recharge Service | `8082` | Health check + recharge APIs |
| Payment Service | `8083` | Health check + transaction APIs |
| Operator Service | `8084` | Health check + operators/plans APIs |

> 🔗 **Backend repo:** [github.com/SoumyadeepMandal2003/OmniCharge](https://github.com/SoumyadeepMandal2003/OmniCharge)

### Start the full stack locally

```bash
# 1. Start backend (Docker)
cd OmniCharge
docker compose -f docker-compose.full.yml up --build

# 2. Start frontend (new terminal)
cd OmniCharge-UI
npm start

# Open http://localhost:4200
```

---

<div align="center">

**Built with ❤️ using Angular 21**

[![GitHub](https://img.shields.io/badge/GitHub-SoumyadeepMandal2003-181717?style=for-the-badge&logo=github)](https://github.com/SoumyadeepMandal2003)
[![Backend](https://img.shields.io/badge/🔗%20Backend-OmniCharge%20API-6366f1?style=for-the-badge)](https://github.com/SoumyadeepMandal2003/OmniCharge)

*If this project helped you, drop a ⭐ — it means a lot!*

</div>
