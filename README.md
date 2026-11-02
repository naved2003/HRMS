# HRMS — Human Resource Management System

A complete HRMS solution built with **Angular 22.1.6** + **.NET 10** + **SQL Server**, using a **Layered + Repository** architecture on both client and server.

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  HRMS.Web (Angular 22.1.6)                                     │
│  Component → Service → Repository (HttpClient) → Web API       │
└────────────────────────────────────────────────────────────────┘
                                │ HTTPS / cookies
                                ▼
┌────────────────────────────────────────────────────────────────┐
│  HRMS.Api (ASP.NET Core Web API, .NET 10)                      │
│  Controller → Service → Repository → DbContext (EF Core 10)    │
└────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  SQL Server       │
                       │  (LocalDB / SQLEXPRESS / Full)
                       └──────────────────┘
```

## Workflow Map (matches the workflow diagram)

```
LOGIN (Admin / HR / Manager)
   │
   ▼
DASHBOARD
   ├── Employees   →  Employee Profile  →  Attendance / Leave / Salary / Performance / Documents
   ├── Departments
   ├── Designations
   ├── Attendance
   ├── Leave
   └── Payroll
            │
            ▼
      REPORTS & EXPORT (CSV / Excel)
```

## Solution Structure

```
HRMS/
├── HRMS.sln                       # Visual Studio solution
├── HRMS.Api/                       # ASP.NET Core Web API (.NET 10)
│   ├── Controllers/                # Auth, Account, Dashboard, Departments,
│   │                               # Designations, Employees, Attendance, Leave,
│   │                               # LeaveTypes, Payroll, SalaryStructures, Reports
│   ├── Seed/                       # DataSeeder (creates default admin)
│   ├── Extensions/                 # ServiceCollectionExtensions (DI wiring)
│   ├── Middleware/                 # ExceptionMiddleware
│   ├── Program.cs                  # App entry + DI + middleware pipeline
│   └── appsettings.json            # Connection string, cookie/CORS config
│
├── HRMS.Core/                      # Domain layer (entities, enums, interfaces)
│   ├── Entities/                   # ApplicationUser, Department, Designation, Employee,
│   │                               # Attendance, LeaveType, LeaveRequest, SalaryStructure,
│   │                               # PayrollRecord, Payslip, PerformanceReview, EmployeeDocument
│   ├── Enums/                      # Gender, EmploymentType, EmployeeStatus, AttendanceStatus,
│   │                               # LeaveStatus, PayrollStatus
│   └── Interfaces/                 # IRepository<T> + per-aggregate repository interfaces
│
├── HRMS.Infrastructure/           # EF Core + Repository implementations
│   ├── Configurations/            # Fluent API per entity
│   ├── Repositories/               # Generic Repository<T> + concrete repos
│   └── HRMSDbContext.cs            # IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
│
├── HRMS.Services/                 # Business logic
│   ├── DTOs/                       # Request/response DTOs (records)
│   ├── Mappings/                   # AutoMapper Profile (entity ↔ DTO)
│   ├── Interfaces/                 # I…Service interfaces
│   └── Services/                   # DepartmentService, EmployeeService, AttendanceService,
│                                    # LeaveService, PayrollService, AuthService,
│                                    # DashboardService, etc.
│
└── HRMS.Web/                       # Angular 22.1.6 frontend
    ├── package.json
    ├── angular.json
    ├── proxy.conf.json             # Dev proxy /api → http://localhost:5000
    └── src/
        ├── index.html
        ├── main.ts                 # bootstrapApplication(AppComponent, appConfig)
        ├── styles.css
        ├── environments/           # apiUrl per environment
        └── app/
            ├── app.config.ts        # provideRouter + provideHttpClient + interceptors
            ├── app.routes.ts        # Lazy routes for all features
            ├── core/                # Singletons shared across features
            │   ├── guards/          # authGuard, roleGuard
            │   ├── interceptors/    # authInterceptor (withCredentials), errorInterceptor
            │   ├── models/          # TS interfaces matching .NET DTOs
            │   ├── repositories/    # HttpClient wrappers per aggregate
            │   └── services/        # Domain services (state via Angular signals)
            ├── shared/
            │   ├── components/      # DataTable, PageHeader, ConfirmDialog, StatusChip,
            │   │                    # LoadingSpinner, EmptyState
            │   ├── layout/          # ShellLayout + Sidebar + Topbar
            │   └── utils/           # csv-export.util.ts
            └── features/            # Lazy-loaded feature pages
                ├── auth/login/
                ├── dashboard/
                ├── departments/
                ├── designations/
                ├── employees/{list,detail,form}/
                ├── attendance/
                ├── leave/
                ├── payroll/{list,payslip-view}/
                └── reports/
