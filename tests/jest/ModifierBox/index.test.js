/**
 * @jest-environment jsdom
 */

// Import the module by reading and evaluating it
const fs = require('fs');
const path = require('path');

// Helper function to load a module file
function loadModule(modulePath) {
  const fullPath = path.join(__dirname, '../../../', modulePath);
  const moduleCode = fs.readFileSync(fullPath, 'utf8');
  eval(moduleCode);
}

describe('ModifierBox Main Module', () => {
  beforeEach(() => {
    // Reset DOM and global state
    resetMocks();
    
    // Load dependencies first (mock them)
    window.ModifierBoxThemeManager = {
      addStyles: jest.fn(),
      updateTheme: jest.fn(),
      startThemeMonitoring: jest.fn(),
      stopThemeMonitoring: jest.fn(),
      forceThemeRefresh: jest.fn(),
      forceElementUpdates: jest.fn()
    };
    
    window.ModifierBoxDragHandler = {
      setupDragFunctionality: jest.fn()
    };
    
    window.ModifierBoxRowManager = {
      setupModifierRowLogic: jest.fn(),
      updateSelectedModifier: jest.fn()
    };
    
    // Load the main ModifierBox module
    loadModule('src/content/ModifierBox/modifierBox.js');
  });

  describe('Module Initialization', () => {
    test('should initialize ModifierBox global object', () => {
      expect(window.ModifierBox).toBeDefined();
      expect(typeof window.ModifierBox).toBe('object');
    });

    test('should expose correct API methods', () => {
      expect(window.ModifierBox.create).toBeInstanceOf(Function);
      expect(window.ModifierBox.show).toBeInstanceOf(Function);
      expect(window.ModifierBox.hide).toBeInstanceOf(Function);
      expect(window.ModifierBox.isVisible).toBeInstanceOf(Function);
      expect(window.ModifierBox.getElement).toBeInstanceOf(Function);
      expect(window.ModifierBox.updateSelectedModifier).toBeInstanceOf(Function);
      expect(window.ModifierBox.isInitialized).toBeInstanceOf(Function);
      expect(window.ModifierBox.updateTheme).toBeInstanceOf(Function);
      expect(window.ModifierBox.forceThemeRefresh).toBeInstanceOf(Function);
      expect(window.ModifierBox.syncGlobalVars).toBeInstanceOf(Function);
    });

    test('should prevent multiple initialization', () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      // Try to load the module again
      loadModule('src/content/ModifierBox/modifierBox.js');
      expect(consoleSpy).toHaveBeenCalledWith("ModifierBox module already loaded, skipping re-initialization");
    });
  });

  describe('createModifierBox', () => {
    test('should create modifier box element with correct structure', async () => {
      const element = await window.ModifierBox.create();
      
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.id).toBe('pixels-modifier-box');
      expect(element.getAttribute('data-testid')).toBe('pixels-modifier-box');
      expect(element.className).toBe('PIXELS_EXTENSION_BOX_FIND_ME');
    });

    test('should create modifier box with correct HTML structure', async () => {
      const element = await window.ModifierBox.create();
      
      // Check header
      const header = element.querySelector('.pixels-header');
      expect(header).toBeTruthy();
      
      const title = header.querySelector('.pixels-title');
      expect(title).toBeTruthy();
      
      const controls = header.querySelector('.pixels-controls');
      expect(controls).toBeTruthy();
      
      // Check buttons
      expect(element.querySelector('.add-modifier-btn')).toBeTruthy();
      expect(element.querySelector('.pixels-minimize')).toBeTruthy();
      expect(element.querySelector('.pixels-close')).toBeTruthy();
      
      // Check content area
      const content = element.querySelector('.pixels-content');
      expect(content).toBeTruthy();
      
      // Check initial modifier row
      const modifierRow = content.querySelector('.modifier-row');
      expect(modifierRow).toBeTruthy();
      
      const radio = modifierRow.querySelector('input[type="radio"]');
      const nameInput = modifierRow.querySelector('input[type="text"]');
      const valueInput = modifierRow.querySelector('input[type="number"]');
      const removeBtn = modifierRow.querySelector('.remove-row-btn');
      
      expect(radio).toBeTruthy();
      expect(nameInput).toBeTruthy();
      expect(valueInput).toBeTruthy();
      expect(removeBtn).toBeTruthy();
      
      expect(radio.checked).toBe(true);
      expect(nameInput.value).toBe('Modifier 1');
      expect(valueInput.value).toBe('0');
    });

    test('should return existing modifier box if one already exists', async () => {
      const firstElement = await window.ModifierBox.create();
      const secondElement = await window.ModifierBox.create();
      
      expect(firstElement).toBe(secondElement);
      expect(console.log).toHaveBeenCalledWith("Modifier box already exists, returning existing instance");
    });

    test('should adopt existing modifier box from DOM', async () => {
      // Create an existing element in the DOM
      const existingBox = document.createElement('div');
      existingBox.id = 'pixels-modifier-box';
      existingBox.innerHTML = `
        <div class="modifier-row">
          <input type="text" class="modifier-name" value="D20">
        </div>
      `;
      document.body.appendChild(existingBox);
      
      const element = await window.ModifierBox.create();
      
      expect(element).toBe(existingBox);
      expect(console.log).toHaveBeenCalledWith("Found existing modifier box in DOM, adopting it");
      
      // Check that "D20" was updated to "Modifier 1"
      const nameInput = element.querySelector('.modifier-name');
      expect(nameInput.value).toBe('Modifier 1');
    });

    test('should call all component setup methods', async () => {
      await window.ModifierBox.create();
      
      expect(window.ModifierBoxThemeManager.addStyles).toHaveBeenCalled();
      expect(window.ModifierBoxDragHandler.setupDragFunctionality).toHaveBeenCalled();
      expect(window.ModifierBoxRowManager.setupModifierRowLogic).toHaveBeenCalled();
      expect(window.ModifierBoxThemeManager.startThemeMonitoring).toHaveBeenCalled();
    });

    test('should handle missing dependencies gracefully', async () => {
      // Remove dependencies
      delete window.ModifierBoxThemeManager;
      delete window.ModifierBoxDragHandler;
      delete window.ModifierBoxRowManager;
      
      // Reload module
      delete window.ModifierBox;
      loadModule('src/content/ModifierBox/modifierBox.js');
      
      const element = await window.ModifierBox.create();
      
      expect(element).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Required modules not loaded. Make sure all modifier box modules are included.");
    });
  });

  describe('showModifierBox', () => {
    test('should create and show modifier box if it does not exist', async () => {
      await window.ModifierBox.show();
      
      expect(window.ModifierBox.isVisible()).toBe(true);
      expect(window.ModifierBox.getElement()).toBeInstanceOf(HTMLElement);
      expect(document.body.contains(window.ModifierBox.getElement())).toBe(true);
    });

    test('should show existing modifier box', async () => {
      // Create modifier box first
      const element = await window.ModifierBox.create();
      element.style.display = 'none';
      
      await window.ModifierBox.show();
      
      expect(element.style.display).toBe('block');
      expect(window.ModifierBox.isVisible()).toBe(true);
    });

    test('should apply fixed position and update theme when showing existing box', async () => {
      // Create modifier box first
      await window.ModifierBox.create();
      
      await window.ModifierBox.show();
      
      expect(window.ModifierBoxThemeManager.updateTheme).toHaveBeenCalled();
      expect(window.ModifierBoxThemeManager.forceElementUpdates).toHaveBeenCalled();
    });
  });

  describe('hideModifierBox', () => {
    test('should hide modifier box if it exists', async () => {
      const element = await window.ModifierBox.create();
      
      window.ModifierBox.hide();
      
      expect(element.style.display).toBe('none');
      expect(window.ModifierBox.isVisible()).toBe(false);
    });

    test('should handle hiding when modifier box does not exist', () => {
      window.ModifierBox.hide();
      
      expect(console.error).toHaveBeenCalledWith("Cannot hide - modifierBox is null");
    });
  });

  describe('Event Handlers', () => {
    test('should set up close button functionality', async () => {
      const element = await window.ModifierBox.create();
      const closeBtn = element.querySelector('.pixels-close');
      
      simulateEvent(closeBtn, 'click');
      
      expect(element.style.display).toBe('none');
      expect(window.ModifierBox.isVisible()).toBe(false);
    });

    test('should set up minimize button functionality', async () => {
      const element = await window.ModifierBox.create();
      const minimizeBtn = element.querySelector('.pixels-minimize');
      
      expect(element.classList.contains('minimized')).toBe(false);
      
      simulateEvent(minimizeBtn, 'click');
      
      expect(element.classList.contains('minimized')).toBe(true);
      
      // Click again to toggle back
      simulateEvent(minimizeBtn, 'click');
      
      expect(element.classList.contains('minimized')).toBe(false);
    });
  });

  describe('State Management', () => {
    test('should track visibility state correctly', async () => {
      expect(window.ModifierBox.isVisible()).toBe(false);
      
      await window.ModifierBox.show();
      expect(window.ModifierBox.isVisible()).toBe(true);
      
      window.ModifierBox.hide();
      expect(window.ModifierBox.isVisible()).toBe(false);
    });

    test('should track initialization state correctly', async () => {
      expect(window.ModifierBox.isInitialized()).toBe(true); // Module loads immediately
      
      await window.ModifierBox.create();
      expect(window.ModifierBox.isInitialized()).toBe(true);
    });

    test('should return correct element reference', async () => {
      expect(window.ModifierBox.getElement()).toBeNull();
      
      const element = await window.ModifierBox.create();
      expect(window.ModifierBox.getElement()).toBe(element);
    });
  });

  describe('Integration Methods', () => {
    test('should call updateSelectedModifier when available', async () => {
      await window.ModifierBox.create();
      
      window.ModifierBox.updateSelectedModifier();
      
      expect(window.ModifierBoxRowManager.updateSelectedModifier).toHaveBeenCalled();
    });

    test('should call theme methods when available', async () => {
      await window.ModifierBox.create();
      
      window.ModifierBox.updateTheme();
      expect(window.ModifierBoxThemeManager.updateTheme).toHaveBeenCalled();
      
      window.ModifierBox.forceThemeRefresh();
      expect(window.ModifierBoxThemeManager.forceThemeRefresh).toHaveBeenCalled();
      expect(window.ModifierBoxThemeManager.forceElementUpdates).toHaveBeenCalled();
    });

    test('should sync global variables', async () => {
      await window.ModifierBox.create();
      
      window.ModifierBox.syncGlobalVars();
      
      expect(window.ModifierBoxRowManager.updateSelectedModifier).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    test('should setup cleanup handlers for page unload', () => {
      const addEventListener = jest.spyOn(window, 'addEventListener');
      
      // Reload module to trigger event listener setup
      delete window.ModifierBox;
      loadModule('src/content/ModifierBox/modifierBox.js');
      
      expect(addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });
  });
});
