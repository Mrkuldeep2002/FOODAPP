import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Star, X, ChevronDown, Search, MapPin, Minus, Plus, Trash2, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';

// ============================================
// Button
// ============================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', fullWidth, loading, icon, children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-hover shadow-sm',
    secondary: 'bg-brand-olive text-white hover:opacity-90',
    outline: 'border-2 border-brand-red text-brand-red hover:bg-brand-red-light',
    ghost: 'text-text-secondary hover:bg-bg-cream',
    danger: 'bg-error text-white hover:opacity-90',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-5 py-2.5 text-sm gap-2', lg: 'px-6 py-3.5 text-base gap-2' };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
}

// ============================================
// Input
// ============================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</span>}
        <input
          className={`w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-colors ${icon ? 'pl-10' : ''} ${error ? 'border-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ============================================
// SearchBar
// ============================================
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Search...', value, onChange, onFocus, className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full bg-white border border-border rounded-2xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bg-cream">
          <X className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Rating
// ============================================
export function Rating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-xs px-1.5 py-0.5 gap-0.5', md: 'text-sm px-2 py-1 gap-1', lg: 'text-base px-2.5 py-1 gap-1' };
  const starSizes = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' };
  const bg = rating >= 4 ? 'bg-success text-white' : rating >= 3 ? 'bg-warning text-white' : 'bg-error text-white';
  return (
    <span className={`inline-flex items-center font-bold rounded-md ${sizes[size]} ${bg}`}>
      <Star className={`${starSizes[size]} fill-current`} />
      {rating.toFixed(1)}
    </span>
  );
}

// ============================================
// StatusBadge
// ============================================
export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const colorMap: Record<string, string> = {
    active: 'bg-success-light text-success', delivered: 'bg-success-light text-success', completed: 'bg-success-light text-success', verified: 'bg-success-light text-success', visible: 'bg-success-light text-success', paid: 'bg-success-light text-success',
    pending: 'bg-warning-light text-warning', preparing: 'bg-warning-light text-warning', placed: 'bg-warning-light text-warning',
    cancelled: 'bg-error-light text-error', rejected: 'bg-error-light text-error', blocked: 'bg-error-light text-error', suspended: 'bg-error-light text-error', failed: 'bg-error-light text-error', hidden: 'bg-error-light text-error', flagged: 'bg-warning-light text-warning',
    on_the_way: 'bg-blue-50 text-blue-600', picked_up: 'bg-blue-50 text-blue-600', confirmed: 'bg-success-light text-success', ready: 'bg-success-light text-success', rider_assigned: 'bg-blue-50 text-blue-600',
    expired: 'bg-gray-100 text-gray-500', disabled: 'bg-gray-100 text-gray-500', refunded: 'bg-brand-olive-light text-brand-olive',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };
  const color = colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-600';
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return <span className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${color} capitalize`}>{label}</span>;
}

// ============================================
// VegIndicator
// ============================================
export function VegIndicator({ isVeg }: { isVeg: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm ${isVeg ? 'border-success' : 'border-brand-red'}`}>
      <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-success' : 'bg-brand-red'}`} />
    </span>
  );
}

// ============================================
// Modal
// ============================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-scale-in`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-bg-cream transition-colors"><X className="w-5 h-5" /></button>
          </div>
        )}
        <div className={title ? '' : 'pt-2'}>{children}</div>
      </div>
    </div>
  );
}

