import { Component } from 'react';
import StatePanel from './Common/StatePanel';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled frontend error', error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-route-shell">
          <StatePanel
            eyebrow="Application Error"
            title="Something broke in the interface"
            description="The page hit an unexpected client-side error. Reload the app to recover."
            variant="error"
            className="app-boundary-panel"
            action={(
              <button type="button" className="btn primary" onClick={this.handleReload}>
                Reload App
              </button>
            )}
          />
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
