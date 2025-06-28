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
            /* CSS Custom Properties for dynamic theming */
            #pixels-modifier-box {
                --pixels-text-color: ${colors.text};
                --pixels-input-bg: ${colors.input};
                --pixels-input-border: ${colors.inputBorder};
                --pixels-button-bg: ${colors.button};
                --pixels-button-border: ${colors.border};
            }
            
            #pixels-modifier-box {
                position: fixed;
                width: 280px;
                min-width: 250px;
                max-width: 400px;
                background: ${colors.background} !important;
                border: 2px solid ${colors.primary};
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                z-index: 999999;
                user-select: none;
                color: var(--pixels-text-color) !important;
                resize: both;
                overflow: hidden;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            
            /* Force text color inheritance for all elements inside the modifier box with higher specificity */
            #pixels-modifier-box *,
            #pixels-modifier-box,
            #pixels-modifier-box .pixels-title,
            #pixels-modifier-box .modifier-name,
            #pixels-modifier-box .modifier-value,
            #pixels-modifier-box .remove-row-btn,
            #pixels-modifier-box .pixels-controls button,
            #pixels-modifier-box .add-modifier-btn {
                color: ${colors.text} !important;
            }
            
            /* Override specific elements that need different colors */
            #pixels-modifier-box .pixels-title {
                color: ${colors.primary} !important;
            }
            
            #pixels-modifier-box .pixels-controls button,
            #pixels-modifier-box .add-modifier-btn {
                color: ${colors.textSecondary} !important;
            }
            
            .pixels-header {
                background: ${colors.surface} !important;
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
                color: ${colors.primary} !important;
                font-size: 12px;
                font-weight: bold;
                transition: color 0.3s ease;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .pixels-logo {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                filter: brightness(0) saturate(100%) invert(56%) sepia(84%) saturate(1077%) hue-rotate(82deg) brightness(97%) contrast(89%);
            }
            
            .pixels-controls {
                display: flex;
                gap: 4px;
                flex-shrink: 0;
            }
              .pixels-controls button {
                background: none;
                border: none;
                color: ${colors.textSecondary} !important;
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
                flex-shrink: 0;
            }
            
            .pixels-controls button:hover {
                background: ${colors.button};
                color: ${colors.text} !important;
            }
              .add-modifier-btn {
                background: none !important;
                border: none !important;
                color: ${colors.textSecondary} !important;
                font-size: 11px !important;
                font-weight: bold !important;
                height: 20px !important;
                padding: 0 6px !important;
                border-radius: 3px !important;
                cursor: pointer;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background-color 0.3s ease, color 0.3s ease !important;
                flex-shrink: 0 !important;
                margin: 0 !important;
                white-space: nowrap !important;
            }
            
            .add-modifier-btn:hover {
                background: ${colors.button} !important;
                color: ${colors.text} !important;
            }
            
            .pixels-content {
                padding: 8px;
                box-sizing: border-box;
                max-height: 300px;
                overflow-y: auto;
                overflow-x: hidden; /* Prevent horizontal scroll */
            }
            
            .modifier-row {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 6px;
                position: relative;
                box-sizing: border-box;
                width: 100%;
                min-width: 0; /* Allow flex items to shrink */
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
                background: ${colors.input} !important;
                color: ${colors.text} !important;
                font-size: 12px;
                min-width: 0;
                box-sizing: border-box;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            
            /* Extra specific selectors for input text color using CSS custom properties */
            #pixels-modifier-box .modifier-name,
            #pixels-modifier-box input.modifier-name,
            #pixels-modifier-box input[type="text"].modifier-name {
                color: var(--pixels-text-color) !important;
                background-color: var(--pixels-input-bg) !important;
                border-color: var(--pixels-input-border) !important;
            }
            
            .modifier-value {
                width: 50px;
                padding: 4px;
                border: 1px solid ${colors.inputBorder};
                border-radius: 3px;
                background: var(--pixels-input-bg) !important;
                color: var(--pixels-text-color) !important;
                font-size: 12px;
                text-align: center;
                box-sizing: border-box;
                flex-shrink: 0;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            
            /* Extra specific selectors for number input color using CSS custom properties */
            #pixels-modifier-box .modifier-value,
            #pixels-modifier-box input.modifier-value,
            #pixels-modifier-box input[type="number"].modifier-value {
                color: var(--pixels-text-color) !important;
                background-color: var(--pixels-input-bg) !important;
                border-color: var(--pixels-input-border) !important;
            }
            
            .remove-row-btn {
                width: 20px;
                height: 20px;
                border: 1px solid ${colors.border};
                border-radius: 3px;
                background: ${colors.button} !important;
                color: ${colors.text} !important;
                font-size: 12px;
                cursor: pointer;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            
            /* Extra specific selectors for remove button using CSS custom properties */
            #pixels-modifier-box .remove-row-btn,
            #pixels-modifier-box button.remove-row-btn {
                color: var(--pixels-text-color) !important;
                background-color: var(--pixels-button-bg) !important;
                border-color: var(--pixels-button-border) !important;
            }
            
            .remove-row-btn:hover {
                background: ${colors.buttonHover} !important;
            }
              .modifier-name:focus, .modifier-value:focus {
                outline: none;
                border-color: ${colors.primary};
                background: ${colors.theme === 'dark' ? '#3a3a3a' : '#f8f8f8'} !important;
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

    function updateTheme(modifierBox) {
        console.log("Updating modifier box theme...");
        
        // Recreate styles with new theme colors
        addModifierBoxStyles();
        
        // Force immediate style updates on the modifier box
        if (modifierBox) {
            // Get the new theme colors
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

            // Force immediate style updates on all elements
            const elementsToUpdate = [
                { selector: '#pixels-modifier-box', styles: { 
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary
                }},
                { selector: '.pixels-header', styles: { 
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border
                }},
                { selector: '.pixels-title', styles: { 
                    color: colors.primary
                }},
                { selector: '.pixels-controls button', styles: { 
                    color: colors.textSecondary
                }},
                { selector: '.add-modifier-btn', styles: { 
                    color: colors.textSecondary
                }},
                { selector: '.modifier-name', styles: { 
                    backgroundColor: colors.input,
                    color: colors.text,
                    borderColor: colors.inputBorder
                }},
                { selector: '.modifier-value', styles: { 
                    backgroundColor: colors.input,
                    color: colors.text,
                    borderColor: colors.inputBorder
                }},
                { selector: '.remove-row-btn', styles: { 
                    backgroundColor: colors.button,
                    color: colors.text,
                    borderColor: colors.border
                }}
            ];

            // Update CSS custom properties for immediate effect
            if (modifierBox) {
                modifierBox.style.setProperty('--pixels-text-color', colors.text);
                modifierBox.style.setProperty('--pixels-input-bg', colors.input);
                modifierBox.style.setProperty('--pixels-input-border', colors.inputBorder);
                modifierBox.style.setProperty('--pixels-button-bg', colors.button);
                modifierBox.style.setProperty('--pixels-button-border', colors.border);
            }

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
