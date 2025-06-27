'use strict';

//
// Floating Modifier Box Module
//
(function() {
    // Module variables
    let modifierBox = null;
    let isModifierBoxVisible = false;
    let rowCounter = 1; // Start from 1 since we have row 0

    // Export functions to global scope
    window.ModifierBox = {
        create: createModifierBox,
        show: showModifierBox,
        hide: hideModifierBox,
        isVisible: () => isModifierBoxVisible,
        getElement: () => modifierBox,
        updateSelectedModifier: updateSelectedModifier
    };

    function createModifierBox() {
        console.log("Creating modifier box...");
        if (modifierBox) return;

        // Create the floating box
        modifierBox = document.createElement('div');
        modifierBox.id = 'pixels-modifier-box';
        modifierBox.setAttribute('data-testid', 'pixels-modifier-box');
        modifierBox.className = 'PIXELS_EXTENSION_BOX_FIND_ME';
        modifierBox.innerHTML = `
            <div class="pixels-header">
                <span class="pixels-title">🎲 Dice Modifiers</span>
                <div class="pixels-controls">
                    <button class="pixels-minimize" title="Minimize">−</button>
                    <button class="pixels-close" title="Close">×</button>
                </div>
            </div>
            <div class="pixels-content">
                <div class="modifier-row">
                    <input type="radio" name="modifier-select" value="0" class="modifier-radio" id="mod-0" checked>
                    <input type="text" class="modifier-name" placeholder="None" value="None" data-index="0">
                    <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="0">
                    <button class="remove-row-btn" type="button">×</button>
                </div>
                <button class="add-modifier-btn">+ Add Row</button>
            </div>
        `;

        // Add CSS styles
        addModifierBoxStyles();

        // Add drag functionality
        setupDragFunctionality();

        // Add close and minimize functionality
        modifierBox.querySelector('.pixels-close').addEventListener('click', () => {
            hideModifierBox();
        });

        modifierBox.querySelector('.pixels-minimize').addEventListener('click', () => {
            modifierBox.classList.toggle('minimized');
        });

        // Add row functionality
        setupModifierRowLogic();

        document.body.appendChild(modifierBox);
        isModifierBoxVisible = true;

        // Position relative to textchatcontainer
        positionModifierBox();
        
        // Add window resize listener to reposition the box
        window.addEventListener('resize', positionModifierBox);
        
        console.log("Modifier box created and added to page");
    }

    function addModifierBoxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #pixels-modifier-box {
                position: fixed;
                width: 280px;
                min-width: 250px;
                max-width: 400px;
                background: #2b2b2b;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                z-index: 999999;
                user-select: none;
                color: white;
                resize: both;
                overflow: hidden;
            }
            .pixels-header {
                background: #1a1a1a;
                padding: 8px 12px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid #555;
            }
            .pixels-title {
                color: #4CAF50;
                font-size: 12px;
                font-weight: bold;
            }
            .pixels-controls {
                display: flex;
                gap: 4px;
            }
            .pixels-controls button {
                background: none;
                border: none;
                color: #ccc;
                font-size: 14px;
                font-weight: bold;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .pixels-controls button:hover {
                background: #444;
                color: #fff;
            }
            .pixels-content {
                padding: 8px;
                box-sizing: border-box;
                max-height: 300px;
                overflow-y: auto;
            }
            .modifier-row {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 6px;
                position: relative;
            }
            .modifier-radio {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }
            .modifier-name {
                flex: 1;
                padding: 4px 6px;
                border: 1px solid #555;
                border-radius: 3px;
                background: #333;
                color: #fff;
                font-size: 12px;
                min-width: 0;
                box-sizing: border-box;
            }
            .modifier-value {
                width: 50px;
                padding: 4px;
                border: 1px solid #555;
                border-radius: 3px;
                background: #333;
                color: #fff;
                font-size: 12px;
                text-align: center;
                box-sizing: border-box;
                flex-shrink: 0;
            }
            .remove-row-btn {
                width: 20px;
                height: 20px;
                border: 1px solid #777;
                border-radius: 3px;
                background: #555;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .remove-row-btn:hover {
                background: #666;
            }
            .modifier-name:focus, .modifier-value:focus {
                outline: none;
                border-color: #777;
                background: #3a3a3a;
            }
            .add-modifier-btn {
                width: 100%;
                padding: 6px;
                border: 1px solid #555;
                border-radius: 4px;
                background: #444;
                color: #ccc;
                font-size: 11px;
                cursor: pointer;
                margin-top: 4px;
            }
            .add-modifier-btn:hover {
                background: #555;
                color: #fff;
            }
            #pixels-modifier-box.minimized .pixels-content {
                display: none;
            }
            #pixels-modifier-box.minimized {
                width: auto !important;
                min-width: 120px;
                resize: none;
            }
        `;
        document.head.appendChild(style);
    }

    function setupDragFunctionality() {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        modifierBox.querySelector('.pixels-header').addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = modifierBox.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            modifierBox.style.left = (e.clientX - dragOffset.x) + 'px';
            modifierBox.style.top = (e.clientY - dragOffset.y) + 'px';
            modifierBox.style.right = 'auto';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    function setupModifierRowLogic() {
        if (!modifierBox) return;

        // Add event listener for the add button
        const addButton = modifierBox.querySelector('.add-modifier-btn');
        addButton.addEventListener('click', () => {
            addModifierRow();
        });

        // Add event listeners for existing radio buttons and inputs
        updateEventListeners();

        function addModifierRow() {
            const content = modifierBox.querySelector('.pixels-content');
            const addButton = content.querySelector('.add-modifier-btn');
            
            // Create new row
            const newRow = document.createElement('div');
            newRow.className = 'modifier-row';
            newRow.innerHTML = `
                <input type="radio" name="modifier-select" value="${rowCounter}" class="modifier-radio" id="mod-${rowCounter}">
                <input type="text" class="modifier-name" placeholder="Modifier ${rowCounter + 1}" value="Modifier ${rowCounter + 1}" data-index="${rowCounter}">
                <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="${rowCounter}">
                <button class="remove-row-btn" type="button">×</button>
            `;
            
            // Insert before the add button
            content.insertBefore(newRow, addButton);
            rowCounter++;
            
            // Update event listeners for all rows
            updateEventListeners();
            
            console.log(`Added modifier row ${rowCounter - 1}`);
        }

        function removeModifierRow(rowElement, rowIndex) {
            // Find the actual data-index from the radio button
            const radio = rowElement.querySelector('.modifier-radio');
            const index = parseInt(radio.value);
            
            // Count total rows
            const totalRows = modifierBox.querySelectorAll('.modifier-row').length;
            
            // If this is the only row left, reset it to default values instead of removing
            if (totalRows === 1) {
                const nameInput = rowElement.querySelector('.modifier-name');
                const valueInput = rowElement.querySelector('.modifier-value');
                
                nameInput.value = "None";
                valueInput.value = "0";
                
                // Make sure it's selected
                radio.checked = true;
                
                // Update the selected modifier
                updateSelectedModifier();
                
                console.log("Reset the last remaining modifier row to default values");
                return;
            }
            
            // Check if this row was selected
            const wasSelected = radio.checked;
            
            // Remove the row
            rowElement.remove();
            
            // If the removed row was selected, select the first remaining row
            if (wasSelected) {
                const firstRadio = modifierBox.querySelector('.modifier-radio');
                if (firstRadio) {
                    firstRadio.checked = true;
                    updateSelectedModifier();
                }
            }
            
            console.log(`Removed modifier row with index ${index}`);
        }

        function updateEventListeners() {
            const rows = modifierBox.querySelectorAll('.modifier-row');
            
            rows.forEach((row, rowIndex) => {
                // Radio button change
                const radio = row.querySelector('.modifier-radio');
                radio.addEventListener('change', updateSelectedModifier);
                
                // Name input change
                const nameInput = row.querySelector('.modifier-name');
                nameInput.addEventListener('input', updateSelectedModifier);
                
                // Value input change
                const valueInput = row.querySelector('.modifier-value');
                valueInput.addEventListener('input', updateSelectedModifier);
                
                // Remove button click
                const removeButton = row.querySelector('.remove-row-btn');
                if (removeButton) {
                    removeButton.addEventListener('click', () => {
                        removeModifierRow(row, rowIndex);
                    });
                }
            });
        }
    }

    function updateSelectedModifier() {
        const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
        if (selectedRadio) {
            const index = parseInt(selectedRadio.value);
            const rows = modifierBox.querySelectorAll('.modifier-row');
            const row = rows[index];
            if (row) {
                const nameInput = row.querySelector('.modifier-name');
                const valueInput = row.querySelector('.modifier-value');
                
                // Update global variables (these should be defined in roll20.js)
                if (typeof window.pixelsModifierName !== 'undefined') {
                    window.pixelsModifierName = nameInput.value || "Unnamed";
                }
                if (typeof window.pixelsModifier !== 'undefined') {
                    window.pixelsModifier = valueInput.value || "0";
                }
                
                console.log(`Selected modifier: ${nameInput.value || "Unnamed"} = ${valueInput.value || "0"}`);
                
                // Send message to extension if the function exists
                if (typeof window.sendMessageToExtension === 'function') {
                    window.sendMessageToExtension({ 
                        action: "modifierChanged", 
                        modifier: valueInput.value || "0",
                        name: nameInput.value || "Unnamed"
                    });
                }
            }
        }
    }

    function positionModifierBox() {
        if (!modifierBox) {
            console.log("positionModifierBox called but modifierBox is null");
            return;
        }
        
        console.log("Positioning modifier box...");
        const chatContainer = document.querySelector('.textchatcontainer');
        if (chatContainer) {
            console.log("Found chat container, positioning relative to it");
            const rect = chatContainer.getBoundingClientRect();
            const boxWidth = modifierBox.offsetWidth || 280; // Use actual width or default
            // Position to the left of the chat container, aligned with its bottom
            modifierBox.style.left = (rect.left - boxWidth - 20) + 'px'; // Dynamic width + 20px gap
            modifierBox.style.top = (rect.bottom - 80) + 'px'; // Align with bottom, smaller offset
        } else {
            console.log("Chat container not found, using fallback position");
            // Fallback to default position if chat container not found
            modifierBox.style.top = '100px';
            modifierBox.style.right = '20px';
            modifierBox.style.left = 'auto';
        }
    }

    function showModifierBox() {
        console.log("showModifierBox called");
        if (!modifierBox) {
            createModifierBox();
        } else {
            console.log("Modifier box already exists, showing it");
            modifierBox.style.display = 'block';
            isModifierBoxVisible = true;
            // Reposition in case the page layout has changed
            positionModifierBox();
        }
        // Update the selected modifier based on current values
        if (modifierBox && typeof window.pixelsModifierName !== 'undefined' && typeof window.pixelsModifier !== 'undefined') {
            const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
            if (selectedRadio) {
                const index = selectedRadio.value;
                const rows = modifierBox.querySelectorAll('.modifier-row');
                const row = rows[parseInt(index)];
                if (row) {
                    const nameInput = row.querySelector('.modifier-name');
                    const valueInput = row.querySelector('.modifier-value');
                    if (nameInput) nameInput.value = window.pixelsModifierName;
                    if (valueInput) valueInput.value = window.pixelsModifier;
                }
            }
        }
    }

    function hideModifierBox() {
        console.log("hideModifierBox called");
        if (modifierBox) {
            modifierBox.style.display = 'none';
            isModifierBoxVisible = false;
            console.log("Modifier box hidden");
        } else {
            console.log("Cannot hide - modifierBox is null");
        }
    }

})();
