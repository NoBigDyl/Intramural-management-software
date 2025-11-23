import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-obsidian text-white p-8 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-neon-pink mb-4">Something went wrong.</h1>
                    <div className="bg-charcoal p-6 rounded-xl border border-white/10 max-w-2xl w-full overflow-auto">
                        <h2 className="text-xl font-bold text-neon-blue mb-2">Error:</h2>
                        <pre className="text-red-400 whitespace-pre-wrap mb-4">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <h2 className="text-xl font-bold text-neon-blue mb-2">Component Stack:</h2>
                        <pre className="text-gray-400 text-xs whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-3 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
