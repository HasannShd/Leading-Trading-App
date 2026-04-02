import './StatePanel.css';

export default function StatePanel({
  eyebrow,
  title,
  description,
  variant = 'default',
  action,
  className = '',
}) {
  return (
    <div className={`state-panel state-panel--${variant} ${className}`.trim()}>
      {eyebrow ? <span className="state-panel-eyebrow">{eyebrow}</span> : null}
      {title ? <h3>{title}</h3> : null}
      {description ? <p>{description}</p> : null}
      {action ? <div className="state-panel-action">{action}</div> : null}
    </div>
  );
}
