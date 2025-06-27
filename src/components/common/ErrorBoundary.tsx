import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-md w-full mx-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">
                Battle Error
              </h2>
              <p className="text-red-300 mb-6">
                Something went wrong during the battle. This might be due to network issues or invalid game data.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  Restart Battle
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  Return to Menu
                </button>
              </div>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-gray-400 cursor-pointer">Technical Details</summary>
                  <pre className="mt-2 text-xs text-gray-500 bg-black/30 rounded p-2 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Battle-specific error display component
interface BattleErrorProps {
  error: string;
  onRetry: () => void;
  onExit: () => void;
}

export function BattleError({ error, onRetry, onExit }: BattleErrorProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-md w-full mx-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🚫</div>
          <h3 className="text-xl font-bold text-white mb-3 font-['Orbitron']">
            Battle Interrupted
          </h3>
          <p className="text-red-300 mb-4 text-sm">
            {error}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-lol-gold hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
            <button
              onClick={onExit}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Exit Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;