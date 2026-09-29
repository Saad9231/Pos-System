/**
 * Currency and date formatting utilities for StoreFlow (PKR standard)
 */

export function formatPKR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  
  // Format with standard thousands separator
  const formatted = Math.round(amount).toLocaleString('en-PK');
  return `Rs. ${formatted}`;
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('en-PK');
}

export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateStr);
  }
}

export function formatDateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return String(dateStr);
  }
}

export function formatTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return String(dateStr);
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'delivered':
    case 'approved':
    case 'active':
    case 'present':
    case 'received':
    case 'cleared':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    
    case 'partially paid':
    case 'partially received':
    case 'partially deducted':
    case 'in stock':
    case 'half day':
    case 'out for delivery':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    
    case 'pending':
    case 'low':
    case 'under manufacturing':
    case 'production started':
    case 'material required':
    case 'design approved':
    case 'order received':
    case 'polishing_upholstery':
    case 'quality_check':
    case 'on leave':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    
    case 'overdue':
    case 'out of stock':
    case 'out':
    case 'danger':
    case 'voided':
    case 'cancelled':
    case 'rejected':
    case 'absent':
    case 'terminated':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
  }
}
