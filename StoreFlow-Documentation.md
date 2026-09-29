# StoreFlow

## Furniture Business Management System

## Inventory · POS · Custom Orders · Customers · Labour · Expenses · Reports

## Contents

1. Product Requirements Document (PRD) 2. Design Document (design.md) 3. Product Display Screen (wireframe) 4. Architecture Document (architecture.md) 5. Technical Requirements Document (TRD.md) 6. Privacy Policy (/privacy) 7. FAQs (/faqs)

8. Custom 404 Page

Version 1.0 · 24 September 2026 · Currency: PKR


## StoreFlow — Product Requirements Document (PRD)

Product: StoreFlow — Furniture Shop Management System (Web ERP)

Version: 1.0 (Draft) | Date: 24 September 2026 | Currency: PKR

Platform: Responsive web app (Desktop, Tablet, Mobile)

## 1. Purpose

StoreFlow digitises the full operation of a furniture business: raw material, production, finished stock, POS sales, custom orders, delivery, customer credit, supplier payables, labour, expenses and profit reporting — all in one dashboard.

## 2. Goals & Success Metrics

| Goal | Metric |
| --- | --- |
| Owner sees business position instantly | Dashboard loads < 2 s, all 15 KPI cards live |
| Reduce unpaid receivables | Overdue amount down 30% in 3 months via reminders |
| Accurate per-item profit | 100% orders have material + labour + other cost |
|   | recorded |
| Zero stock surprises | Low-stock alerts fire for all items below minimum |
| Adoption by staff | Cashier can complete a POS sale in < 60 s |

## 3. Users & Roles

| Role | Main access |
| --- | --- |
| Owner / Super Admin | Everything, approvals, settings, audit logs |
| Manager | Inventory, sales, purchases, customers, suppliers, |
|   | reports |
| Accountant | Payments, expenses, ledgers, P&L, reports |
| Sales Staff / Cashier | POS, customer payments, custom order intake |
| Production Manager | Custom orders, production stages, raw material issue, |
|   | labour |
| Store Keeper | Stock in/out, adjustments, raw material |

Permissions per module: View, Create, Edit, Delete (void/archive), Approve, Export, Print.

## 4. Scope by Phase

Phase 1 (MVP): Login, dashboard, products & categories, finished + raw stock, customers, suppliers, purchases, POS sales, customer payments, supplier payments, expenses, invoices, basic reports, roles.

Phase 2: Custom orders & production stages, labour/attendance/salary/advances, delivery, WhatsApp reminders, barcode, returns, stock adjustments, cash book, profit & loss, product costing.

Phase 3: Multi-warehouse/branch, approval workflows, advanced analytics, automated reports, batch/serial tracking, advanced WhatsApp automation.

## 5. Functional Requirements

Cards: Sales today, Purchases today, Expenses today, Labour cost today, Cash in hand, Receivables, Payables, Stock value, Low stock, Out of stock, Pending orders, Ready for delivery, Today's profit, Monthly sales/expenses/profit.

## 5.1 Dashboard


Charts: sales & purchases (daily/weekly/monthly/yearly), expenses by category, profit trend, top-selling and dead stock.

## 5.2 Product / Furniture Management

- Categories: Sofa, Bed, Dining Table, Chairs, Wardrobe, Cabinets, Office Furniture, Custom.

- Fields: Product ID, SKU, barcode, name, images (multiple), category, brand, material, colour, dimensions (L×W×H), unit, purchase cost, manufacturing cost, sale price, wholesale price, minimum sale price, opening/current/min/max stock, tax, discount, description, warehouse/rack, status.

- Complete stock history: date, time, qty, type, reference, user, previous and new stock.

- Product display screen: responsive grid of product cards (image, name, SKU, category, price, stock badge, quick actions) with search, filters, sort, grid/list toggle and pagination (see Design doc §6 and products.html).

Wood (ft), foam (sheets), fabric (m), polish (L), hardware, glue, paint. Purchase → stock in; production → stock out (issue to order). Low-stock alerts on raw material.

