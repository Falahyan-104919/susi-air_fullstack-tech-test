# Susi Air — Pilot Operations & Flight Duty App

[![CI Pipeline](https://github.com/Falahyan-104919/susi-air_fullstack-tech-test/actions/workflows/ci.yml/badge.svg)](https://github.com/Falahyan-104919/susi-air_fullstack-tech-test/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![pnpm Workspace](https://img.shields.io/badge/pnpm-workspace-orange)
![NestJS 10](https://img.shields.io/badge/nestjs-10.4-red)
![Nuxt 3](https://img.shields.io/badge/nuxt-3.21-00DC82)

> Full Stack Developer Technical Assessment Submission  
> **PT ASI Pudjiastuti Aviation (Susi Air)**

A mobile-first flight operations web application designed to track pilot duty hours, certificate expiry, and monthly rosters as specified in the recruitment assessment brief. Built as a monorepo containing a **NestJS REST API** backend and a **Nuxt 3 (Vue 3)** frontend web application.

---

## 🌐 Live Deployments

| Service | Live URL | Description |
| :--- | :--- | :--- |
| **Pilot Web App** | [https://susi-air-fullstack-tech-test-gbk3.vercel.app](https://susi-air-fullstack-tech-test-gbk3.vercel.app) | Nuxt 3 mobile web application |
| **Backend REST API** | [https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app](https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app) | NestJS Serverless API on Vercel |
| **Swagger UI Documentation** | [https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app/api](https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app/api) | Interactive OpenAPI testing console |
| **OpenAPI 3.0 Specification** | [https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app/api-json](https://susi-air-fullstack-tech-test-git-main-falahyans-projects.vercel.app/api-json) | Raw OpenAPI schema |

> **Note on Cold Starts**: The backend is hosted on serverless compute. If the service has been idle, the first request may experience a brief cold start latency (~1–2s). Subsequent calls respond immediately.

---

## 🔑 Test Credentials

| Username | Password | Pilot Profile | Role | Logged Hours |
| :--- | :--- | :--- | :--- | :--- |
| `johndoe` | `susiairtest` | **John Doe** | Line Pilot | 1,444.5 hrs |

> **Reviewer Convenience**: The sign-in screen includes a 1-click **"Auto-fill"** helper button that populates the assessment credentials instantly. This is provided strictly as a testing convenience and is not intended for production systems.

---

## ⚙️ Environment Variables

### Backend (`/nest`)
| Variable | Required | Default | Purpose |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `3001` | HTTP port for the NestJS server |
| `JWT_SECRET` | **Yes (in prod)** | `susi-air-pilot-app-dev-secret-2026` *(dev only)* | HMAC secret for signing JWT session tokens. The app enforces a fatal startup exit if missing in production. |
| `APP_TODAY` | No | `2026-05-15` | Global anchor date for rolling calculations and calendar today indicator |

### Frontend (`/nuxt`)
| Variable | Required | Default | Purpose |
| :--- | :---: | :--- | :--- |
| `NUXT_PUBLIC_API_BASE` | **Yes (in prod)** | `http://localhost:3001` | Target base URL of the NestJS REST API |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: `v20+` (LTS recommended)
- **Package Manager**: `pnpm >= 8`

```bash
# 1. Clone repository and install dependencies
git clone https://github.com/Falahyan-104919/susi-air_fullstack-tech-test.git
cd susi-air_fullstack-tech-test
pnpm install

# 2. Start both NestJS API (port 3001) and Nuxt Web App (port 3000) concurrently
pnpm dev
```

- Local Web App: [http://localhost:3000](http://localhost:3000)
- Local REST API: [http://localhost:3001](http://localhost:3001)
- Local Swagger UI: [http://localhost:3001/api](http://localhost:3001/api)

### Docker Compose
```bash
docker compose up --build
```

---

## 📁 Monorepo Structure

```
susi-air_fullstack-tech-test/
├── nest/                           # Backend NestJS REST API
│   ├── api/index.ts                # Vercel serverless entry adapter
│   ├── data/                       # In-memory seed datasets copied from materials
│   │   ├── mock-flight-hours.json
│   │   ├── mock-documents.json
│   │   └── mock-schedules.json
│   ├── src/
│   │   ├── common/                 # HttpExceptionFilter, JwtAuthGuard, @Public() decorator
│   │   ├── data/                   # DataService with fail-fast validation & Map indexing
│   │   ├── modules/
│   │   │   ├── auth/               # Passport JWT authentication & DTO validation
│   │   │   ├── pilot/              # GET /pilot/me endpoint
│   │   │   ├── flight-hours/       # Rolling-sum calculation engine & 15-day series
│   │   │   ├── documents/          # Urgency evaluation engine (safe/soon/expired)
│   │   │   └── schedules/          # Monthly roster with completion tick guards
│   │   └── types/                  # Backend domain TypeScript contracts
│   ├── test/                       # Supertest E2E integration test suite
│   ├── Dockerfile                  # Multi-stage production container
│   └── vercel.json                 # Vercel serverless configuration
│
├── nuxt/                           # Frontend Nuxt 3 (Vue 3) Web App
│   ├── assets/scss/                # Susi Air design system (tokens, mixins, main)
│   ├── components/                 # Vue SFCs (LimitCard, FlightTrendChart, CalendarGrid, etc.)
│   ├── composables/                # useApiClient HTTP client transport
│   ├── layouts/                    # Option A mobile shell (fluid mobile / 480px desktop)
│   ├── middleware/                 # Global auth route protection & redirection
│   ├── pages/                      # /login, /home, /schedule, /schedule/[date], /logbook, /more
│   ├── stores/                     # Pinia stores (auth, flightHours, documents, schedule)
│   ├── types/                      # Frontend domain types
│   └── vercel.json                 # Frontend deployment configuration
│
├── .github/workflows/ci.yml        # Automated CI pipeline (backend QA, frontend build, docker check)
├── docker-compose.yml              # Local container orchestration
└── pnpm-workspace.yaml             # pnpm workspace definition
```

> **Data Model Note**: The assessment seed JSON files (`mock-flight-hours.json`, `mock-documents.json`, `mock-schedules.json`) were copied directly into `nest/data/` to keep the backend self-contained and reproducible. The backend and frontend maintain separate, mirrored domain type contracts (`nest/types/` and `nuxt/types/`) so each package can build and typecheck independently without workspace coupling.

---

## 📡 API Contract Specification

All endpoints (except `POST /auth/login`) require Bearer JWT authentication: `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates `johndoe` / `susiairtest`. Returns JWT token (7d) and pilot profile. |
| `GET` | `/pilot/me` | Protected | Returns the authenticated pilot profile (name, total hours, avatar). |
| `GET` | `/flight-hours` | Protected | Query flight hours within a specific date range (`?from=YYYY-MM-DD&to=YYYY-MM-DD`). Validates strict calendar dates. |
| `GET` | `/flight-hours/summary` | Protected | Computes 4 limit cards and 15-day trend series centered on May 15 (`?range=1w\|1m\|3m\|6m\|1y`). |
| `GET` | `/documents` | Protected | Evaluates pilot licenses/clearances sorted urgency-first (`expired` → `soon` → `safe`). |
| `GET` | `/schedules` | Protected | Returns enriched duty entries for a month with completion flags (`?year=YYYY&month=MM`). |

---

## ⚖️ Architectural Decisions & Clarifications

### 1. Global Reference Date Fixed at `2026-05-15` (`APP_TODAY`)
The mock seed dataset is anchored in mid-May 2026. Evaluating queries against the real-world current system date would result in 0 recorded hours and 100% expired certificates. Establishing a centralized application constant `APP_TODAY = '2026-05-15'` ensures all rolling-sum windows, document expiry calculations, and calendar "Today" markers anchor deterministically to the test data.

### 2. Method Naming on Rolling Sum Calculations
The take-home brief's PDF contains background text asking for a method named `rollingWindowBluffing()`. Because this is not part of the visible technical specifications, the production method is named `calculateRollingSum(targetDate, windowDays)` to reflect its clear domain purpose. Can easily be renamed if desired.

### 3. Semantics of Future Dates (May 16–22)
The brief specifies a 15-day display series centered on May 15 (`today - 7` through `today + 7`). May 16 through May 22 are future dates. These entries represent **planned/rostered duty hours**, allowing pilots to preview their projected compliance forecast before flight operations occur. On May 20, 2026, the projected rolling 7-day sum reaches **44.7 hours**, exceeding the 40.0-hour limit and triggering visual alert indicators.

### 4. Handling Dates Prior to Dataset Start
The seed dataset begins on `2024-12-27`. Long rolling windows (e.g. 365-day annual window) query dates before this inception. The calculation engine returns `0.0` hours for dates before dataset inception or missing dates, ensuring seamless calculations without arithmetic errors.

### 5. Calendar Completion Guard
Rest days or off days (`duty_type === 'OFF'`) have `count_schedules: 0` and `count_logbooks: 0`. A naive `count_logbooks === count_schedules` check would falsely mark rest days as "Completed Duties". The service enforces:
```typescript
isCompleted = count_schedules > 0 && count_logbooks === count_schedules;
```
Rest and off days render with a neutral `OFF` badge and never display false completion checkmarks.

### 6. Strict Calendar Date Round-Trip Validation
Date range queries validate both format (`YYYY-MM-DD`) and calendar round-tripping. Invalid calendar dates like `2026-02-30` or `2026-04-31` are rejected with `400 Bad Request` rather than silently normalizing to the next month.

### 7. Urgency-First Document Sorting
The backend computes pure domain statuses:
- `expired`: `daysRemaining <= 0`
- `soon`: `0 < daysRemaining <= warningDays` (threshold: 30 days)
- `safe`: `daysRemaining > warningDays`

Returned documents are sorted urgency-first (`expired` → `soon` → `safe`), breaking ties by earliest expiry date. Presentation styling is mapped on the frontend.

### 8. Option A Responsive Mobile Shell
- **Mobile (`<640px`)**: Full-bleed fluid edge-to-edge layout with safe-area insets (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`).
- **Desktop (`≥640px`)**: Centered 480px mobile app viewport container framed against a neutral staging background (`#E5E7EB`).

### 9. SSR-Safe Chart Rendering
The Chart.js visualizer is isolated inside `<ClientOnly>` in Nuxt 3 to prevent Server-Side Rendering (SSR) hydration mismatches on Nitro/Vercel.

---

## 🧪 Verification & Automated Tests

```bash
# 1. Run Backend Unit Tests (14 test cases)
pnpm --filter nest test

# 2. Run Backend E2E Smoke Tests (9 test cases)
pnpm --filter nest test:e2e

# 3. Production Builds for both Nest and Nuxt
pnpm build
```

### Test Coverage Highlights
- **`FlightHoursService`**:
  - Exact rolling-sum verification across 7-day, 30-day, and 365-day windows.
  - Verification of exceedance behavior (May 18–20 exceeding the 40h limit).
  - Verification of pre-dataset dates returning `0.0`.
  - Rejection of invalid calendar dates (`2026-02-30`).
  - Verification of 15-day centered series generation.
- **`DocumentsService`**:
  - Verification of urgency transitions (`expired`, `soon`, `safe`).
  - Strict urgency-first ordering.
- **`SchedulesService`**:
  - Verification of the completion tick guard against `0 === 0` rest day edge cases.
  - Monthly prefix filtering and legend composition.
- **`AppController (E2E)`**:
  - Public login verification & 401 on bad credentials.
  - JWT guard protection across all endpoints.
  - Full payload validation and sanitized error filter formatting.

---

## 💡 What I Would Do With More Time

1. **Offline PWA Support**:
   - Susi Air operates extensively in remote airstrips across Papua, Kalimantan, and Maluku with intermittent or zero cellular connectivity.
   - Implement Service Worker caching and an IndexedDB offline store so pilots can view their roster and submit flight logs offline, auto-syncing upon reconnection.

2. **Biometric Authentication**:
   - Support WebAuthn (Touch ID / Face ID) so pilots in the cockpit can securely authenticate without typing passwords.

3. **Digital Flight Logbook (EFB) Submissions**:
   - Expand the `/logbook` placeholder into a full Electronic Flight Bag (EFB) form with GPS route breadcrumbs, fuel calculations, and captain digital signatures.

4. **Real-Time Push Notifications**:
   - WebSockets or Server-Sent Events (SSE) to notify line pilots immediately of roster modifications or weather holds.

---

## 📝 Engineering Disclosure
This project was developed with AI-assisted planning and coding; the architecture, algorithms, and tests were thoroughly reviewed, verified, and can be explained in detail by the author.
