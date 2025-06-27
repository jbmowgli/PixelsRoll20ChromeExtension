'use strict';

//
// Floating Modifier Box Module - Singleton Pattern
//
(function() {    // Singleton instance variables
    let modifierBox = null;
    let isModifierBoxVisible = false;
    let rowCounter = 1; // Start from 1 since we have row 0
    let isInitialized = false;
    let themeObserver = null; // For monitoring theme changes

    // Prevent multiple initialization
    if (window.ModifierBox) {
        console.warn("ModifierBox module already loaded, skipping re-initialization");
        return;
    }    // Export functions to global scope
    window.ModifierBox = {
        create: createModifierBox,
        show: showModifierBox,
        hide: hideModifierBox,
        isVisible: () => isModifierBoxVisible,
        getElement: () => modifierBox,
        updateSelectedModifier: updateSelectedModifier,
        isInitialized: () => isInitialized,
        updateTheme: updateTheme
    };function createModifierBox() {
        console.log("Creating modifier box...");
        
        // Singleton check - ensure only one instance exists
        if (modifierBox) {
            console.log("Modifier box already exists, returning existing instance");
            return modifierBox;
        }

        // Check if an existing modifier box exists in the DOM
        const existingBox = document.getElementById('pixels-modifier-box');
        if (existingBox) {
            console.log("Found existing modifier box in DOM, adopting it");
            modifierBox = existingBox;
            isModifierBoxVisible = existingBox.style.display !== 'none';
            setupModifierRowLogic(); // Re-setup event listeners
            isInitialized = true;
            return modifierBox;
        }

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
        setupModifierRowLogic();        document.body.appendChild(modifierBox);
        isModifierBoxVisible = true;
        isInitialized = true;

        // Position relative to textchatcontainer
        positionModifierBox();
        
        // Add window resize listener to reposition the box
        window.addEventListener('resize', positionModifierBox);
        
        console.log("Modifier box created and added to page");
        return modifierBox;
    }    function addModifierBoxStyles() {
        // Remove existing styles if they exist
        const existingStyle = document.getElementById('pixels-modifier-box-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'pixels-modifier-box-styles';
        
        // Get theme colors if ThemeDetector is available
        let colors = {
            theme: 'dark',
            primary: '#4CAF50',
            background: '#2b2b2b',
            surface: '#1a1a1a',
            border: '#555555',
            text: '#ffffff',
            textSecondary: '#cccccc',
            input: '#333333',
            inputBorder: '#555555',
            button: '#444444',
            buttonHover: '#555555'
        };

        if (window.ThemeDetector) {
            colors = window.ThemeDetector.getThemeColors();
        }

        style.textContent = `
            #pixels-modifier-box {
                position: fixed;
                width: 280px;
                min-width: 250px;
                max-width: 400px;
                background: ${colors.background};
                border: 2px solid ${colors.primary};
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                z-index: 999999;
                user-select: none;
                color: ${colors.text};
                resize: both;
                overflow: hidden;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            .pixels-header {
                background: ${colors.surface};
                padding: 8px 12px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid ${colors.border};
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            .pixels-title {
                color: ${colors.primary};
                font-size: 12px;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            .pixels-controls {
                display: flex;
                gap: 4px;
            }
            .pixels-controls button {
                background: none;
                border: none;
                color: ${colors.textSecondary};
                font-size: 14px;
                font-weight: bold;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s ease, color 0.3s ease;
            }
            .pixels-controls button:hover {
                background: ${colors.button};
                color: ${colors.text};
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
                accent-color: ${colors.primary};
            }
            .modifier-name {
                flex: 1;
                padding: 4px 6px;
                border: 1px solid ${colors.inputBorder};
                border-radius: 3px;
                background: ${colors.input};
                color: ${colors.text};
                font-size: 12px;
                min-width: 0;
                box-sizing: border-box;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            .modifier-value {
                width: 50px;
                padding: 4px;
                border: 1px solid ${colors.inputBorder};
                border-radius: 3px;
                background: ${colors.input};
                color: ${colors.text};
                font-size: 12px;
                text-align: center;
                box-sizing: border-box;
                flex-shrink: 0;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            .remove-row-btn {
                width: 20px;
                height: 20px;
                border: 1px solid ${colors.border};
                border-radius: 3px;
                background: ${colors.button};
                color: ${colors.text};
                font-size: 12px;
                cursor: pointer;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            .remove-row-btn:hover {
                background: ${colors.buttonHover};
            }
            .modifier-name:focus, .modifier-value:focus {
                outline: none;
                border-color: ${colors.primary};
                background: ${colors.theme === 'dark' ? '#3a3a3a' : '#f8f8f8'};
            }
            .add-modifier-btn {
                width: 100%;
                padding: 6px;
                border: 1px solid ${colors.inputBorder};
                border-radius: 4px;
                background: ${colors.button};
                color: ${colors.textSecondary};
                font-size: 11px;
                cursor: pointer;
                margin-top: 4px;
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            .add-modifier-btn:hover {
                background: ${colors.buttonHover};
                color: ${colors.text};
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
                
                nameInput.value = "Pixel Dice";
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
    }    function showModifierBox() {
        console.log("showModifierBox called");
        
        // Singleton check
        if (!modifierBox) {
            const result = createModifierBox();
            if (!result) {
                console.error("Failed to create modifier box");
                return;
            }
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
        } else {            console.log("Cannot hide - modifierBox is null");
        }
    }

    // Theme update function
    function updateTheme() {
        console.log("Updating modifier box theme...");
        addModifierBoxStyles(); // Recreate styles with new theme colors
    }

    // Start theme monitoring when box is created
    function startThemeMonitoring() {
        if (window.ThemeDetector && !themeObserver) {
            console.log("Starting theme monitoring for modifier box...");
            themeObserver = window.ThemeDetector.onThemeChange((newTheme, colors) => {
                console.log("Theme changed to:", newTheme, colors);
                updateTheme();
            });
        }
    }

    // Stop theme monitoring
    function stopThemeMonitoring() {
        if (themeObserver) {
            console.log("Stopping theme monitoring for modifier box...");
            themeObserver.disconnect();
            themeObserver = null;
        }
    }

    // Update the create function to start theme monitoring
    const originalCreateModifierBox = createModifierBox;
    createModifierBox = function() {
        const result = originalCreateModifierBox.apply(this, arguments);
        if (result && isInitialized) {
            startThemeMonitoring();
        }
        return result;
    };

    // Update the hide function to optionally stop theme monitoring
    const originalHideModifierBox = hideModifierBox;
    hideModifierBox = function() {
        originalHideModifierBox.apply(this, arguments);
        // Keep theme monitoring active even when hidden, so it's ready when shown again
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopThemeMonitoring();
    });

    // Mark module as initialized
    isInitialized = true;
    console.log("ModifierBox module initialized as singleton");

})();
