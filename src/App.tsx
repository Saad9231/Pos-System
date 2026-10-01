import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsCatalogView } from './components/products/ProductsCatalogView';
import { CategoriesView } from './components/products/CategoriesView';
import { RawMaterialsView } from './components/products/RawMaterialsView';
import { POSCounterView } from './components/pos/POSCounterView';
import { InvoicesView } from './components/sales/InvoicesView';
import { CustomOrdersView } from './components/orders/CustomOrdersView';
import { DeliveryView } from './components/orders/DeliveryView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { SuppliersView } from './components/purchases/SuppliersView';
import { CustomersView } from './components/customers/CustomersView';
import { PendingReceivablesView } from './components/customers/PendingReceivablesView';
import { LabourView } from './components/labour/LabourView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { FinanceView } from './components/finance/FinanceView';
import { ProfitLossView } from './components/finance/ProfitLossView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';
import { FAQsView } from './components/public/FAQsView';
import { NotFoundView } from './components/public/NotFoundView';

import { LoginView } from './components/auth/LoginView';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, language } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || activeTab === 'login') {
    return <LoginView onSuccess={() => setActiveTab('dashboard')} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'catalog':
        return <ProductsCatalogView />;
      case 'categories':
        return <CategoriesView />;
      case 'rawMaterials':
        return <RawMaterialsView />;
      case 'pos':
        return <POSCounterView />;
      case 'invoices':
      case 'salesReturns':
        return <InvoicesView />;
      case 'customOrders':
        return <CustomOrdersView />;
      case 'delivery':
        return <DeliveryView />;
      case 'purchases':
        return <PurchasesView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'customers':
        return <CustomersView />;
      case 'pendingPayments':
        return <PendingReceivablesView />;
      case 'employees':
      case 'attendance':
      case 'salaries':
        return <LabourView />;
      case 'expenses':
        return <ExpensesView />;
      case 'cashBook':
        return <FinanceView />;
      case 'profitLoss':
        return <ProfitLossView />;
      case 'reports':
        return <ReportsView />;
      case 'auditLogs':
        return <AuditLogsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'faqs':
        return <FAQsView />;
      case 'barcode':
      case 'stockAdjustments':
        return <ProductsCatalogView />;
      case '404':
      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="animated-furniture-bg min-h-screen text-[#1F1A14] dark:text-[#F3EDE4] flex flex-col font-sans relative overflow-x-hidden">
      <div className="ambient-glow-1 pointer-events-none" />
      <div className="ambient-glow-2 pointer-events-none" />

      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-w-0 transition-all duration-200">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="lg:ml-64 border-t border-[#E6DED2] dark:border-[#332C24] bg-white/60 dark:bg-[#1E1A15]/60 py-4 px-6 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
          <span>© 2026 StoreFlow Furniture Management ERP. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <button onClick={() => setActiveTab('privacy')} className="hover:text-[#8B5A2B] hover:underline">
            Privacy Policy
          </button>
          <span className="hidden sm:inline">·</span>
          <button onClick={() => setActiveTab('faqs')} className="hover:text-[#8B5A2B] hover:underline">
            FAQs & Guide
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400 mt-2 sm:mt-0">
          <span>Currency: PKR (Rs.)</span>
          <span>·</span>
          <span>Asia/Karachi UTC+5</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
