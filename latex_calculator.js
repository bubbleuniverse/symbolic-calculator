document.addEventListener('DOMContentLoaded', function() {
    // Initialize MathQuill
    const MQ = MathQuill.getInterface(2);
    
    // Store all math fields and their corresponding result fields
    const mathFields = [];
    const resultFields = [];
    
    // Initialize the first row
    initializeRow(0);
    
    // Add delete functionality to the first row
    setupDeleteButton(0);
    
    // Function to create a new row
    function createNewRow() {
        const notebookContainer = document.querySelector('.notebook-container');
        const rows = document.querySelectorAll('.equation-row');
        const newRowId = rows.length;
        
        // Create the new row HTML
        const newRow = document.createElement('div');
        newRow.className = 'equation-row';
        newRow.setAttribute('data-row-id', newRowId);
        
        newRow.innerHTML = `
            <div class="row-number">${newRowId + 1}</div>
            <div class="calculator-container">
                <div class="editor-section">
                    <div class="mathquill-editor">
                        <div class="math-field" data-field-id="${newRowId}"></div>
                    </div>
                    
                    <div class="action-controls">
                        <select class="action-select">
                            <option value="">Select an action...</option>
                            <option value="expand">Expand</option>
                            <option value="factor">Factor</option>
                            <option value="integrate">Integrate</option>
                            <option value="diff">Differentiate</option>
                        </select>
                        <button class="btn calculate-btn" disabled>Calculate</button>
                    </div>
                </div>
                
                <div class="result-section">
                    <div class="result-display">
                        <div class="math-field result-field" data-field-id="${newRowId}"></div>
                    </div>
                    <div class="result-actions">
                        <button class="btn copy-result">Copy LaTeX</button>
                    </div>
                </div>
            </div>
            <button class="delete-row-btn" tabindex="-1" aria-label="Delete row">×</button>
        `;
        
        // Add the new row to the notebook
        notebookContainer.appendChild(newRow);
        
        // Initialize the new row
        initializeRow(newRowId);
        
        // Setup delete button for the new row
        setupDeleteButton(newRowId);
        
        // Focus on the new math field
        setTimeout(() => {
            mathFields[newRowId].focus();
        }, 100);
        
        return newRowId;
    }
    
    // Function to setup delete button for a row
    function setupDeleteButton(rowId) {
        const deleteBtn = document.querySelector(`.equation-row[data-row-id="${rowId}"] .delete-row-btn`);
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                // Confirm before deleting
                if (confirm('Are you sure you want to delete this row?')) {
                    deleteRow(rowId);
                }
            });
        }
    }
    
    // Function to delete a row
    function deleteRow(rowId) {
        const row = document.querySelector(`.equation-row[data-row-id="${rowId}"]`);
        
        if (row) {
            // Remove the row from the DOM
            row.remove();
            
            // Update row numbers for all rows after the deleted one
            updateRowNumbers();
            
            // Focus on the math field of the previous row or the next row if available
            const remainingRows = document.querySelectorAll('.equation-row');
            if (remainingRows.length > 0) {
                const targetRowId = Math.min(rowId, remainingRows.length - 1);
                const targetMathField = document.querySelector(`.math-field[data-field-id="${targetRowId}"]`);
                if (targetMathField) {
                    mathFields[targetRowId].focus();
                }
            }
        }
    }
    
    // Function to update row numbers after deletion
    function updateRowNumbers() {
        const rows = document.querySelectorAll('.equation-row');
        
        rows.forEach((row, index) => {
            // Update the row ID
            row.setAttribute('data-row-id', index);
            
            // Update the row number display
            const rowNumber = row.querySelector('.row-number');
            if (rowNumber) {
                rowNumber.textContent = index + 1;
            }
            
            // Update the field IDs
            const mathField = row.querySelector('.math-field');
            const resultField = row.querySelector('.result-field');
            
            if (mathField) {
                mathField.setAttribute('data-field-id', index);
            }
            
            if (resultField) {
                resultField.setAttribute('data-field-id', index);
            }
            
            // Update the math fields array
            if (mathFields[index]) {
                mathFields[index] = MQ.MathField(mathField, {
                    spaceBehavesLikeTab: true,
                    handlers: {
                        edit: function() {
                            const calculateBtn = row.querySelector('.calculate-btn');
                            const hasContent = mathFields[index].latex().trim() !== '';
                            calculateBtn.disabled = !hasContent;
                        }
                    }
                });
            }
            
            // Update the result fields array
            if (resultFields[index]) {
                resultFields[index] = MQ.MathField(resultField, {
                    spaceBehavesLikeTab: true,
                    handlers: {
                        edit: function() {
                            // This field is read-only, so we don't need to do anything here
                        }
                    }
                });
            }
        });
    }
    
    // Function to initialize a row
    function initializeRow(rowId) {
        const mathFieldSpan = document.querySelector(`.math-field[data-field-id="${rowId}"]`);
        const resultFieldSpan = document.querySelector(`.result-field[data-field-id="${rowId}"]`);
        const calculateBtn = document.querySelector(`.equation-row[data-row-id="${rowId}"] .calculate-btn`);
        const actionSelect = document.querySelector(`.equation-row[data-row-id="${rowId}"] .action-select`);
        const copyResultBtn = document.querySelector(`.equation-row[data-row-id="${rowId}"] .copy-result`);
        const resultSection = document.querySelector(`.equation-row[data-row-id="${rowId}"] .result-section`);
        
        // Create the math field
        const mathField = MQ.MathField(mathFieldSpan, {
            spaceBehavesLikeTab: true,
            handlers: {
                edit: function() {
                    // Enable/disable calculate button based on whether there's content
                    const hasContent = mathField.latex().trim() !== '';
                    calculateBtn.disabled = !hasContent;
                }
            }
        });
        
        // Create the result field (read-only)
        const resultField = MQ.MathField(resultFieldSpan, {
            spaceBehavesLikeTab: true,
            handlers: {
                edit: function() {
                    // This field is read-only, so we don't need to do anything here
                }
            }
        });
        
        // Make the result field read-only
        resultFieldSpan.setAttribute('contenteditable', 'false');
        
        // Store the fields
        mathFields[rowId] = mathField;
        resultFields[rowId] = resultField;
        
        // Handle action selection
        actionSelect.addEventListener('change', function() {
            calculateBtn.disabled = !this.value || mathField.latex().trim() === '';
        });
        
        // Handle calculate button click
        calculateBtn.addEventListener('click', function() {
            const action = actionSelect.value;
            const latex = mathField.latex();
            
            if (!action || !latex) return;
            
            // Show loading state
            resultField.latex('\\text{Calculating...}');
            
            // Determine the endpoint based on the selected action
            let endpoint;
            switch(action) {
                case 'expand':
                    endpoint = CONFIG.API.ENDPOINTS.EXPAND;
                    break;
                case 'factor':
                    endpoint = CONFIG.API.ENDPOINTS.FACTOR;
                    break;
                case 'integrate':
                    endpoint = CONFIG.API.ENDPOINTS.INTEGRATE;
                    break;
                case 'diff':
                    endpoint = CONFIG.API.ENDPOINTS.DIFF;
                    break;
                default:
                    resultField.latex('\\text{Invalid action selected}');
                    return;
            }
            
            // Send the request to the server
            fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...CONFIG.API.CORS.HEADERS,
                    'Origin': window.location.origin
                },
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify({ expression: latex })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Display the result
                resultField.latex(data.result);
            })
            .catch(error => {
                console.error('Direct request error:', error);
                
                // Try using the proxy as a fallback
                if (window.makeProxiedRequest) {
                    console.log('Attempting to use CORS proxy as fallback...');
                    window.makeProxiedRequest(endpoint, { expression: latex })
                        .then(data => {
                            // Display the result from the proxy
                            resultField.latex(data.result);
                        })
                        .catch(proxyError => {
                            console.error('Proxy request error:', proxyError);
                            resultField.latex('\\text{Error: ' + error.message + '}');
                        });
                } else {
                    resultField.latex('\\text{Error: ' + error.message + '}');
                }
            });
        });
        
        // Handle copy result button
        copyResultBtn.addEventListener('click', function() {
            const latex = resultField.latex();
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
        
        // Add keyboard event listener for Shift+Enter to the math field
        mathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                createNewRow();
            }
        });
        
        // Add keyboard event listener for Shift+Enter to the result section
        resultSection.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                createNewRow();
            }
        });
    }
    
    // Handle example buttons
    document.querySelectorAll('.example-btn').forEach(button => {
        button.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            
            // Find the active row (the one with focus)
            let activeRowId = -1;
            for (let i = 0; i < mathFields.length; i++) {
                if (document.activeElement && document.activeElement.closest(`.math-field[data-field-id="${i}"]`)) {
                    activeRowId = i;
                    break;
                }
            }
            
            // If no active row, use the last row
            if (activeRowId === -1) {
                activeRowId = mathFields.length - 1;
            }
            
            // Set the example in the math field
            mathFields[activeRowId].latex(example);
            
            // Enable the calculate button
            const calculateBtn = document.querySelector(`.equation-row[data-row-id="${activeRowId}"] .calculate-btn`);
            calculateBtn.disabled = false;
            
            // Focus on the math field
            mathFields[activeRowId].focus();
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Command+Enter or Ctrl+Enter to calculate
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            // Find the active row
            let activeRowId = -1;
            for (let i = 0; i < mathFields.length; i++) {
                if (document.activeElement && document.activeElement.closest(`.math-field[data-field-id="${i}"]`)) {
                    activeRowId = i;
                    break;
                }
            }
            
            // If no active row, use the last row
            if (activeRowId === -1) {
                activeRowId = mathFields.length - 1;
            }
            
            // Get the calculate button for the active row
            const calculateBtn = document.querySelector(`.equation-row[data-row-id="${activeRowId}"] .calculate-btn`);
            
            // Click the calculate button if it's enabled
            if (calculateBtn && !calculateBtn.disabled) {
                calculateBtn.click();
            }
        }
    });
}); 