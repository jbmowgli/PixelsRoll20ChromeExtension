'use strict';

/**
 * Main Initialization and Coordination for Pixels Roll20 Extension
 * Coordinates all the different modules and handles initial setup
 */

(function () {
  // Prevent multiple initializations
  if (typeof window.roll20PixelsLoaded !== 'undefined') {
    return;
  }
  
  window.roll20PixelsLoaded = true;
  
  // Global modifier variables (accessed by modifierBox.js)
  window.pixelsModifier = '0';
  window.pixelsModifierName = 'Modifier 1';
  
  // Global pixels array
  window.pixels = [];

  // Chat message formulas
  // Formula when modifier box is visible (shows modifier details)
  window.pixelsFormulaWithModifier =
    '&{template:default} {{name=#modifier_name}} {{Pixel Die=[[#face_value]]}} {{Modifier=[[#modifier]]}} {{Total=[[#face_value + #modifier]]}}';

  // Formula when modifier box is hidden (simplified display)
  window.pixelsFormulaSimple =
    '&{template:default} {{name=Result}} {{Pixel Dice=[[#result]]}}';

  // Legacy formula variable for backward compatibility
  window.pixelsFormula = window.pixelsFormulaWithModifier;

  // Initialize all modules
  function initializePixelsExtension() {
    console.log('Starting Pixels Roll20 extension');

    // Initialize global cleanup for bluetooth connections
    if (window.PixelsBluetoothManager && window.PixelsBluetoothManager.initializeGlobalCleanup) {
      window.PixelsBluetoothManager.initializeGlobalCleanup();
    }

    // Set up extension message listener
    if (window.PixelsExtensionMessaging && window.PixelsExtensionMessaging.setupMessageListener) {
      window.PixelsExtensionMessaging.setupMessageListener();
    }

    // Send initial status
    if (window.sendStatusToExtension) {
      window.sendStatusToExtension();
    }

    // Load modifier settings from localStorage
    console.log('Loading modifier settings from localStorage...');
    if (window.loadModifierSettings) {
      window.loadModifierSettings();
    }

    // Show modifier box by default
    console.log('Attempting to show modifier box automatically...');
    setTimeout(() => {
      try {
        if (window.showModifierBox) {
          window.showModifierBox();
          console.log('Modifier box shown successfully on page load');
        }
      } catch (error) {
        console.log('Error showing modifier box: ' + error);
      }
    }, 1000);
  }

  // Wait for all modules to be loaded before initializing
  function waitForModulesAndInitialize() {
    const requiredModules = [
      'PixelsSessionStorage',
      'PixelsChatIntegration', 
      'Pixel',
      'PixelsBluetoothManager',
      'PixelsExtensionMessaging',
      'PixelsModifierBoxIntegration'
    ];

    let attempts = 0;
    const maxAttempts = 50; // 5 seconds total
    
    function checkModules() {
      const allLoaded = requiredModules.every(module => window[module] !== undefined);
      
      if (allLoaded) {
        initializePixelsExtension();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkModules, 100);
      } else {
        console.warn('Some modules failed to load within timeout, initializing anyway');
        initializePixelsExtension();
      }
    }
    
    checkModules();
  }

  // Export initialization function
  window.PixelsInitialization = {
    initializePixelsExtension,
    waitForModulesAndInitialize
  };

  // Start the initialization process
  waitForModulesAndInitialize();
})();
