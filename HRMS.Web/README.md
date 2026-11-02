# HRMS.Web

Angular 22.1.6 frontend for the **HRMS** (Human Resource Management System).

## Tech Stack
- Angular 22.1.6 (standalone components, no NgModules)
- Angular Material 22.1.6
- Angular CDK 22.1.6
- TypeScript 5.5
- RxJS 7.8
- Angular Router, Reactive Forms, HttpClient

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm start
```
The dev server proxies `/api/*` to `http://localhost:5000` (see `proxy.conf.json`) so the
Angular app can talk to the .NET HRMS.Api without CORS configuration.

### 3. Build for production
```bash
npm run build
```
Output is written to `dist/hrms-web/`.

## Project Structure
```
src/
├── app/
│   ├── core/           # services, repositories, guards, interceptors, models
│   ├── features/       # auth, dashboard, departments, designations, employees,
│   │                   # attendance, leave, payroll, reports
│   ├── shared/         # layout (shell, sidebar, topbar) + reusable components
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/       # environment.ts, environment.development.ts
├── index.html
├── main.ts
└── styles.scss
```

## Architecture
`Component → Service → Repository → HttpClient → Web API`

- **Repositories** wrap HttpClient calls per aggregate (return Observables).
- **Services** orchestrate business operations and expose state via Angular signals.
- **Components** are standalone and consume services via `inject()`.

## Backend
This frontend expects the .NET HRMS.Api running on `http://localhost:5000` with cookie-based
ASP.NET Identity auth. Endpoints must follow the `{baseUrl}/api/{aggregate}` convention.