```

## Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | Angular 22.1.6, Angular Material 22.1.6, CDK 22.1.6, RxJS 7.8, TypeScript 5.5 |
| Backend     | .NET 10, ASP.NET Core Web API, ASP.NET Identity (cookies + roles) |
| Data        | EF Core 10, SQL Server (LocalDB / Express / Full) |
| Mapping     | AutoMapper 14                                    |
| API Docs    | Swashbuckle / Swagger                            |
| Auth        | ASP.NET Identity with `Admin`, `HR`, `Manager` roles |

## Prerequisites

| Tool                          | Version                |
|-------------------------------|------------------------|
| Visual Studio 2026            | with **.NET 10 SDK** workload |
| .NET 10 SDK                   | 10.0.x                 |
| SQL Server                    | LocalDB (built-in) / Express / Full |
| Node.js                       | 20 LTS or 22 LTS       |
| npm                           | 10+                    |
| Angular CLI (optional)        | 22.1.6 (global or via npx) |

## Getting Started — Backend (HRMS.Api)

### Option A — Visual Studio 2026
1. Open `HRMS.sln`.
2. Set **HRMS.Api** as the startup project.
3. Open `appsettings.json` and adjust the connection string if you are not using LocalDB:
   ```json
   "ConnectionStrings": {
     "Default": "Server=(localdb)\\MSSQLLocalDB;Database=HRMSDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
   }
   ```
4. Open the Package Manager Console (PMC) and run:
   ```powershell
   Add-Migration InitialCreate
   Update-Database
   ```
5. Press **F5**. The API will start at `https://localhost:5001` (and `http://localhost:5000`).
6. Swagger UI is available at `https://localhost:5001/swagger`.

### Option B — .NET CLI
```bash
cd HRMS
dotnet restore
dotnet build

# Generate + apply EF migrations
dotnet ef migrations add InitialCreate -p HRMS.Infrastructure -s HRMS.Api
dotnet ef database update -p HRMS.Infrastructure -s HRMS.Api

# Run the API
cd HRMS.Api
dotnet run
```

### Default seeded admin
The `DataSeeder` runs on first start-up and creates an Admin user so you can sign in:

| Email                | Password       | Role |
|----------------------|----------------|------|
| `admin@hrms.local`   | `Admin@123456` | Admin |

You can change this password immediately after first login, or modify `Seed/DataSeeder.cs` before running.

## Getting Started — Frontend (HRMS.Web)

```bash
cd HRMS.Web
npm install

# Start dev server (proxies /api → http://localhost:5000)
npm start
# Application: http://localhost:4200
```

The proxy config (`proxy.conf.json`) redirects `/api` to `http://localhost:5000`. If your API runs on a different port, edit this file.

### Production build
```bash
npm run build
# Output: dist/hrms-web/  — host with IIS / nginx / Azure Static Web Apps
```

## Login

1. Open `http://localhost:4200` in your browser.
2. You'll be redirected to `/login`.
3. Use the seeded admin: `admin@hrms.local` / `Admin@123456`.
4. After login you land on the Dashboard.

To create HR and Manager users, sign in as Admin and use the **Account → Register** endpoint (in Swagger or via an HR module page in a future iteration).

## Feature Walkthrough

