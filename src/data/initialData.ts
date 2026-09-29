import { 
  Product, 
  RawMaterial, 
  Customer, 
  CustomerTransaction, 
  Supplier, 
  SupplierTransaction, 
  SaleInvoice, 
  CustomOrder, 
  Employee, 
  AttendanceRecord, 
  EmployeeAdvance, 
  Expense, 
  BankAccount, 
  CashTransaction, 
  StockMovement, 
  NotificationItem, 
  AuditLogItem, 
  BusinessSettings,
  Purchase
} from '../types';

export const initialSettings: BusinessSettings = {
  storeName: 'StoreFlow Furniture Studio',
  tagline: 'Premium Woodcraft, Bespoke Interiors & POS Management',
  ownerName: 'Muhammad Salman Sheikh',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  email: 'info@storeflow.pk',
  address: 'Showroom # 14-B, Main Boulevard, Gulberg III',
  city: 'Lahore, Pakistan',
  ntnStrn: 'NTN: 7894561-2 | STRN: 327787612345',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  taxRate: 0,
  invoicePrefix: 'INV-2026-',
  orderPrefix: 'ORD-2026-',
  purchasePrefix: 'PUR-2026-',
  lowStockThresholdDefault: 3,
  enableWhatsappReminders: true,
  enableSmsReminders: true,
  enableEmailReminders: true,
  reminderDaysBeforeDue: 7,
  reminderTemplateWhatsapp: 'Assalam-o-Alaikum {customer_name}, this is a gentle reminder from StoreFlow Furniture. Your pending balance of {amount} for invoice #{invoice_no} is due on {due_date}. Thank you for choosing us!',
  reminderTemplateSms: 'StoreFlow Reminder: Dear {customer_name}, balance {amount} for Inv #{invoice_no} is due {due_date}. Call +923001234567.',
  thermalReceiptHeader: 'STOREFLOW FURNITURE STUDIO\nMain Boulevard Gulberg III, Lahore\nPh: 0300-1234567',
  thermalReceiptFooter: 'Thank you for your valued business!\nWarranty: 5 Years Wood Guarantee\nCustom goods are non-refundable.',
  termsAndConditions: '1. 50% advance on all custom furniture orders.\n2. Goods once delivered and inspected cannot be returned.\n3. 5-year structural warranty on seasoned Sheesham and Teak wood items.'
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'SF-SOF-001',
    barcode: '89640001001',
    name: 'Chesterfield Royal 3-Seater Velvet Sofa',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Sofa',
    brand: 'StoreFlow Signature',
    material: 'Seasoned Sheesham Wood & Turkish Emerald Velvet',
    color: 'Emerald Green',
    colorHex: '#0F766E',
    dimensions: { length: 86, width: 36, height: 32, unit: 'in' },
    unit: 'pcs',
    purchaseCost: 65000,
    manufacturingCost: 60000,
    salePrice: 115000,
    wholesalePrice: 95000,
    minSalePrice: 100000,
    currentStock: 4,
    minStock: 2,
    maxStock: 10,
    taxPercent: 0,
    discountPercent: 5,
    description: 'Deep button tufted mastercraft 3-seater sofa made with solid kiln-dried rosewood frame and high resilience Molty foam.',
    warehouseRack: 'Rack A-01 (Showroom Floor)',
    status: 'active',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'prod-2',
    sku: 'SF-BED-002',
    barcode: '89640001002',
    name: 'King Size Teak Wood Bridal Bed Set',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Bed',
    brand: 'Heritage Craft',
    material: 'Burma Teak Wood with Antique Brass Inlays',
    color: 'Warm Walnut Finish',
    colorHex: '#8B5A2B',
    dimensions: { length: 78, width: 72, height: 54, unit: 'in' },
    unit: 'sets',
    purchaseCost: 140000,
    manufacturingCost: 130000,
    salePrice: 245000,
    wholesalePrice: 215000,
    minSalePrice: 225000,
    currentStock: 2,
    minStock: 2,
    maxStock: 5,
    taxPercent: 0,
    discountPercent: 0,
    description: 'Includes King Bed frame, 2 Side tables, and High-Gloss finished Dresser with LED illuminated mirror frame.',
    warehouseRack: 'Showroom Hall B',
    status: 'active',
    createdAt: '2026-08-15T11:30:00Z',
    updatedAt: '2026-09-22T14:15:00Z'
  },
  {
    id: 'prod-3',
    sku: 'SF-DIN-003',
    barcode: '89640001003',
    name: 'Solid Sheesham 6-Seater Dining Table Set',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dining Table',
    brand: 'Chiniot Artisans',
    material: 'Pure Solid Sheesham Wood & Cushioned Chairs',
    color: 'Dark Walnut Matte',
    colorHex: '#4A2E18',
    dimensions: { length: 72, width: 40, height: 30, unit: 'in' },
    unit: 'sets',
    purchaseCost: 85000,
    manufacturingCost: 78000,
    salePrice: 155000,
    wholesalePrice: 135000,
    minSalePrice: 140000,
    currentStock: 1, // Low stock trigger
    minStock: 3,
    maxStock: 8,
    taxPercent: 0,
    discountPercent: 0,
    description: '6 heavy solid wood chairs with high-density foam seating and tempered glass tabletop protective overlay.',
    warehouseRack: 'Rack C-04',
    status: 'active',
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-09-23T15:00:00Z'
  },
  {
    id: 'prod-4',
    sku: 'SF-CHR-004',
    barcode: '89640001004',
    name: 'Nordic Minimalist Oak Accent Armchair',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a8a30f4e30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Chairs',
    brand: 'Nordic Living',
    material: 'Natural Oak Wood with Boucle Fabric',
    color: 'Ivory Cream',
    colorHex: '#F5F5DC',
    dimensions: { length: 30, width: 28, height: 34, unit: 'in' },
    unit: 'pcs',
    purchaseCost: 18000,
    manufacturingCost: 16000,
    salePrice: 38000,
    wholesalePrice: 30000,
    minSalePrice: 32000,
    currentStock: 8,
    minStock: 3,
    maxStock: 20,
    taxPercent: 0,
    discountPercent: 10,
    description: 'Chic designer accent chair ideal for living rooms, master bedrooms, and executive lounge waiting areas.',
    warehouseRack: 'Rack D-02',
    status: 'active',
    createdAt: '2026-08-25T14:00:00Z',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'prod-5',
    sku: 'SF-WRD-005',
    barcode: '89640001005',
    name: '4-Door Sliding Mirror Modular Wardrobe',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Wardrobe',
    brand: 'StoreFlow Modern',
    material: 'High-Moisture Resistant MDF with German Sliding Tracks',
    color: 'Ash Grey & Oak Two-Tone',
    colorHex: '#6B6258',
    dimensions: { length: 96, width: 24, height: 84, unit: 'in' },
    unit: 'pcs',
    purchaseCost: 75000,
    manufacturingCost: 70000,
    salePrice: 138000,
    wholesalePrice: 120000,
    minSalePrice: 125000,
    currentStock: 0, // Out of stock trigger
    minStock: 2,
    maxStock: 6,
    taxPercent: 0,
    discountPercent: 0,
    description: 'Spacious wardrobe with soft-closing sliding doors, integrated LED hanging rods, internal drawers and security locker.',
    warehouseRack: 'Warehouse Main Bay',
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-24T11:00:00Z'
  },
  {
    id: 'prod-6',
    sku: 'SF-OFF-006',
    barcode: '89640001006',
    name: 'CEO Executive Boss Desk with Side Credenza',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Office Furniture',
    brand: 'Executive Line',
    material: 'Solid Mahogany & Italian PU Gloss Finish',
    color: 'Mahogany Brown',
    colorHex: '#4A1525',
    dimensions: { length: 84, width: 42, height: 30, unit: 'in' },
    unit: 'sets',
    purchaseCost: 95000,
    manufacturingCost: 88000,
    salePrice: 175000,
    wholesalePrice: 150000,
    minSalePrice: 160000,
    currentStock: 3,
    minStock: 1,
    maxStock: 5,
    taxPercent: 0,
    discountPercent: 0,
    description: 'Stately executive workstation with leather desktop writing pad, wire management raceways and biometric locking side drawers.',
    warehouseRack: 'Rack E-01',
    status: 'active',
    createdAt: '2026-09-05T12:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z'
  },
  {
    id: 'prod-7',
    sku: 'SF-CAB-007',
    barcode: '89640001007',
    name: 'Vintage Glass Display Cabinet with Warm Lighting',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Cabinets',
    brand: 'Heritage Craft',
    material: 'Seasoned Sheesham Wood with Beveled Glass',
    color: 'Natural Wood Grain',
    colorHex: '#8B5A2B',
    dimensions: { length: 48, width: 18, height: 78, unit: 'in' },
    unit: 'pcs',
    purchaseCost: 45000,
    manufacturingCost: 40000,
    salePrice: 85000,
    wholesalePrice: 70000,
    minSalePrice: 75000,
    currentStock: 2,
    minStock: 2,
    maxStock: 4,
    taxPercent: 0,
    discountPercent: 0,
    description: 'Crockery and curio display cabinet with tempered shelves and integrated soft 3000K warm spot lighting.',
    warehouseRack: 'Rack B-03',
    status: 'active',
    createdAt: '2026-09-10T14:30:00Z',
    updatedAt: '2026-09-24T13:00:00Z'
  },
  {
    id: 'prod-8',
    sku: 'SF-SOF-008',
    barcode: '89640001008',
    name: 'L-Shape Modern Sectional Sofa (Left Facing)',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Sofa',
    brand: 'StoreFlow Comfort',
    material: 'Imported Chenille Fabric with Feather Blend Cushions',
    color: 'Warm Charcoal Grey',
    colorHex: '#374151',
    dimensions: { length: 112, width: 68, height: 32, unit: 'in' },
    unit: 'sets',
    purchaseCost: 90000,
    manufacturingCost: 82000,
    salePrice: 168000,
    wholesalePrice: 145000,
    minSalePrice: 155000,
    currentStock: 3,
    minStock: 2,
    maxStock: 6,
    taxPercent: 0,
    discountPercent: 0,
    description: 'Spacious family sectional sofa with stain-resistant treated fabric and washable removable cushion covers.',
    warehouseRack: 'Showroom Floor Bay A',
    status: 'active',
    createdAt: '2026-09-12T09:15:00Z',
    updatedAt: '2026-09-24T14:00:00Z'
  }
];

