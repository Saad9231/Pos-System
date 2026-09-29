# StoreFlow — Architecture Document (architecture.md)

## 1. Overview
A modular monolith web application (React frontend + Node.js/Express API + PostgreSQL) with background workers for reminders and reports. Modular boundaries allow later extraction into services if needed.

## 2. System Context
```
Users (Owner/Manager/Cashier/...) --> Browser (React SPA/PWA)
Browser --HTTPS--> Reverse Proxy (Nginx) --> API (Node/Express)
API --> PostgreSQL (primary data)
API --> Redis (cache, sessions, queues)
API --> Object Storage (images, receipts, backups, PDFs)
Worker --> WhatsApp/SMS/Email providers
Worker --> Scheduled jobs (reminders, reports, backups)
```

## 3. Logical Architecture
| Layer | Responsibility |
|---|---|
| Presentation | React + TypeScript, Tailwind, React Query, i18n (EN/UR) |
| API | REST (JSON), validation, auth, RBAC, rate limiting |
| Domain modules | Catalog, Inventory, Sales/POS, Purchases, Customers, Suppliers, Orders/Production, Delivery, Labour, Expenses, Finance, Reports, Notifications, Admin |
| Data | PostgreSQL via ORM (Prisma), migrations, transactions |
| Async | BullMQ workers on Redis |
| Integrations | WhatsApp Business API, SMS gateway, SMTP |

## 4. Module Boundaries & Core Flows
- **Purchase:** Supplier → Purchase → stock+ → payable+ → supplier payment → payable−.
- **Sale:** Customer → Sale → stock− → receivable → payment → cash/bank+.
- **Custom order:** Order → advance → material issue (raw stock−) → labour allocation → production stages → QC → delivery → final payment. Actual cost = material + labour + other.
- **Labour:** Attendance → salary calc → salary payment → labour expense.
All money/stock changes go through a single **ledger/stock-movement service** inside DB transactions so modules stay consistent.

## 5. Data Architecture
- PostgreSQL, UUID/bigint keys, `created_at/updated_at/created_by`, soft-delete (`voided_at`).
- Stock is **derived from `stock_movements`** (append-only); `current_stock` is a cached column updated in the same transaction.
- Customer/supplier balances derived from ledger tables with running balance snapshot.
- Core tables: users, roles, permissions, products, categories, units, brands, raw_materials, customers, customer_transactions, customer_payments, suppliers, supplier_transactions, supplier_payments, purchases(+items), purchase_returns(+items), sales(+items), sales_returns(+items), custom_orders, order_stages, order_materials, deliveries, stock_movements, stock_adjustments, employees, attendance, salary, salary_payments, employee_advances, expenses, expense_categories, bank_accounts, cash_transactions, bank_transactions, notifications, notification_logs, invoices, audit_logs, settings, attachments. Phase 3: warehouses, warehouse_stock, stock_transfers, product_batches, product_serials.

## 6. Security Architecture
JWT access + rotating refresh tokens (httpOnly cookies), Argon2/bcrypt hashing, RBAC + permission checks per endpoint, optional 2FA for owner, rate limiting, CSRF protection, input validation (Zod), TLS everywhere, encrypted backups, secrets in env/secret manager, full audit trail.

## 7. Deployment Architecture
| Component | Option |
|---|---|
| Frontend | Static hosting/CDN (Vercel/Netlify/Nginx) |
| API + Worker | Docker containers on VPS/Cloud (DigitalOcean, AWS, Hetzner) |
| DB | Managed PostgreSQL or self-hosted with PITR |
| Redis | Managed/self-hosted |
| Storage | S3-compatible bucket |
| CI/CD | GitHub Actions → build → test → deploy |
Environments: local, staging, production.

## 8. Scalability & Reliability
Vertical scale first; horizontal API replicas behind proxy; DB indexes on foreign keys/date/status; caching dashboard aggregates in Redis; pagination everywhere; queue retries with backoff; health checks and uptime alerts.

## 9. Backup & DR
Daily automated DB dump + WAL archiving (PITR), weekly/monthly retention, off-site copy, quarterly restore test. RPO ≤ 24 h (target 15 min with PITR), RTO ≤ 4 h.

## 10. Observability
Structured logs (pino), error tracking (Sentry), metrics (Prometheus/Grafana or hosted), audit log UI for business events.

## 11. Key Decisions (ADR summary)
| Decision | Reason |
|---|---|
| Modular monolith | Small team, simpler ops |
| PostgreSQL | Strong transactions for finance/stock |
| Append-only stock & ledger | Traceability and audit |
| Void, not delete | Financial integrity |
| Queue for notifications | Reliable reminders, provider retries |