// ============================================
// BottomSheet
// ============================================
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up md:relative md:rounded-2xl md:max-w-lg md:mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-bg-cream"><X className="w-5 h-5" /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ============================================
// Tabs
// ============================================
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills';
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default' }: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border hover:border-brand-red'}`}
          >
            {tab.label}{tab.count !== undefined && ` (${tab.count})`}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex border-b border-border overflow-x-auto scroll-hidden">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-brand-red text-brand-red' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
        >
          {tab.label}{tab.count !== undefined && <span className="ml-1.5 bg-bg-cream px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ============================================
// QuantityControl
// ============================================
export function QuantityControl({ quantity, onChange, min = 0, max = 20, size = 'md' }: { quantity: number; onChange: (q: number) => void; min?: number; max?: number; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'h-7 text-xs', md: 'h-9 text-sm' };
  const btnSizes = { sm: 'w-7 h-7', md: 'w-9 h-9' };
  return (
    <div className={`inline-flex items-center border border-brand-red rounded-xl overflow-hidden ${sizes[size]}`}>
      <button onClick={() => onChange(Math.max(min, quantity - 1))} className={`${btnSizes[size]} flex items-center justify-center text-brand-red hover:bg-brand-red-light transition-colors`}>
        {quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
      </button>
      <span className="w-8 text-center font-bold text-brand-red">{quantity}</span>
      <button onClick={() => onChange(Math.min(max, quantity + 1))} className={`${btnSizes[size]} flex items-center justify-center text-brand-red hover:bg-brand-red-light transition-colors`}>
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ============================================
// EmptyState
// ============================================
export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {icon && <div className="mb-4 text-text-tertiary">{icon}</div>}
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-text-secondary mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

// ============================================
// Skeleton
// ============================================
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Toast
// ============================================
export function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = { success: 'bg-success text-white', error: 'bg-error text-white', info: 'bg-text-primary text-white' };

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg ${colors[type]} animate-fade-in-up flex items-center gap-2 text-sm font-medium max-w-[90vw]`}>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

// ============================================
// ConfirmDialog
// ============================================
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmText?: string; variant?: 'danger' | 'primary';
}) {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} fullWidth onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// DataTable (for admin/restaurant)
// ============================================
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string }>({ columns, data, onRowClick, emptyMessage = 'No data found' }: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyMessage} icon={<ShoppingBag className="w-12 h-12" />} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 font-semibold text-text-secondary whitespace-nowrap">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={(item as any).id || i} onClick={() => onRowClick?.(item)}
              className={`border-b border-border-light hover:bg-bg-cream/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 whitespace-nowrap">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Pagination
// ============================================
export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  const pages = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm rounded-lg hover:bg-bg-cream disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-brand-red text-white' : 'hover:bg-bg-cream text-text-secondary'}`}
        >{p}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm rounded-lg hover:bg-bg-cream disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
    </div>
  );
}

// ============================================
// OrderTimeline
// ============================================
export function OrderTimeline({ timeline }: { timeline: { status: string; label: string; time?: string; isCompleted: boolean; isActive: boolean }[] }) {
  return (
    <div className="space-y-0">
      {timeline.map((step, i) => (
        <div key={step.status} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${step.isCompleted ? 'bg-success border-success' : step.isActive ? 'bg-brand-red border-brand-red animate-pulse' : 'bg-white border-border'}`}>
              {step.isCompleted && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            {i < timeline.length - 1 && <div className={`w-0.5 h-8 ${step.isCompleted ? 'bg-success' : 'bg-border'}`} />}
          </div>
          <div className="pb-8">
            <p className={`text-sm font-medium ${step.isActive ? 'text-brand-red' : step.isCompleted ? 'text-text-primary' : 'text-text-tertiary'}`}>{step.label}</p>
            {step.time && <p className="text-xs text-text-secondary mt-0.5">{step.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Card
// ============================================
export function Card({ children, className = '', onClick, padding = true, style }: { children: ReactNode; className?: string; onClick?: () => void; padding?: boolean; style?: React.CSSProperties }) {
  return (
    <div onClick={onClick} style={style}
      className={`bg-white rounded-2xl border border-border-light ${padding ? 'p-4' : ''} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}


// ============================================
// StatCard (for dashboards)
// ============================================
export function StatCard({ title, value, subtitle, icon, trend, color = 'default' }: {
  title: string; value: string | number; subtitle?: string; icon?: ReactNode; trend?: { value: string; positive: boolean }; color?: 'default' | 'red' | 'green' | 'orange' | 'olive';
}) {
  const bgColors = {
    default: 'bg-white',
    red: 'bg-brand-red-light',
    green: 'bg-success-light',
    orange: 'bg-warning-light',
    olive: 'bg-brand-olive-light',
  };

  return (
    <Card className={bgColors[color]}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
          {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && <div className="p-2.5 rounded-xl bg-white/70 text-text-secondary">{icon}</div>}
      </div>
    </Card>
  );
}

// ============================================
// Select
// ============================================
export function Select({ label, options, value, onChange, className = '' }: {
  label?: string; options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-primary appearance-none focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-colors cursor-pointer"
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
      </div>
    </div>
  );
}

// ============================================
// Toggle
// ============================================
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-success' : 'bg-border'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
    </label>
  );
}
