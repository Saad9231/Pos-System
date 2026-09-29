# StoreFlow — Technical Requirements Document (TRD)

## 1. Technology Stack
| Area | Choice |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form + Zod, Recharts, i18next |
| Backend | Node.js 20, Express (or NestJS), TypeScript, Zod validation |
| Database | PostgreSQL 15+, Prisma ORM |
| Cache/Queue | Redis, BullMQ |
| Auth | JWT (access 15 min) + refresh rotation, RBAC |
| Files | S3-compatible storage, image resize (sharp) |
| PDF | Puppeteer / pdfkit for invoices and reports |
| Export | ExcelJS, CSV |
| Barcode | JsBarcode (generate), browser camera/scanner (HID keyboard-wedge) |
| Messaging | WhatsApp Business API provider, SMS gateway, Nodemailer |
| Testing | Vitest/Jest, Supertest, Playwright |
| DevOps | Docker, GitHub Actions, Nginx |

## 2. Functional-to-Technical Mapping
| Requirement | Technical approach |
|---|---|
| Stock accuracy | Append-only `stock_movements`, transactional updates, row locks on POS |
| Customer ledger | `customer_transactions` with running balance, recomputable |
| Reminders | Daily cron job → query due invoices → enqueue notifications → provider → log |
| Custom order pipeline | State machine (allowed transitions), stage log with user/time |
| Product costing | `order_materials` + `labour_allocation` + `order_expenses` summed per order |
| Permissions | Permission matrix table; middleware `can(user, module, action)` |
| Audit | DB triggers or service hook writing old/new JSON |
| Backups | pg_dump cron + WAL archiving, upload to object storage |

## 3. API Design
REST, versioned `/api/v1`, JSON, cursor/offset pagination, filtering `?q=&from=&to=&status=`, consistent error format `{code, message, details}`. OpenAPI/Swagger docs.
Main resources: `/auth`, `/users`, `/roles`, `/products`, `/categories`, `/raw-materials`, `/customers`, `/customers/:id/ledger`, `/suppliers`, `/purchases`, `/sales`, `/payments`, `/orders`, `/orders/:id/stages`, `/deliveries`, `/employees`, `/attendance`, `/salaries`, `/advances`, `/expenses`, `/accounts`, `/reports/*`, `/notifications`, `/audit-logs`, `/settings`, `/backups`.

## 4. Data Requirements
- Money: `NUMERIC(14,2)`, PKR, never floats.
- Dates: UTC stored, displayed Asia/Karachi (PKT, UTC+5).
- Unique: SKU, barcode, invoice number (sequential per series), customer phone (warn on duplicate).
- Indexes: FK columns, `(customer_id, date)`, `(status, due_date)`, `(product_id, created_at)`.
- Retention: financial data ≥ 7 years; audit logs ≥ 3 years.

## 5. Security Requirements
- OWASP Top 10 mitigations, parameterised queries via ORM.
- Password policy ≥ 10 chars, lockout after repeated failures, optional 2FA.
- PII (CNIC, phone, address) restricted by role; masked in logs; encrypted at rest (disk/DB level), CNIC column optionally app-level encrypted.
- Upload validation (type, size ≤ 5 MB images), malware scan optional.
- Rate limits: auth 5/min/IP, API 100/min/user.
- Security headers (CSP, HSTS), CORS allow-list.

## 6. Performance Requirements
| Metric | Target |
|---|---|
| API p95 latency | < 300 ms (reads), < 600 ms (writes) |
| Dashboard load | < 2 s |
| POS product search | < 300 ms for 50k products |
| Report (1 year) | < 10 s, async export for larger |
| Concurrent users | 50 v1 |

## 7. Notification Requirements
Templates with placeholders `{customer_name}`, `{amount}`, `{due_date}`, `{invoice_no}`. Per-channel enable flags, quiet hours, retry 3× with backoff, delivery status stored in `notification_logs`, opt-out honoured.

## 8. Localisation
i18n keys for EN/UR, RTL support via CSS logical properties, PKR formatting, PKT timezone, date format DD MMM YYYY.

## 9. Testing & Quality
Unit tests for costing, ledger and stock services (≥ 80% coverage on these), integration tests for API, E2E for POS, order and payment flows, seed data, ESLint + Prettier, CI must pass before merge.

## 10. Deployment & Environments
`.env` per environment, Docker Compose for local, staging mirror of production, zero-downtime deploy, DB migrations run in CI/CD, rollback plan.

## 11. Browser/Device Support
Latest 2 versions of Chrome, Edge, Firefox, Safari; Android Chrome; iOS Safari; PWA installable; thermal (80 mm) and A4 printing.

## 12. Delivery Plan
| Phase | Duration (est.) | Output |
|---|---|---|
| 0 Setup | 1 wk | Repo, CI, design tokens, DB schema v1 |
| 1 MVP | 6–8 wks | Core inventory, POS, customers, suppliers, payments |
| 2 | 6–8 wks | Orders/production, labour, delivery, WhatsApp, finance |
| 3 | 6+ wks | Multi-branch, analytics, approvals |

## 13. Acceptance Criteria (MVP)
Sale reduces stock and updates ledger atomically; payment updates receivable and cash; permissions enforced per role; audit logs written; invoice PDF prints correctly; backups restore successfully; all pages responsive.