export const initialRawMaterials: RawMaterial[] = [
  {
    id: 'raw-1',
    sku: 'RAW-WD-SH',
    name: 'Seasoned Sheesham Wood (Rosewood)',
    category: 'Wood',
    unit: 'ft',
    currentStock: 480,
    minStock: 200,
    unitCost: 2800,
    supplierId: 'sup-1',
    supplierName: 'Chiniot Timber Traders',
    notes: 'A-Grade kiln dried logs, moisture level 10-12%',
    updatedAt: '2026-09-23T10:00:00Z'
  },
  {
    id: 'raw-2',
    sku: 'RAW-WD-TK',
    name: 'Burma Teak Wood Planks',
    category: 'Wood',
    unit: 'ft',
    currentStock: 85, // Low stock
    minStock: 150,
    unitCost: 4500,
    supplierId: 'sup-1',
    supplierName: 'Chiniot Timber Traders',
    notes: 'Premium imported golden teak for bridal sets',
    updatedAt: '2026-09-22T11:00:00Z'
  },
  {
    id: 'raw-3',
    sku: 'RAW-FM-MT',
    name: 'Master Molty High-Resilience Foam (4-inch Sheet)',
    category: 'Foam',
    unit: 'sheets',
    currentStock: 24,
    minStock: 15,
    unitCost: 8500,
    supplierId: 'sup-2',
    supplierName: 'Master Molty Foam Ltd',
    notes: '10-year warranty high density seating grade',
    updatedAt: '2026-09-24T08:00:00Z'
  },
  {
    id: 'raw-4',
    sku: 'RAW-FB-TRK',
    name: 'Turkish Royal Velvet Fabric (Emerald & Blue)',
    category: 'Fabric',
    unit: 'm',
    currentStock: 140,
    minStock: 50,
    unitCost: 1650,
    supplierId: 'sup-3',
    supplierName: 'Turkish Textile Importers',
    notes: 'Heavy duty rub test 50,000+ cycles',
    updatedAt: '2026-09-24T09:30:00Z'
  },
  {
    id: 'raw-5',
    sku: 'RAW-POL-PU',
    name: 'PU High Gloss Italian Wood Polish & Hardener',
    category: 'Polish',
    unit: 'L',
    currentStock: 45,
    minStock: 30,
    unitCost: 2200,
    supplierId: 'sup-4',
    supplierName: 'Deco Coatings Hub',
    notes: 'Scratch and water-resistant polyurethane clear coat',
    updatedAt: '2026-09-20T16:00:00Z'
  },
  {
    id: 'raw-6',
    sku: 'RAW-HD-TRK',
    name: 'Telescopic Soft-Close Drawer Channels (18-inch)',
    category: 'Hardware',
    unit: 'pcs',
    currentStock: 60,
    minStock: 40,
    unitCost: 750,
    supplierId: 'sup-4',
    supplierName: 'Deco Coatings Hub',
    notes: '45kg weight capacity ball-bearing slides',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'raw-7',
    sku: 'RAW-GL-FEV',
    name: 'Fevicol Marine Synthetic Wood Adhesive',
    category: 'Glue',
    unit: 'kg',
    currentStock: 90,
    minStock: 30,
    unitCost: 650,
    supplierId: 'sup-4',
    supplierName: 'Deco Coatings Hub',
    notes: 'Waterproof bond for all structural joints',
    updatedAt: '2026-09-21T11:00:00Z'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    customerNo: 'CUST-001',
    name: 'Malik Tariq Mehmood',
    fatherHusbandName: 'Chaudhry Mehmood Ali',
    phone: '03008456789',
    whatsapp: '923008456789',
    alternatePhone: '04235876543',
    cnic: '35202-1234567-1',
    email: 'tariq.mehmood@gmail.com',
    address: 'House # 45, Sector Y, Phase 3, DHA',
    city: 'Lahore',
    area: 'DHA Phase 3',
    type: 'Regular',
    creditLimit: 500000,
    openingBalance: 0,
    totalPurchases: 360000,
    totalPaid: 260000,
    currentBalance: 100000, // Due receivable
    lastPaymentDate: '2026-09-15',
    nextDueDate: '2026-09-30',
    notes: 'Furnishing his new bungalow. Prefer walnut finish.',
    createdAt: '2026-07-15T10:00:00Z'
  },
  {
    id: 'cust-2',
    customerNo: 'CUST-002',
    name: 'Dr. Ayesha Siddiqui',
    fatherHusbandName: 'Farhan Siddiqui',
    phone: '03214567890',
    whatsapp: '923214567890',
    cnic: '35201-9876543-2',
    email: 'ayesha.siddiqui@hospital.org',
    address: 'Apartment 4B, Gulberg Heights, Gulberg II',
    city: 'Lahore',
    area: 'Gulberg',
    type: 'Regular',
    creditLimit: 200000,
    openingBalance: 0,
    totalPurchases: 155000,
    totalPaid: 155000,
    currentBalance: 0, // Fully paid
    lastPaymentDate: '2026-09-21',
    notes: 'Bought 6-seater dining table set.',
    createdAt: '2026-08-01T12:00:00Z'
  },
  {
    id: 'cust-3',
    customerNo: 'CUST-003',
    name: 'Naveed Akhtar (ArchiTek Studio)',
    phone: '03334512398',
    whatsapp: '923334512398',
    cnic: '35202-4567890-3',
    email: 'info@architek.pk',
    address: 'Office 302, Siddiq Trade Centre, Gulberg',
    city: 'Lahore',
    area: 'Gulberg III',
    type: 'Corporate',
    creditLimit: 1500000,
    openingBalance: 0,
    totalPurchases: 540000,
    totalPaid: 300000,
    currentBalance: 240000, // Overdue receivable
    lastPaymentDate: '2026-08-28',
    nextDueDate: '2026-09-20', // Overdue
    notes: 'Interior designer corporate partner. High repeat volume.',
    createdAt: '2026-06-10T09:00:00Z'
  },
  {
    id: 'cust-4',
    customerNo: 'CUST-004',
    name: 'Zubair Butt',
    phone: '03029876543',
    whatsapp: '923029876543',
    address: 'Street 9, Cavalry Ground',
    city: 'Lahore',
    area: 'Cavalry Ground',
    type: 'Retail',
    creditLimit: 50000,
    openingBalance: 0,
    totalPurchases: 38000,
    totalPaid: 38000,
    currentBalance: 0,
    lastPaymentDate: '2026-09-24',
    notes: 'Walk-in customer.',
    createdAt: '2026-09-24T10:30:00Z'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    supplierNo: 'SUP-001',
    name: 'Haji Mukhtar Timber Co.',
    contactPerson: 'Haji Mukhtar Ahmed',
    phone: '03009451122',
    whatsapp: '923009451122',
    email: 'mukhtar.timber@chiniot.pk',
    companyName: 'Chiniot Timber Traders',
    address: 'Timber Market, Ravi Road',
    city: 'Lahore',
    currentBalance: 120000, // We owe them (payable)
    totalPurchases: 850000,
    totalPaid: 730000,
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'sup-2',
    supplierNo: 'SUP-002',
    name: 'Master Molty Foam Distribution',
    contactPerson: 'Khurram Shehzad',
    phone: '03224433221',
    email: 'khurram@moltydistributors.com',
    companyName: 'Master Molty Foam Ltd',
    address: 'Industrial Area, Kot Lakhpat',
    city: 'Lahore',
    currentBalance: 45000,
    totalPurchases: 340000,
    totalPaid: 295000,
    createdAt: '2026-06-01T11:00:00Z'
  },
  {
    id: 'sup-3',
    supplierNo: 'SUP-003',
    name: 'Turkish Velvet & Fabrics Direct',
    contactPerson: 'Murat Khan',
    phone: '03456789012',
    companyName: 'Turkish Textile Importers',
    address: 'Textile Plaza, Circular Road',
    city: 'Lahore',
    currentBalance: 0,
    totalPurchases: 220000,
    totalPaid: 220000,
    createdAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'sup-4',
    supplierNo: 'SUP-004',
    name: 'Deco Polish & Hardware Hub',
    contactPerson: 'Abdul Rehman',
    phone: '03017654321',
    companyName: 'Deco Coatings Hub',
    address: 'Badami Bagh Hardware Market',
    city: 'Lahore',
    currentBalance: 28000,
    totalPurchases: 190000,
    totalPaid: 162000,
    createdAt: '2026-07-01T09:00:00Z'
  }
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'acc-1',
    name: 'Cash in Hand (POS Counter)',
    type: 'Cash',
    balance: 87500,
    isDefault: true
  },
  {
    id: 'acc-2',
    name: 'Meezan Bank (Islamic Business A/C)',
    type: 'Bank',
    bankName: 'Meezan Bank Ltd',
    accountNumber: '0201-0105897643',
    balance: 845000,
    isDefault: false
  },
  {
    id: 'acc-3',
    name: 'Habib Bank Limited (HBL Operational)',
    type: 'Bank',
    bankName: 'HBL',
    accountNumber: '5021-7900123403',
    balance: 420000,
    isDefault: false
  },
  {
    id: 'acc-4',
    name: 'JazzCash Merchant Account',
    type: 'Mobile Wallet',
    accountNumber: '0300-1234567',
    balance: 38200,
    isDefault: false
  },
  {
    id: 'acc-5',
    name: 'Easypaisa Business Wallet',
    type: 'Mobile Wallet',
    accountNumber: '0300-1234567',
    balance: 24500,
    isDefault: false
  }
];

