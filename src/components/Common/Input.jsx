// Common Input component for consistent UI
export default function Input({ className = '', ...props }) {
  return <input className={`input ${className}`.trim()} {...props} />;
}