- Profile: Customer ID, name, father/husband name, mobile, WhatsApp, alternate phone, CNIC (optional), email, address, city, area, type (Retail/Wholesale/Regular/Corporate), date added, notes, photo (optional).

- Financial: opening balance, total purchases, total paid, total pending, advance, overdue, credit limit, payment terms, last payment date, next due date.

- Order history, ledger (date, description, debit, credit, balance), payment history with receipts, delivery details, preferences/notes.

- Search by name, phone, CNIC, customer ID, order ID, invoice ID.

Requirements (type, L×W×H, material, colour, reference image), estimated cost, advance, remaining, expected completion, production status. Pipeline: Order Received → Design Approved → Material Required → Production Started → Under Manufacturing → Polishing/Upholstery → Quality Check → Ready → Delivered.

Each stage change is timestamped, attributable and can trigger a customer notification.

Search/barcode, cart, qty, discount, tax, customer select, cash/credit/partial sale, invoice print/PDF/WhatsApp, sale returns. Stock decreases automatically.

Purchase invoice, items, discount, tax, paid/pending, payment method, due date. Supplier ledger (purchase, payment, return, adjustment, balance). Purchase returns reduce stock and payable.

Every credit sale/order creates a receivable: total, paid, remaining, due date, status (Paid / Partially Paid / Pending / Overdue). Reminders: 7 days before due, on due date, after due date (repeat interval configurable). Channels:

WhatsApp, SMS, Email, In-app — each toggleable. Message templates editable.

Record customer, invoice/order, amount, date, method, account, reference, notes, received-by; auto-update ledger and cash/bank; issue receipt.

Profile (name, father name, CNIC, phone, address, joining date, role: Carpenter/Polisher/Upholsterer/Helper, salary type Monthly/Daily/Hourly/Per-task). Daily attendance (Present/Absent/Half Day/Leave/Holiday, check-in/out, overtime). Salary = basic + overtime + bonus −

## 5.3 Raw Material Inventory

## 5.4 Customer Management (detailed)

## 5.5 Custom Furniture Orders

## 5.6 Sales & POS

## 5.7 Purchases & Suppliers

## 5.8 Customer Pending Payments & Reminders

## 5.9 Payment Collection

## 5.10 Labour Management


advance − deduction. Advance/loan history. Labour cost allocated per order.

## 5.11 Delivery Management

Delivery address, contact person, date, charges, driver, vehicle, status (Pending / Out for delivery / Delivered), notes, proof of delivery.

Categories: electricity, rent, transport, fuel, labour, workshop, maintenance, packaging, delivery, misc. Fields: date, category, amount, method, paid by, receipt image, notes. Optional approval: Staff → Manager → Owner.

Cash book, multiple accounts (Cash, Bank, JazzCash, Easypaisa, Card), receivables, payables, stock adjustments (damage, loss, correction, theft) with reason.

Profit: Actual Cost = Material + Labour + Other; Profit = Sale Price − Actual Cost; Net Profit = Gross Profit − Operating Expenses − Labour.

Sales, purchases, inventory (raw + finished), receivables/payables, expenses, labour, production, delivery, P&L, customer & supplier ledgers. Filters: date, customer, supplier, product, category, status, user. Export: PDF, Excel, CSV.

Low stock, out of stock, payment due/overdue, supplier due, salary due, order completion, delivery reminder, daily summaries.

Audit log of every create/edit/void with old/new values. No hard-delete of financial records (void/archive). Daily/weekly/monthly backups with restore. Business settings: name, logo, address, tax, invoice format, payment terms, thresholds, notification channels.

Login, forgot password, Privacy Policy (/privacy), FAQs (/faqs), custom 404 (/404), 403 and 500 pages.

## 5.12 Expenses

## 5.13 Finance

## 5.14 Reports

## 5.15 Notifications Center

## 5.16 Audit, Backup, Settings

