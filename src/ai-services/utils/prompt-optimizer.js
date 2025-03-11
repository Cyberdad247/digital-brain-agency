/**
 * Enhanced PromptOptimizer
 * 
 * This class implements advanced prompt optimization techniques inspired by
 * Ryota "Coda" Varella's symbolic compression expertise and
 * Zara "Muse" Kapoor's prompt optimization skills from Inspira_staff.txt.
 */

class PromptOptimizer {
    constructor() {
        // Basic symbolic compression rules from the original implementation
        this.symbolicCompressionRules = {
            'Generate Python code for': 'Code:',
            'REST API endpoint': 'API',
            'please': '',
            'could you': '',
            'would you': ''
        };

        // Zara Kapoor's semantic analysis and clarity optimization rules
        this.semanticRules = {
            // Remove redundant phrases
            'I was wondering if': '',
            'I would like to': '',
            'I need you to': '',
            'Can you help me': '',
            
            // Clarify intent
            'explain': 'explain concisely',
            'summarize': 'summarize key points',
            'analyze': 'analyze critically'
        };

        // Ryota Varella's symbolic compression techniques
        this.symbolectRules = {
            // Domain-specific compressions
            'machine learning': 'ML',
            'artificial intelligence': 'AI',
            'natural language processing': 'NLP',
            'deep learning': 'DL',
            'neural network': 'NN',
            
            // Command compressions
            'create a': 'create',
            'generate a': 'generate',
            'write a': 'write'
        };

        // Context-aware optimization patterns
        this.contextPatterns = {
            'code': {
                prefix: '```',
                suffix: '```',
                rules: {
                    'write code that': 'Code:',
                    'implement a function': 'Func:',
                    'create a class': 'Class:'
                }
            },
            'creative': {
                prefix: '',
                suffix: '',
                rules: {
                    'write creatively': 'Creative:',
                    'be imaginative': 'Imagine:',
                    'think outside the box': 'Innovate:'
                }
            },
            'analytical': {
                prefix: '',
                suffix: '',
                rules: {
                    'analyze': 'Analysis:',
                    'compare and contrast': 'Compare:',
                    'evaluate': 'Evaluation:'
                }
            }
        };
    }

    /**
     * Detects the context of the prompt to apply appropriate optimization rules
     * @param {string} prompt - The original prompt
     * @returns {string} - The detected context type
     */
    detectContext(prompt) {
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('code') || 
            promptLower.includes('function') || 
            promptLower.includes('programming') ||
            promptLower.includes('algorithm')) {
            return 'code';
        } else if (promptLower.includes('creative') || 
                  promptLower.includes('story') || 
                  promptLower.includes('imagine')) {
            return 'creative';
        } else if (promptLower.includes('analyze') || 
                  promptLower.includes('evaluate') || 
                  promptLower.includes('compare')) {
            return 'analytical';
        }
        
        return 'general';
    }

    /**
     * Applies symbolic compression based on Ryota Varella's techniques
     * @param {string} prompt - The prompt to compress
     * @returns {string} - The compressed prompt
     */
    applySymbolicCompression(prompt) {
        let compressedPrompt = prompt;
        
        // Apply basic symbolic compression rules
        for (const [pattern, replacement] of Object.entries(this.symbolicCompressionRules)) {
            compressedPrompt = compressedPrompt.replace(new RegExp(pattern, 'gi'), replacement);
        }
        
        // Apply Ryota's advanced symbolect rules
        for (const [pattern, replacement] of Object.entries(this.symbolectRules)) {
            compressedPrompt = compressedPrompt.replace(new RegExp(`\\b${pattern}\\b`, 'gi'), replacement);
        }
        
        return compressedPrompt;
    }

    /**
     * Applies semantic analysis based on Zara Kapoor's techniques
     * @param {string} prompt - The prompt to analyze and optimize
     * @returns {string} - The semantically optimized prompt
     */
    applySemanticAnalysis(prompt) {
        let optimizedPrompt = prompt;
        
        // Apply semantic rules
        for (const [pattern, replacement] of Object.entries(this.semanticRules)) {
            optimizedPrompt = optimizedPrompt.replace(new RegExp(pattern, 'gi'), replacement);
        }
        
        return optimizedPrompt;
    }

    /**
     * Applies context-aware optimization
     * @param {string} prompt - The prompt to optimize
     * @param {string} context - The detected or provided context
     * @returns {string} - The context-optimized prompt
     */
    applyContextOptimization(prompt, context) {
        // If context is not provided or not recognized, use general optimization
        if (!context || !this.contextPatterns[context]) {
            return prompt;
        }
        
        let optimizedPrompt = prompt;
        const contextPattern = this.contextPatterns[context];
        
        // Apply context-specific rules
        for (const [pattern, replacement] of Object.entries(contextPattern.rules)) {
            optimizedPrompt = optimizedPrompt.replace(new RegExp(pattern, 'gi'), replacement);
        }
        
        // Add prefix and suffix if they exist and aren't already present
        if (contextPattern.prefix && !optimizedPrompt.startsWith(contextPattern.prefix)) {
            optimizedPrompt = contextPattern.prefix + optimizedPrompt;
        }
        
        if (contextPattern.suffix && !optimizedPrompt.endsWith(contextPattern.suffix)) {
            optimizedPrompt = optimizedPrompt + contextPattern.suffix;
        }
        
        return optimizedPrompt;
    }

    /**
     * Main method to optimize a prompt using all available techniques
     * @param {string} prompt - The original prompt to optimize
     * @param {Object} options - Optional parameters for optimization
     * @param {string} options.context - Specific context for optimization (code, creative, analytical)
     * @param {boolean} options.aggressive - Whether to use aggressive optimization
     * @returns {string} - The fully optimized prompt
     */
    optimizePrompt(prompt, options = {}) {
        // Start with the original prompt
        let optimizedPrompt = prompt;
        
        // Detect context if not provided
        const context = options.context || this.detectContext(prompt);
        
        // Apply semantic analysis (Zara Kapoor's techniques)
        optimizedPrompt = this.applySemanticAnalysis(optimizedPrompt);
        
        // Apply symbolic compression (Ryota Varella's techniques)
        optimizedPrompt = this.applySymbolicCompression(optimizedPrompt);
        
        // Apply context-aware optimization
        optimizedPrompt = this.applyContextOptimization(optimizedPrompt, context);
        
        // Remove extra whitespace
        optimizedPrompt = optimizedPrompt.replace(/\s+/g, ' ').trim();
        
        return optimizedPrompt;
    }
}

// Create a singleton instance
const optimizer = new PromptOptimizer();

/**
 * Utility function to optimize a prompt
 * @param {string} prompt - The prompt to optimize
 * @param {Object} options - Optional parameters for optimization
 * @returns {string} - The optimized prompt
 */
function optimizePrompt(prompt, options = {}) {
    return optimizer.optimizePrompt(prompt, options);
}

module.exports = {
    PromptOptimizer,
    optimizePrompt
};