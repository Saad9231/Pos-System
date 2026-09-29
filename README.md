# 🪑 StoreFlow — Furniture Business Management System

<div align="center">

![StoreFlow](https://img.shields.io/badge/StoreFlow-v1.0.0-8B5A2B?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A full-featured web ERP for furniture businesses — Inventory · POS · Custom Orders · Customers · Labour · Expenses · Reports**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Roadmap](#-roadmap)

</div>

---

## 📖 Overview

**StoreFlow** digitises the complete operation of a furniture business in one unified dashboard. From raw material procurement to finished goods, POS sales, custom order production pipelines, customer credit tracking, labour attendance, and multi-format profit reporting — everything runs in a single, responsive web application.

> **Currency:** PKR (Rs.) | **Timezone:** Asia/Karachi (UTC+5) | **Version:** 1.0 | **Date:** September 2026

---

## ✨ Features

### 🏠 Dashboard
- **15 live KPI cards** — Sales today, Purchases today, Expenses, Labour cost, Cash in hand, Receivables, Payables, Stock value, Low stock, Out of stock, Pending orders, Ready for delivery, Today''s profit, Monthly sales & expenses
- Interactive charts: daily/weekly/monthly/yearly sales & purchases, expenses by category, profit trend, top-selling & dead stock

### 📦 Product & Inventory Management
- Full product catalog with SKU, barcode, images, category, brand, material, colour, dimensions (L×W×H)
- Multiple price tiers: purchase cost, manufacturing cost, sale price, wholesale price, minimum sale price
- Real-time stock tracking with complete stock movement history
- Responsive product grid — 4 columns desktop, 3 tablet, 2 mobile — with search, filters & sort
- Raw material inventory (wood, foam, fabric, polish, hardware) with low-stock alerts

### 🛒 Point of Sale (POS)
- Barcode/search-driven cart with real-time stock check
- Cash, credit, partial and advance payment modes
- Customer selection, discount & tax application
- Invoice print / PDF / WhatsApp share
- POS keyboard shortcuts for speed at the counter

### 📋 Custom Orders & Production
- Full requirement capture: dimensions, material, colour, reference images
- **9-stage production pipeline:** Order Received → Design Approved → Material Required → Production Started → Under Manufacturing → Polishing/Upholstery → Quality Check → Ready → Delivered
- Each stage timestamped with responsible user; optional customer notification per stage

### 👥 Customer Management
- Rich customer profiles: name, father/husband name, CNIC, phone, WhatsApp, address, type (Retail/Wholesale/Regular/Corporate)
- Financial overview: opening balance, total purchases, total paid, pending, advance, overdue, credit limit
- Tabs: Details · Orders · Ledger · Payments · Deliveries · Notes
- Payment reminders via WhatsApp, SMS, Email, In-app (7 days before, on due date, overdue repeats)

### 🏭 Labour Management
- Employee profiles: Carpenter, Polisher, Upholsterer, Helper roles
- Daily attendance: Present / Absent / Half Day / Leave / Holiday + overtime
- Salary calculation: basic + overtime + bonus − advance − deductions
- Labour cost allocated per custom order for accurate job costing

### 📊 Finance & Reports
- Cash book, multiple accounts (Cash, Bank, JazzCash, Easypaisa, Card)
- Receivables, payables, stock adjustments (damage/loss/correction/theft)
- Profit calculation: Sale Price − (Material + Labour + Other costs) = Net Profit per order
- Full P&L report; export to PDF, Excel, CSV

### 🔐 Security & Audit
- Role-based access control (Owner, Manager, Accountant, Sales Staff, Production Manager, Store Keeper)
- Configurable permissions per module: View, Create, Edit, Delete/Void, Approve, Export, Print
- Complete audit log of every create/edit/void with old & new values
- Void instead of hard-delete for financial integrity

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript, Vite 6, Tailwind CSS 3 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Barcode** | JsBarcode |
| **i18n** | i18next (EN + Urdu RTL ready) |
| **State** | React Context API |
| **Styling** | Tailwind CSS + CSS Variables (warm walnut/teal design system) |
| **Build** | Vite + TypeScript compiler |

### Planned Backend (Phase 2)

| Layer | Technology |
|---|---|
| **API** | Node.js 20, Express / NestJS, TypeScript |
| **Database** | PostgreSQL 15+, Prisma ORM |
| **Cache/Queue** | Redis, BullMQ |
| **Auth** | JWT + rotating refresh tokens, RBAC |
| **Files** | S3-compatible storage, sharp |
| **PDF** | Puppeteer / pdfkit |
| **Messaging** | WhatsApp Business API, SMS gateway, Nodemailer |
| **DevOps** | Docker, GitHub Actions, Nginx |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Saad9231/Pos-System.git
cd Pos-System

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
# Type-check and build
npm run build

# Preview the production build
npm run preview
```

Output is generated in the `dist/` directory.

---

## 📁 Project Structure

```
Pos-System/
├── src/
│   ├── components/
│   │   ├── audit/          # Audit logs view
│   │   ├── customers/      # Customer management & pending receivables
│   │   ├── dashboard/      # KPI cards and charts
│   │   ├── expenses/       # Expense tracking
│   │   ├── finance/        # Cash book, P&L
│   │   ├── labour/         # Employees, attendance, salaries
│   │   ├── layout/         # Header, Sidebar
│   │   ├── notifications/  # Notification center
│   │   ├── orders/         # Custom orders, production, delivery
│   │   ├── pos/            # Point of Sale counter
│   │   ├── products/       # Catalog, categories, raw materials
│   │   ├── public/         # Privacy Policy, FAQs, 404
│   │   ├── purchases/      # Purchases, suppliers
│   │   ├── reports/        # Reports view
│   │   ├── sales/          # Invoices, sales returns
│   │   └── settings/       # Application settings
│   ├── context/
│   │   └── StoreContext.tsx  # Global state management
│   ├── data/               # Seed / mock data
│   ├── i18n/               # Translation files (EN / UR)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root component & routing
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── StoreFlow-Documentation.md  # Full PRD
├── architecture.md
├── design.md
├── TRD.md
├── privacy-policy.md
├── faqs.md
└── README.md
```

---

## 🎨 Design System

StoreFlow uses a **warm, wood-inspired** design system with full dark mode support:

| Token | Light | Dark |
|---|---|---|
| `--primary` (walnut) | `#8B5A2B` | `#C58B4D` |
| `--accent` (teal) | `#0F766E` | `#2DD4BF` |
| `--bg` | `#FAF7F2` | `#14110D` |
| `--surface` | `#FFFFFF` | `#1E1A15` |
| `--text` | `#1F1A14` | `#F3EDE4` |

**Typography:** Inter (UI), JetBrains Mono (codes/SKU), Noto Nastaliq Urdu

---

## 🗺 Roadmap

### ✅ Phase 1 — MVP (Current)
- [x] Login & role-based dashboard
- [x] Product catalog & categories
- [x] Finished goods + raw material stock
- [x] POS counter with payment modes
- [x] Customer profiles & ledger
- [x] Supplier management & purchases
- [x] Expense tracking
- [x] Basic reports
- [x] Privacy Policy, FAQs, 404 pages

### 🔄 Phase 2 — Planned
- [ ] Custom orders & 9-stage production pipeline
- [ ] Labour attendance, salary & advances
- [ ] Delivery management with proof of delivery
- [ ] WhatsApp / SMS / Email payment reminders
- [ ] Barcode generation & scanning
- [ ] Sales & purchase returns
- [ ] Cash book & multi-account finance
- [ ] Profit & Loss report

### 🔮 Phase 3 — Future
- [ ] Multi-warehouse / multi-branch support
- [ ] Approval workflows
- [ ] Advanced analytics & automated reports
- [ ] Full WhatsApp Business API automation

---

## 👤 User Roles

| Role | Access |
|---|---|
| **Owner / Super Admin** | Everything, approvals, settings, audit logs |
| **Manager** | Inventory, sales, purchases, customers, suppliers, reports |
| **Accountant** | Payments, expenses, ledgers, P&L, reports |
| **Sales Staff / Cashier** | POS, customer payments, custom order intake |
| **Production Manager** | Custom orders, production stages, raw material issue, labour |
| **Store Keeper** | Stock in/out, adjustments, raw material |

---

## 📄 Documentation

| Document | Description |
|---|---|
| [StoreFlow-Documentation.md](./StoreFlow-Documentation.md) | Full Product Requirements Document (PRD) |
| [architecture.md](./architecture.md) | System architecture & data design |
| [design.md](./design.md) | UI/UX design system & component guidelines |
| [TRD.md](./TRD.md) | Technical Requirements Document |
| [privacy-policy.md](./privacy-policy.md) | Privacy Policy |
| [faqs.md](./faqs.md) | Frequently Asked Questions |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m ''feat: add amazing feature''`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📞 Support

For support or business enquiries, contact: **[support@yourdomain.com]**

---

<div align="center">

Built with ❤️ for furniture businesses in Pakistan 🇵🇰

**© 2026 StoreFlow Furniture Management ERP**

</div>