## 5.17 Public / System Pages

## 6. Non-Functional Requirements

Performance (page < 2 s, POS search < 300 ms), availability 99.5%, responsive UI, RBAC security, data encryption in transit and at rest, daily backups, English + Urdu (RTL) readiness, accessibility (WCAG 2.1 AA target).

## 7. Assumptions & Out of Scope (v1)

Single store in v1; full double-entry accounting, FBR e-invoicing and payment-gateway checkout are out of scope for v1. WhatsApp requires an approved provider (Business API).

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| WhatsApp API cost/approval delay | Start with SMS/Email + wa.me links, add API later |
| Staff resistance | Simple POS, training, role-based UI |
| Data loss | Automated backups + restore drills |
| Scope creep | Strict phase gates |

## 9. Open Questions


Single vs multiple branches at launch? Preferred WhatsApp provider? Need Urdu invoices? Which

payment methods beyond Cash/Bank/JazzCash/Easypaisa?


## StoreFlow — Design Document

## (design.md)

## 1. Design Principles

- 1. Clarity over decoration — owners glance at numbers; make them large and scannable.

- 2. Speed at the counter — POS is keyboard/barcode first, touch friendly.

- 3. One place for everything — customer profile shows orders, payments, ledger, deliveries.

- 4. Safe by default — destructive actions are void/archive with confirmation.

- 5. Responsive & bilingual-ready — LTR now, RTL (Urdu) supported by tokens/logical CSS.

## 2. Brand & Visual Language

Warm, wood-inspired but professional. Working name: StoreFlow.

| Token | Light | Dark |
| --- | --- | --- |
| --primary (walnut) | #8B5A2B | #C58B4D |
| --primary-contrast | #FFFFFF | #1A1208 |
| --accent (teal) | #0F766E | #2DD4BF |
| --bg | #FAF7F2 | #14110D |
| --surface | #FFFFFF | #1E1A15 |
| --text | #1F1A14 | #F3EDE4 |
| --muted | #6B6258 | #A79B8C |
| --border | #E6DED2 | #332C24 |
| --success / --warning / --danger / | #15803D / #B45309 / #B91C1C / | lighter equivalents |
| --info | #1D4ED8 |   |

Status colours: Paid = success, Partially Paid = info, Pending = warning, Overdue = danger, Production

= accent.

## 3. Typography

Inter (UI), Noto Nastaliq Urdu / Noto Naskh Arabic (Urdu), JetBrains Mono (codes/SKU). Scale: 12 / 14 / 16 / 20 / 24 / 32. Numbers use tabular figures. Currency format: Rs. 1,25,000 (PKR, grouping configurable).

## 4. Layout & Spacing

8-pt grid (4, 8, 12, 16, 24, 32). Radius: 8 (inputs), 12 (cards), 999 (badges). Shadows: subtle (1–2 levels).

Breakpoints: mobile < 640, tablet 640–1024, desktop > 1024. Sidebar collapses to bottom nav / drawer

on mobile.

## 5. Navigation (IA)

Dashboard · Products (Products, Categories, Units, Raw Material, Barcode, Stock) · Sales (POS, Invoices, Returns, Payments) · Orders (Custom Orders, Production, Delivery) · Purchases (Purchases, Returns, Suppliers, Payments) · Customers (List, Ledger, Pending, Collection) · Labour (Employees, Attendance, Salary, Overtime, Advances) · Expenses · Finance (Cash Book, Accounts, Receivables, Payables, P&L) · Reports · Notifications · Users & Roles · Audit Logs · Settings.

Footer/public links: Privacy Policy, FAQs, Support.

## 6. Product Display Screen

Header: page title, "Add Product" button, view toggle (grid/list).


Toolbar: search (name/SKU/barcode), category chips, filters (material, colour, price range, stock status), sort (newest, price, stock, best selling).

Grid: 4 columns desktop, 3 tablet, 2 mobile, 1 small phone. Card contents:

