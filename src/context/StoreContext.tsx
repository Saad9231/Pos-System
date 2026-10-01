import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Product, 
  RawMaterial, 
  Customer, 
  Supplier, 
  SaleInvoice, 
  CustomOrder, 
  Employee, 
  AttendanceRecord, 
  EmployeeAdvance, 
  Expense, 
  BankAccount, 
  StockMovement, 
  NotificationItem, 
  AuditLogItem, 
  BusinessSettings,
  Purchase,
  PaymentMethod,
  OrderProductionStage,
  SaleItem,
  RawMaterialCategory
} from '../types';

import { 
  initialSettings, 
  initialProducts, 
  initialRawMaterials, 
  initialCustomers, 
  initialSuppliers, 
  initialInvoices, 
  initialCustomOrders, 
  initialEmployees, 
  initialAttendance, 
  initialAdvances, 
  initialExpenses, 
  initialBankAccounts, 
  initialPurchases, 
  initialNotifications, 
  initialAuditLogs, 
  initialStockMovements 
} from '../data/initialData';

import { Language } from '../i18n/translations';

interface StoreContextType {
  // Auth & System
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductIdForView: string | null;
  setSelectedProductIdForView: (id: string | null) => void;
  selectedCustomerIdForView: string | null;
  setSelectedCustomerIdForView: (id: string | null) => void;
  selectedOrderIdForView: string | null;
  setSelectedOrderIdForView: (id: string | null) => void;
  
  // Data
  settings: BusinessSettings;
  products: Product[];
  rawMaterials: RawMaterial[];
  customers: Customer[];
  suppliers: Supplier[];
  invoices: SaleInvoice[];
  customOrders: CustomOrder[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  advances: EmployeeAdvance[];
  expenses: Expense[];
  accounts: BankAccount[];
  purchases: Purchase[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  stockMovements: StockMovement[];
  
  // Mutations & Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addRawMaterial: (material: Omit<RawMaterial, 'id' | 'updatedAt'>) => void;
  updateRawMaterial: (id: string, material: Partial<RawMaterial>) => void;
  
  adjustStock: (
    itemId: string, 
    itemType: 'product' | 'raw_material', 
    adjustmentType: 'damage' | 'loss' | 'correction' | 'theft' | 'sample', 
    qtyChange: number, 
    reason: string
  ) => void;
  
  createSaleInvoice: (invoiceData: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    shippingCharges: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    accountId?: string;
    dueDate?: string;
    notes?: string;
  }) => SaleInvoice;
  
  voidInvoice: (invoiceId: string, reason: string) => void;
  
  recordCustomerPayment: (payment: {
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    accountId: string;
    invoiceId?: string;
    notes?: string;
  }) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'customerNo' | 'totalPurchases' | 'totalPaid' | 'currentBalance' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'supplierNo' | 'currentBalance' | 'totalPurchases' | 'totalPaid' | 'createdAt'>) => Supplier;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  
  createPurchase: (purchaseData: {
    supplierId: string;
    supplierName: string;
    dueDate?: string;
    items: any[];
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    accountId?: string;
    notes?: string;
  }) => Purchase;
  
  recordSupplierPayment: (payment: {
    supplierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    accountId: string;
    purchaseId?: string;
    notes?: string;
  }) => void;
  
