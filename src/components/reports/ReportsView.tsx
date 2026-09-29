import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate } from '../../utils/formatters';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar,
  Layers
} from 'lucide-react';

type ReportType = 'sales' | 'purchases' | 'inventory' | 'receivables' | 'expenses' | 'production';

export const ReportsView: React.FC = () => {
  const { 
    invoices, 
    purchases, 
    products, 
    rawMaterials, 
    customers, 
    expenses, 
    customOrders,
    settings 
  } = useStore();

  const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-30');

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `StoreFlow_${selectedReport}_Report_${Date.now()}.csv`;

    if (selectedReport === 'sales') {
      headers = ['Invoice No', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Grand Total', 'Paid', 'Balance', 'Status'];
      rows = invoices.map(i => [
        i.invoiceNo,
        i.date,
        `"${i.customerName}"`,
        `"${i.customerPhone}"`,
        i.items.length,
        i.grandTotal,
        i.paidAmount,
        i.balanceDue,
        i.status
      ]);
    } else if (selectedReport === 'inventory') {
      headers = ['Item Name', 'SKU', 'Category', 'Current Stock', 'Unit', 'Purchase Cost', 'Sale Price', 'Total Valuation'];
      rows = products.map(p => [
        `"${p.name}"`,
        p.sku,
        p.category,
        p.currentStock,
        p.unit,
        p.purchaseCost,
        p.salePrice,
        p.currentStock * p.purchaseCost
      ]);
    } else if (selectedReport === 'expenses') {
      headers = ['Voucher No', 'Date', 'Category', 'Title', 'Paid By', 'Amount', 'Payment Method', 'Approval'];
      rows = expenses.map(e => [
        e.expenseNo,
        e.date,
        e.category,
        `"${e.title}"`,
        `"${e.paidBy}"`,
        e.amount,
        e.paymentMethod,
        e.approvalStatus
      ]);
    } else if (selectedReport === 'receivables') {
      headers = ['Customer ID', 'Client Name', 'Phone', 'Type', 'Credit Limit', 'Total Purchases', 'Total Paid', 'Outstanding Balance'];
      rows = customers.map(c => [
        c.customerNo,
        `"${c.name}"`,
        `"${c.phone}"`,
        c.type,
        c.creditLimit,
        c.totalPurchases,
        c.totalPaid,
        c.currentBalance
      ]);
    } else if (selectedReport === 'purchases') {
      headers = ['Purchase Bill No', 'Date', 'Supplier', 'Grand Total', 'Paid', 'Payable Due', 'Status'];
      rows = purchases.map(p => [
        p.purchaseNo,
        p.date,
        `"${p.supplierName}"`,
        p.grandTotal,
        p.paidAmount,
        p.balanceDue,
        p.status
      ]);
    } else if (selectedReport === 'production') {
      headers = ['Order No', 'Client', 'Description', 'Dimensions', 'Final Price', 'Advance', 'Stage', 'Target Delivery'];
      rows = customOrders.map(o => [
        o.orderNo,
        `"${o.customerName}"`,
        `"${o.itemType}"`,
        `"${o.dimensions.length}x${o.dimensions.width}x${o.dimensions.height}"`,
        o.finalPrice,
        o.advancePaid,
        o.currentStage,
        o.expectedDeliveryDate
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Reports & Analytics Hub
          </h1>
          <p className="text-xs text-stone-500">
            Export audit-ready Excel/CSV statements and formatted PDF summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV / Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'sales', label: 'Sales & POS Invoices' },
          { id: 'purchases', label: 'Supplier Purchases' },
          { id: 'inventory', label: 'Inventory Valuation' },
          { id: 'receivables', label: 'Customer Receivables' },
          { id: 'expenses', label: 'Operating Expenses' },
          { id: 'production', label: 'Custom Orders & Jobs' }
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedReport === r.id 
                ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                : 'bg-white dark:bg-[#1E1A15] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Date Range Toolbar */}
      <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-stone-700 dark:text-stone-300">Date Range:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border"
          />
          <span className="text-stone-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border"
          />
        </div>

        <span className="text-stone-400">
          Generated for <span className="font-bold text-stone-800 dark:text-stone-200">{settings.storeName}</span>
        </span>
      </div>

      {/* Report Data Preview Table */}
      <div id="printable-invoice" className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          {selectedReport === 'sales' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Paid Amount</th>
                  <th className="p-3">Balance Due</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="p-3 font-mono font-bold text-[#8B5A2B]">{inv.invoiceNo}</td>
                    <td className="p-3 text-stone-500">{formatDate(inv.date)}</td>
                    <td className="p-3 font-semibold">{inv.customerName}</td>
                    <td className="p-3">{inv.paymentMethod}</td>
                    <td className="p-3 font-bold tabular-nums">{formatPKR(inv.grandTotal)}</td>
                    <td className="p-3 font-bold text-emerald-600 tabular-nums">{formatPKR(inv.paidAmount)}</td>
                    <td className="p-3 font-bold text-rose-600 tabular-nums">{formatPKR(inv.balanceDue)}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800">{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'inventory' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Cost Price</th>
                  <th className="p-3">Retail Price</th>
                  <th className="p-3 font-bold">Stock Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3 font-mono">{p.sku}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 font-bold">{p.currentStock} {p.unit}</td>
                    <td className="p-3 tabular-nums">{formatPKR(p.purchaseCost)}</td>
                    <td className="p-3 tabular-nums">{formatPKR(p.salePrice)}</td>
                    <td className="p-3 font-extrabold text-[#8B5A2B] tabular-nums">{formatPKR(p.currentStock * p.purchaseCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'expenses' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Voucher #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Paid By</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td className="p-3 font-mono font-bold text-[#8B5A2B]">{e.expenseNo}</td>
                    <td className="p-3 text-stone-500">{formatDate(e.date)}</td>
                    <td className="p-3 font-medium">{e.category}</td>
                    <td className="p-3 font-semibold">{e.title}</td>
                    <td className="p-3 text-stone-500">{e.paidBy}</td>
                    <td className="p-3 font-bold text-rose-600 tabular-nums">{formatPKR(e.amount)}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{e.approvalStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'receivables' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Client Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Total Purchases</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3 font-bold">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="p-3 font-mono font-bold text-[#8B5A2B]">{c.customerNo}</td>
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td className="p-3 font-mono">{c.phone}</td>
                    <td className="p-3">{c.type}</td>
                    <td className="p-3 font-bold tabular-nums">{formatPKR(c.totalPurchases)}</td>
                    <td className="p-3 font-bold text-emerald-600 tabular-nums">{formatPKR(c.totalPaid)}</td>
                    <td className="p-3 font-black text-rose-600 tabular-nums">{formatPKR(c.currentBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
