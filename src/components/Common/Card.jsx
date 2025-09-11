// Common Card component for consistent UI
export default function Card({ children, style, ...props }) {
  return (
    <div className="card" style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff', ...style}} {...props}>
      {children}
    </div>
  );
}
