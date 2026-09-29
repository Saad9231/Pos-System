export type UserRole = 
  | 'owner' 
  | 'manager' 
  | 'accountant' 
  | 'cashier' 
  | 'production_manager' 
  | 'store_keeper';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm' | 'ft' | 'mm';
}

export type ProductCategory = 
  | 'Sofa' 
  | 'Bed' 
  | 'Dining Table' 
  | 'Chairs' 
  | 'Wardrobe' 
  | 'Cabinets' 
  | 'Office Furniture' 
  | 'Custom';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  images: string[];
  category: ProductCategory;
  brand: string;
  material: string;
  color: string;
  colorHex?: string;
  dimensions: Dimensions;
  unit: string;
  purchaseCost: number;
  manufacturingCost: number;
  salePrice: number;
  wholesalePrice: number;
  minSalePrice: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  taxPercent: number;
  discountPercent: number;
  description: string;
  warehouseRack: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type RawMaterialCategory = 
  | 'Wood' 
  | 'Foam' 
  | 'Fabric' 
  | 'Polish' 
  | 'Hardware' 
  | 'Glue' 
  | 'Paint'
  | 'Accessories';

export interface RawMaterial {
  id: string;
  sku: string;
  name: string;
  category: RawMaterialCategory;
  unit: 'ft' | 'sheets' | 'm' | 'L' | 'pcs' | 'kg' | 'boxes';
  currentStock: number;
  minStock: number;
  unitCost: number;
  supplierId?: string;
  supplierName?: string;
  notes?: string;
  updatedAt: string;
}

export type CustomerType = 'Retail' | 'Wholesale' | 'Regular' | 'Corporate';

export interface Customer {
  id: string;
  customerNo: string;
  name: string;
  fatherHusbandName?: string;
  phone: string;
  whatsapp?: string;
  alternatePhone?: string;
  cnic?: string;
  email?: string;
  address: string;
  city: string;
  area: string;
  type: CustomerType;
  creditLimit: number;
  openingBalance: number;
  totalPurchases: number;
  totalPaid: number;
  currentBalance: number; // Positive = customer owes us (receivable)
  lastPaymentDate?: string;
  nextDueDate?: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  date: string;
  type: 'Sale' | 'Payment' | 'Return' | 'Adjustment' | 'Opening Balance';
  referenceId: string; // invoice # or receipt #
  description: string;
  debit: number;  // Increases receivable (e.g. Sale)
  credit: number; // Decreases receivable (e.g. Payment)
  runningBalance: number;
  createdByName: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Card' | 'Cheque' | 'Credit';

export interface CustomerPayment {
  id: string;
  paymentNo: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNo?: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName: string;
  transactionRef?: string;
  notes?: string;
  receivedBy: string;
}

export interface Supplier {
  id: string;
  supplierNo: string;
  name: string;
  contactPerson: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  city: string;
  companyName: string;
  currentBalance: number; // Positive = we owe supplier (payable)
  totalPurchases: number;
  totalPaid: number;
  createdAt: string;
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  date: string;
  type: 'Purchase' | 'Payment' | 'Return' | 'Adjustment' | 'Opening Balance';
  referenceId: string;
  description: string;
  debit: number;  // payment made to supplier (decreases payable)
  credit: number; // purchase from supplier (increases payable)
  runningBalance: number;
  createdByName: string;
}

export interface SupplierPayment {
  id: string;
  paymentNo: string;
  supplierId: string;
  supplierName: string;
  purchaseId?: string;
  purchaseNo?: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName: string;
  transactionRef?: string;
  notes?: string;
  paidBy: string;
}

export interface PurchaseItem {
  id: string;
  itemType: 'product' | 'raw_material';
  itemId: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  purchaseNo: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate?: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  accountId?: string;
  status: 'Received' | 'Partially Received' | 'Pending' | 'Cancelled';
  notes?: string;
  createdByName: string;
  createdAt: string;
}

export interface PurchaseReturn {
  id: string;
  returnNo: string;
  purchaseId: string;
  purchaseNo: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: {
    itemId: string;
    itemType: 'product' | 'raw_material';
    name: string;
    qty: number;
    unitPrice: number;
    total: number;
    reason: string;
  }[];
  totalRefund: number;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  costPrice: number;
  total: number;
}

export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Voided';

export interface SaleInvoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  dueDate?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharges: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  accountId?: string;
  status: InvoiceStatus;
  notes?: string;
  createdByName: string;
  voidedAt?: string;
  voidReason?: string;
  voidedByName?: string;
  createdAt: string;
}

export interface SaleReturn {
  id: string;
  returnNo: string;
  invoiceId: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    qty: number;
    unitPrice: number;
    total: number;
    restock: boolean;
    reason: string;
  }[];
  refundAmount: number;
  refundMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export type OrderProductionStage = 
  | 'order_received' 
  | 'design_approved' 
  | 'material_required' 
  | 'production_started' 
  | 'under_manufacturing' 
  | 'polishing_upholstery' 
  | 'quality_check' 
  | 'ready' 
  | 'delivered';

export interface StageHistoryItem {
  stage: OrderProductionStage;
  timestamp: string;
  userName: string;
  notes?: string;
}