- Image (4:3, lazy-loaded, hover shows second image)

- Stock badge: In stock (green), Low (amber), Out (red)

- Name, SKU, category · material

- Dimensions (L×W×H) and colour swatch

- Price (sale) with cost/profit visible to permitted roles only

- Actions: Quick view, Edit, Add to POS/cart

Empty state: illustration + "No products found — Add your first product".

Loading: skeleton cards. Pagination: 12/24/48 per page.

A working reference is in products.html.

## 7. Key Screen Notes

- Dashboard: KPI cards (2 rows) → charts → tables (low stock, overdue payments, orders ready).

- POS: left product search/grid, right cart with totals, customer picker, payment split, Pay button pinned.

- Customer profile: header (name, phone, balance, credit limit) + tabs: Details · Orders · Ledger · Payments · Deliveries · Notes.

- Custom order: stepper for production stages, requirement form, image upload, payment schedule panel.

- Tables: sticky header, column chooser, export, row actions menu, bulk select.

## 8. Components

Buttons (primary, secondary, ghost, danger), inputs, selects, date pickers, tabs, stepper, badges, cards, modals, drawers, toasts, data tables, charts, file/image uploader, empty states, skeletons, breadcrumb.

## 9. States & Feedback

Every form: inline validation, disabled-while-submitting, success toast. Destructive: confirm dialog with reason. Offline/slow: retry banner.

## 10. Accessibility

Contrast ≥ 4.5:1, visible focus ring, full keyboard navigation (POS shortcuts), ARIA labels on icon buttons, no colour-only meaning (badges include text), respects prefers-reduced-motion and prefers-color-scheme.

## 11. Error Pages

Custom 404 (see 404.html): friendly message, search box, links to Dashboard/Products/FAQs. Matching 403/500.

## 12. Print & Documents

Invoice/receipt templates: A4 and 80 mm thermal. Contains logo, business info, invoice #, items, totals, paid/remaining, terms. Urdu-capable fonts embedded.


## Product Display Screen (Wireframe)

Desktop layout: header, search + filters, category chips, and a responsive product card grid (4 columns desktop, 3 tablet, 2 mobile). Live version: products.html.

Each card shows image, stock badge, name, SKU, category, material, dimensions, price and actions (Quick view, Add to POS). Out-of-stock items disable Add to POS.


## StoreFlow — Architecture Document (architecture.md)

## 1. Overview

A modular monolith web application (React frontend + Node.js/Express API + PostgreSQL) with background workers for reminders and reports. Modular boundaries allow later extraction into services

if needed.

## 2. System Context

Users (Owner/Manager/Cashier/...) --> Browser (React SPA/PWA)

Browser --HTTPS--> Reverse Proxy (Nginx) --> API (Node/Express)

API --> PostgreSQL (primary data)

API --> Redis (cache, sessions, queues)

API --> Object Storage (images, receipts, backups, PDFs)

Worker --> WhatsApp/SMS/Email providers

Worker --> Scheduled jobs (reminders, reports, backups)

## 3. Logical Architecture

| Layer | Responsibility |
| --- | --- |
| Presentation | React + TypeScript, Tailwind, React Query, i18n (EN/UR) |
| API | REST (JSON), validation, auth, RBAC, rate limiting |
| Domain modules | Catalog, Inventory, Sales/POS, Purchases, Customers, |
|   | Suppliers, Orders/Production, Delivery, Labour, |
|   | Expenses, Finance, Reports, Notifications, Admin |
| Data | PostgreSQL via ORM (Prisma), migrations, transactions |
| Async | BullMQ workers on Redis |
| Integrations | WhatsApp Business API, SMS gateway, SMTP |

## 4. Module Boundaries & Core Flows

- Purchase: Supplier → Purchase → stock+ → payable+ → supplier payment → payable−.

- Sale: Customer → Sale → stock− → receivable → payment → cash/bank+.

