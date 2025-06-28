'use strict';

//
// Theme Manager Module - Handles styling and theme updates for the modifier box
//
(function() {
    // Theme observer instance
    let themeObserver = null;

    // Export functions to global scope
    window.ModifierBoxThemeManager = {
        addStyles: addModifierBoxStyles,
        updateTheme: updateTheme,
        startThemeMonitoring: startThemeMonitoring,
        stopThemeMonitoring: stopThemeMonitoring,
        forceThemeRefresh: function(modifierBox) {
            // Force an immediate theme refresh
            console.log("Forcing theme refresh...");
            updateTheme(modifierBox);
        },
        forceElementUpdates: function(modifierBox) {
            // Force immediate style updates on problematic elements
            if (!modifierBox) return;
            
            const colors = window.ThemeDetector ? window.ThemeDetector.getThemeColors() : {
                theme: 'dark',
                primary: '#4CAF50',
                background: '#2b2b2b',
                text: '#ffffff',
                input: '#333333',
                inputBorder: '#555555',
                button: '#444444',
                border: '#555555'
            };
            
            // Force update all inputs
            const inputs = modifierBox.querySelectorAll('input[type="text"], input[type="number"]');
            inputs.forEach(input => {
                input.style.setProperty('color', colors.text, 'important');
                input.style.setProperty('background-color', colors.input, 'important');
                input.style.setProperty('border-color', colors.inputBorder, 'important');
            });
            
            // Force update all remove buttons
            const buttons = modifierBox.querySelectorAll('.remove-row-btn');
            buttons.forEach(button => {
                button.style.setProperty('color', colors.text, 'important');
                button.style.setProperty('background-color', colors.button, 'important');
                button.style.setProperty('border-color', colors.border, 'important');
            });
        }
    };

    function addModifierBoxStyles() {
        const styleId = 'pixels-modifier-box-styles';
        if (document.getElementById(styleId)) {
            console.log("Modifier box styles already added, skipping");
            return;
        }

        console.log("Adding modifier box styles to the page...");
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Base Modifier Box Styles */
            #pixels-modifier-box {
                position: fixed !important;
                z-index: 1000000 !important;
                min-width: 300px !important;
                width: 400px;
                min-height: 120px !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                font-family: Arial, sans-serif !important;
                font-size: 14px !important;
                color: #ffffff !important;
                background-color: #2b2b2b !important;
                border: 1px solid #555555 !important;
                resize: none !important;
                display: flex !important;
                flex-direction: column !important;
            }

            /* Header Styles */
            #pixels-modifier-box .pixels-header {
                cursor: move !important;
                padding: 12px 16px !important;
                font-size: 16px !important;
                font-weight: bold !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                border-bottom: 1px solid #555555 !important;
                color: #ffffff !important;
                background-color: #333333 !important;
                border-radius: 7px 7px 0 0 !important;
                flex-shrink: 0 !important;
            }

            #pixels-modifier-box .pixels-title {
                display: flex !important;
                align-items: center !important;
                font-size: 16px !important;
                font-weight: bold !important;
            }

            #pixels-modifier-box .pixels-logo {
                width: 24px !important;
                height: 24px !important;
                margin-right: 8px !important;
            }

            #pixels-modifier-box .pixels-controls {
                display: flex !important;
                gap: 4px !important;
            }

            #pixels-modifier-box .pixels-controls button {
                width: 24px !important;
                height: 24px !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: #ffffff !important;
                background-color: #444444 !important;
                transition: background-color 0.2s ease !important;
            }

            #pixels-modifier-box .pixels-controls button:hover {
                background-color: #666666 !important;
            }

            #pixels-modifier-box .add-modifier-btn {
                width: auto !important;
                padding: 4px 8px !important;
                font-size: 11px !important;
                border-radius: 3px !important;
            }

            /* Content Area */
            #pixels-modifier-box .pixels-content {
                padding: 16px !important;
                color: #ffffff !important;
                background-color: #2b2b2b !important;
                overflow-y: auto !important;
                flex: 1 !important;
                min-height: 0 !important;
            }

            /* Current Roll Display */
            #pixels-modifier-box .current-roll {
                margin-bottom: 16px !important;
                padding: 12px !important;
                border-radius: 6px !important;
                font-weight: bold !important;
                text-align: center !important;
                color: #ffffff !important;
                background-color: #444444 !important;
                border: 1px solid #666666 !important;
            }

            /* Modifier Input Styles */
            #pixels-modifier-box .modifier-input {
                width: 100% !important;
                margin-bottom: 12px !important;
                padding: 8px 12px !important;
                border-radius: 4px !important;
                box-sizing: border-box !important;
                font-size: 14px !important;
                color: #ffffff !important;
                background-color: #333333 !important;
                border: 1px solid #555555 !important;
            }

            #pixels-modifier-box .modifier-input:focus {
                outline: none !important;
                border-color: #4CAF50 !important;
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.3) !important;
            }

            /* Button Styles */
            #pixels-modifier-box .roll-btn {
                width: 100% !important;
                padding: 10px !important;
                border-radius: 6px !important;
                border: none !important;
                font-size: 14px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                margin-bottom: 8px !important;
                color: #ffffff !important;
                background-color: #4CAF50 !important;
                transition: background-color 0.2s ease !important;
            }

            #pixels-modifier-box .roll-btn:hover {
                background-color: #45a049 !important;
            }

            #pixels-modifier-box .roll-btn:active {
                background-color: #3d8b40 !important;
            }

            /* Modifier Row Styles */
            #pixels-modifier-box .modifier-row {
                display: flex !important;
                align-items: center !important;
                margin-bottom: 8px !important;
                gap: 8px !important;
            }

            #pixels-modifier-box .modifier-radio {
                flex: 0 0 auto !important;
                margin: 0 !important;
                width: 16px !important;
                height: 16px !important;
                cursor: pointer !important;
            }

            #pixels-modifier-box .modifier-name,
            #pixels-modifier-box .modifier-row input[type="text"] {
                flex: 1 !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
                font-size: 13px !important;
                color: #ffffff !important;
                background-color: #333333 !important;
                border: 1px solid #555555 !important;
            }

            #pixels-modifier-box .modifier-value,
            #pixels-modifier-box .modifier-row input[type="number"] {
                flex: 0 0 60px !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
                font-size: 13px !important;
                text-align: center !important;
                color: #ffffff !important;
                background-color: #333333 !important;
                border: 1px solid #555555 !important;
            }

            #pixels-modifier-box .modifier-name:focus,
            #pixels-modifier-box .modifier-value:focus,
            #pixels-modifier-box .modifier-row input:focus {
                outline: none !important;
                border-color: #4CAF50 !important;
                box-shadow: 0 0 3px rgba(76, 175, 80, 0.3) !important;
            }

            #pixels-modifier-box .remove-row-btn {
                flex: 0 0 auto !important;
                width: 24px !important;
                height: 24px !important;
                border-radius: 50% !important;
                border: none !important;
                font-size: 12px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: #ffffff !important;
                background-color: #444444 !important;
                transition: background-color 0.2s ease !important;
            }

            #pixels-modifier-box .remove-row-btn:hover {
                background-color: #666666 !important;
            }

            /* Add Row Button */
            #pixels-modifier-box .add-row-btn {
                width: 100% !important;
                padding: 8px !important;
                border-radius: 4px !important;
                border: 1px dashed #666666 !important;
                font-size: 13px !important;
                cursor: pointer !important;
                margin-top: 8px !important;
                color: #cccccc !important;
                background-color: transparent !important;
                transition: all 0.2s ease !important;
            }

            #pixels-modifier-box .add-row-btn:hover {
                border-color: #4CAF50 !important;
                color: #4CAF50 !important;
                background-color: rgba(76, 175, 80, 0.1) !important;
            }

            /* Minimized State */
            #pixels-modifier-box.minimized .pixels-content {
                display: none !important;
            }

            #pixels-modifier-box.minimized {
                width: auto !important;
                min-width: 200px !important;
            }

            /* Resize Handle */
            #pixels-modifier-box .pixels-resize-handle {
                position: absolute !important;
                bottom: 0 !important;
                right: 0 !important;
                width: 20px !important;
                height: 20px !important;
                cursor: se-resize !important;
                background: linear-gradient(-45deg, transparent 25%, #666 35%, transparent 45%, #666 55%, transparent 65%, #666 75%, transparent 85%) !important;
                border-bottom-right-radius: 8px !important;
                z-index: 10 !important;
                opacity: 0.6 !important;
                transition: opacity 0.2s ease !important;
            }

            #pixels-modifier-box .pixels-resize-handle:hover {
                opacity: 1 !important;
                background: linear-gradient(-45deg, transparent 25%, #888 35%, transparent 45%, #888 55%, transparent 65%, #888 75%, transparent 85%) !important;
            }

            /* Theme-specific overrides */
            .roll20-light-theme #pixels-modifier-box {
                color: #333333 !important;
                background-color: #ffffff !important;
                border-color: #dddddd !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-header {
                color: #333333 !important;
                background-color: #f8f9fa !important;
                border-bottom-color: #dddddd !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-controls button {
                color: #333333 !important;
                background-color: #e9ecef !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-controls button:hover {
                background-color: #dee2e6 !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-content {
                color: #333333 !important;
                background-color: #ffffff !important;
            }

            .roll20-light-theme #pixels-modifier-box .current-roll {
                color: #333333 !important;
                background-color: #f8f9fa !important;
                border-color: #dddddd !important;
            }

            .roll20-light-theme #pixels-modifier-box .modifier-input {
                color: #333333 !important;
                background-color: #ffffff !important;
                border-color: #cccccc !important;
            }

            .roll20-light-theme #pixels-modifier-box .modifier-name,
            .roll20-light-theme #pixels-modifier-box .modifier-value,
            .roll20-light-theme #pixels-modifier-box .modifier-row input {
                color: #333333 !important;
                background-color: #ffffff !important;
                border-color: #cccccc !important;
            }

            .roll20-light-theme #pixels-modifier-box .remove-row-btn {
                color: #333333 !important;
                background-color: #e9ecef !important;
            }

            .roll20-light-theme #pixels-modifier-box .remove-row-btn:hover {
                background-color: #dee2e6 !important;
            }

            .roll20-light-theme #pixels-modifier-box .modifier-row input[type="text"],
            .roll20-light-theme #pixels-modifier-box .modifier-row input[type="number"] {
                color: #333333 !important;
                background-color: #ffffff !important;
                border-color: #cccccc !important;
            }

            .roll20-light-theme #pixels-modifier-box .remove-row-btn {
                color: #666666 !important;
                background-color: #f8f9fa !important;
                border-color: #dddddd !important;
            }

            .roll20-light-theme #pixels-modifier-box .add-row-btn {
                color: #666666 !important;
                border-color: #cccccc !important;
            }

            .roll20-light-theme #pixels-modifier-box .add-row-btn:hover {
                border-color: #4CAF50 !important;
                color: #4CAF50 !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-resize-handle {
                background: linear-gradient(-45deg, transparent 30%, #999 40%, transparent 50%, #999 60%, transparent 70%) !important;
            }

            .roll20-light-theme #pixels-modifier-box .pixels-resize-handle:hover {
                background: linear-gradient(-45deg, transparent 30%, #777 40%, transparent 50%, #777 60%, transparent 70%) !important;
            }

            /* Accessibility improvements */
            #pixels-modifier-box * {
                box-sizing: border-box !important;
            }

            #pixels-modifier-box button:focus,
            #pixels-modifier-box input:focus {
                outline: 2px solid #4CAF50 !important;
                outline-offset: 2px !important;
            }

            /* Animation for smooth theme transitions */
            #pixels-modifier-box,
            #pixels-modifier-box * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log("Modifier box styles added successfully");
    }

    function updateTheme(modifierBox) {
        if (!modifierBox) {
            console.log("updateTheme called but modifierBox is null");
            return;
        }

        console.log("Updating modifier box theme...");
        
        // Get current theme colors
        const colors = window.ThemeDetector ? window.ThemeDetector.getThemeColors() : {
            theme: 'dark',
            primary: '#4CAF50',
            background: '#2b2b2b',
            text: '#ffffff',
            input: '#333333',
            inputBorder: '#555555',
            button: '#444444',
            border: '#555555'
        };

        console.log("Using theme colors:", colors);

        // Define element styles to update
        const elementsToUpdate = [
            {
                selector: '#pixels-modifier-box',
                styles: {
                    'background-color': colors.background,
                    'color': colors.text,
                    'border-color': colors.border
                }
            },
            {
                selector: '.pixels-header',
                styles: {
                    'background-color': colors.button,
                    'color': colors.text,
                    'border-bottom-color': colors.border
                }
            },
            {
                selector: '.pixels-content',
                styles: {
                    'background-color': colors.background,
                    'color': colors.text
                }
            },
            {
                selector: '.current-roll',
                styles: {
                    'background-color': colors.button,
                    'color': colors.text,
                    'border-color': colors.border
                }
            },
            {
                selector: '.modifier-input',
                styles: {
                    'background-color': colors.input,
                    'color': colors.text,
                    'border-color': colors.inputBorder
                }
            },
            {
                selector: '.modifier-row input[type="text"]',
                styles: {
                    'background-color': colors.input,
                    'color': colors.text,
                    'border-color': colors.inputBorder
                }
            },
            {
                selector: '.modifier-row input[type="number"]',
                styles: {
                    'background-color': colors.input,
                    'color': colors.text,
                    'border-color': colors.inputBorder
                }
            },
            {
                selector: '.remove-row-btn',
                styles: {
                    'background-color': colors.button,
                    'color': colors.text,
                    'border-color': colors.border
                }
            }
        ];

        // Apply styles immediately to force visual update
        elementsToUpdate.forEach(({ selector, styles }) => {
            const elements = modifierBox.querySelectorAll(selector);
            elements.forEach(element => {
                Object.keys(styles).forEach(property => {
                    element.style.setProperty(property, styles[property], 'important');
                });
            });
        });

        // Force update on all input elements specifically
        const allInputs = modifierBox.querySelectorAll('input[type="text"], input[type="number"]');
        allInputs.forEach(input => {
            input.style.setProperty('color', colors.text, 'important');
            input.style.setProperty('background-color', colors.input, 'important');
            input.style.setProperty('border-color', colors.inputBorder, 'important');
            // Force re-render by temporarily changing a property
            const originalOpacity = input.style.opacity;
            input.style.opacity = '0.99';
            input.offsetHeight; // Force reflow
            input.style.opacity = originalOpacity;
        });

        // Force update on all remove buttons specifically
        const allRemoveButtons = modifierBox.querySelectorAll('.remove-row-btn');
        allRemoveButtons.forEach(button => {
            button.style.setProperty('color', colors.text, 'important');
            button.style.setProperty('background-color', colors.button, 'important');
            button.style.setProperty('border-color', colors.border, 'important');
            // Force re-render
            const originalOpacity = button.style.opacity;
            button.style.opacity = '0.99';
            button.offsetHeight; // Force reflow
            button.style.opacity = originalOpacity;
        });

        // Also update the modifier box itself if it matches the selector
        if (modifierBox.id === 'pixels-modifier-box') {
            const boxStyles = elementsToUpdate[0].styles;
            Object.keys(boxStyles).forEach(property => {
                modifierBox.style.setProperty(property, boxStyles[property], 'important');
            });
        }

        // Final forced reflow on the entire modifier box
        modifierBox.style.display = 'none';
        modifierBox.offsetHeight; // Force reflow
        modifierBox.style.display = 'block';
        
        console.log("Theme update completed with immediate style application");
    }

    function startThemeMonitoring(onThemeChangeCallback) {
        if (window.ThemeDetector && !themeObserver) {
            console.log("Starting theme monitoring for modifier box...");
            themeObserver = window.ThemeDetector.onThemeChange((newTheme, colors) => {
                console.log("Theme changed to:", newTheme, colors);
                if (onThemeChangeCallback) {
                    onThemeChangeCallback(newTheme, colors);
                }
            });
        }
    }

    function stopThemeMonitoring() {
        if (themeObserver) {
            console.log("Stopping theme monitoring for modifier box...");
            themeObserver.disconnect();
            themeObserver = null;
        }
    }

    console.log("ModifierBoxThemeManager module initialized");
})();
