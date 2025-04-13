document.addEventListener('DOMContentLoaded', function() {
    // Initialize MathQuill
    const MQ = MathQuill.getInterface(2);
    
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
                    <div class="math-field" data-field-id="left-${newRowId}"></div>
                </div>
                <div class="equation-equals">=</div>
                <div class="equation-side right-side">
                    <div class="math-field" data-field-id="right-${newRowId}"></div>
                </div>
            </div>
            <div class="delete-icon" data-row-id="${newRowId}">×</div>
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
            newLeftField.latex(sourceLeftField.latex());
            newRightField.latex(sourceRightField.latex());
        }
        
        // Focus on the left math field of the new row
        setTimeout(() => {
            leftMathFields[newRowId].focus();
        }, 100);
        
        return newRowId;
    }
    
    // Function to delete a row
    function deleteRow(rowId) {
        const row = document.querySelector(`.equation-row[data-row-id="${rowId}"]`);
        
        if (row) {
            // Remove the row from the DOM
            row.remove();
            
            // Update row numbers for all rows after the deleted one
            updateRowNumbers();
            
            // Focus on the left math field of the previous row or the next row if available
            const remainingRows = document.querySelectorAll('.equation-row');
            if (remainingRows.length > 0) {
                const targetRowId = Math.min(rowId, remainingRows.length - 1);
                const targetMathField = document.querySelector(`.math-field[data-field-id="left-${targetRowId}"]`);
                if (targetMathField) {
                    leftMathFields[targetRowId].focus();
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
            const leftMathField = row.querySelector('.left-side .math-field');
            const rightMathField = row.querySelector('.right-side .math-field');
            
            if (leftMathField) {
                leftMathField.setAttribute('data-field-id', `left-${index}`);
            }
            
            if (rightMathField) {
                rightMathField.setAttribute('data-field-id', `right-${index}`);
            }
            
            // Update the delete icon data attribute
            const deleteIcon = row.querySelector('.delete-icon');
            if (deleteIcon) {
                deleteIcon.setAttribute('data-row-id', index);
            }
            
            // Update the math fields arrays
            if (leftMathFields[index]) {
                leftMathFields[index] = MQ.MathField(leftMathField, {
                    spaceBehavesLikeTab: true
                });
            }
            
            if (rightMathFields[index]) {
                rightMathFields[index] = MQ.MathField(rightMathField, {
                    spaceBehavesLikeTab: true
                });
            }
        });
    }
    
    // Function to initialize a row
    function initializeRow(rowId) {
        const leftMathFieldSpan = document.querySelector(`.math-field[data-field-id="left-${rowId}"]`);
        const rightMathFieldSpan = document.querySelector(`.math-field[data-field-id="right-${rowId}"]`);
        const equationContainer = document.querySelector(`.equation-row[data-row-id="${rowId}"] .equation-container`);
        const deleteIcon = document.querySelector(`.delete-icon[data-row-id="${rowId}"]`);
        
        // Create the left math field
        const leftMathField = MQ.MathField(leftMathFieldSpan, {
            spaceBehavesLikeTab: true
        });
        
        // Create the right math field
        const rightMathField = MQ.MathField(rightMathFieldSpan, {
            spaceBehavesLikeTab: true
        });
        
        // Store the fields
        leftMathFields[rowId] = leftMathField;
        rightMathFields[rowId] = rightMathField;
        
        // Add keyboard event listeners for Shift+Enter to create a new row
        leftMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                createNewRow();
            }
        });
        
        rightMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                createNewRow();
            }
        });
        
        // Add keyboard event listeners for Command+Enter to create a new row with copied content
        leftMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow(true, rowId);
            }
        });
        
        rightMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                createNewRow(true, rowId);
            }
        });
        
        // Add click event listener to the delete icon
        if (deleteIcon) {
            deleteIcon.addEventListener('click', function() {
                deleteRow(rowId);
            });
        }
        
        // Add tab navigation between left and right fields
        leftMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                rightMathField.focus();
            }
        });
        
        rightMathFieldSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                leftMathField.focus();
            }
        });
    }
}); 