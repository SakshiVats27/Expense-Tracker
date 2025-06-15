import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Error occurred. Please refresh.</div>;
    }
    return this.props.children;
  }
}