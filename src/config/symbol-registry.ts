/**
 * 🌐 SYMBOLECT CONFIGURATION
 * @description Defines the symbol system used throughout the codebase for enhanced code navigation and AI assistance
 */

export interface SymbolMapping {
  symbol: string;
  description: string;
  category: 'architecture' | 'ui' | 'data' | 'routing' | 'security' | 'debug';
  hotkeys?: string[];
  aiHooks?: string[];
}

export interface HotkeyConfig {
  key: string;
  description: string;
  action: string;
}

export interface AIHookConfig {
  symbol: string;
  description: string;
  action: string;
}

export const hotkeyRegistry: Record<string, HotkeyConfig> = {
  'Alt+🔼': {
    key: 'Alt+🔼',
    description: 'Navigate to next symbol block',
    action: 'jumpToNextSymbol'
  },
  'Alt+🔽': {
    key: 'Alt+🔽',
    description: 'Navigate to previous symbol block',
    action: 'jumpToPrevSymbol'
  }
};

export const aiHookRegistry: Record<string, AIHookConfig> = {
  '💡': {
    symbol: '💡',
    description: 'Performance optimization suggestions',
    action: 'suggestOptimizations'
  },
  '⚠️': {
    symbol: '⚠️',
    description: 'Generate error boundary documentation',
    action: 'generateErrorDocs'
  }
};

export const symbolRegistry: Record<string, SymbolMapping> = {
  // Data Management Symbols
  '🔄🗄️': {
    symbol: '🔄🗄️',
    description: 'React Query Client - Data Caching System',
    category: 'data',
    hotkeys: ['Alt+Q'],
    aiHooks: ['💡']
  },
  '📦': {
    symbol: '📦',
    description: 'Data Provider Integration',
    category: 'data',
  },

  // UI Layer Symbols
  '🛠️🔧': {
    symbol: '🛠️🔧',
    description: 'UI Utility Providers and Components',
    category: 'ui',
  },
  '🔦': {
    symbol: '🔦',
    description: 'Tooltip and Contextual UI Elements',
    category: 'ui',
  },
  '📢': {
    symbol: '📢',
    description: 'Notification and Alert Systems',
    category: 'ui',
  },

  // Routing and Navigation
  '🎯🌍': {
    symbol: '🎯🌍',
    description: 'React Router Navigation Configuration',
    category: 'routing',
  },
  '🧭': {
    symbol: '🧭',
    description: 'Navigation Components and Controls',
    category: 'routing',
  },
  '🚦': {
    symbol: '🚦',
    description: 'Route Management and Control Flow',
    category: 'routing',
  },

  // Architecture and Core Systems
  '🤖💬': {
    symbol: '🤖💬',
    description: 'Chatbot and Conversation Systems',
    category: 'architecture',
  },
  '👤': {
    symbol: '👤',
    description: 'User Identity and Persona Management',
    category: 'architecture',
  },
  '📊': {
    symbol: '📊',
    description: 'Analytics and Metrics Systems',
    category: 'architecture',
  },

  // Debug and Error Handling
  '⚠️': {
    symbol: '⚠️',
    description: 'Error Boundary and Error Handling',
    category: 'debug',
  },
  '🐛': {
    symbol: '🐛',
    description: 'Debug Points and Logging',
    category: 'debug',
  },

  // Security
  '🔐': {
    symbol: '🔐',
    description: 'Authentication and Security',
    category: 'security',
  },
  '🛡️': {
    symbol: '🛡️',
    description: 'Security Middleware and Protections',
    category: 'security',
  },
};

/**
 * Get symbol description by key
 * @param symbolKey The symbol to look up
 * @returns The symbol mapping if found, undefined otherwise
 */
export const getSymbolDescription = (symbolKey: string): SymbolMapping | undefined => {
  return symbolRegistry[symbolKey];
};

/**
 * Get all symbols for a specific category
 * @param category The category to filter by
 * @returns Array of symbol mappings in the specified category
 */
export const getSymbolsByCategory = (category: SymbolMapping['category']): SymbolMapping[] => {
  return Object.values(symbolRegistry).filter((mapping) => mapping.category === category);
};