export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-800',
    secondary: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`${base} ${variants[variant] || ''} ${className}`}>
      {children}
    </span>
  );
}