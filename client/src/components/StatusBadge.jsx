import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Ban, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true }) {
  const normalizedStatus = status?.toLowerCase() || 'unknown';

  const config = {
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      Icon: CheckCircle2,
    },
    available: {
      label: 'Available',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500 animate-pulse-slow',
      Icon: CheckCircle2,
    },
    active: {
      label: 'Active',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      Icon: ShieldCheck,
    },
    pending: {
      label: 'Pending',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500 animate-pulse-slow',
      Icon: Clock,
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      Icon: XCircle,
    },
    maintenance: {
      label: 'Maintenance',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      Icon: AlertTriangle,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      Icon: Ban,
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      Icon: Ban,
    },
  };

  const current = config[normalizedStatus] || {
    label: status,
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    Icon: Clock,
  };

  const IconComponent = current.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border shadow-2xs transition-all ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      <span className="capitalize">{current.label}</span>
    </span>
  );
}