export const initialInvoices: SaleInvoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-2026-00101',
    customerId: 'cust-1',
    customerName: 'Malik Tariq Mehmood',
    customerPhone: '03008456789',
    date: '2026-09-15',
    dueDate: '2026-09-30',
    items: [
      {
        productId: 'prod-2',
        productName: 'King Size Teak Wood Bridal Bed Set',
        sku: 'SF-BED-002',
        unit: 'sets',
        quantity: 1,
        unitPrice: 245000,
        discount: 0,
        costPrice: 140000,
        total: 245000
      },
      {
        productId: 'prod-1',
        productName: 'Chesterfield Royal 3-Seater Velvet Sofa',
        sku: 'SF-SOF-001',
        unit: 'pcs',
        quantity: 1,
        unitPrice: 115000,
        discount: 0,
        costPrice: 65000,
        total: 115000
      }
    ],
    subtotal: 360000,
    discount: 0,
    tax: 0,
    shippingCharges: 0,
    grandTotal: 360000,
    paidAmount: 260000,
    balanceDue: 100000,
    paymentMethod: 'Bank Transfer',
    accountId: 'acc-2',
    status: 'Partially Paid',
    notes: 'Paid Rs. 260,000 via Meezan Online. Rs. 100,000 due upon final wardrobe setup.',
    createdByName: 'Salman Sheikh (Owner)',
    createdAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-2026-00102',
    customerId: 'cust-2',
    customerName: 'Dr. Ayesha Siddiqui',
    customerPhone: '03214567890',
    date: '2026-09-21',
    items: [
      {
        productId: 'prod-3',
        productName: 'Solid Sheesham 6-Seater Dining Table Set',
        sku: 'SF-DIN-003',
        unit: 'sets',
        quantity: 1,
        unitPrice: 155000,
        discount: 0,
        costPrice: 85000,
        total: 155000
      }
    ],
    subtotal: 155000,
    discount: 0,
    tax: 0,
    shippingCharges: 0,
    grandTotal: 155000,
    paidAmount: 155000,
    balanceDue: 0,
    paymentMethod: 'Card',
    accountId: 'acc-2',
    status: 'Paid',
    notes: 'Full payment cleared via POS Credit Card swipe.',
    createdByName: 'Bilal Cashier',
    createdAt: '2026-09-21T16:00:00Z'
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV-2026-00103',
    customerId: 'cust-3',
    customerName: 'Naveed Akhtar (ArchiTek Studio)',
    customerPhone: '03334512398',
    date: '2026-09-05',
    dueDate: '2026-09-20', // Overdue
    items: [
      {
        productId: 'prod-6',
        productName: 'CEO Executive Boss Desk with Side Credenza',
        sku: 'SF-OFF-006',
        unit: 'sets',
        quantity: 2,
        unitPrice: 175000,
        discount: 10000,
        costPrice: 95000,
        total: 340000
      },
      {
        productId: 'prod-7',
        productName: 'Vintage Glass Display Cabinet',
        sku: 'SF-CAB-007',
        unit: 'pcs',
        quantity: 2,
        unitPrice: 85000,
        discount: 0,
        costPrice: 45000,
        total: 170000
      }
    ],
    subtotal: 510000,
    discount: 0,
    tax: 0,
    shippingCharges: 0,
    grandTotal: 510000,
    paidAmount: 270000,
    balanceDue: 240000,
    paymentMethod: 'Bank Transfer',
    accountId: 'acc-3',
    status: 'Overdue',
    notes: 'Delivered to ArchiTek office. Follow up on 240k balance.',
    createdByName: 'Salman Sheikh (Owner)',
    createdAt: '2026-09-05T11:00:00Z'
  },
  {
    id: 'inv-4',
    invoiceNo: 'INV-2026-00104',
    customerId: 'cust-4',
    customerName: 'Zubair Butt',
    customerPhone: '03029876543',
    date: '2026-09-24',
    items: [
      {
        productId: 'prod-4',
        productName: 'Nordic Minimalist Oak Accent Armchair',
        sku: 'SF-CHR-004',
        unit: 'pcs',
        quantity: 1,
        unitPrice: 38000,
        discount: 0,
        costPrice: 18000,
        total: 38000
      }
    ],
    subtotal: 38000,
    discount: 0,
    tax: 0,
    shippingCharges: 0,
    grandTotal: 38000,
    paidAmount: 38000,
    balanceDue: 0,
    paymentMethod: 'Cash',
    accountId: 'acc-1',
    status: 'Paid',
    notes: 'Counter walk-in cash sale.',
    createdByName: 'Bilal Cashier',
    createdAt: '2026-09-24T11:15:00Z'
  }
];