- Custom order: Order → advance → material issue (raw stock−) → labour allocation → production stages → QC → delivery → final payment. Actual cost = material + labour + other.

- Labour: Attendance → salary calc → salary payment → labour expense.

All money/stock changes go through a single ledger/stock-movement service inside DB transactions so modules stay consistent.

## 5. Data Architecture

- PostgreSQL, UUID/bigint keys, created_at/updated_at/created_by, soft-delete (voided_at).

- Stock is derived from stock_movements (append-only); current_stock is a cached column updated in the same transaction.

- Customer/supplier balances derived from ledger tables with running balance snapshot.

- Core tables: users, roles, permissions, products, categories, units, brands, raw_materials, customers, customer_transactions, customer_payments, suppliers, supplier_transactions, supplier_payments, purchases(+items), purchase_returns(+items), sales(+items), sales_returns(+items), custom_orders, order_stages, order_materials, deliveries, stock_movements, stock_adjustments, employees, attendance, salary, salary_payments, employee_advances, expenses, expense_categories, bank_accounts, cash_transactions, bank_transactions, notifications, notification_logs, invoices, audit_logs, settings, attachments. Phase 3: warehouses, warehouse_stock, stock_transfers, product_batches, product_serials.


## 6. Security Architecture

JWT access + rotating refresh tokens (httpOnly cookies), Argon2/bcrypt hashing, RBAC + permission checks per endpoint, optional 2FA for owner, rate limiting, CSRF protection, input validation (Zod), TLS everywhere, encrypted backups, secrets in env/secret manager, full audit trail.

## 7. Deployment Architecture

| Component | Option |
| --- | --- |
| Frontend | Static hosting/CDN (Vercel/Netlify/Nginx) |
| API + Worker | Docker containers on VPS/Cloud (DigitalOcean, AWS, |
|   | Hetzner) |
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

Structured logs (pino), error tracking (Sentry), metrics (Prometheus/Grafana or hosted), audit log UI for

business events.

## 11. Key Decisions (ADR summary)

| Decision | Reason |
| --- | --- |
| Modular monolith | Small team, simpler ops |
| PostgreSQL | Strong transactions for finance/stock |
| Append-only stock & ledger | Traceability and audit |
| Void, not delete | Financial integrity |
| Queue for notifications | Reliable reminders, provider retries |


## StoreFlow — Technical Requirements Document (TRD)

## 1. Technology Stack

| Area | Choice |
| --- | --- |
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, React Router, |
|   | TanStack Query, React Hook Form + Zod, Recharts, |
|   | i18next |
| Backend | Node.js 20, Express (or NestJS), TypeScript, Zod |
|   | validation |
| Database | PostgreSQL 15+, Prisma ORM |
| Cache/Queue | Redis, BullMQ |
| Auth | JWT (access 15 min) + refresh rotation, RBAC |
| Files | S3-compatible storage, image resize (sharp) |
| PDF | Puppeteer / pdfkit for invoices and reports |
| Export | ExcelJS, CSV |
| Barcode | JsBarcode (generate), browser camera/scanner (HID |
|   | keyboard-wedge) |
| Messaging | WhatsApp Business API provider, SMS gateway, |
|   | Nodemailer |
| Testing | Vitest/Jest, Supertest, Playwright |
| DevOps | Docker, GitHub Actions, Nginx |

## 2. Functional-to-Technical Mapping

| Requirement | Technical approach |
| --- | --- |
| Stock accuracy | Append-only stock_movements, transactional updates, |
|   | row locks on POS |
| Customer ledger | customer_transactions with running balance, |
|   | recomputable |
| Reminders | Daily cron job → query due invoices → enqueue |
|   | notifications → provider → log |
| Custom order pipeline | State machine (allowed transitions), stage log with |
|   | user/time |
| Product costing | order_materials + labour_allocation + |
|   | order_expenses summed per order |
| Permissions | Permission matrix table; middleware can(user, |
|   | module, action) |
| Audit | DB triggers or service hook writing old/new JSON |
| Backups | pg_dump cron + WAL archiving, upload to object storage |

