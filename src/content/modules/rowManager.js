'use strict';

//
// Row Manager Module - Handles adding, removing, and managing modifier rows
//
(function() {
    let rowCounter = 1; // Start from 1 since we have row 0

    // Export functions to global scope
    window.ModifierBoxRowManager = {
        setupModifierRowLogic: setupModifierRowLogic,
        addModifierRow: addModifierRow,
        removeModifierRow: removeModifierRow,
        updateEventListeners: updateEventListeners,
        updateSelectedModifier: updateSelectedModifier,
        getRowCounter: () => rowCounter,
        setRowCounter: (value) => rowCounter = value
    };

    function setupModifierRowLogic(modifierBox, updateSelectedModifierCallback) {
        if (!modifierBox) {
            console.error("setupModifierRowLogic: modifierBox is required");
            return;
        }

        // Add event listener for the add button (only if not already added)
        const addButton = modifierBox.querySelector('.add-modifier-btn');
        if (addButton && !addButton.hasAttribute('data-listener-added')) {
            addButton.addEventListener('click', () => {
                addModifierRow(modifierBox, updateSelectedModifierCallback);
            });
            addButton.setAttribute('data-listener-added', 'true');
        }

        // Add event listeners for existing radio buttons and inputs
        updateEventListeners(modifierBox, updateSelectedModifierCallback);
    }

    function addModifierRow(modifierBox, updateSelectedModifierCallback) {
        if (!modifierBox) {
            console.error("addModifierRow: modifierBox is required");
            return;
        }

        const content = modifierBox.querySelector('.pixels-content');
        if (!content) {
            console.error("addModifierRow: content area not found");
            return;
        }
        
        // Create new row
        const newRow = document.createElement('div');
        newRow.className = 'modifier-row';
        newRow.innerHTML = `
            <input type="radio" name="modifier-select" value="${rowCounter}" class="modifier-radio" id="mod-${rowCounter}">
            <input type="text" class="modifier-name" placeholder="Modifier ${rowCounter + 1}" value="Modifier ${rowCounter + 1}" data-index="${rowCounter}">
            <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="${rowCounter}">
            <button class="remove-row-btn" type="button">×</button>
        `;
        
        // Append the new row to the content area
        content.appendChild(newRow);
        rowCounter++;
        
        // Update event listeners for all rows
        updateEventListeners(modifierBox, updateSelectedModifierCallback);
        
        // Force theme updates on the new elements
        if (window.ModifierBoxThemeManager && window.ModifierBoxThemeManager.forceElementUpdates) {
            window.ModifierBoxThemeManager.forceElementUpdates(modifierBox);
        }
        
        console.log(`Added modifier row ${rowCounter - 1}`);
    }

    function removeModifierRow(rowElement, modifierBox, updateSelectedModifierCallback) {
        if (!rowElement) {
            console.error('removeModifierRow: rowElement is null or undefined');
            return;
        }
        
        if (!modifierBox) {
            console.error('removeModifierRow: modifierBox is required');
            return;
        }
        
        // Find the actual data-index from the radio button
        const radio = rowElement.querySelector('.modifier-radio');
        if (!radio) {
            console.error('removeModifierRow: radio button not found in row');
            return;
        }
        
        const index = parseInt(radio.value);
        
        // Count total rows
        const totalRows = modifierBox.querySelectorAll('.modifier-row').length;
        
        // If this is the only row left, reset it to default values instead of removing
        if (totalRows === 1) {
            console.log('Only one row left, resetting instead of removing');
            const nameInput = rowElement.querySelector('.modifier-name');
            const valueInput = rowElement.querySelector('.modifier-value');
            
            nameInput.value = "Modifier 1";
            valueInput.value = "0";
            
            // Make sure it's selected
            radio.checked = true;
            
            // Update the selected modifier
            if (updateSelectedModifierCallback) {
                updateSelectedModifierCallback();
            }
            
            console.log("Reset the last remaining modifier row to default values");
            return;
        }
        
        console.log('Proceeding to remove row');
        
        // Check if this row was selected
        const wasSelected = radio.checked;
        console.log('Row was selected:', wasSelected);
        
        // Remove the row
        console.log('Removing row element from DOM');
        rowElement.remove();
        
        console.log('Row removed, checking if need to select another row');
        
        // If the removed row was selected, select the first remaining row
        if (wasSelected) {
            const firstRadio = modifierBox.querySelector('.modifier-radio');
            if (firstRadio) {
                console.log('Selecting first remaining row');
                firstRadio.checked = true;
                if (updateSelectedModifierCallback) {
                    updateSelectedModifierCallback();
                }
            } else {
                console.log('No remaining rows found');
            }
        }
        
        console.log(`Successfully removed modifier row with index ${index}`);
    }

    function updateEventListeners(modifierBox, updateSelectedModifierCallback) {
        if (!modifierBox) {
            console.error("updateEventListeners: modifierBox is required");
            return;
        }

        // Remove all existing event listeners by clearing and re-adding rows
        // This is simpler than trying to manage individual listeners
        const rows = modifierBox.querySelectorAll('.modifier-row');
        
        rows.forEach((row) => {
            // Get elements
            const radio = row.querySelector('.modifier-radio');
            const nameInput = row.querySelector('.modifier-name');
            const valueInput = row.querySelector('.modifier-value');
            const removeButton = row.querySelector('.remove-row-btn');
            
            // Add event listeners (removing duplicates isn't critical since 
            // addEventListener with the same function reference won't add duplicates)
            if (radio && updateSelectedModifierCallback) {
                radio.addEventListener('change', updateSelectedModifierCallback);
            }
            if (nameInput && updateSelectedModifierCallback) {
                nameInput.addEventListener('input', updateSelectedModifierCallback);
            }
            if (valueInput && updateSelectedModifierCallback) {
                valueInput.addEventListener('input', updateSelectedModifierCallback);
            }
            
            // For remove button, we need to ensure we get the right row
            // Use a closure to capture the current row element
            if (removeButton) {
                removeButton.onclick = function() {
                    removeModifierRow(row, modifierBox, updateSelectedModifierCallback);
                };
            }
        });
    }

    function updateSelectedModifier(modifierBox) {
        if (!modifierBox) {
            console.error("updateSelectedModifier: modifierBox is required");
            return;
        }

        const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
        if (selectedRadio) {
            const index = parseInt(selectedRadio.value);
            const rows = modifierBox.querySelectorAll('.modifier-row');
            const row = rows[index];
            if (row) {
                const nameInput = row.querySelector('.modifier-name');
                const valueInput = row.querySelector('.modifier-value');
                
                // Update global variables (these should be defined in roll20.js)
                const modifierName = nameInput.value || "Unnamed";
                const modifierValue = valueInput.value || "0";
                
                if (typeof window.pixelsModifierName !== 'undefined') {
                    window.pixelsModifierName = modifierName;
                    console.log(`Updated pixelsModifierName to: "${window.pixelsModifierName}"`);
                }
                if (typeof window.pixelsModifier !== 'undefined') {
                    window.pixelsModifier = modifierValue;
                    console.log(`Updated pixelsModifier to: "${window.pixelsModifier}"`);
                }
                
                // Update the header title to show the selected modifier
                const headerTitle = modifierBox.querySelector('.pixels-title');
                if (headerTitle) {
                    const valueText = modifierValue === "0" ? "±0" : (modifierValue > 0 ? `+${modifierValue}` : modifierValue);
                    // Find the logo image and preserve it, then update the text content
                    const logoImg = headerTitle.querySelector('.pixels-logo');
                    if (logoImg) {
                        headerTitle.innerHTML = `<img src="${logoImg.src}" alt="Pixels" class="pixels-logo"> ${modifierName} (${valueText})`;
                    } else {
                        headerTitle.textContent = `${modifierName} (${valueText})`;
                    }
                }

                console.log(`Selected modifier: ${modifierName} = ${modifierValue}`);
                console.log(`Global variables - pixelsModifierName: "${window.pixelsModifierName}", pixelsModifier: "${window.pixelsModifier}"`);
                
                // Send message to extension if the function exists
                if (typeof window.sendMessageToExtension === 'function') {
                    window.sendMessageToExtension({ 
                        action: "modifierChanged", 
                        modifier: modifierValue,
                        name: modifierName
                    });
                }
            }
        }
    }

    console.log("ModifierBoxRowManager module initialized");
})();