| Module          | Page / Route              | Notes |
|-----------------|---------------------------|-------|
| Login           | `/login`                  | Cookie-based; remembers me for 8h |
| Dashboard       | `/dashboard`              | KPIs: total employees, present today, on leave today, pending leaves, department-wise headcount |
| Departments     | `/departments`            | CRUD with manager assignment |
| Designations    | `/designations`           | CRUD scoped to a department |
| Employees       | `/employees`              | Searchable, filter by department; row click → detail page |
| Employee Detail | `/employees/:id`          | Tabs: Profile, Attendance, Leave, Salary/Payroll, Performance, Documents |
| Attendance      | `/attendance`             | Per-day marking with CheckIn/CheckOut; auto Late if check-in > 09:30; missing checkout = Absent; < 4 hours = HalfDay |
| Leave           | `/leave`                  | Tabs: My Leaves, Pending Approvals (HR/Manager), All Leaves. Apply / Approve / Reject / Cancel |
| Payroll         | `/payroll`                | Per-month processing (single or bulk); unique index prevents double processing; view/print payslip |
| Reports         | `/reports`                | Attendance / Leave / Payroll reports with filters and CSV export (`?format=csv` server-side) |

## Architecture Rules (consistent across both sides)

### .NET side
- **Controllers** only translate HTTP ↔ DTOs and call services. No business logic.
- **Services** own business rules (payroll math, attendance auto-status, leave day-counting, role validation).
- **Repositories** are the only layer that touches `HRMSDbContext`. Each aggregate has its own interface + implementation.
- **DTOs** (records) live in `HRMS.Services/DTOs/` so the API layer stays thin.
- **Entity interfaces** live in `HRMS.Core/Interfaces/` so services depend on abstractions, not EF.

### Angular side
- **Components** only render UI and emit events; never call `HttpClient` directly.
- **Services** own state (Angular signals) and call repositories.
- **Repositories** wrap `HttpClient` and return `Observable<T>`.
- **Models** match DTOs exactly (camelCase) so JSON serialization is transparent.
- **Guards + Interceptors** handle authentication globally.

## Cross-Origin & Cookie Setup

The API enables cookies for `http://localhost:4200` with:
- `WithCredentials` on every Angular HTTP request (handled by `authInterceptor`)
- CORS policy `AllowAngular` allowing `http://localhost:4200` with credentials
- Cookie: `HttpOnly`, `Secure=Always`, `SameSite=None`, sliding 8 hours

If you change the Angular port, update `appsettings.json → Cors.AllowedOrigins` and `proxy.conf.json`.

## Common Tasks

| Task                                              | Command |
|---------------------------------------------------|---------|
| Add a new EF migration                            | `dotnet ef migrations add <Name> -p HRMS.Infrastructure -s HRMS.Api` |
| Apply migrations                                  | `dotnet ef database update -p HRMS.Infrastructure -s HRMS.Api` |
| Run the .NET API                                  | `cd HRMS.Api && dotnet run` |
| Run the Angular app                               | `cd HRMS.Web && npm start` |
| Build Angular for production                     | `cd HRMS.Web && npm run build` |
| Generate Angular component (schematic standalone) | `cd HRMS.Web && ng generate component features/<module>/<name> --standalone` |

## Folder Output

This deliverable is a loose folder at `/home/z/my-project/download/HRMS/` (no ZIP). Open `HRMS.sln` directly in Visual Studio 2026.

## Known Notes / TODOs

1. **EF migrations not pre-generated** — run `dotnet ef migrations add InitialCreate` (or PMC `Add-Migration InitialCreate`) on first open to materialize the schema.
2. **Auto-cancel pending leaves on termination** — the hook `LeaveService.AutoCancelPendingLeavesForEmployeeAsync` exists; wire it from `EmployeeService.UpdateAsync` when status flips to `Terminated`.
3. **Role guard available but unused on routes** — add `canActivate: [roleGuard([UserRole.HR, UserRole.Manager])]` to any child route you want to restrict.
4. **Angular environment file replacement** — `angular.json` does not yet wire `fileReplacements` for production; add one if you want to swap `environment.ts` ↔ `environment.development.ts` at build time.
5. **No unit tests generated** — add tests for repositories (`HttpTestingController`) and services (signal state) as a next step.
6. **Document uploads** — `EmployeeDocument` entity exists; the API controller and Angular UI for file upload can be added as a follow-up.

## License

Internal project — adapt to your organization's license policy.
