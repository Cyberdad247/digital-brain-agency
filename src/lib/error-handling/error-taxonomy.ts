/**
 * Error Taxonomy Mapper for No-Code IDE
 * 
 * This module provides a comprehensive error classification system
 * for identifying, categorizing, and handling errors in the No-Code IDE.
 */

export enum ErrorCategory {
  UI = 'UI_ERR',
  LOGIC = 'LOGIC_ERR',
  INTEGRATION = 'INTEGRATION_ERR',
  SECURITY = 'SECURITY_ERR',
  PERFORMANCE = 'PERFORMANCE_ERR'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorTaxonomy {
  id: string;
  category: ErrorCategory;
  subcategory: string;
  severity: ErrorSeverity;
  message: string;
  suggestedFix?: string;
  autoFixable: boolean;
}

export interface ErrorReport {
  timestamp: number;
  errors: ErrorTaxonomy[];
  componentId?: string;
  sessionId: string;
}

// Common error patterns in drag-and-drop workflows
export const dragDropErrorPatterns = [
  {
    pattern: 'component-misalignment',
    category: ErrorCategory.UI,
    severity: ErrorSeverity.MEDIUM,
    message: 'Component misalignment detected',
    suggestedFix: 'Auto-align component to nearest grid point',
    autoFixable: true
  },
  {
    pattern: 'drop-outside-container',
    category: ErrorCategory.UI,
    severity: ErrorSeverity.LOW,
    message: 'Component dropped outside valid container',
    suggestedFix: 'Move component to nearest valid container',
    autoFixable: true
  },
  {
    pattern: 'component-overlap',
    category: ErrorCategory.UI,
    severity: ErrorSeverity.MEDIUM,
    message: 'Component overlapping with existing component',
    suggestedFix: 'Adjust component position to prevent overlap',
    autoFixable: true
  },
  {
    pattern: 'invalid-property-value',
    category: ErrorCategory.LOGIC,
    severity: ErrorSeverity.HIGH,
    message: 'Invalid property value assigned',
    suggestedFix: 'Reset property to default value',
    autoFixable: true
  },
  {
    pattern: 'circular-dependency',
    category: ErrorCategory.LOGIC,
    severity: ErrorSeverity.CRITICAL,
    message: 'Circular dependency detected in component relationships',
    suggestedFix: 'Break circular dependency by removing one relationship',
    autoFixable: false
  }
];

// Security error patterns for third-party integrations
export const securityErrorPatterns = [
  {
    pattern: 'insecure-plugin-access',
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.CRITICAL,
    message: 'Third-party plugin requesting excessive permissions',
    suggestedFix: 'Restrict plugin permissions to minimum required',
    autoFixable: false
  },
  {
    pattern: 'unvalidated-input',
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.HIGH,
    message: 'Unvalidated input detected in component',
    suggestedFix: 'Add input validation to component properties',
    autoFixable: false
  },
  {
    pattern: 'insecure-data-binding',
    category: ErrorCategory.SECURITY,
    severity: ErrorSeverity.HIGH,
    message: 'Insecure data binding detected',
    suggestedFix: 'Implement secure data binding with sanitization',
    autoFixable: false
  }
];

/**
 * Creates a new error taxonomy entry
 */
export function createErrorTaxonomy(
  category: ErrorCategory,
  subcategory: string,
  severity: ErrorSeverity,
  message: string,
  suggestedFix?: string,
  autoFixable: boolean = false
): ErrorTaxonomy {
  return {
    id: `${category}-${subcategory}-${Date.now()}`,
    category,
    subcategory,
    severity,
    message,
    suggestedFix,
    autoFixable
  };
}

/**
 * Generates an error report for the current session
 */
export function generateErrorReport(errors: ErrorTaxonomy[], componentId?: string): ErrorReport {
  return {
    timestamp: Date.now(),
    errors,
    componentId,
    sessionId: `session-${Date.now()}`
  };
}

/**
 * Analyzes a component for potential errors
 */
export function analyzeComponentForErrors(component: any): ErrorTaxonomy[] {
  const errors: ErrorTaxonomy[] = [];
  
  // Check for UI errors
  if (component.properties) {
    // Check for position outside bounds
    if (component.properties.x < 0 || component.properties.y < 0) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.UI,
        'position',
        ErrorSeverity.MEDIUM,
        'Component positioned outside canvas bounds',
        'Reposition component within canvas bounds',
        true
      ));
    }
    
    // Check for invalid dimensions
    if (component.properties.width <= 0 || component.properties.height <= 0) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.UI,
        'dimension',
        ErrorSeverity.MEDIUM,
        'Invalid component dimensions',
        'Reset component to default dimensions',
        true
      ));
    }
  }
  
  return errors;
}