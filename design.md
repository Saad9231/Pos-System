# StoreFlow — Design Document (design.md)

## 1. Design Principles
1. **Clarity over decoration** — owners glance at numbers; make them large and scannable.
2. **Speed at the counter** — POS is keyboard/barcode first, touch friendly.
3. **One place for everything** — customer profile shows orders, payments, ledger, deliveries.
4. **Safe by default** — destructive actions are void/archive with confirmation.
5. **Responsive & bilingual-ready** — LTR now, RTL (Urdu) supported by tokens/logical CSS.

## 2. Brand & Visual Language
Warm, wood-inspired but professional. Working name: StoreFlow.

| Token | Light | Dark |
|---|---|---|
| --primary (walnut) | #8B5A2B | #C58B4D |
| --primary-contrast | #FFFFFF | #1A1208 |
| --accent (teal) | #0F766E | #2DD4BF |
| --bg | #FAF7F2 | #14110D |
| --surface | #FFFFFF | #1E1A15 |
| --text | #1F1A14 | #F3EDE4 |
| --muted | #6B6258 | #A79B8C |
| --border | #E6DED2 | #332C24 |
| --success / --warning / --danger / --info | #15803D / #B45309 / #B91C1C / #1D4ED8 | lighter equivalents |

Status colours: Paid = success, Partially Paid = info, Pending = warning, Overdue = danger, Production = accent.

## 3. Typography
Inter (UI), Noto Nastaliq Urdu / Noto Naskh Arabic (Urdu), JetBrains Mono (codes/SKU). Scale: 12 / 14 / 16 / 20 / 24 / 32. Numbers use tabular figures. Currency format: `Rs. 1,25,000` (PKR, grouping configurable).

## 4. Layout & Spacing
8-pt grid (4, 8, 12, 16, 24, 32). Radius: 8 (inputs), 12 (cards), 999 (badges). Shadows: subtle (1–2 levels).
Breakpoints: mobile < 640, tablet 640–1024, desktop > 1024. Sidebar collapses to bottom nav / drawer on mobile.

## 5. Navigation (IA)
Dashboard · Products (Products, Categories, Units, Raw Material, Barcode, Stock) · Sales (POS, Invoices, Returns, Payments) · Orders (Custom Orders, Production, Delivery) · Purchases (Purchases, Returns, Suppliers, Payments) · Customers (List, Ledger, Pending, Collection) · Labour (Employees, Attendance, Salary, Overtime, Advances) · Expenses · Finance (Cash Book, Accounts, Receivables, Payables, P&L) · Reports · Notifications · Users & Roles · Audit Logs · Settings.
Footer/public links: Privacy Policy, FAQs, Support.

## 6. Product Display Screen
**Header:** page title, "Add Product" button, view toggle (grid/list).
**Toolbar:** search (name/SKU/barcode), category chips, filters (material, colour, price range, stock status), sort (newest, price, stock, best selling).
**Grid:** 4 columns desktop, 3 tablet, 2 mobile, 1 small phone. Card contents:
- Image (4:3, lazy-loaded, hover shows second image)
- Stock badge: In stock (green), Low (amber), Out (red)
- Name, SKU, category · material
- Dimensions (L×W×H) and colour swatch
- Price (sale) with cost/profit visible to permitted roles only
- Actions: Quick view, Edit, Add to POS/cart
**Empty state:** illustration + "No products found — Add your first product".
**Loading:** skeleton cards. **Pagination:** 12/24/48 per page.
A working reference is in `products.html`.

## 7. Key Screen Notes
- **Dashboard:** KPI cards (2 rows) → charts → tables (low stock, overdue payments, orders ready).
- **POS:** left product search/grid, right cart with totals, customer picker, payment split, Pay button pinned.
- **Customer profile:** header (name, phone, balance, credit limit) + tabs: Details · Orders · Ledger · Payments · Deliveries · Notes.
- **Custom order:** stepper for production stages, requirement form, image upload, payment schedule panel.
- **Tables:** sticky header, column chooser, export, row actions menu, bulk select.

## 8. Components
Buttons (primary, secondary, ghost, danger), inputs, selects, date pickers, tabs, stepper, badges, cards, modals, drawers, toasts, data tables, charts, file/image uploader, empty states, skeletons, breadcrumb.

## 9. States & Feedback
Every form: inline validation, disabled-while-submitting, success toast. Destructive: confirm dialog with reason. Offline/slow: retry banner.

## 10. Accessibility
Contrast ≥ 4.5:1, visible focus ring, full keyboard navigation (POS shortcuts), ARIA labels on icon buttons, no colour-only meaning (badges include text), respects prefers-reduced-motion and prefers-color-scheme.

## 11. Error Pages
Custom 404 (see `404.html`): friendly message, search box, links to Dashboard/Products/FAQs. Matching 403/500.

## 12. Print & Documents
Invoice/receipt templates: A4 and 80 mm thermal. Contains logo, business info, invoice #, items, totals, paid/remaining, terms. Urdu-capable fonts embedded.