export const initialCustomOrders: CustomOrder[] = [
  {
    id: 'ord-1',
    orderNo: 'ORD-2026-0042',
    customerId: 'cust-1',
    customerName: 'Malik Tariq Mehmood',
    customerPhone: '03008456789',
    itemType: 'Custom 10-Seater Royal Sheesham Dining Table with Carved Legs',
    dimensions: { length: 120, width: 48, height: 30, unit: 'in' },
    woodType: 'Pure Seasoned Sheesham',
    fabricType: 'Turkish Royal Velvet (Navy Blue)',
    polishColor: 'Walnut High Gloss Polish',
    specifications: 'Hand-carved lion paw legs, 10mm tempered glass protection cover, 10 master chairs with tufted back.',
    referenceImages: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedCost: 185000,
    actualMaterialCost: 110000,
    actualLabourCost: 45000,
    actualOtherCost: 8000,
    totalActualCost: 163000,
    finalPrice: 285000,
    advancePaid: 150000,
    balanceDue: 135000,
    paymentStatus: 'Partially Paid',
    orderDate: '2026-09-08',
    expectedDeliveryDate: '2026-09-28',
    currentStage: 'polishing_upholstery',
    stageHistory: [
      { stage: 'order_received', timestamp: '2026-09-08T10:00:00Z', userName: 'Salman Sheikh', notes: 'Advance Rs. 150,000 received via Bank' },
      { stage: 'design_approved', timestamp: '2026-09-10T14:00:00Z', userName: 'Ustad Aslam', notes: 'CAD drawings & dimensions approved by customer' },
      { stage: 'material_required', timestamp: '2026-09-11T09:30:00Z', userName: 'Store Keeper', notes: 'Issued 60 ft Sheesham Wood + 2 sheets foam' },
      { stage: 'production_started', timestamp: '2026-09-13T08:00:00Z', userName: 'Ustad Aslam', notes: 'Carpentry cutting and sizing underway' },
      { stage: 'under_manufacturing', timestamp: '2026-09-18T16:00:00Z', userName: 'Master Rashid', notes: 'Frame and leg carving completed' },
      { stage: 'polishing_upholstery', timestamp: '2026-09-23T11:00:00Z', userName: 'Kashif Polisher', notes: 'First coat of PU sealer applied, polishing in progress' }
    ],
    materialsIssued: [
      { rawMaterialId: 'raw-1', name: 'Seasoned Sheesham Wood', category: 'Wood', quantity: 60, unit: 'ft', unitCost: 2800, totalCost: 168000, dateIssued: '2026-09-11' },
      { rawMaterialId: 'raw-3', name: 'Master Molty High-Resilience Foam', category: 'Foam', quantity: 3, unit: 'sheets', unitCost: 8500, totalCost: 25500, dateIssued: '2026-09-18' }
    ],
    labourAllocated: [
      { employeeId: 'emp-1', employeeName: 'Ustad Aslam (Master Carpenter)', task: 'Table Structure & Lion Paw Carving', hours: 40, cost: 25000, date: '2026-09-18' },
      { employeeId: 'emp-2', employeeName: 'Kashif Ali (Chief Polisher)', task: 'Sanding & PU Italian Gloss Coating', hours: 25, cost: 15000, date: '2026-09-23' }
    ],
    delivery: {
      recipientName: 'Malik Tariq Mehmood',
      recipientPhone: '03008456789',
      deliveryAddress: 'House # 45, Sector Y, Phase 3, DHA, Lahore',
      city: 'Lahore',
      driverName: 'Muhammad Ramzan',
      driverPhone: '03041122334',
      vehicleNo: 'LEA-4890 (Mazda Truck)',
      deliveryCharges: 5000,
      status: 'Pending',
      expectedDate: '2026-09-28'
    },
    assignedCarpenterId: 'emp-1',
    assignedCarpenterName: 'Ustad Aslam',
    notes: 'High priority VIP order. Customer requested photo updates.',
    createdAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'ord-2',
    orderNo: 'ORD-2026-0043',
    customerId: 'cust-3',
    customerName: 'Naveed Akhtar (ArchiTek Studio)',
    customerPhone: '03334512398',
    itemType: 'Modern Fluted Panel TV Console & Acoustic Wall Panel',
    dimensions: { length: 96, width: 18, height: 84, unit: 'in' },
    woodType: 'Natural Oak Veneer on HD Marine Board',
    polishColor: 'Natural Matte Clear Coat',
    specifications: 'Integrated warm LED cove lights, push-to-open soft close drawers, cable management raceway.',
    referenceImages: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedCost: 75000,
    actualMaterialCost: 48000,
    actualLabourCost: 20000,
    actualOtherCost: 4000,
    totalActualCost: 72000,
    finalPrice: 125000,
    advancePaid: 65000,
    balanceDue: 60000,
    paymentStatus: 'Partially Paid',
    orderDate: '2026-09-12',
    expectedDeliveryDate: '2026-09-25',
    currentStage: 'ready', // Ready for delivery trigger
    stageHistory: [
      { stage: 'order_received', timestamp: '2026-09-12T11:00:00Z', userName: 'Salman Sheikh', notes: 'Advance Rs. 65,000 recorded' },
      { stage: 'design_approved', timestamp: '2026-09-13T10:00:00Z', userName: 'Ustad Aslam', notes: 'Fluted profile approved' },
      { stage: 'production_started', timestamp: '2026-09-15T09:00:00Z', userName: 'Ustad Aslam', notes: 'Carpentry started' },
      { stage: 'quality_check', timestamp: '2026-09-23T15:00:00Z', userName: 'Salman Sheikh', notes: 'QC Passed 100%' },
      { stage: 'ready', timestamp: '2026-09-24T09:00:00Z', userName: 'Salman Sheikh', notes: 'Packaged in protective bubble wrap, ready for dispatch.' }
    ],
    materialsIssued: [
      { rawMaterialId: 'raw-5', name: 'PU Polish', category: 'Polish', quantity: 6, unit: 'L', unitCost: 2200, totalCost: 13200, dateIssued: '2026-09-20' },
      { rawMaterialId: 'raw-6', name: 'Telescopic Channels', category: 'Hardware', quantity: 6, unit: 'pcs', unitCost: 750, totalCost: 4500, dateIssued: '2026-09-20' }
    ],
    labourAllocated: [
      { employeeId: 'emp-3', employeeName: 'Tariq Mehmood', task: 'Fluting and Panel Assembly', hours: 20, cost: 14000, date: '2026-09-20' }
    ],
    delivery: {
      recipientName: 'ArchiTek Site Engineer',
      recipientPhone: '03334512398',
      deliveryAddress: 'Site # 88, Lake City Holdings, Raiwind Road',
      city: 'Lahore',
      deliveryCharges: 3500,
      status: 'Pending',
      expectedDate: '2026-09-25'
    },
    notes: 'Call architect 1 hour before dispatch.',
    createdAt: '2026-09-12T11:00:00Z'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeNo: 'EMP-001',
    name: 'Ustad Muhammad Aslam',
    fatherName: 'Allah Ditta',
    cnic: '35201-1122334-5',
    phone: '03004455667',
    address: 'Mohalla Chishtian, Shahdara, Lahore',
    role: 'Carpenter',
    salaryType: 'Monthly',
    basicSalary: 65000,
    ratePerHour: 350,
    joiningDate: '2024-01-10',
    status: 'Active',
    currentAdvancesBalance: 15000
  },
  {
    id: 'emp-2',
    employeeNo: 'EMP-002',
    name: 'Kashif Ali',
    fatherName: 'Muhammad Din',
    cnic: '35202-5566778-9',
    phone: '03217788990',
    address: 'Baghbanpura, Lahore',
    role: 'Polisher',
    salaryType: 'Monthly',
    basicSalary: 55000,
    ratePerHour: 300,
    joiningDate: '2024-03-15',
    status: 'Active',
    currentAdvancesBalance: 0
  },
  {
    id: 'emp-3',
    employeeNo: 'EMP-003',
    name: 'Tariq Mehmood',
    fatherName: 'Abdul Ghafoor',
    cnic: '35201-9988776-3',
    phone: '03451234876',
    address: 'Kot Abdul Malik, Lahore',
    role: 'Upholsterer',
    salaryType: 'Monthly',
    basicSalary: 50000,
    ratePerHour: 280,
    joiningDate: '2024-06-01',
    status: 'Active',
    currentAdvancesBalance: 8000
  },
  {
    id: 'emp-4',
    employeeNo: 'EMP-004',
    name: 'Muhammad Imran',
    fatherName: 'Rashid Khan',
    cnic: '35202-4433221-1',
    phone: '03112233445',
    address: 'Ferozepur Road, Lahore',
    role: 'Helper',
    salaryType: 'Daily',
    basicSalary: 32000,
    ratePerHour: 180,
    joiningDate: '2025-02-01',
    status: 'Active',
    currentAdvancesBalance: 0
  },
  {
    id: 'emp-5',
    employeeNo: 'EMP-005',
    name: 'Master Rashid Hussain',
    fatherName: 'Hussain Bakhsh',
    cnic: '35201-6677889-7',
    phone: '03089900112',
    address: 'Chung Stop, Multan Road, Lahore',
    role: 'Supervisor',
    salaryType: 'Monthly',
    basicSalary: 75000,
    ratePerHour: 400,
    joiningDate: '2023-11-01',
    status: 'Active',
    currentAdvancesBalance: 0
  }
];

