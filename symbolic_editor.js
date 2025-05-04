document.addEventListener('DOMContentLoaded', function() {
    // Store all math fields
    const leftMathFields = [];
    const rightMathFields = [];
    
    // Initialize the first row
    initializeRow(0);
    
    // Function to create a new row
    function createNewRow(copyContent = false, sourceRowId = null) {
        const notebookContainer = document.querySelector('.notebook-container');
        const rows = document.querySelectorAll('.equation-row');
        const newRowId = rows.length;
        
        // Create the new row HTML
        const newRow = document.createElement('div');
        newRow.className = 'equation-row';
        newRow.setAttribute('data-row-id', newRowId);
        
        newRow.innerHTML = `
            <div class="row-number">${newRowId + 1}</div>
            <div class="equation-container">
                <div class="equation-side left-side">
                    <math-field data-field-id="left-${newRowId}"></math-field>
                </div>
                <div class="equation-equals">=</div>
                <div class="equation-side right-side">
                    <math-field data-field-id="right-${newRowId}"></math-field>
                </div>
            </div>
        `;
        
        // Add the new row to the notebook
        notebookContainer.appendChild(newRow);
        
        // Initialize the new row
        initializeRow(newRowId);
        
        // If copyContent is true, copy the content from the source row
        if (copyContent && sourceRowId !== null) {
            const sourceLeftField = leftMathFields[sourceRowId];
            const sourceRightField = rightMathFields[sourceRowId];
            const newLeftField = leftMathFields[newRowId];
            const newRightField = rightMathFields[newRowId];
            
            // Copy the LaTeX content
            newLeftField.setValue(sourceLeftField.getValue());
            newRightField.setValue(sourceRightField.getValue());
        }
        
        // Focus on the left math field of the new row
        setTimeout(() => {
            leftMathFields[newRowId].focus();
        }, 100);
        
        return newRowId;
    }
    
    // Function to initialize a row
    function initializeRow(rowId) {
        const leftMathFieldElement = document.querySelector(`[data-field-id="left-${rowId}"]`);
        const rightMathFieldElement = document.querySelector(`[data-field-id="right-${rowId}"]`);
        
        // Store the fields
        leftMathFields[rowId] = leftMathFieldElement;
        rightMathFields[rowId] = rightMathFieldElement;
        
        // Add keyboard event listeners for Shift+Enter to create a new row
        leftMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey && !(e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow();
            }
        });
        
        rightMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey && !(e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow();
            }
        });
        
        // Add keyboard event listeners for Command+Enter to create a new row with copied content
        leftMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow(true, rowId);
            }
        });
        
        rightMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow(true, rowId);
            }
        });
        
        // Add tab navigation between left and right fields
        leftMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                rightMathFieldElement.focus();
            }
        });
        
        rightMathFieldElement.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                leftMathFieldElement.focus();
            }
        });
    }
}); 