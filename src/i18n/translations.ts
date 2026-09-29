export type Language = 'en' | 'ur';

export interface TranslationDict {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const translations: TranslationDict = {
  // Brand & App
  'app.name': { en: 'StoreFlow', ur: 'اسٹور فلو' },
  'app.tagline': { en: 'Furniture Shop Management ERP', ur: 'فرنیچر بزنس مینجمنٹ سسٹم' },
  
  // Navigation
  'nav.dashboard': { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  'nav.products': { en: 'Products & Stock', ur: 'پروڈکٹس اور اسٹاک' },
  'nav.catalog': { en: 'Product Catalog', ur: 'فرنیچر کیٹلاگ' },
  'nav.categories': { en: 'Categories', ur: 'اقسام (کیٹیگریز)' },
  'nav.rawMaterials': { en: 'Raw Materials', ur: 'خام مال (لکڑی، فوم، پالش)' },
  'nav.barcode': { en: 'Barcode Generator', ur: 'بارکوڈ جنریٹر' },
  'nav.stockAdjustments': { en: 'Stock Adjustments', ur: 'اسٹاک ایڈجسٹمنٹ' },
  'nav.sales': { en: 'Sales & POS', ur: 'سیلز اور پی او ایس' },
  'nav.posCounter': { en: 'POS Counter', ur: 'پی او ایس کاؤنٹر' },
  'nav.invoices': { en: 'Invoices & Sales', ur: 'انوائسز اور بلز' },
  'nav.salesReturns': { en: 'Sales Returns', ur: 'سیل واپسی' },
  'nav.customOrders': { en: 'Custom Orders', ur: 'کسٹم آرڈرز' },
  'nav.production': { en: 'Production Pipeline', ur: 'پروڈکشن پائپ لائن' },
  'nav.delivery': { en: 'Delivery Tracking', ur: 'ڈیلیوری ٹریکنگ' },
  'nav.purchases': { en: 'Purchases & Vendors', ur: 'خریداری اور سپلائرز' },
  'nav.purchaseList': { en: 'Purchase Bills', ur: 'خریداری کے بل' },
  'nav.suppliers': { en: 'Suppliers Ledger', ur: 'سپلائر کھاتہ' },
  'nav.customers': { en: 'Customers Ledger', ur: 'کسٹمرز اور کھاتہ' },
  'nav.pendingPayments': { en: 'Pending Receivables', ur: 'بقایا وصولیاں اور ریمائنڈرز' },
  'nav.labour': { en: 'Labour & Payroll', ur: 'لیبر اور تنخواہیں' },
  'nav.employees': { en: 'Artisans & Staff', ur: 'کاریگر اور ملازمین' },
  'nav.attendance': { en: 'Daily Attendance', ur: 'روزانہ حاضری' },
  'nav.salaries': { en: 'Salary & Advances', ur: 'تنخواہ اور پیشگی رقم' },
  'nav.expenses': { en: 'Expenses', ur: 'اخراجات' },
  'nav.finance': { en: 'Finance & Accounts', ur: 'مالیات اور کھاتہ جات' },
  'nav.cashBook': { en: 'Cash Book', ur: 'روزنامچہ (کیش بک)' },
  'nav.accounts': { en: 'Bank & Wallets', ur: 'بینک اور والٹس' },
  'nav.profitLoss': { en: 'Profit & Loss (P&L)', ur: 'نفع اور نقصان (P&L)' },
  'nav.reports': { en: 'Reports & Analytics', ur: 'رپورٹس اور تجزیات' },
  'nav.notifications': { en: 'Notifications', ur: 'اطلاعات' },
  'nav.auditLogs': { en: 'Audit Logs', ur: 'آڈٹ لاگز' },
  'nav.settings': { en: 'Settings', ur: 'ترتیبات' },
  'nav.privacy': { en: 'Privacy Policy', ur: 'پرائیویسی پالیسی' },
  'nav.faqs': { en: 'FAQs & Help', ur: 'عام سوالات و رہنمائی' },

  // Roles
  'role.owner': { en: 'Owner / Super Admin', ur: 'مالک / ایڈمن' },
  'role.manager': { en: 'Manager', ur: 'مینیجر' },
  'role.accountant': { en: 'Accountant', ur: 'اکاؤنٹنٹ' },
  'role.cashier': { en: 'Sales / Cashier', ur: 'سیلز مین / کیشیر' },
  'role.production_manager': { en: 'Production Manager', ur: 'پروڈکشن مینیجر' },
  'role.store_keeper': { en: 'Store Keeper', ur: 'اسٹور کیپر' },

  // Common Actions
  'action.add': { en: 'Add New', ur: 'نیا شامل کریں' },
  'action.save': { en: 'Save', ur: 'محفوظ کریں' },
  'action.cancel': { en: 'Cancel', ur: 'منسوخ کریں' },
  'action.edit': { en: 'Edit', ur: 'ترمیم کریں' },
  'action.delete': { en: 'Delete / Void', ur: 'ختم / منسوخ کریں' },
  'action.print': { en: 'Print', ur: 'پرنٹ کریں' },
  'action.export': { en: 'Export', ur: 'ایکسپورٹ' },
  'action.search': { en: 'Search...', ur: 'تلاش کریں...' },
  'action.filter': { en: 'Filter', ur: 'فلٹر کریں' },
  'action.view': { en: 'View Details', ur: 'تفصیلات دیکھیں' },
  'action.pay': { en: 'Record Payment', ur: 'ادائیگی درج کریں' },
  'action.sendReminder': { en: 'Send Reminder', ur: 'ریمائنڈر بھیجیں' },
  'action.whatsapp': { en: 'Send WhatsApp', ur: 'واٹس ایپ بھیجیں' },
  'action.advance': { en: 'Give Advance', ur: 'ایڈوانس دیں' },
  'action.quickView': { en: 'Quick View', ur: 'سرسری نظر' },
  'action.addToCart': { en: 'Add to POS', ur: 'کاؤنٹر میں شامل کریں' },
  'action.clear': { en: 'Clear', ur: 'صاف کریں' },
  'action.refresh': { en: 'Refresh', ur: 'تازہ کریں' },
  'action.checkout': { en: 'Complete Sale', ur: 'سیل مکمل کریں' },

  // Common Fields
  'field.name': { en: 'Name', ur: 'نام' },
  'field.sku': { en: 'SKU', ur: 'ایس کے یو (SKU)' },
  'field.barcode': { en: 'Barcode', ur: 'بارکوڈ' },
  'field.category': { en: 'Category', ur: 'کیٹیگری' },
  'field.price': { en: 'Price', ur: 'قیمت' },
  'field.salePrice': { en: 'Sale Price', ur: 'فروخت کی قیمت' },
  'field.costPrice': { en: 'Purchase Cost', ur: 'خریداری لاگت' },
  'field.stock': { en: 'Stock', ur: 'موجودہ اسٹاک' },
  'field.quantity': { en: 'Quantity', ur: 'تعداد' },
  'field.dimensions': { en: 'Dimensions (L×W×H)', ur: 'پیمائش (لمبائی×چوڑائی×اونچائی)' },
  'field.material': { en: 'Material', ur: 'میٹیریل / لکڑی' },
  'field.color': { en: 'Color', ur: 'رنگ' },
  'field.customer': { en: 'Customer', ur: 'گاہک / خریدار' },
  'field.supplier': { en: 'Supplier', ur: 'سپلائر / وینڈر' },
  'field.date': { en: 'Date', ur: 'تاریخ' },
  'field.dueDate': { en: 'Due Date', ur: 'آخری تاریخ' },
  'field.status': { en: 'Status', ur: 'حالت' },
  'field.amount': { en: 'Amount', ur: 'رقم' },
  'field.total': { en: 'Total', ur: 'کل رقم' },
  'field.subtotal': { en: 'Subtotal', ur: 'ذیلی ٹوٹل' },
  'field.discount': { en: 'Discount', ur: 'رعایت' },
  'field.tax': { en: 'Tax', ur: 'ٹیکس' },
  'field.paid': { en: 'Paid Amount', ur: 'ادا شدہ رقم' },
  'field.balance': { en: 'Remaining Balance', ur: 'بقایا رقم' },
  'field.paymentMethod': { en: 'Payment Method', ur: 'ادائیگی کا طریقہ' },
  'field.notes': { en: 'Notes / Remarks', ur: 'نوٹس / تفصیل' },
  'field.phone': { en: 'Phone / Mobile', ur: 'موبائل نمبر' },
  'field.address': { en: 'Address', ur: 'پتہ' },

  // Status Labels
  'status.inStock': { en: 'In Stock', ur: 'دستیاب' },
  'status.lowStock': { en: 'Low Stock', ur: 'کم اسٹاک' },
  'status.outOfStock': { en: 'Out of Stock', ur: 'ختم' },
  'status.paid': { en: 'Paid', ur: 'ادا شدہ' },
  'status.partiallyPaid': { en: 'Partially Paid', ur: 'جزوی ادا شدہ' },
  'status.pending': { en: 'Pending', ur: 'زیر التواء' },
  'status.overdue': { en: 'Overdue', ur: 'میعاد ختم / واجب الادا' },
  'status.voided': { en: 'Voided', ur: 'منسوخ شدہ' },
  'status.active': { en: 'Active', ur: 'فعال' },
  
  // Custom Order Stages
  'stage.order_received': { en: 'Order Received', ur: 'آرڈر موصول' },
  'stage.design_approved': { en: 'Design Approved', ur: 'ڈیزائن منظور' },
  'stage.material_required': { en: 'Material Issued', ur: 'خام مال جاری' },
  'stage.production_started': { en: 'Production Started', ur: 'تیاری شروع' },
  'stage.under_manufacturing': { en: 'Carpentry / Making', ur: 'ڈھانچہ / مینوفیکچرنگ' },
  'stage.polishing_upholstery': { en: 'Polishing & Upholstery', ur: 'پالش اور پوشش' },
  'stage.quality_check': { en: 'Quality Inspection', ur: 'کوالٹی چیک' },
  'stage.ready': { en: 'Ready for Delivery', ur: 'تیار' },
  'stage.delivered': { en: 'Delivered', ur: 'ڈیلیور ہو گیا' },

  // Dashboard KPI Titles
  'kpi.salesToday': { en: 'Sales Today', ur: 'آج کی فروخت' },
  'kpi.purchasesToday': { en: 'Purchases Today', ur: 'آج کی خریداری' },
  'kpi.expensesToday': { en: 'Expenses Today', ur: 'آج کے اخراجات' },
  'kpi.labourCostToday': { en: 'Labour Cost Today', ur: 'آج کی لیبر لاگت' },
  'kpi.cashInHand': { en: 'Cash & Bank Balance', ur: 'کیش و بینک بیلنس' },
  'kpi.receivables': { en: 'Customer Receivables', ur: 'کسٹمر بقایا جات' },
  'kpi.payables': { en: 'Supplier Payables', ur: 'سپلائر کے بقایا جات' },
  'kpi.stockValue': { en: 'Total Stock Valuation', ur: 'اسٹاک کی کل قیمت' },
  'kpi.lowStockCount': { en: 'Low Stock Alerts', ur: 'کم اسٹاک کی انتباہ' },
  'kpi.pendingOrders': { en: 'Custom Orders Active', ur: 'جاری کسٹم آرڈرز' },
  'kpi.readyDelivery': { en: 'Ready for Dispatch', ur: 'ڈیلیوری کے لیے تیار' },
  'kpi.todayProfit': { en: "Today's Net Profit", ur: 'آج کا خالص منافع' },
  'kpi.monthlySales': { en: 'Monthly Sales', ur: 'ماہانہ سیلز' },
  'kpi.monthlyExpenses': { en: 'Monthly Expenses', ur: 'ماہانہ اخراجات' },
  'kpi.monthlyProfit': { en: 'Monthly Net Profit', ur: 'ماہانہ خالص منافع' },
};

export function getTranslation(key: string, lang: Language): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