  createCustomOrder: (order: any) => CustomOrder;
  updateOrderStatus: (orderId: string, newStage: OrderProductionStage, notes?: string) => void;
  issueMaterialToOrder: (orderId: string, rawMaterialId: string, quantity: number) => void;
  allocateLabourToOrder: (orderId: string, employeeId: string, task: string, hours: number, cost: number) => void;
  updateOrderDelivery: (orderId: string, deliveryData: any) => void;
  
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeNo' | 'currentAdvancesBalance'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  markAttendance: (records: AttendanceRecord[]) => void;
  issueEmployeeAdvance: (advance: { employeeId: string; amount: number; reason: string; accountId: string }) => void;
  
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNo' | 'createdAt'>) => void;
  approveExpense: (expenseId: string) => void;
  
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  transferFunds: (fromAccountId: string, toAccountId: string, amount: number, notes: string) => void;
  
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  resetToDemoData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_PREFIX = 'storeflow_data_v1_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load helpers
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadState('authenticated', false));
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Muhammad Salman Sheikh',
    email: 'salman@storeflow.pk',
    role: 'owner',
    phone: '+92 300 1234567'
  });

  const [language, setLanguage] = useState<Language>(() => loadState('lang', 'en'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadState('dark_mode', false));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [selectedProductIdForView, setSelectedProductIdForView] = useState<string | null>(null);
  const [selectedCustomerIdForView, setSelectedCustomerIdForView] = useState<string | null>(null);
  const [selectedOrderIdForView, setSelectedOrderIdForView] = useState<string | null>(null);

  // Business entities
  const [settings, setSettings] = useState<BusinessSettings>(() => loadState('settings', initialSettings));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', initialProducts));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => loadState('raw_materials', initialRawMaterials));
  const [customers, setCustomers] = useState<Customer[]>(() => loadState('customers', initialCustomers));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadState('suppliers', initialSuppliers));
  const [invoices, setInvoices] = useState<SaleInvoice[]>(() => loadState('invoices', initialInvoices));
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => loadState('custom_orders', initialCustomOrders));
  const [employees, setEmployees] = useState<Employee[]>(() => loadState('employees', initialEmployees));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadState('attendance', initialAttendance));
  const [advances, setAdvances] = useState<EmployeeAdvance[]>(() => loadState('advances', initialAdvances));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadState('expenses', initialExpenses));
  const [accounts, setAccounts] = useState<BankAccount[]>(() => loadState('accounts', initialBankAccounts));
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadState('purchases', initialPurchases));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', initialNotifications));
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => loadState('audit_logs', initialAuditLogs));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => loadState('stock_movements', initialStockMovements));

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'lang', JSON.stringify(language));
    document.documentElement.setAttribute('dir', language === 'ur' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'raw_materials', JSON.stringify(rawMaterials)); }, [rawMaterials]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'custom_orders', JSON.stringify(customOrders)); }, [customOrders]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'advances', JSON.stringify(advances)); }, [advances]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'stock_movements', JSON.stringify(stockMovements)); }, [stockMovements]);

  // Auth Operations
  const login = (email: string, password?: string, role?: UserRole): boolean => {
    const roleNames: Record<UserRole, string> = {
      owner: 'Muhammad Salman Sheikh (Owner)',
      manager: 'Hamza Tariq (Store Manager)',
      accountant: 'Noman Siddiqui (Chief Accountant)',
      cashier: 'Bilal Cashier (POS)',
      production_manager: 'Ustad Aslam (Production Lead)',
      store_keeper: 'Rashid Khan (Inventory Keeper)'
    };
    
    const assignedRole = role || 'owner';
    const userName = roleNames[assignedRole] || email.split('@')[0];

    setCurrentUser({
      id: 'usr-' + Date.now(),
      name: userName,
      email,
      role: assignedRole,
      phone: '+92 300 1234567'
    });
    setIsAuthenticated(true);
    addAuditLog('LOGIN', 'Authentication', `User ${userName} (${email}) logged in successfully as ${assignedRole}`);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    addAuditLog('LOGIN', 'Authentication', `User ${currentUser.name} logged out`);
  };

  // Role Switcher
  const switchRole = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      owner: 'Muhammad Salman Sheikh (Owner)',
      manager: 'Hamza Tariq (Store Manager)',
      accountant: 'Noman Siddiqui (Chief Accountant)',
      cashier: 'Bilal Cashier (POS)',
      production_manager: 'Ustad Aslam (Production Lead)',
      store_keeper: 'Rashid Khan (Inventory Keeper)'
    };
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: roleNames[role]
    }));
    addAuditLog('LOGIN', 'Authentication', `Switched active profile role to ${role}`);
  };

  const addAuditLog = (action: AuditLogItem['action'], module: string, details: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLogItem = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      userName: currentUser.name,
      userRole: currentUser.role,
      module,
      action,
      details,
      oldValue,
      newValue,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = 'prod-' + (products.length + 1) + '-' + Date.now().toString().slice(-4);
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    
    // Add initial stock movement if > 0
    if (newProduct.currentStock > 0) {
      const movement: StockMovement = {
        id: 'mv-' + Date.now(),
        date: new Date().toISOString(),
        itemType: 'product',
        itemId: newId,
        itemName: newProduct.name,
        sku: newProduct.sku,
        movementType: 'initial',
        qtyChange: newProduct.currentStock,
        previousStock: 0,
        newStock: newProduct.currentStock,
        referenceNo: 'OPENING-STOCK',
        userName: currentUser.name,
        notes: 'Initial product stock creation'
      };
      setStockMovements(prev => [movement, ...prev]);
    }
    
    addAuditLog('CREATE', 'Products', `Created new product ${newProduct.name} (${newProduct.sku})`);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
        return updated;
      }
      return p;
    }));
    addAuditLog('UPDATE', 'Products', `Updated product details for ID: ${id}`);
  };

  const deleteProduct = (id: string) => {
    const p = products.find(x => x.id === id);
    setProducts(prev => prev.filter(x => x.id !== id));
    addAuditLog('DELETE', 'Products', `Deleted product ${p?.name || id}`);
  };

  // Raw Materials CRUD
  const addRawMaterial = (matData: Omit<RawMaterial, 'id' | 'updatedAt'>) => {
    const newId = 'raw-' + (rawMaterials.length + 1) + '-' + Date.now().toString().slice(-4);
    const newMaterial: RawMaterial = {
      ...matData,
      id: newId,
      updatedAt: new Date().toISOString()
    };
    setRawMaterials(prev => [newMaterial, ...prev]);
    addAuditLog('CREATE', 'Raw Materials', `Added raw material ${newMaterial.name}`);
  };

  const updateRawMaterial = (id: string, fields: Partial<RawMaterial>) => {
    setRawMaterials(prev => prev.map(m => m.id === id ? { ...m, ...fields, updatedAt: new Date().toISOString() } : m));
    addAuditLog('UPDATE', 'Raw Materials', `Updated raw material ID: ${id}`);
  };

  // Stock Adjustment (Damage, Loss, Correction, Theft)
  const adjustStock = (
    itemId: string,
    itemType: 'product' | 'raw_material',
    adjustmentType: 'damage' | 'loss' | 'correction' | 'theft' | 'sample',
    qtyChange: number,
    reason: string
  ) => {
    if (itemType === 'product') {
      const prod = products.find(p => p.id === itemId);
      if (!prod) return;
      const prevStock = prod.currentStock;
      const newStock = Math.max(0, prevStock + qtyChange);
      
      setProducts(prev => prev.map(p => p.id === itemId ? { ...p, currentStock: newStock, updatedAt: new Date().toISOString() } : p));
      
      const movement: StockMovement = {
        id: 'mv-' + Date.now(),
        date: new Date().toISOString(),
        itemType: 'product',
        itemId,
        itemName: prod.name,
        sku: prod.sku,
        movementType: 'adjustment',
        qtyChange,
        previousStock: prevStock,
        newStock,
        referenceNo: `ADJ-${adjustmentType.toUpperCase()}`,
        userName: currentUser.name,
        notes: reason
      };
      setStockMovements(prev => [movement, ...prev]);
      
      if (newStock <= prod.minStock) {
        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          type: 'low_stock',
          title: `Low Stock: ${prod.name}`,
          message: `Stock adjusted. Current level (${newStock}) is at or below threshold (${prod.minStock}).`,
          link: '/products',
          read: false,
          priority: 'high',
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [notif, ...prev]);
      }
    } else {
      const raw = rawMaterials.find(m => m.id === itemId);
      if (!raw) return;
      const prevStock = raw.currentStock;
      const newStock = Math.max(0, prevStock + qtyChange);
      
      setRawMaterials(prev => prev.map(m => m.id === itemId ? { ...m, currentStock: newStock, updatedAt: new Date().toISOString() } : m));
      
      const movement: StockMovement = {
        id: 'mv-' + Date.now(),
        date: new Date().toISOString(),
        itemType: 'raw_material',
        itemId,
        itemName: raw.name,
        sku: raw.sku,
        movementType: 'adjustment',
        qtyChange,
        previousStock: prevStock,
        newStock,
        referenceNo: `ADJ-${adjustmentType.toUpperCase()}`,
        userName: currentUser.name,
        notes: reason
      };
      setStockMovements(prev => [movement, ...prev]);
    }
    
    addAuditLog('UPDATE', 'Stock Adjustment', `Adjusted stock for ${itemId} by ${qtyChange} (${adjustmentType}: ${reason})`);
  };

  // POS & Sales Transaction
  const createSaleInvoice = (data: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    shippingCharges: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    accountId?: string;
    dueDate?: string;
    notes?: string;
  }): SaleInvoice => {
    const invCount = invoices.length + 101;
    const invNo = `${settings.invoicePrefix}${invCount.toString().padStart(5, '0')}`;
    const balanceDue = Math.max(0, data.grandTotal - data.paidAmount);
    
    const status: SaleInvoice['status'] = balanceDue <= 0 ? 'Paid' : data.paidAmount > 0 ? 'Partially Paid' : 'Pending';
    
    const newInvoice: SaleInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNo: invNo,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      date: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      shippingCharges: data.shippingCharges,
      grandTotal: data.grandTotal,
      paidAmount: data.paidAmount,
      balanceDue,
      paymentMethod: data.paymentMethod,
      accountId: data.accountId || accounts[0]?.id,
      status,
      notes: data.notes,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    // 1. Atomically deduct stock and record stock movements
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      const newMovements: StockMovement[] = [];

      data.items.forEach(item => {
        const idx = updated.findIndex(p => p.id === item.productId);
        if (idx !== -1) {
          const currentProd = updated[idx];
          const prevStock = currentProd.currentStock;
          const nextStock = Math.max(0, prevStock - item.quantity);
          
          updated[idx] = {
            ...currentProd,
            currentStock: nextStock,
            updatedAt: new Date().toISOString()
          };

          newMovements.push({
            id: 'mv-' + Date.now() + '-' + item.productId,
            date: new Date().toISOString(),
            itemType: 'product',
            itemId: item.productId,
            itemName: item.productName,
            sku: item.sku,
            movementType: 'sale',
            qtyChange: -item.quantity,
            previousStock: prevStock,
            newStock: nextStock,
            referenceNo: invNo,
            userName: currentUser.name,
            notes: `POS Sale to ${data.customerName}`
          });

          // Check low stock trigger
          if (nextStock <= currentProd.minStock) {
            setNotifications(prev => [
              {
                id: 'notif-' + Date.now() + '-' + item.productId,
                type: 'low_stock',
                title: `Low Stock: ${currentProd.name}`,
                message: `Current stock is ${nextStock} ${currentProd.unit}. Reorder soon!`,
                link: '/products',
                read: false,
                priority: 'high',
                createdAt: new Date().toISOString()
              },
              ...prev
            ]);
          }
        }
      });

      setStockMovements(prev => [...newMovements, ...prev]);
      return updated;
    });

    // 2. Update Customer Balances
    if (data.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === data.customerId) {
          return {
            ...c,
            totalPurchases: c.totalPurchases + data.grandTotal,
            totalPaid: c.totalPaid + data.paidAmount,
            currentBalance: c.currentBalance + balanceDue,
            lastPaymentDate: data.paidAmount > 0 ? new Date().toISOString().split('T')[0] : c.lastPaymentDate
          };
        }
        return c;
      }));
    }

    // 3. Update Bank/Cash Account Balance if paid amount > 0
    if (data.paidAmount > 0 && data.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === data.accountId) {
          return { ...acc, balance: acc.balance + data.paidAmount };
        }
        return acc;
      }));
    }

    // 4. Append Invoice
    setInvoices(prev => [newInvoice, ...prev]);

    // 5. Add Audit Log
    addAuditLog('CREATE', 'Sales & POS', `Issued Invoice ${invNo} for ${data.customerName} - Total: Rs. ${data.grandTotal}, Paid: Rs. ${data.paidAmount}`);

    return newInvoice;
  };

  // Void Invoice
  const voidInvoice = (invoiceId: string, reason: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv || inv.status === 'Voided') return;

    // 1. Restock products
    setProducts(prev => {
      const updated = [...prev];
      inv.items.forEach(item => {
        const idx = updated.findIndex(p => p.id === item.productId);
        if (idx !== -1) {
          const prod = updated[idx];
          const prevStock = prod.currentStock;
          const nextStock = prevStock + item.quantity;
          updated[idx] = { ...prod, currentStock: nextStock };

          setStockMovements(prevMov => [
            {
              id: 'mv-' + Date.now() + '-' + item.productId,
              date: new Date().toISOString(),
              itemType: 'product',
              itemId: item.productId,
              itemName: item.productName,
              sku: item.sku,
              movementType: 'return',
              qtyChange: item.quantity,
              previousStock: prevStock,
              newStock: nextStock,
              referenceNo: `VOID-${inv.invoiceNo}`,
              userName: currentUser.name,
              notes: `Void invoice restock: ${reason}`
            },
            ...prevMov
          ]);
        }
      });
      return updated;
    });

    // 2. Reverse customer receivable
    if (inv.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === inv.customerId) {
          return {
            ...c,
            totalPurchases: Math.max(0, c.totalPurchases - inv.grandTotal),
            totalPaid: Math.max(0, c.totalPaid - inv.paidAmount),
            currentBalance: Math.max(0, c.currentBalance - inv.balanceDue)
          };
        }
        return c;
      }));
    }

    // 3. Reverse account if payment was recorded
    if (inv.paidAmount > 0 && inv.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === inv.accountId) {
          return { ...acc, balance: Math.max(0, acc.balance - inv.paidAmount) };
        }
        return acc;
      }));
    }

    // 4. Mark invoice voided
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          status: 'Voided',
          voidedAt: new Date().toISOString(),
          voidReason: reason,
          voidedByName: currentUser.name
        };
      }
      return i;
    }));

    addAuditLog('VOID', 'Sales & POS', `Voided invoice ${inv.invoiceNo}. Reason: ${reason}`);
  };

  // Customer Payment
  const recordCustomerPayment = (data: {
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    accountId: string;
    invoiceId?: string;
    notes?: string;
  }) => {
    const cust = customers.find(c => c.id === data.customerId);
    if (!cust) return;

    // 1. Update customer balance
    setCustomers(prev => prev.map(c => {
      if (c.id === data.customerId) {
        return {
          ...c,
          totalPaid: c.totalPaid + data.amount,
          currentBalance: Math.max(0, c.currentBalance - data.amount),
          lastPaymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));

    // 2. Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === data.accountId) {
        return { ...acc, balance: acc.balance + data.amount };
      }
      return acc;
    }));

    // 3. Update invoice if specified
    if (data.invoiceId) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === data.invoiceId) {
          const newPaid = inv.paidAmount + data.amount;
          const newBalance = Math.max(0, inv.grandTotal - newPaid);
          const newStatus: SaleInvoice['status'] = newBalance === 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: newStatus
          };
        }
        return inv;
      }));
    }

    addAuditLog('CREATE', 'Finance & Collections', `Received payment of Rs. ${data.amount} from ${cust.name} via ${data.paymentMethod}`);
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id' | 'customerNo' | 'totalPurchases' | 'totalPaid' | 'currentBalance' | 'createdAt'>): Customer => {
    const count = customers.length + 1;
    const newCust: Customer = {
      ...customerData,
      id: 'cust-' + Date.now(),
      customerNo: `CUST-${count.toString().padStart(3, '0')}`,
      totalPurchases: 0,
      totalPaid: 0,
      currentBalance: customerData.openingBalance || 0,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog('CREATE', 'Customers', `Added new customer ${newCust.name} (${newCust.phone})`);
    return newCust;
  };

  const updateCustomer = (id: string, fields: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
    addAuditLog('UPDATE', 'Customers', `Updated customer profile ${id}`);
  };

  // Supplier Management & Purchases
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'supplierNo' | 'currentBalance' | 'totalPurchases' | 'totalPaid' | 'createdAt'>): Supplier => {
    const count = suppliers.length + 1;
    const newSup: Supplier = {
      ...supplierData,
      id: 'sup-' + Date.now(),
      supplierNo: `SUP-${count.toString().padStart(3, '0')}`,
      currentBalance: 0,
      totalPurchases: 0,
      totalPaid: 0,
      createdAt: new Date().toISOString()
    };
    setSuppliers(prev => [newSup, ...prev]);
    addAuditLog('CREATE', 'Suppliers', `Added new vendor ${newSup.companyName}`);
    return newSup;
  };

  const updateSupplier = (id: string, fields: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
    addAuditLog('UPDATE', 'Suppliers', `Updated supplier ${id}`);
  };

  const createPurchase = (data: {
    supplierId: string;
    supplierName: string;
    dueDate?: string;
    items: any[];
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    accountId?: string;
    notes?: string;
  }): Purchase => {
    const count = purchases.length + 55;
    const purNo = `${settings.purchasePrefix}${count.toString().padStart(5, '0')}`;
    const balanceDue = Math.max(0, data.grandTotal - data.paidAmount);

    const newPurchase: Purchase = {
      id: 'pur-' + Date.now(),
      purchaseNo: purNo,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      date: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      grandTotal: data.grandTotal,
      paidAmount: data.paidAmount,
      balanceDue,
      paymentMethod: data.paymentMethod,
      accountId: data.accountId,
      status: 'Received',
      notes: data.notes,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    // 1. Stock In for raw materials or products
    data.items.forEach(item => {
      if (item.itemType === 'raw_material') {
        setRawMaterials(prev => prev.map(m => {
          if (m.id === item.itemId) {
            const nextStock = m.currentStock + item.quantity;
            return { ...m, currentStock: nextStock, unitCost: item.unitPrice, updatedAt: new Date().toISOString() };
          }
          return m;
        }));
      } else {
        setProducts(prev => prev.map(p => {
          if (p.id === item.itemId) {
            const nextStock = p.currentStock + item.quantity;
            return { ...p, currentStock: nextStock, purchaseCost: item.unitPrice, updatedAt: new Date().toISOString() };
          }
          return p;
        }));
      }

      setStockMovements(prev => [
        {
          id: 'mv-' + Date.now() + '-' + item.itemId,
          date: new Date().toISOString(),
          itemType: item.itemType,
          itemId: item.itemId,
          itemName: item.name,
          sku: item.sku || 'N/A',
          movementType: 'purchase',
          qtyChange: item.quantity,
          previousStock: 0,
          newStock: item.quantity,
          referenceNo: purNo,
          userName: currentUser.name,
          notes: `Purchase bill from ${data.supplierName}`
        },
        ...prev
      ]);
    });

    // 2. Update Supplier Balance
    setSuppliers(prev => prev.map(s => {
      if (s.id === data.supplierId) {
        return {
          ...s,
          totalPurchases: s.totalPurchases + data.grandTotal,
          totalPaid: s.totalPaid + data.paidAmount,
          currentBalance: s.currentBalance + balanceDue
        };
      }
      return s;
    }));

    // 3. Deduct Account Balance if paid amount > 0
    if (data.paidAmount > 0 && data.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === data.accountId) {
          return { ...acc, balance: Math.max(0, acc.balance - data.paidAmount) };
        }
        return acc;
      }));
    }

    setPurchases(prev => [newPurchase, ...prev]);
    addAuditLog('CREATE', 'Purchases', `Created Purchase Bill ${purNo} for ${data.supplierName} - Rs. ${data.grandTotal}`);

    return newPurchase;
  };

  const recordSupplierPayment = (data: {
    supplierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    accountId: string;
    purchaseId?: string;
    notes?: string;
  }) => {
    const sup = suppliers.find(s => s.id === data.supplierId);
    if (!sup) return;

    setSuppliers(prev => prev.map(s => {
      if (s.id === data.supplierId) {
        return {
          ...s,
          totalPaid: s.totalPaid + data.amount,
          currentBalance: Math.max(0, s.currentBalance - data.amount)
        };
      }
      return s;
    }));

    setAccounts(prev => prev.map(acc => {
      if (acc.id === data.accountId) {
        return { ...acc, balance: Math.max(0, acc.balance - data.amount) };
      }
      return acc;
    }));

    addAuditLog('CREATE', 'Purchases', `Paid Rs. ${data.amount} to supplier ${sup.companyName} via ${data.paymentMethod}`);
  };

  // Custom Orders & Production Pipeline
  const createCustomOrder = (orderData: any): CustomOrder => {
    const count = customOrders.length + 44;
    const orderNo = `${settings.orderPrefix}${count.toString().padStart(4, '0')}`;
    const advancePaid = Number(orderData.advancePaid) || 0;
    const finalPrice = Number(orderData.finalPrice) || 0;
    const balanceDue = Math.max(0, finalPrice - advancePaid);

    const newOrder: CustomOrder = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNo,
      finalPrice,
      advancePaid,
      balanceDue,
      paymentStatus: balanceDue === 0 ? 'Paid' : advancePaid > 0 ? 'Partially Paid' : 'Pending',
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      currentStage: 'order_received',
      stageHistory: [
        {
          stage: 'order_received',
          timestamp: new Date().toISOString(),
          userName: currentUser.name,
          notes: `Order created. Advance Rs. ${advancePaid} received.`
        }
      ],
      materialsIssued: [],
      labourAllocated: [],
      actualMaterialCost: 0,
      actualLabourCost: 0,
      actualOtherCost: 0,
      totalActualCost: 0,
      delivery: {
        recipientName: orderData.customerName,
        recipientPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress || 'Store Pickup',
        city: 'Lahore',
        deliveryCharges: 0,
        status: 'Pending',
        expectedDate: orderData.expectedDeliveryDate
      },
      createdAt: new Date().toISOString()
    };

    // If advance paid, update bank account and customer ledger
    if (advancePaid > 0) {
      if (orderData.accountId) {
        setAccounts(prev => prev.map(a => a.id === orderData.accountId ? { ...a, balance: a.balance + advancePaid } : a));
      }
      if (orderData.customerId) {
        setCustomers(prev => prev.map(c => c.id === orderData.customerId ? {
          ...c,
          totalPurchases: c.totalPurchases + finalPrice,
          totalPaid: c.totalPaid + advancePaid,
          currentBalance: c.currentBalance + balanceDue
        } : c));
      }
    }

    setCustomOrders(prev => [newOrder, ...prev]);
    addAuditLog('CREATE', 'Custom Orders', `Created Custom Order ${orderNo} for ${orderData.customerName}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStage: OrderProductionStage, notes?: string) => {
    setCustomOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const history = [
          ...ord.stageHistory,
          {
            stage: newStage,
            timestamp: new Date().toISOString(),
            userName: currentUser.name,
            notes: notes || `Stage updated to ${newStage}`
          }
        ];

        if (newStage === 'ready') {
          setNotifications(prevNotif => [
            {
              id: 'notif-' + Date.now(),
              type: 'order_ready',
              title: `Order Ready: ${ord.orderNo}`,
              message: `${ord.itemType} for ${ord.customerName} is ready for delivery.`,
              link: '/orders',
              read: false,
              priority: 'medium',
              createdAt: new Date().toISOString()
            },
            ...prevNotif
          ]);
        }

        return {
          ...ord,
          currentStage: newStage,
          stageHistory: history,
          completionDate: newStage === 'delivered' ? new Date().toISOString().split('T')[0] : ord.completionDate
        };
      }
      return ord;
    }));

    addAuditLog('UPDATE', 'Custom Orders', `Moved Order ${orderId} to stage ${newStage}`);
  };

  const issueMaterialToOrder = (orderId: string, rawMaterialId: string, quantity: number) => {
    const raw = rawMaterials.find(r => r.id === rawMaterialId);
    if (!raw || raw.currentStock < quantity) return;

    const totalCost = quantity * raw.unitCost;

    // Deduct raw material stock
    setRawMaterials(prev => prev.map(m => m.id === rawMaterialId ? { ...m, currentStock: m.currentStock - quantity, updatedAt: new Date().toISOString() } : m));

    // Append to order
    setCustomOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedMaterials = [
          ...ord.materialsIssued,
          {
            rawMaterialId,
            name: raw.name,
            category: raw.category,
            quantity,
            unit: raw.unit,
            unitCost: raw.unitCost,
            totalCost,
            dateIssued: new Date().toISOString().split('T')[0]
          }
        ];
        const newMatCost = ord.actualMaterialCost + totalCost;
        const totalActual = newMatCost + ord.actualLabourCost + ord.actualOtherCost;

        return {
          ...ord,
          materialsIssued: updatedMaterials,
          actualMaterialCost: newMatCost,
          totalActualCost: totalActual
        };
      }
      return ord;
    }));

    // Stock Movement
    setStockMovements(prev => [
      {
        id: 'mv-' + Date.now(),
        date: new Date().toISOString(),
        itemType: 'raw_material',
        itemId: rawMaterialId,
        itemName: raw.name,
        sku: raw.sku,
        movementType: 'order_issue',
        qtyChange: -quantity,
        previousStock: raw.currentStock,
        newStock: raw.currentStock - quantity,
        referenceNo: `ORDER-${orderId}`,
        userName: currentUser.name,
        notes: `Issued to Custom Order ID: ${orderId}`
      },
      ...prev
    ]);

    addAuditLog('UPDATE', 'Custom Orders', `Issued ${quantity} ${raw.unit} of ${raw.name} to order ${orderId}`);
  };

  const allocateLabourToOrder = (orderId: string, employeeId: string, task: string, hours: number, cost: number) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    setCustomOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedLabour = [
          ...ord.labourAllocated,
          {
            employeeId,
            employeeName: emp.name,
            task,
            hours,
            cost,
            date: new Date().toISOString().split('T')[0]
          }
        ];
        const newLabourCost = ord.actualLabourCost + cost;
        const totalActual = ord.actualMaterialCost + newLabourCost + ord.actualOtherCost;

        return {
          ...ord,
          labourAllocated: updatedLabour,
          actualLabourCost: newLabourCost,
          totalActualCost: totalActual
        };
      }
      return ord;
    }));

    addAuditLog('UPDATE', 'Custom Orders', `Allocated ${hours}h labour (${emp.name}) to order ${orderId} - Rs. ${cost}`);
  };

  const updateOrderDelivery = (orderId: string, deliveryData: any) => {
    setCustomOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          delivery: { ...ord.delivery, ...deliveryData }
        };
      }
      return ord;
    }));
    addAuditLog('UPDATE', 'Delivery', `Updated delivery details for Order ${orderId}`);
  };

  // Employees & Attendance
  const addEmployee = (empData: Omit<Employee, 'id' | 'employeeNo' | 'currentAdvancesBalance'>) => {
    const count = employees.length + 1;
    const newEmp: Employee = {
      ...empData,
      id: 'emp-' + Date.now(),
      employeeNo: `EMP-${count.toString().padStart(3, '0')}`,
      currentAdvancesBalance: 0
    };
    setEmployees(prev => [newEmp, ...prev]);
    addAuditLog('CREATE', 'Labour', `Added artisan/staff: ${newEmp.name} (${newEmp.role})`);
  };

  const updateEmployee = (id: string, fields: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e));
    addAuditLog('UPDATE', 'Labour', `Updated employee profile ${id}`);
  };

  const markAttendance = (records: AttendanceRecord[]) => {
    setAttendance(records);
    addAuditLog('UPDATE', 'Labour', `Updated daily attendance for ${records.length} artisans`);
  };

  const issueEmployeeAdvance = (data: { employeeId: string; amount: number; reason: string; accountId: string }) => {
    const emp = employees.find(e => e.id === data.employeeId);
    if (!emp) return;

    // Deduct bank account
    setAccounts(prev => prev.map(acc => acc.id === data.accountId ? { ...acc, balance: Math.max(0, acc.balance - data.amount) } : acc));

    // Increase advance balance
    setEmployees(prev => prev.map(e => e.id === data.employeeId ? { ...e, currentAdvancesBalance: e.currentAdvancesBalance + data.amount } : e));

    const count = advances.length + 21;
    const newAdv: EmployeeAdvance = {
      id: 'adv-' + Date.now(),
      advanceNo: `ADV-${count.toString().padStart(3, '0')}`,
      employeeId: data.employeeId,
      employeeName: emp.name,
      date: new Date().toISOString().split('T')[0],
      amount: data.amount,
      deductedAmount: 0,
      remainingAmount: data.amount,
      reason: data.reason,
      status: 'Active'
    };

    setAdvances(prev => [newAdv, ...prev]);
    addAuditLog('CREATE', 'Labour', `Issued Advance of Rs. ${data.amount} to ${emp.name}. Reason: ${data.reason}`);
  };

  // Expenses CRUD
  const addExpense = (expData: Omit<Expense, 'id' | 'expenseNo' | 'createdAt'>) => {
    const count = expenses.length + 90;
    const expNo = `EXP-2026-${count.toString().padStart(3, '0')}`;

    const newExp: Expense = {
      ...expData,
      id: 'exp-' + Date.now(),
      expenseNo: expNo,
      createdAt: new Date().toISOString()
    };

    if (newExp.approvalStatus === 'Approved' && expData.accountId) {
      setAccounts(prev => prev.map(acc => acc.id === expData.accountId ? { ...acc, balance: Math.max(0, acc.balance - expData.amount) } : acc));
    }

    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('CREATE', 'Expenses', `Recorded expense ${expNo}: ${expData.title} - Rs. ${expData.amount}`);
  };

  const approveExpense = (expenseId: string) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId && exp.approvalStatus === 'Pending') {
        if (exp.accountId) {
          setAccounts(prevAcc => prevAcc.map(acc => acc.id === exp.accountId ? { ...acc, balance: Math.max(0, acc.balance - exp.amount) } : acc));
        }
        return {
          ...exp,
          approvalStatus: 'Approved',
          approvedBy: currentUser.name
        };
      }
      return exp;
    }));

    addAuditLog('APPROVE', 'Expenses', `Approved expense ID: ${expenseId}`);
  };

  // Accounts & Transfers
  const addBankAccount = (accData: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = {
      ...accData,
      id: 'acc-' + Date.now()
    };
    setAccounts(prev => [...prev, newAcc]);
    addAuditLog('CREATE', 'Finance', `Created financial account: ${newAcc.name}`);
  };

  const transferFunds = (fromAccountId: string, toAccountId: string, amount: number, notes: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: Math.max(0, acc.balance - amount) };
      }
      if (acc.id === toAccountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));

    addAuditLog('CREATE', 'Finance', `Transferred Rs. ${amount} between accounts. Notes: ${notes}`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('UPDATE', 'Settings', 'Updated Store Settings and business details');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset & Backup/Restore
  const resetToDemoData = () => {
    setSettings(initialSettings);
    setProducts(initialProducts);
    setRawMaterials(initialRawMaterials);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setInvoices(initialInvoices);
    setCustomOrders(initialCustomOrders);
    setEmployees(initialEmployees);
    setAttendance(initialAttendance);
    setAdvances(initialAdvances);
    setExpenses(initialExpenses);
    setAccounts(initialBankAccounts);
    setPurchases(initialPurchases);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setStockMovements(initialStockMovements);
    localStorage.clear();
    addAuditLog('UPDATE', 'System', 'Reset all system data to fresh factory demo state');
  };

  const exportDatabaseJSON = (): string => {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      products,
      rawMaterials,
      customers,
      suppliers,
      invoices,
      customOrders,
      employees,
      attendance,
      advances,
      expenses,
      accounts,
      purchases,
      notifications,
      auditLogs,
      stockMovements
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && data.customers && data.invoices) {
        if (data.settings) setSettings(data.settings);
        if (data.products) setProducts(data.products);
        if (data.rawMaterials) setRawMaterials(data.rawMaterials);
        if (data.customers) setCustomers(data.customers);
        if (data.suppliers) setSuppliers(data.suppliers);
        if (data.invoices) setInvoices(data.invoices);
        if (data.customOrders) setCustomOrders(data.customOrders);
        if (data.employees) setEmployees(data.employees);
        if (data.attendance) setAttendance(data.attendance);
        if (data.advances) setAdvances(data.advances);
        if (data.expenses) setExpenses(data.expenses);
        if (data.accounts) setAccounts(data.accounts);
        if (data.purchases) setPurchases(data.purchases);
        if (data.notifications) setNotifications(data.notifications);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.stockMovements) setStockMovements(data.stockMovements);
        addAuditLog('UPDATE', 'System', 'Restored system database from JSON backup file');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
      switchRole,
      language,
      setLanguage,
      isDarkMode,
      setIsDarkMode,
      activeTab,
      setActiveTab,
      selectedProductIdForView,
      setSelectedProductIdForView,
      selectedCustomerIdForView,
      setSelectedCustomerIdForView,
      selectedOrderIdForView,
      setSelectedOrderIdForView,
      
      settings,
      products,
      rawMaterials,
      customers,
      suppliers,
      invoices,
      customOrders,
      employees,
      attendance,
      advances,
      expenses,
      accounts,
      purchases,
      notifications,
      auditLogs,
      stockMovements,
      
      addProduct,
      updateProduct,
      deleteProduct,
      addRawMaterial,
      updateRawMaterial,
      adjustStock,
      createSaleInvoice,
      voidInvoice,
      recordCustomerPayment,
      addCustomer,
      updateCustomer,
      addSupplier,
      updateSupplier,
      createPurchase,
      recordSupplierPayment,
      createCustomOrder,
      updateOrderStatus,
      issueMaterialToOrder,
      allocateLabourToOrder,
      updateOrderDelivery,
      addEmployee,
      updateEmployee,
      markAttendance,
      issueEmployeeAdvance,
      addExpense,
      approveExpense,
      addBankAccount,
      transferFunds,
      updateSettings,
      markNotificationRead,
      clearAllNotifications,
      resetToDemoData,
      exportDatabaseJSON,
      importDatabaseJSON
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
