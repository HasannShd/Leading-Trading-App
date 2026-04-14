import { Link } from 'react-router-dom';
import StatePanel from './Common/StatePanel';

export default function NotFoundPage() {
  return (
    <main className="app-route-shell">
      <StatePanel
        eyebrow="404"
        title="Page not found"
        description="The link does not match a live page in the website or portal."
        action={(
          <Link className="btn primary" to="/">
            Back to Home
          </Link>
        )}
      />
    </main>
  );
}
