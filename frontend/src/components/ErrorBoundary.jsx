import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="nest-shell flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="nest-panel max-w-md p-8">
            <AlertTriangle className="mx-auto mb-5 h-12 w-12 text-red-700" />
            <h1 className="text-2xl font-black text-[var(--nest-ink)]">Something went wrong</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--nest-muted)]">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button onClick={() => window.location.reload()} className="nest-btn mt-6">Reload page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
