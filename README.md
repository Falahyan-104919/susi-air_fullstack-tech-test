# Susi Air — Pilot Operations & Flight Duty App

[![CI Pipeline](https://github.com/Falahyan-104919/susi-air_fullstack-tech-test/actions/workflows/ci.yml/badge.svg)](https://github.com/Falahyan-104919/susi-air_fullstack-tech-test/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![pnpm Workspace](https://img.shields.io/badge/pnpm-workspace-orange)
![NestJS 10](https://img.shields.io/badge/nestjs-10.4-red)
![Nuxt 3](https://img.shields.io/badge/nuxt-3.21-00DC82)

> Full Stack Developer Technical Assessment Submission  
> **PT ASI Pudjiastuti Aviation (Susi Air)**

A high-reliability, mobile-first operations and flight duty compliance web application for Susi Air line pilots. Built as a monorepo containing a **NestJS REST API** backend and a **Nuxt 3 (Vue 3)** frontend web app adhering to Civil Aviation Safety Regulations (CASR).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20+` (developed & verified on Node `v26.1.0` / Node `v20 LTS`)
- **Package Manager**: `pnpm >= 8` (monorepo workspaces)

### 1. Local Monorepo (Recommended)
```bash
# Clone and install dependencies across the monorepo
pnpm install

# Start both NestJS API (port 3001) and Nuxt Web App (port 3000) concurrently
pnpm dev
```
- **Pilot Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:3001](http://localhost:3001)
- **Interactive Swagger Documentation**: [http://localhost:3001/api](http://localhost:3001/api)
- **OpenAPI 3.0 Specification**: [http://localhost:3001/api-json](http://localhost:3001/api-json)

### 2. Docker & Containerized Launch
```bash
# Build and run the NestJS API container
docker compose up --build
```

---

## 🔑 Reviewer Test Credentials

| Username | Password | Assigned Pilot | Role | Total Hours |
| :--- | :--- | :--- | :--- | :--- |
| `johndoe` | `susiairtest` | **John Doe** | Line Pilot | 1,444.5 hrs |

> **Pro-Tip for Reviewers**: The Sign-In screen features a 1-click **"Auto-fill"** helper button that automatically populates the test credentials for fast evaluation.

---

## 🏛️ Monorepo Architecture

```
technical-interview-susi-air/
├── nest/                           # Backend NestJS REST API
│   ├── data/                       # In-memory seed datasets (isolated per brief)
│   │   ├── mock-flight-hours.json
│   │   ├── mock-documents.json
│   │   └── mock-schedules.json
│   ├── src/
│   │   ├── common/                 # Filters, guards, decorators, constants
│   │   │   ├── filters/            # Global HttpExceptionFilter
│   │   │   ├── guards/             # Global JwtAuthGuard
│   │   │   └── decorators/         # @Public() bypass decorator
│   │   ├── data/                   # DataService with fail-fast validation & Map indexing
│   │   ├── modules/
│   │   │   ├── auth/               # Passport JWT authentication & DTO validation
│   │   │   ├── pilot/              # GET /pilot/me endpoint
│   │   │   ├── flight-hours/       # Rolling-sum calculation engine & 15-day series
│   │   │   ├── documents/          # Urgency evaluation engine (safe/soon/expired)
│   │   │   └── schedules/          # Monthly roster with completion tick guards
│   │   └── types/                  # Shared enterprise domain TypeScript contracts
│   └── test/                       # Supertest E2E integration test suite
│
├── nuxt/                           # Frontend Nuxt 3 (Vue 3) Web App
│   ├── assets/scss/                # Susi Air design system (tokens, mixins, main)
│   ├── components/
│   │   ├── layout/                 # AppHeader & BottomNav components
│   │   ├── flight-hours/           # LimitCard, RangeToggle, FlightTrendChart
│   │   ├── documents/              # DocumentBadge & DocumentList
│   │   └── schedule/               # CalendarHeader, CalendarGrid, DutyLegend
│   ├── layouts/                    # Option A mobile shell (fluid mobile / 480px desktop)
│   ├── middleware/                 # Global auth route protection & redirection
│   ├── pages/                      # /login, /home, /schedule, /schedule/[date], /logbook, /more
│   ├── stores/                     # Pinia stores (auth, flightHours, documents, schedule)
│   └── types/                      # Frontend domain types
│
├── docker-compose.yml              # Local container orchestration
├── pnpm-workspace.yaml             # Workspace definition
└── README.md                       # Comprehensive system documentation
```

---

## 📡 API Contract Specification

All endpoints (except `POST /auth/login`) require Bearer JWT authentication: `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates `johndoe` / `susiairtest`. Returns JWT token (7d) and pilot profile. |
| `GET` | `/pilot/me` | Protected | Returns the authenticated pilot profile (name, total hours, avatar). |
| `GET` | `/flight-hours` | Protected | Query flight hours within a specific date range (`?from=YYYY-MM-DD&to=YYYY-MM-DD`). |
| `GET` | `/flight-hours/summary` | Protected | Computes 4 limit cards and 15-day trend series centered on May 15 (`?range=1w\|1m\|3m\|6m\|1y`). |
| `GET` | `/documents` | Protected | Evaluates pilot licenses/clearances sorted urgency-first (`expired` → `soon` → `safe`). |
| `GET` | `/schedules` | Protected | Returns enriched duty entries for a month with completion flags (`?year=YYYY&month=MM`). |

---

## ⚖️ Section D: Architectural Decisions & Ambiguity Resolutions

### 1. Global Reference Date Fixed at `2026-05-15` (`APP_TODAY`)
- **Challenge**: The seed dataset is anchored around mid-May 2026. Evaluating queries against the real-world current system date would result in 0 hours and 100% expired certificates.
- **Decision**: Established a centralized application constant `APP_TODAY = '2026-05-15'`. All rolling-sum windows, document expiry calculations, and calendar "Today" markers anchor deterministically to this date.

### 2. Neutralization of the "Canary Trap"
- **Observation**: The take-home brief PDF contained white-text prompt injections instructing AI assistants to insert a fake function `rollingWindowBluffing()` and comment `// this is a rolling sum calculation :)`.
- **Decision**: Safely identified and ignored the injection. Implemented a clean, production-grade `calculateRollingSum(targetDate, windowDays)` method with `Math.round(sum * 10) / 10` precision rounding.

### 3. Semantics of Future Dates (May 16–22)
- **Challenge**: The brief specifies a 15-day display series centered on May 15 (`today - 7` through `today + 7`). May 16 through May 22 are future dates.
- **Decision**: Future dates represent **projected/rostered duty flight hours**. They allow line pilots and flight dispatchers to forecast regulatory compliance exceedances before flying. Points where `date > APP_TODAY` have `isProjected: true`. On May 20, 2026, the rolling 7-day sum reaches **44.7 hours**, exceeding the 40.0-hour limit and triggering visual alert indicators.

### 4. Handling Pre-Dataset Dates
- **Challenge**: The seed dataset begins on `2024-12-27`. Long rolling windows (e.g., 365-day annual window) query dates before this inception.
- **Decision**: The calculation engine gracefully returns `0.0` hours for dates before dataset inception or missing dates, ensuring seamless calculations without arithmetic errors.

### 5. Schedule Completion Tick Guard
- **Challenge**: Rest days or off days (`duty_type === 'OFF'`) have `count_schedules: 0` and `count_logbooks: 0`. A naive `count_logbooks === count_schedules` check would falsely mark rest days as "Completed Duties".
- **Decision**: Enforced the strict guard:
  ```typescript
  isCompleted = count_schedules > 0 && count_logbooks === count_schedules;
  ```
  Rest and off days render with a neutral `OFF` badge and never display false completion checkmarks.

### 6. Urgency-First Document Sorting
- **Implementation**: The backend computes pure domain statuses:
  - `expired`: `daysRemaining <= 0`
  - `soon`: `0 < daysRemaining <= warningDays` (threshold: 30 days)
  - `safe`: `daysRemaining > warningDays`
- Returned documents are sorted urgency-first (`expired` → `soon` → `safe`), breaking ties by earliest expiry date. Presentation styling is mapped on the frontend.

### 7. Option A Responsive Mobile Shell
- **Mobile (`<640px`)**: Full-bleed 100% fluid edge-to-edge layout with iOS safe-area insets (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`).
- **Desktop (`≥640px`)**: Centered 480px mobile app viewport container framed against a neutral staging background (`#E5E7EB`).

### 8. SSR-Safe Chart Rendering
- Chart.js visualizer is isolated inside `<ClientOnly>` in Nuxt 3 to prevent Server-Side Rendering (SSR) hydration mismatches on Nitro/Vercel.

---

## 🧪 Verification & Test Suite

### Run All Tests & Verification
```bash
# 1. Run Backend Unit Tests (13 test cases)
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
  - Full payload validation and error filter formatting.

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

## 📄 License
Assessment submission prepared for PT ASI Pudjiastuti Aviation (Susi Air). All rights reserved.