export interface IssuedMaterial {
  rawMaterialId: string;
  name: string;
  category: RawMaterialCategory;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  dateIssued: string;
}

export interface AllocatedLabour {
  employeeId: string;
  employeeName: string;
  task: string;
  hours: number;
  cost: number;
  date: string;
}

export interface DeliveryDetails {
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  city: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNo?: string;
  deliveryCharges: number;
  status: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Returned';
  expectedDate?: string;
  deliveredDate?: string;
  proofImageUrl?: string;
  notes?: string;
}

export interface CustomOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  itemType: string;
  dimensions: Dimensions;
  woodType: string;
  fabricType?: string;
  polishColor?: string;
  specifications: string;
  referenceImages: string[];
  
  // Costing
  estimatedCost: number;
  actualMaterialCost: number;
  actualLabourCost: number;
  actualOtherCost: number;
  totalActualCost: number;
  
  finalPrice: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending';
  
  orderDate: string;
  expectedDeliveryDate: string;
  completionDate?: string;
  
  currentStage: OrderProductionStage;
  stageHistory: StageHistoryItem[];
  
  materialsIssued: IssuedMaterial[];
  labourAllocated: AllocatedLabour[];
  
  delivery: DeliveryDetails;
  
  assignedCarpenterId?: string;
  assignedCarpenterName?: string;
  notes?: string;
  createdAt: string;
}

export type EmployeeRole = 'Carpenter' | 'Polisher' | 'Upholsterer' | 'Helper' | 'Supervisor' | 'Driver';
export type SalaryType = 'Monthly' | 'Daily' | 'Hourly' | 'Per-task';

export interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  fatherName?: string;
  cnic: string;
  phone: string;
  address: string;
  role: EmployeeRole;
  salaryType: SalaryType;
  basicSalary: number;
  ratePerHour?: number;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  currentAdvancesBalance: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeHours: number;
  notes?: string;
}

export interface EmployeeAdvance {
  id: string;
  advanceNo: string;
  employeeId: string;
  employeeName: string;
  date: string;
  amount: number;
  deductedAmount: number;
  remainingAmount: number;
  reason: string;
  status: 'Active' | 'Partially Deducted' | 'Cleared';
}

export interface SalaryPayment {
  id: string;
  salaryNo: string;
  employeeId: string;
  employeeName: string;
  monthYear: string; // e.g. "Sep 2026"
  basicSalary: number;
  presentDays: number;
  overtimeHours: number;
  overtimePay: number;
  bonus: number;
  advanceDeduction: number;
  otherDeduction: number;
  netSalary: number;
  paidDate: string;
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName: string;
  status: 'Paid' | 'Pending';
  notes?: string;
}

export type ExpenseCategory = 
  | 'Electricity' 
  | 'Rent' 
  | 'Transport' 
  | 'Fuel' 
  | 'Labour' 
  | 'Workshop' 
  | 'Maintenance' 
  | 'Packaging' 
  | 'Delivery' 
  | 'Marketing'
  | 'Tea & Refreshment'
  | 'Misc';

export interface Expense {
  id: string;
  expenseNo: string;
  date: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName: string;
  paidBy: string;
  receiptImage?: string;
  notes?: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  approvedBy?: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Mobile Wallet';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  isDefault?: boolean;
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  sourceModule: 'POS Sale' | 'Customer Payment' | 'Supplier Payment' | 'Expense' | 'Salary' | 'Custom Order Advance' | 'Transfer' | 'Manual';
  referenceNo: string;
  accountId: string;
  accountName: string;
  description: string;
  runningBalance: number;
  recordedBy: string;
}

export interface StockMovement {
  id: string;
  date: string;
  itemType: 'product' | 'raw_material';
  itemId: string;
  itemName: string;
  sku: string;
  movementType: 'sale' | 'purchase' | 'return' | 'order_issue' | 'adjustment' | 'initial';
  qtyChange: number; // positive or negative
  previousStock: number;
  newStock: number;
  referenceNo: string;
  userName: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  itemType: 'product' | 'raw_material';
  itemId: string;
  itemName: string;
  adjustmentType: 'damage' | 'loss' | 'correction' | 'theft' | 'sample';
  qtyChange: number; // negative for reduction, positive for addition
  previousStock: number;
  newStock: number;
  reason: string;
  userName: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'low_stock' | 'payment_due' | 'order_ready' | 'supplier_due' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  module: string;
  action: 'CREATE' | 'UPDATE' | 'VOID' | 'DELETE' | 'APPROVE' | 'LOGIN';
  details: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
}

export interface BusinessSettings {
  storeName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  ntnStrn?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  invoicePrefix: string;
  orderPrefix: string;
  purchasePrefix: string;
  lowStockThresholdDefault: number;
  enableWhatsappReminders: boolean;
  enableSmsReminders: boolean;
  enableEmailReminders: boolean;
  reminderDaysBeforeDue: number;
  reminderTemplateWhatsapp: string;
  reminderTemplateSms: string;
  thermalReceiptHeader: string;
  thermalReceiptFooter: string;
  termsAndConditions: string;
}