export const initialAttendance: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'emp-1', employeeName: 'Ustad Muhammad Aslam', date: '2026-09-24', status: 'Present', checkIn: '08:45 AM', checkOut: '06:15 PM', overtimeHours: 1.5 },
  { id: 'att-2', employeeId: 'emp-2', employeeName: 'Kashif Ali', date: '2026-09-24', status: 'Present', checkIn: '09:00 AM', checkOut: '05:00 PM', overtimeHours: 0 },
  { id: 'att-3', employeeId: 'emp-3', employeeName: 'Tariq Mehmood', date: '2026-09-24', status: 'Present', checkIn: '08:50 AM', checkOut: '07:00 PM', overtimeHours: 2.0 },
  { id: 'att-4', employeeId: 'emp-4', employeeName: 'Muhammad Imran', date: '2026-09-24', status: 'Present', checkIn: '08:30 AM', checkOut: '05:30 PM', overtimeHours: 0.5 },
  { id: 'att-5', employeeId: 'emp-5', employeeName: 'Master Rashid Hussain', date: '2026-09-24', status: 'Present', checkIn: '08:30 AM', checkOut: '06:00 PM', overtimeHours: 1.0 }
];

export const initialAdvances: EmployeeAdvance[] = [
  { id: 'adv-1', advanceNo: 'ADV-019', employeeId: 'emp-1', employeeName: 'Ustad Muhammad Aslam', date: '2026-09-10', amount: 15000, deductedAmount: 0, remainingAmount: 15000, reason: 'Family medical expense', status: 'Active' },
  { id: 'adv-2', advanceNo: 'ADV-020', employeeId: 'emp-3', employeeName: 'Tariq Mehmood', date: '2026-09-12', amount: 8000, deductedAmount: 0, remainingAmount: 8000, reason: 'Children school fees', status: 'Active' }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    expenseNo: 'EXP-2026-089',
    date: '2026-09-24',
    category: 'Workshop',
    title: 'Diesel Generator Fuel for Wood Planer & Sawing Machine',
    amount: 14500,
    paymentMethod: 'Cash',
    accountId: 'acc-1',
    accountName: 'Cash in Hand (POS Counter)',
    paidBy: 'Master Rashid (Supervisor)',
    approvalStatus: 'Approved',
    approvedBy: 'Salman Sheikh (Owner)',
    notes: '50 Litres diesel during power load-shedding.',
    createdAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'exp-2',
    expenseNo: 'EXP-2026-088',
    date: '2026-09-23',
    category: 'Tea & Refreshment',
    title: 'Artisans & Showroom Weekly Tea / Milk Expense',
    amount: 3800,
    paymentMethod: 'Cash',
    accountId: 'acc-1',
    accountName: 'Cash in Hand (POS Counter)',
    paidBy: 'Bilal Cashier',
    approvalStatus: 'Approved',
    approvedBy: 'Salman Sheikh (Owner)',
    notes: 'Fresh milk and tea leaves for workshop crew.',
    createdAt: '2026-09-23T16:00:00Z'
  },
  {
    id: 'exp-3',
    expenseNo: 'EXP-2026-087',
    date: '2026-09-18',
    category: 'Transport',
    title: 'Sheesham Timber Carriage & Freight from Ravi Road Market',
    amount: 8500,
    paymentMethod: 'Cash',
    accountId: 'acc-1',
    accountName: 'Cash in Hand (POS Counter)',
    paidBy: 'Master Rashid',
    approvalStatus: 'Approved',
    approvedBy: 'Salman Sheikh (Owner)',
    notes: 'Loading/Unloading charges for 120ft wood logs.',
    createdAt: '2026-09-18T14:00:00Z'
  },
  {
    id: 'exp-4',
    expenseNo: 'EXP-2026-086',
    date: '2026-09-05',
    category: 'Electricity',
    title: 'LESCO Commercial Showroom Electricity Bill',
    amount: 68500,
    paymentMethod: 'Bank Transfer',
    accountId: 'acc-2',
    accountName: 'Meezan Bank (Islamic Business A/C)',
    paidBy: 'Salman Sheikh',
    approvalStatus: 'Approved',
    approvedBy: 'Salman Sheikh',
    notes: 'LESCO bill paid via Meezan Internet Banking.',
    createdAt: '2026-09-05T12:00:00Z'
  }
];

