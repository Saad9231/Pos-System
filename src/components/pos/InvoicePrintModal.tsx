import React, { useState } from 'react';
import { SaleInvoice } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate, formatDateTime } from '../../utils/formatters';
import { 
  X, 
  Printer, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  FileText, 
  Receipt,
  Download
} from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: SaleInvoice;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ invoice, onClose }) => {
  const { settings } = useStore();
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = `*${settings.storeName}*\n\n` +
      `*INVOICE RECEIPT:* #${invoice.invoiceNo}\n` +
      `*Date:* ${formatDate(invoice.date)}\n` +
      `*Customer:* ${invoice.customerName}\n\n` +
      `*Items:*\n` +
      invoice.items.map(item => `- ${item.productName} (x${item.quantity}) = ${formatPKR(item.total)}`).join('\n') +
      `\n\n*Grand Total:* ${formatPKR(invoice.grandTotal)}\n` +
      `*Paid:* ${formatPKR(invoice.paidAmount)}\n` +
      `*Balance Due:* ${formatPKR(invoice.balanceDue)}\n\n` +
      `*Payment Status:* ${invoice.status}\n` +
      `_Thank you for choosing ${settings.storeName}!_`;

    const phoneClean = invoice.customerPhone.replace(/[^0-9]/g, '');
    const fullPhone = phoneClean.startsWith('92') ? phoneClean : '92' + phoneClean.replace(/^0/, '');
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Sale Receipt: #{invoice.invoiceNo}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Toggle */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  printFormat === 'thermal' ? 'bg-[#8B5A2B] text-white' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                80mm Thermal
              </button>
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  printFormat === 'a4' ? 'bg-[#8B5A2B] text-white' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                A4 Standard
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 flex-1 bg-stone-100 dark:bg-stone-950 overflow-y-auto flex justify-center">
          {printFormat === 'thermal' ? (
            /* 80mm Thermal POS Receipt Layout */
            <div 
              id="printable-invoice" 
              className="w-80 bg-white text-stone-900 p-4 rounded-xl shadow-card border border-stone-200 font-mono text-xs space-y-3"
            >
              {/* Header */}
              <div className="text-center pb-2 border-b border-dashed border-stone-300">
                <h2 className="font-black text-sm uppercase tracking-wider">{settings.storeName}</h2>
                <p className="text-[10px] text-stone-500 whitespace-pre-line">{settings.thermalReceiptHeader}</p>
                {settings.ntnStrn && <p className="text-[9px] text-stone-500 mt-0.5">{settings.ntnStrn}</p>}
              </div>

              {/* Meta */}
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Invoice #:</span>
                  <span className="font-bold">{invoice.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date/Time:</span>
                  <span>{formatDateTime(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-semibold">{invoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Cashier:</span>
                  <span>{invoice.createdByName}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="pt-2 border-t border-dashed border-stone-300">
                <div className="flex justify-between text-[10px] font-bold uppercase text-stone-500 pb-1 border-b border-stone-200">
                  <span>Item & Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                </div>
                <div className="divide-y divide-stone-100 py-1">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-start text-[11px]">
                      <div className="max-w-[140px]">
                        <div className="font-semibold line-clamp-2">{item.productName}</div>
                        <div className="text-[10px] text-stone-500">
                          {item.quantity} {item.unit} @ {formatPKR(item.unitPrice)}
                        </div>
                      </div>
                      <div className="text-right font-bold tabular-nums">
                        {formatPKR(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-dashed border-stone-300 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal:</span>
                  <span className="tabular-nums">{formatPKR(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span className="tabular-nums">-{formatPKR(invoice.discount)}</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tax:</span>
                    <span className="tabular-nums">+{formatPKR(invoice.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="tabular-nums">{formatPKR(invoice.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Paid ({invoice.paymentMethod}):</span>
                  <span className="tabular-nums">{formatPKR(invoice.paidAmount)}</span>
                </div>
                {invoice.balanceDue > 0 && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Balance Due:</span>
                    <span className="tabular-nums">{formatPKR(invoice.balanceDue)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-3 border-t border-dashed border-stone-300 text-[10px] text-stone-500 whitespace-pre-line leading-relaxed">
                {settings.thermalReceiptFooter}
              </div>
            </div>
          ) : (
            /* A4 Professional Invoice Layout */
            <div 
              id="printable-invoice" 
              className="w-full bg-white text-stone-900 p-8 rounded-xl shadow-card border border-stone-200 text-xs space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5A2B] text-white flex items-center justify-center font-bold">
                      SF
                    </div>
                    <h1 className="text-xl font-black text-[#8B5A2B] uppercase">{settings.storeName}</h1>
                  </div>
                  <p className="text-stone-500 mt-1 max-w-sm">{settings.address}, {settings.city}</p>
                  <p className="text-stone-500 font-mono">Ph: {settings.phone} | {settings.email}</p>
                  {settings.ntnStrn && <p className="text-stone-400 font-mono text-[10px]">{settings.ntnStrn}</p>}
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    {invoice.status} Invoice
                  </span>
                  <div className="text-xl font-black mt-2">{invoice.invoiceNo}</div>
                  <div className="text-stone-500 mt-0.5">Date: {formatDate(invoice.date)}</div>
                  {invoice.dueDate && <div className="text-amber-700 font-medium">Due Date: {formatDate(invoice.dueDate)}</div>}
                </div>
              </div>

              {/* Bill To */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400">Billed To Customer</span>
                <div className="font-bold text-sm text-stone-900 mt-0.5">{invoice.customerName}</div>
                <div className="text-stone-600 font-mono text-xs">{invoice.customerPhone}</div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] font-bold border-y border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-stone-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold">{item.productName}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{item.sku}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{item.quantity} {item.unit}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{formatPKR(item.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">{formatPKR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold tabular-nums">{formatPKR(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount:</span>
                      <span className="tabular-nums">-{formatPKR(invoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-stone-300">
                    <span>Grand Total:</span>
                    <span className="text-[#8B5A2B] tabular-nums">{formatPKR(invoice.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Paid Amount ({invoice.paymentMethod}):</span>
                    <span className="tabular-nums">{formatPKR(invoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Balance Due:</span>
                    <span className="tabular-nums">{formatPKR(invoice.balanceDue)}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-500 leading-relaxed">
                <span className="font-bold text-stone-700 block mb-1">Terms & Conditions:</span>
                <p className="whitespace-pre-line">{settings.termsAndConditions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between gap-3">
          <button
            onClick={handleSendWhatsApp}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Send via WhatsApp
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-2 shadow-subtle transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
