document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputField = document.getElementById('input-field');
    const resultField = document.getElementById('result-field');
    const actionSelect = document.getElementById('action-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const copyResultBtn = document.getElementById('copy-result');

    // Configure MathLive fields
    inputField.setOptions({
        virtualKeyboardMode: 'manual',
        smartFence: true,
        smartSuperscript: true,
        scriptDepth: 3,
        removeExtraneousParentheses: true,
        macros: {
            '\\diff': '\\frac{d}{d#1}',
            '\\int': '\\int_{#1}^{#2}',
        }
    });

    resultField.setOptions({
        virtualKeyboardMode: 'manual',
        readOnly: true
    });

    // Enable/disable calculate button based on input and action selection
    function updateCalculateButton() {
        const hasContent = inputField.getValue().trim() !== '';
        const hasAction = actionSelect.value !== '';
        calculateBtn.disabled = !hasContent || !hasAction;
    }

    // Listen for changes in the input field
    inputField.addEventListener('input', updateCalculateButton);

    // Listen for changes in the action select
    actionSelect.addEventListener('change', updateCalculateButton);

    // Handle example buttons
    document.querySelectorAll('.example-btn').forEach(button => {
        button.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            inputField.setValue(example);
            updateCalculateButton();
            inputField.focus();
        });
    });

    // Handle calculate button click
    calculateBtn.addEventListener('click', function() {
        const operation = actionSelect.value;
        const latex = inputField.getValue();
        
        if (!operation || !latex) return;
        
        // Show loading state
        resultField.setValue('\\text{Calculating...}');
        
        // Send the request to the server
        fetch(`${CONFIG.API.BASE_URL}/calculate`, {
            method: 'POST',
            headers: CONFIG.API.CORS.HEADERS,
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ 
                operation: operation,
                expression: latex 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the result
            resultField.setValue(data.result);
        })
        .catch(error => {
            console.error('Direct request error:', error);
            
            // Try using the proxy as a fallback
            if (window.makeProxiedRequest) {
                console.log('Attempting to use CORS proxy as fallback...');
                window.makeProxiedRequest('/calculate', { 
                    operation: operation,
                    expression: latex 
                })
                    .then(data => {
                        // Display the result from the proxy
                        resultField.setValue(data.result);
                    })
                    .catch(proxyError => {
                        console.error('Proxy request error:', proxyError);
                        resultField.setValue('\\text{Error: ' + error.message + '}');
                    });
            } else {
                resultField.setValue('\\text{Error: ' + error.message + '}');
            }
        });
    });

    // Handle copy result button
    copyResultBtn.addEventListener('click', function() {
        const latex = resultField.getValue();
        if (!latex) return;
        
        navigator.clipboard.writeText(latex)
            .then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, CONFIG.UI.COPY_FEEDBACK_DURATION);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Command+Enter or Ctrl+Enter to calculate
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            if (!calculateBtn.disabled) {
                calculateBtn.click();
            }
        }
    });
}); 