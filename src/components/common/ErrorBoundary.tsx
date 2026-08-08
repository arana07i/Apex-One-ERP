/**
 * @license
 * Apache-2.0
 * Centralized Enterprise Error Boundary Component
 * Wraps view routes and components to isolate UI rendering failures and
 * log diagnostics directly to the audit logging service.
 */

import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw, Copy, Check, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { errorTrackingService } from '../../services/errorTracking';

export interface ErrorBoundaryProps {
  children: ReactNode;
  viewName?: string;
  onReset?: () => void;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  isCopied: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      isCopied: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Report error to centralized audit logging endpoint
    errorTrackingService.trackUiError({
      error,
      errorInfo,
      viewName: this.props.viewName || 'Application View',
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      isCopied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReloadPage = (): void => {
    window.location.reload();
  };

  private handleCopyDiagnostics = (): void => {
    const { error, errorInfo } = this.state;
    const diagnostics = [
      `=== ENTERPRISE ERP UI ERROR DIAGNOSTICS ===`,
      `View Name: ${this.props.viewName || 'Unknown'}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Error Name: ${error?.name || 'Error'}`,
      `Message: ${error?.message || 'No message provided'}`,
      `\n--- COMPONENT STACK ---`,
      errorInfo?.componentStack || 'No component stack available',
      `\n--- CALL STACK ---`,
      error?.stack || 'No call stack available',
    ].join('\n');

    navigator.clipboard.writeText(diagnostics).then(() => {
      this.setState({ isCopied: true });
      setTimeout(() => this.setState({ isCopied: false }), 3000);
    });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, isCopied } = this.state;
      const viewTitle = this.props.viewName
        ? `${this.props.viewName.charAt(0).toUpperCase() + this.props.viewName.slice(1)} View`
        : 'Application View';

      return (
        <div className="p-6 md:p-8 my-4 max-w-5xl mx-auto bg-white dark:bg-zinc-900 border-2 border-red-500/30 dark:border-red-600/40 rounded-2xl shadow-xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-100 dark:bg-red-950/80 rounded-xl text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/80 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                    UI Rendering Exception
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {viewTitle} Encountered a Failure
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                  An unhandled rendering exception was caught and isolated. Surrounding navigation remains functional.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message Box */}
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{error?.name || 'Error'}: {error?.message || 'An unexpected rendering error occurred.'}</span>
            </div>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 pl-6">
              This incident has been logged to the immutable audit stream for compliance monitoring.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset View & Retry</span>
              </button>

              <button
                type="button"
                onClick={this.handleReloadPage}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleCopyDiagnostics}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Diagnostics Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Diagnostic Payload</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => this.setState({ showDetails: !showDetails })}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 cursor-pointer py-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showDetails ? 'Hide Stack Trace' : 'View Stack Trace'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Technical Diagnostics Details Accordion */}
          {showDetails && (
            <div className="mt-4 p-4 bg-zinc-950 text-zinc-300 rounded-xl font-mono text-[11px] overflow-x-auto space-y-3 border border-zinc-800">
              <div>
                <span className="text-amber-400 font-bold block mb-1">Component Stack:</span>
                <pre className="whitespace-pre-wrap leading-relaxed text-zinc-400">
                  {errorInfo?.componentStack || 'No component stack provided by React engine.'}
                </pre>
              </div>

              {error?.stack && (
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-amber-400 font-bold block mb-1">Execution Call Stack:</span>
                  <pre className="whitespace-pre-wrap leading-relaxed text-zinc-500">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
