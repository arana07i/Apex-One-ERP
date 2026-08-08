/**
 * @license
 * Apache-2.0
 * Centralized Client Error Tracking Service
 * Automatically logs UI rendering failures, component crashes, and client exceptions
 * directly to the Enterprise Audit Logging API endpoint.
 */

import { RiskLevel } from '../types';

export interface UiErrorPayload {
  error: Error | string;
  errorInfo?: { componentStack?: string };
  viewName?: string;
  componentName?: string;
  additionalDetails?: Record<string, any>;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private apiEndpoint = '/api/v1/audit-logs/error';

  private constructor() {}

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  /**
   * Log UI rendering failure or error to audit logging endpoint
   */
  public async trackUiError(payload: UiErrorPayload): Promise<void> {
    const { error, errorInfo, viewName, componentName, additionalDetails } = payload;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UIError';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const compStack = errorInfo?.componentStack;

    // Local diagnostic console log
    console.error(`💥 [ErrorTrackingService] UI Rendering Exception captured in view [${viewName || 'Global'}]:`, {
      name: errorName,
      message: errorMessage,
      componentStack: compStack,
      stack: errorStack,
    });

    try {
      const token = localStorage.getItem('erp_jwt_token') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body = {
        action: 'UI_RENDER_ERROR',
        entityType: 'UI_Component',
        entityId: viewName || componentName || 'UI_View',
        riskLevel: RiskLevel.High,
        details: `UI Rendering Exception in view '${viewName || 'Unknown'}': ${errorMessage}`,
        metadata: {
          errorName,
          errorMessage,
          errorStack,
          componentStack: compStack,
          viewName: viewName || 'UnspecifiedView',
          componentName: componentName || 'ErrorBoundary',
          url: typeof window !== 'undefined' ? window.location.href : 'N/A',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
          timestamp: new Date().toISOString(),
          ...additionalDetails,
        },
      };

      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.warn(`[ErrorTrackingService] Audit logger endpoint responded with status ${res.status}`);
      }
    } catch (loggingError) {
      // Fallback: Ensure the tracking service never throws or crashes client
      console.warn('[ErrorTrackingService] Network error sending error log to audit endpoint:', loggingError);
    }
  }
}

export const errorTrackingService = ErrorTrackingService.getInstance();
