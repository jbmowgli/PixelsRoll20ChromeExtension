'use strict';

//
// Floating Modifier Box Module - Singleton Pattern
// Refactored to use modular components for better maintainability
//
(function() {
    // Singleton instance variables
    let modifierBox = null;
    let isModifierBoxVisible = false;
    let isInitialized = false;

    // Prevent multiple initialization
    if (window.ModifierBox) {
        console.warn("ModifierBox module already loaded, skipping re-initialization");
        return;
    }

    // Export functions to global scope
    window.ModifierBox = {
        create: createModifierBox,
        show: showModifierBox,
        hide: hideModifierBox,
        isVisible: () => isModifierBoxVisible,
        getElement: () => modifierBox,
        updateSelectedModifier: () => {
            if (window.ModifierBoxRowManager && modifierBox) {
                window.ModifierBoxRowManager.updateSelectedModifier(modifierBox);
            }
        },
        isInitialized: () => isInitialized,
        updateTheme: () => {
            if (window.ModifierBoxThemeManager && modifierBox) {
                window.ModifierBoxThemeManager.updateTheme(modifierBox);
            }
        },
        forceThemeRefresh: () => {
            if (window.ModifierBoxThemeManager && modifierBox) {
                window.ModifierBoxThemeManager.forceThemeRefresh(modifierBox);
                window.ModifierBoxThemeManager.forceElementUpdates(modifierBox);
            }
        },
        syncGlobalVars: () => {
            // Force sync global variables with current modifier values
            if (modifierBox && window.ModifierBoxRowManager) {
                window.ModifierBoxRowManager.updateSelectedModifier(modifierBox);
            }
        }
    };

    function createModifierBox() {
        console.log("Creating modifier box...");
        
        // Check if required modules are available
        if (!window.ModifierBoxThemeManager || !window.ModifierBoxDragHandler || 
            !window.ModifierBoxRowManager) {
            console.error("Required modules not loaded. Make sure all modifier box modules are included.");
            return null;
        }
        
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
            
            // Update the first row's default values to match current standards
            const firstNameInput = existingBox.querySelector('.modifier-name');
            if (firstNameInput && (firstNameInput.value === "None" || firstNameInput.value === "D20")) {
                firstNameInput.value = "Modifier 1";
                firstNameInput.placeholder = "Modifier 1";
                
                // Update global variable too
                if (typeof window.pixelsModifierName !== 'undefined') {
                    window.pixelsModifierName = "Modifier 1";
                }
            }
            
            setupModifierBoxComponents(); // Setup all components
            isInitialized = true;
            return modifierBox;
        }

        // Create the floating box
        modifierBox = document.createElement('div');
        modifierBox.id = 'pixels-modifier-box';
        modifierBox.setAttribute('data-testid', 'pixels-modifier-box');
        modifierBox.className = 'PIXELS_EXTENSION_BOX_FIND_ME';

        // Get logo URL safely - handle both extension and test environments
        let logoUrl = 'assets/images/logo-128.png'; // fallback
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
                logoUrl = chrome.runtime.getURL('assets/images/logo-128.png');
            }
        } catch (error) {
            console.log("Using fallback logo URL (not in extension context)");
        }

        modifierBox.innerHTML = `
            <div class="pixels-header">
                <span class="pixels-title">
                    <img src="${logoUrl}" alt="Pixels" class="pixels-logo"> Dice Modifiers
                </span>
                <div class="pixels-controls">
                    <button class="add-modifier-btn" type="button" title="Add Row">Add</button>
                    <button class="pixels-minimize" title="Minimize">−</button>
                    <button class="pixels-close" title="Close">×</button>
                </div>
            </div>
            <div class="pixels-content">
                <div class="modifier-row">
                    <input type="radio" name="modifier-select" value="0" class="modifier-radio" id="mod-0" checked>
                    <input type="text" class="modifier-name" placeholder="Modifier 1" value="Modifier 1" data-index="0">
                    <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="0">
                    <button class="remove-row-btn" type="button">×</button>
                </div>
            </div>
        `;

        // Setup all components
        setupModifierBoxComponents();

        document.body.appendChild(modifierBox);
        isModifierBoxVisible = true;
        isInitialized = true;

        console.log("Modifier box created and added to page");
        return modifierBox;
    }

    function setupModifierBoxComponents() {
        if (!modifierBox) {
            console.error("setupModifierBoxComponents: modifierBox is null");
            return;
        }

        // Check if already setup to prevent duplicate event listeners
        if (modifierBox.hasAttribute('data-components-setup')) {
            console.log("Components already setup, skipping");
            return;
        }

        // Add CSS styles using theme manager
        window.ModifierBoxThemeManager.addStyles();

        // Setup drag functionality
        window.ModifierBoxDragHandler.setupDragFunctionality(modifierBox);

        // Set fixed position - top left corner
        modifierBox.style.top = '20px';
        modifierBox.style.left = '60px'; 
        modifierBox.style.right = 'auto';

        // Add close and minimize functionality
        const closeBtn = modifierBox.querySelector('.pixels-close');
        const minimizeBtn = modifierBox.querySelector('.pixels-minimize');
        
        if (closeBtn) {
            console.log("Close button found, adding event listener");
            closeBtn.addEventListener('click', (e) => {
                console.log("Close button clicked - hiding modifier box");
                e.preventDefault();
                e.stopPropagation();
                
                // Debug: log current state before hiding
                console.log("Before hide - display:", modifierBox.style.display, "isVisible:", isModifierBoxVisible);
                
                hideModifierBox();
                
                // Debug: log state after hiding
                setTimeout(() => {
                    console.log("After hide - display:", modifierBox.style.display, "isVisible:", isModifierBoxVisible);
                }, 10);
            });
        } else {
            console.error("Close button not found!");
        }

        if (minimizeBtn) {
            console.log("Minimize button found, adding event listener");
            minimizeBtn.addEventListener('click', (e) => {
                console.log("Minimize button clicked");
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyMinimized = modifierBox.classList.contains('minimized');
                
                if (!isCurrentlyMinimized) {
                    // Store current dimensions before minimizing
                    const rect = modifierBox.getBoundingClientRect();
                    modifierBox.setAttribute('data-original-width', rect.width);
                    modifierBox.setAttribute('data-original-height', rect.height);
                    
                    // Minimize
                    modifierBox.classList.add('minimized');
                    // Force the minimized dimensions to override any inline styles
                    modifierBox.style.setProperty('width', '200px', 'important');
                    modifierBox.style.setProperty('min-width', '200px', 'important');
                    modifierBox.style.setProperty('max-width', '200px', 'important');
                    modifierBox.style.setProperty('height', 'auto', 'important');
                    modifierBox.style.setProperty('min-height', 'auto', 'important');
                    minimizeBtn.textContent = '+';
                    minimizeBtn.title = 'Restore';
                    console.log("Minimized - stored dimensions:", rect.width, "x", rect.height);
                } else {
                    // Restore original dimensions
                    const originalWidth = modifierBox.getAttribute('data-original-width');
                    const originalHeight = modifierBox.getAttribute('data-original-height');
                    
                    modifierBox.classList.remove('minimized');
                    
                    // Clear forced minimized styles
                    modifierBox.style.removeProperty('min-width');
                    modifierBox.style.removeProperty('max-width');
                    modifierBox.style.removeProperty('min-height');
                    
                    // Restore dimensions if they were stored
                    if (originalWidth && originalHeight) {
                        modifierBox.style.setProperty('width', originalWidth + 'px', 'important');
                        modifierBox.style.setProperty('height', originalHeight + 'px', 'important');
                        console.log("Restored dimensions:", originalWidth, "x", originalHeight);
                    }
                    
                    minimizeBtn.textContent = '−';
                    minimizeBtn.title = 'Minimize';
                }
            });
        } else {
            console.error("Minimize button not found!");
        }

        // Setup row management with callback
        const updateCallback = () => window.ModifierBoxRowManager.updateSelectedModifier(modifierBox);
        window.ModifierBoxRowManager.setupModifierRowLogic(modifierBox, updateCallback);

        // Start theme monitoring
        window.ModifierBoxThemeManager.startThemeMonitoring((newTheme, colors) => {
            console.log("Theme changed to:", newTheme, colors);
            window.ModifierBoxThemeManager.updateTheme(modifierBox);
        });

        // Update header to show initial modifier
        window.ModifierBoxRowManager.updateSelectedModifier(modifierBox);
        
        // Mark as setup
        modifierBox.setAttribute('data-components-setup', 'true');
        console.log("Components setup completed");
    }

    function showModifierBox() {
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
            modifierBox.style.setProperty('display', 'block', 'important');
            isModifierBoxVisible = true;
            
            // Only reset position if it's not been set or if it's at 0,0 (which means lost)
            const currentTop = parseInt(modifierBox.style.top) || 0;
            const currentLeft = parseInt(modifierBox.style.left) || 0;
            
            if (currentTop <= 0 || currentLeft <= 0 || 
                currentLeft > window.innerWidth || currentTop > window.innerHeight) {
                console.log("Resetting position - current position invalid");
                modifierBox.style.top = '20px';
                modifierBox.style.left = '20px';
            } else {
                console.log("Keeping existing position:", currentLeft, currentTop);
            }
            modifierBox.style.right = 'auto';
            modifierBox.style.bottom = 'auto';
            
            // Force theme update to ensure correct colors are applied
            if (window.ModifierBoxThemeManager) {
                window.ModifierBoxThemeManager.updateTheme(modifierBox);
                // Also force element-specific updates
                window.ModifierBoxThemeManager.forceElementUpdates(modifierBox);
            }
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
            console.log("Hiding modifier box");
            // Use setProperty with important to ensure it overrides any CSS
            modifierBox.style.setProperty('display', 'none', 'important');
            isModifierBoxVisible = false;
            console.log("Modifier box hidden successfully - display set to:", modifierBox.style.display);
        } else {
            console.error("Cannot hide - modifierBox is null");
        }
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.ModifierBoxThemeManager) {
            window.ModifierBoxThemeManager.stopThemeMonitoring();
        }
    });

    // Mark module as initialized
    isInitialized = true;
    console.log("ModifierBox module initialized as singleton with modular components");

})();