## 3. API Design

REST, versioned /api/v1, JSON, cursor/offset pagination, filtering ?q=&from=&to=&status=, consistent

error format {code, message, details}. OpenAPI/Swagger docs.

Main resources: /auth, /users, /roles, /products, /categories, /raw-materials, /customers,

/customers/:id/ledger, /suppliers, /purchases, /sales, /payments, /orders, /orders/:id/stages, /deliveries, /employees, /attendance, /salaries, /advances, /expenses, /accounts, /reports/*, /notifications, /audit-logs, /settings, /backups.


## 4. Data Requirements

- Money: NUMERIC(14,2), PKR, never floats.

- Dates: UTC stored, displayed Asia/Karachi (PKT, UTC+5).

- Unique: SKU, barcode, invoice number (sequential per series), customer phone (warn on duplicate).

- Indexes: FK columns, (customer_id, date), (status, due_date), (product_id, created_at).

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
| --- | --- |
| API p95 latency | < 300 ms (reads), < 600 ms (writes) |
| Dashboard load | < 2 s |
| POS product search | < 300 ms for 50k products |
| Report (1 year) | < 10 s, async export for larger |
| Concurrent users | 50 v1 |

## 7. Notification Requirements

Templates with placeholders {customer_name}, {amount}, {due_date}, {invoice_no}. Per-channel enable

flags, quiet hours, retry 3× with backoff, delivery status stored in notification_logs, opt-out honoured.

## 8. Localisation

i18n keys for EN/UR, RTL support via CSS logical properties, PKR formatting, PKT timezone, date format

DD MMM YYYY.

## 9. Testing & Quality

Unit tests for costing, ledger and stock services (≥ 80% coverage on these), integration tests for API, E2E for POS, order and payment flows, seed data, ESLint + Prettier, CI must pass before merge.

## 10. Deployment & Environments

.env per environment, Docker Compose for local, staging mirror of production, zero-downtime deploy, DB migrations run in CI/CD, rollback plan.

## 11. Browser/Device Support

Latest 2 versions of Chrome, Edge, Firefox, Safari; Android Chrome; iOS Safari; PWA installable; thermal (80 mm) and A4 printing.

## 12. Delivery Plan

| Phase | Duration (est.) | Output |
| --- | --- | --- |
| 0 Setup | 1 wk | Repo, CI, design tokens, DB schema |
|   |   | v1 |


| Phase | Duration (est.) | Output |
| --- | --- | --- |
| 1 MVP | 6–8 wks | Core inventory, POS, customers, |
|   |   | suppliers, payments |
| 2 | 6–8 wks | Orders/production, labour, delivery, |
|   |   | WhatsApp, finance |
| 3 | 6+ wks | Multi-branch, analytics, approvals |

## 13. Acceptance Criteria (MVP)

Sale reduces stock and updates ledger atomically; payment updates receivable and cash; permissions enforced per role; audit logs written; invoice PDF prints correctly; backups restore successfully; all pages responsive.


## StoreFlow — Privacy Policy

Link: /privacy (footer and login page) | Last updated: 24 September 2026

Template for business use. Have it reviewed by a legal professional before launch.

## 1. Who We Are

StoreFlow is operated by [Business / Company Name], [Address], Pakistan. Contact: [privacy@yourdomain.com], [Phone].

## 2. Information We Collect

- Account data: name, email, phone, role, password (hashed).

- Customer data entered by the business: name, father/husband name, phone, WhatsApp, CNIC (optional), address, order and payment history, delivery details.

- Supplier and employee data: contact details, CNIC, attendance, salary and advances.

- Business data: products, stock, sales, purchases, expenses, invoices.

- Technical data: IP address, device/browser, log data, cookies for sessions.

## 3. How We Use Information

To run the system (sales, inventory, ledgers), send invoices, receipts and payment reminders (WhatsApp/SMS/Email), generate reports, secure the service, provide support, and comply with the law.

## 4. Legal Basis & Consent

We process data to perform our contract with the business owner and, for customer messaging, on the customer's consent/legitimate business interest. Customers can ask to stop reminders at any time.

## 5. Sharing

We do not sell personal data. Data is shared only with: hosting/storage providers, messaging providers (WhatsApp, SMS, email), payment/banking partners if enabled, and authorities when legally required. Providers act under confidentiality obligations.

## 6. Data Security

HTTPS encryption, hashed passwords, role-based access, audit logs, encrypted backups and access controls. No system is 100% secure; report issues to the contact above.

## 7. Retention

Financial records are kept as required by applicable law (typically at least 6–7 years). Other data is kept while the account is active and deleted or anonymised on request when not legally required.

## 8. Your Rights

Access, correct, update, delete (where allowed), withdraw consent, and object to messaging. Contact us to exercise these rights; we respond within 30 days.

## 9. Cookies

Essential cookies for login/session and preferences. No advertising cookies.

## 10. Children

StoreFlow is for business use and is not directed at children under 18.

## 11. International Transfers


Data may be stored on servers outside Pakistan; we use providers with appropriate safeguards.

## 12. Changes

We will post updates here with a new date and notify account owners of material changes.

## 13. Contact

[Business Name] · [Email] · [Phone] · [Address]


Link: /faqs

## General

## Q: What is StoreFlow?

A web system that manages furniture inventory, POS sales, custom orders, customers, suppliers, labour, expenses and profit in one place.

## Q: Which devices can I use?

Any modern browser on desktop, tablet or phone. It can be installed as an app (PWA).

## Q: Is my data safe?

Yes. Data is encrypted in transit, access is role-based, every change is logged, and backups run automatically.

## Products & Stock

## Q: Can I track raw material as well as finished furniture?

Yes. Wood, foam, fabric, polish and hardware have their own stock, and are deducted when issued to an

order.

## Q: How does low-stock alert work?

Set a minimum level per product. When stock falls below it, you see a dashboard alert and notification.

## Q: What if physical stock differs from system stock?

Create a stock adjustment with a reason (damage, loss, correction). It is logged.

## Customers & Payments

## Q: Can I sell on credit or take advance payment?

Yes. Cash, credit, partial and advance payments are supported, with a full customer ledger.

## Q: How do payment reminders work?

The system sends reminders 7 days before, on the due date, and after it is overdue via WhatsApp, SMS, Email or in-app. You can turn each channel on/off.

## Q: Can I see everything about one customer?

Yes — details, orders, payments, ledger, deliveries and notes are on one profile.

## Orders & Delivery

## Q: How are custom orders handled?

Record size, material, colour and reference image, take an advance, then move the order through production stages to delivery.

## Q: Can I know the profit on each item or order?

Yes. Profit = sale price − (material + labour + other costs).

## Labour

## Q: Can I manage carpenters' attendance and advances?

Yes. Attendance, overtime, salary, advances and deductions are supported, and labour cost is linked to

orders.

## Accounts & Reports

## Q: Which payment methods are supported?


Cash, bank transfer, JazzCash, Easypaisa, card and others.

## Q: Can I export reports?

Yes, to PDF, Excel and CSV.

## Q: Can I delete an invoice?

Financial records are voided/cancelled, not deleted, so the audit trail stays intact.

## Users & Support

## Q: Can staff have limited access?

Yes. Roles (Owner, Manager, Accountant, Sales, Production Manager, Store Keeper) with configurable permissions.

## Q: Where can I read the privacy policy?

At /privacy, linked in the footer.

## Q: How do I get help?

Contact support at [support@yourdomain.com] or [phone/WhatsApp].


## Custom 404 Page

Friendly branded page shown for unknown routes (404.html).

404 Yeh page nahi mila

The page you are looking for was moved, deleted, or never existed.

Search

Dashboard Products Orders FAQs Privacy Policy
