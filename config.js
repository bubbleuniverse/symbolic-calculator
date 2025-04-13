/**
 * Configuration settings for the LaTeX Editor
 */
const CONFIG = {
    // API endpoints
    API: {
        // Base URL for the API server
        BASE_URL: 'http://localhost:5000',
        // Endpoints for different operations
        ENDPOINTS: {
            EXPAND: '/expand',
            FACTOR: '/factor',
            INTEGRATE: '/integrate',
            DIFF: '/diff'
        }
    },
    
    // UI settings
    UI: {
        // Debounce time for input events (in milliseconds)
        DEBOUNCE_TIME: 300,
        // Copy button feedback duration (in milliseconds)
        COPY_FEEDBACK_DURATION: 2000
    },
    
    // Default LaTeX examples
    EXAMPLES: [
        '(x+1)(x+2)',
        'x^{2} + 3 x + 2',
        '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
        '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'
    ]
}; 