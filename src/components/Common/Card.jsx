import './Card.css';

// Common Card component for consistent UI
export default function Card({ children, className = '', style, ...props }) {
  return (
    <div className={`card ${className}`.trim()} style={style} {...props}>
      {children}
    </div>
  );
}
