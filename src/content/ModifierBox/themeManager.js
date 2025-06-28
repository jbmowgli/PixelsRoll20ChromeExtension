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
        console.log("Loading modifier box styles from external CSS files...");
        
        // Check if CSSLoader is available
        if (!window.CSSLoader) {
            console.error("CSSLoader utility not found. Loading inline styles as fallback.");
            addInlineStyles();
            return;
        }

        // Define CSS files to load
        const cssFiles = [
            {
                path: 'src/content/ModifierBox/styles/modifierBox.css',
                id: 'pixels-modifier-box-base-styles'
            },
            {
                path: 'src/content/ModifierBox/styles/minimized.css',
                id: 'pixels-modifier-box-minimized-styles'
            },
            {
                path: 'src/content/ModifierBox/styles/lightTheme.css',
                id: 'pixels-modifier-box-light-theme-styles'
            }
        ];

        // Load all CSS files
        window.CSSLoader.loadMultipleCSS(cssFiles)
            .then(() => {
                console.log("All modifier box CSS files loaded successfully");
            })
            .catch(error => {
                console.error("Failed to load CSS files, falling back to inline styles:", error);
                addInlineStyles();
            });
    }

    // Fallback function for inline styles (keeping the original functionality)
    function addInlineStyles() {
        const styleId = 'pixels-modifier-box-styles-fallback';
        if (document.getElementById(styleId)) {
            console.log("Fallback modifier box styles already added, skipping");
            return;
        }

        console.log("Adding fallback inline modifier box styles...");
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Fallback Base Modifier Box Styles */
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
            /* Additional fallback styles would go here - truncated for brevity */
        `;
        
        document.head.appendChild(style);
        console.log("Fallback modifier box styles added successfully");
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
