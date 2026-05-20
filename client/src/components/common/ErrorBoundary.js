import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center', background: '#fff0f0', borderRadius: '12px', margin: '2rem' }}>
          <h2 style={{ color: '#ff4d4f' }}>Something went wrong.</h2>
          <p>The dashboard encountered a runtime error.</p>
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ffccc7', margin: '1rem 0' }}>
            <strong>{this.state.error && this.state.error.toString()}</strong>
            <br /><br />
            {this.state.errorInfo?.componentStack || 'No stack trace available.'}
          </details>
          <button 
            style={{ padding: '0.8rem 1.5rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