export const initialPurchases: Purchase[] = [
  {
    id: 'pur-1',
    purchaseNo: 'PUR-2026-00054',
    supplierId: 'sup-1',
    supplierName: 'Chiniot Timber Traders',
    date: '2026-09-18',
    dueDate: '2026-10-05',
    items: [
      {
        id: 'pitem-1',
        itemType: 'raw_material',
        itemId: 'raw-1',
        name: 'Seasoned Sheesham Wood (Rosewood)',
        sku: 'RAW-WD-SH',
        unit: 'ft',
        quantity: 120,
        unitPrice: 2800,
        total: 336000
      }
    ],
    subtotal: 336000,
    tax: 0,
    discount: 0,
    grandTotal: 336000,
    paidAmount: 216000,
    balanceDue: 120000,
    paymentMethod: 'Bank Transfer',
    accountId: 'acc-2',
    status: 'Received',
    notes: 'High quality A-grade wood delivered to factory.',
    createdByName: 'Salman Sheikh',
    createdAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'pur-2',
    purchaseNo: 'PUR-2026-00055',
    supplierId: 'sup-2',
    supplierName: 'Master Molty Foam Ltd',
    date: '2026-09-20',
    dueDate: '2026-10-10',
    items: [
      {
        id: 'pitem-2',
        itemType: 'raw_material',
        itemId: 'raw-3',
        name: 'Master Molty High-Resilience Foam (4-inch Sheet)',
        sku: 'RAW-FM-MT',
        unit: 'sheets',
        quantity: 10,
        unitPrice: 8500,
        total: 85000
      }
    ],
    subtotal: 85000,
    tax: 0,
    discount: 0,
    grandTotal: 85000,
    paidAmount: 40000,
    balanceDue: 45000,
    paymentMethod: 'Bank Transfer',
    accountId: 'acc-3',
    status: 'Received',
    notes: 'Foam stock for custom sofa orders.',
    createdByName: 'Salman Sheikh',
    createdAt: '2026-09-20T14:00:00Z'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    title: 'Low Stock Alert: Burma Teak Wood',
    message: 'Burma Teak Wood (Planks) is currently at 85 ft, below threshold of 150 ft.',
    link: '/products',
    read: false,
    priority: 'high',
    createdAt: '2026-09-24T08:00:00Z'
  },
  {
    id: 'notif-2',
    type: 'payment_due',
    title: 'Overdue Balance: ArchiTek Studio',
    message: 'Rs. 240,000 is overdue since 20 Sep 2026. Click to send WhatsApp reminder.',
    link: '/customers',
    read: false,
    priority: 'high',
    createdAt: '2026-09-24T09:00:00Z'
  },
  {
    id: 'notif-3',
    type: 'order_ready',
    title: 'Order Ready for Delivery: #ORD-2026-0043',
    message: 'Fluted TV Console for ArchiTek Studio has passed QC and is ready for dispatch.',
    link: '/orders',
    read: false,
    priority: 'medium',
    createdAt: '2026-09-24T09:30:00Z'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'audit-1',
    timestamp: '2026-09-24T11:15:00Z',
    userName: 'Bilal Cashier',
    userRole: 'cashier',
    module: 'Sales / POS',
    action: 'CREATE',
    details: 'Completed POS Cash Sale INV-2026-00104 for Rs. 38,000 (Nordic Armchair)',
    ipAddress: '192.168.1.102'
  },
  {
    id: 'audit-2',
    timestamp: '2026-09-24T10:00:00Z',
    userName: 'Salman Sheikh',
    userRole: 'owner',
    module: 'Expenses',
    action: 'APPROVE',
    details: 'Approved Workshop Fuel Expense EXP-2026-089 for Rs. 14,500',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'audit-3',
    timestamp: '2026-09-23T11:00:00Z',
    userName: 'Kashif Polisher',
    userRole: 'production_manager',
    module: 'Custom Orders',
    action: 'UPDATE',
    details: 'Moved Order #ORD-2026-0042 to "Polishing & Upholstery" stage.',
    ipAddress: '192.168.1.105'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'mv-1',
    date: '2026-09-24T11:15:00Z',
    itemType: 'product',
    itemId: 'prod-4',
    itemName: 'Nordic Minimalist Oak Accent Armchair',
    sku: 'SF-CHR-004',
    movementType: 'sale',
    qtyChange: -1,
    previousStock: 9,
    newStock: 8,
    referenceNo: 'INV-2026-00104',
    userName: 'Bilal Cashier',
    notes: 'POS sale deducted stock atomically'
  },
  {
    id: 'mv-2',
    date: '2026-09-20T14:00:00Z',
    itemType: 'raw_material',
    itemId: 'raw-3',
    itemName: 'Master Molty High-Resilience Foam',
    sku: 'RAW-FM-MT',
    movementType: 'purchase',
    qtyChange: 10,
    previousStock: 14,
    newStock: 24,
    referenceNo: 'PUR-2026-00055',
    userName: 'Salman Sheikh',
    notes: 'Supplier bill received & stock updated'
  }
];
