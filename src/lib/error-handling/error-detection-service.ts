/**
 * Error Detection Service for No-Code IDE
 * 
 * This service provides real-time error detection, classification, and auto-fixing
 * capabilities for the No-Code IDE drag-and-drop workflows.
 */

import { ErrorCategory, ErrorSeverity, ErrorTaxonomy, createErrorTaxonomy, generateErrorReport } from './error-taxonomy';
import { UIComponent } from '../../components/NoCodeIDE';

export interface ErrorDetectionOptions {
  enableAutoFix: boolean;
  detectionThreshold: number; // 0-1 sensitivity threshold
  reportSilentFailures: boolean;
  securityScanEnabled: boolean;
}

export class ErrorDetectionService {
  private options: ErrorDetectionOptions;
  private detectedErrors: Map<string, ErrorTaxonomy[]> = new Map();
  private fixedErrors: Map<string, ErrorTaxonomy[]> = new Map();
  private silentFailures: ErrorTaxonomy[] = [];
  
  constructor(options: Partial<ErrorDetectionOptions> = {}) {
    this.options = {
      enableAutoFix: true,
      detectionThreshold: 0.7,
      reportSilentFailures: true,
      securityScanEnabled: true,
      ...options
    };
  }
  
  /**
   * Detects errors in a component's drag-and-drop operation
   */
  public detectDragDropErrors(component: UIComponent, allComponents: UIComponent[], canvasBounds: DOMRect): ErrorTaxonomy[] {
    const errors: ErrorTaxonomy[] = [];
    
    // Check for component outside canvas bounds
    if (component.properties.x < 0 || component.properties.y < 0 ||
        component.properties.x + component.properties.width > canvasBounds.width ||
        component.properties.y + component.properties.height > canvasBounds.height) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.UI,
        'bounds',
        ErrorSeverity.MEDIUM,
        'Component positioned outside canvas bounds',
        'Reposition component within canvas bounds',
        true
      ));
    }
    
    // Check for component overlap
    const overlappingComponents = this.detectComponentOverlap(component, allComponents);
    if (overlappingComponents.length > 0) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.UI,
        'overlap',
        ErrorSeverity.MEDIUM,
        `Component overlapping with ${overlappingComponents.length} other component(s)`,
        'Adjust component position to prevent overlap',
        true
      ));
    }
    
    // Check for component alignment issues
    const alignmentIssues = this.detectAlignmentIssues(component, allComponents);
    if (alignmentIssues) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.UI,
        'alignment',
        ErrorSeverity.LOW,
        'Component misalignment detected',
        'Auto-align component to grid',
        true
      ));
    }
    
    // Store detected errors
    this.detectedErrors.set(component.id, errors);
    
    return errors;
  }
  
  /**
   * Detects errors in component properties
   */
  public detectPropertyErrors(component: UIComponent): ErrorTaxonomy[] {
    const errors: ErrorTaxonomy[] = [];
    
    // Check for invalid dimensions
    if (component.properties.width <= 0 || component.properties.height <= 0) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.LOGIC,
        'dimension',
        ErrorSeverity.HIGH,
        'Invalid component dimensions',
        'Reset component to default dimensions',
        true
      ));
    }
    
    // Check for empty required text properties
    if (component.type === 'button' && (!component.properties.text || component.properties.text.trim() === '')) {
      errors.push(createErrorTaxonomy(
        ErrorCategory.LOGIC,
        'property',
        ErrorSeverity.MEDIUM,
        'Button text is empty',
        'Set default button text',
        true
      ));
    }
    
    // Check for invalid URLs in image components
    if (component.type === 'image' && component.properties.src) {
      try {
        new URL(component.properties.src);
      } catch (e) {
        if (!component.properties.src.startsWith('/')) {
          errors.push(createErrorTaxonomy(
            ErrorCategory.LOGIC,
            'property',
            ErrorSeverity.HIGH,
            'Invalid image URL',
            'Reset to default image or fix URL',
            true
          ));
        }
      }
    }
    
    // Store detected errors
    const existingErrors = this.detectedErrors.get(component.id) || [];
    this.detectedErrors.set(component.id, [...existingErrors, ...errors]);
    
    return errors;
  }
  
  /**
   * Detects security issues in component properties
   */
  public detectSecurityIssues(component: UIComponent): ErrorTaxonomy[] {
    if (!this.options.securityScanEnabled) return [];
    
    const errors: ErrorTaxonomy[] = [];
    
    // Check for potentially unsafe content in text properties
    const textProperties = ['text', 'placeholder', 'alt', 'title'];
    for (const prop of textProperties) {
      if (component.properties[prop] && typeof component.properties[prop] === 'string') {
        const value = component.properties[prop];
        
        // Check for potential script injection
        if (value.includes('<script') || value.includes('javascript:') || value.includes('onerror=')) {
          errors.push(createErrorTaxonomy(
            ErrorCategory.SECURITY,
            'xss',
            ErrorSeverity.CRITICAL,
            'Potential XSS vulnerability detected in text property',
            'Sanitize text content to remove script tags and event handlers',
            true
          ));
        }
      }
    }
    
    // Check for insecure URLs
    const urlProperties = ['src', 'href', 'url'];
    for (const prop of urlProperties) {
      if (component.properties[prop] && typeof component.properties[prop] === 'string') {
        const value = component.properties[prop];
        
        // Check for data: URLs which can be used for XSS
        if (value.startsWith('data:') && !value.startsWith('data:image/')) {
          errors.push(createErrorTaxonomy(
            ErrorCategory.SECURITY,
            'url',
            ErrorSeverity.HIGH,
            'Potentially unsafe data URL detected',
            'Use standard HTTP/HTTPS URLs or image data URLs only',
            true
          ));
        }
      }
    }
    
    // Store detected errors
    const existingErrors = this.detectedErrors.get(component.id) || [];
    this.detectedErrors.set(component.id, [...existingErrors, ...errors]);
    
    return errors;
  }
  
  /**
   * Auto-fixes errors if enabled
   */
  public autoFixErrors(component: UIComponent, allComponents: UIComponent[], canvasBounds: DOMRect): UIComponent {
    if (!this.options.enableAutoFix) return component;
    
    const errors = this.detectedErrors.get(component.id) || [];
    let fixedComponent = { ...component };
    const fixedErrors: ErrorTaxonomy[] = [];
    
    for (const error of errors) {
      if (!error.autoFixable) continue;
      
      switch (`${error.category}-${error.subcategory}`) {
        case `${ErrorCategory.UI}-bounds`:
          // Fix component position to be within bounds
          fixedComponent.properties = {
            ...fixedComponent.properties,
            x: Math.max(0, Math.min(fixedComponent.properties.x, canvasBounds.width - fixedComponent.properties.width)),
            y: Math.max(0, Math.min(fixedComponent.properties.y, canvasBounds.height - fixedComponent.properties.height))
          };
          fixedErrors.push(error);
          break;
          
        case `${ErrorCategory.UI}-alignment`:
          // Snap to grid (assuming 8px grid)
          fixedComponent.properties = {
            ...fixedComponent.properties,
            x: Math.round(fixedComponent.properties.x / 8) * 8,
            y: Math.round(fixedComponent.properties.y / 8) * 8
          };
          fixedErrors.push(error);
          break;
          
        case `${ErrorCategory.LOGIC}-dimension`:
          // Reset invalid dimensions
          fixedComponent.properties = {
            ...fixedComponent.properties,
            width: fixedComponent.properties.width <= 0 ? 100 : fixedComponent.properties.width,
            height: fixedComponent.properties.height <= 0 ? 40 : fixedComponent.properties.height
          };
          fixedErrors.push(error);
          break;
          
        case `${ErrorCategory.LOGIC}-property`:
          // Fix empty text
          if (fixedComponent.type === 'button' && (!fixedComponent.properties.text || fixedComponent.properties.text.trim() === '')) {
            fixedComponent.properties = {
              ...fixedComponent.properties,
              text: `Button ${fixedComponent.id.substring(0, 4)}`
            };
            fixedErrors.push(error);
          }
          break;
          
        case `${ErrorCategory.SECURITY}-xss`:
          // Sanitize text properties
          const textProperties = ['text', 'placeholder', 'alt', 'title'];
          for (const prop of textProperties) {
            if (fixedComponent.properties[prop] && typeof fixedComponent.properties[prop] === 'string') {
              fixedComponent.properties = {
                ...fixedComponent.properties,
                [prop]: this.sanitizeText(fixedComponent.properties[prop])
              };
            }
          }
          fixedErrors.push(error);
          break;
      }
    }
    
    // Store fixed errors
    this.fixedErrors.set(component.id, fixedErrors);
    
    // Remove fixed errors from detected errors
    const remainingErrors = errors.filter(error => !fixedErrors.includes(error));
    this.detectedErrors.set(component.id, remainingErrors);
    
    return fixedComponent;
  }
  
  /**
   * Detects silent failures in visual logic chains
   */
  public detectSilentFailures(components: UIComponent[]): ErrorTaxonomy[] {
    if (!this.options.reportSilentFailures) return [];
    
    const errors: ErrorTaxonomy[] = [];
    
    // Check for orphaned components (components with parent that doesn't exist)
    const componentIds = new Set(components.map(c => c.id));
    for (const component of components) {
      if (component.parent && !componentIds.has(component.parent)) {
        errors.push(createErrorTaxonomy(
          ErrorCategory.LOGIC,
          'orphan',
          ErrorSeverity.HIGH,
          `Component references non-existent parent ${component.parent}`,
          'Remove parent reference or create parent component',
          true
        ));
      }
    }
    
    // Check for circular parent-child relationships
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    for (const component of components) {
      if (!visited.has(component.id)) {
        this.detectCircularDependency(component.id, components, visited, recursionStack, errors);
      }
    }
    
    this.silentFailures = errors;
    return errors;
  }
  
  /**
   * Generates a comprehensive error report
   */
  public generateReport(): any {
    const allErrors: ErrorTaxonomy[] = [];
    
    // Collect all detected errors
    for (const [componentId, errors] of this.detectedErrors.entries()) {
      allErrors.push(...errors);
    }
    
    // Add silent failures
    allErrors.push(...this.silentFailures);
    
    // Generate statistics
    const errorsByCategory = this.groupErrorsByCategory(allErrors);
    const errorsBySeverity = this.groupErrorsBySeverity(allErrors);
    const fixedErrorsCount = Array.from(this.fixedErrors.values()).reduce((sum, errors) => sum + errors.length, 0);
    
    return {
      timestamp: Date.now(),
      summary: {
        totalErrors: allErrors.length,
        fixedErrors: fixedErrorsCount,
        remainingErrors: allErrors.length - fixedErrorsCount,
        errorsByCategory,
        errorsBySeverity
      },
      errors: allErrors,
      fixedErrors: Array.from(this.fixedErrors.values()).flat(),
      silentFailures: this.silentFailures
    };
  }
  
  /**
   * Helper method to detect component overlap
   */
  private detectComponentOverlap(component: UIComponent, allComponents: UIComponent[]): UIComponent[] {
    const overlapping: UIComponent[] = [];
    
    for (const other of allComponents) {
      if (other.id === component.id) continue;
      
      // Check for overlap using bounding box collision detection
      if (component.properties.x < other.properties.x + other.properties.width &&
          component.properties.x + component.properties.width > other.properties.x &&
          component.properties.y < other.properties.y + other.properties.height &&
          component.properties.y + component.properties.height > other.properties.y) {
        overlapping.push(other);
      }
    }
    
    return overlapping;
  }
  
  /**
   * Helper method to detect alignment issues
   */
  private detectAlignmentIssues(component: UIComponent, allComponents: UIComponent[]): boolean {
    // Check if component is aligned to grid (assuming 8px grid)
    const isAlignedToGrid = component.properties.x % 8 === 0 && component.properties.y % 8 === 0;
    if (!isAlignedToGrid) return true;
    
    // Check if component is aligned with other components
    for (const other of allComponents) {
      if (other.id === component.id) continue;
      
      // Check for near-alignment (within 5px) but not exact alignment
      const xDiff = Math.abs(component.properties.x - other.properties.x);
      const