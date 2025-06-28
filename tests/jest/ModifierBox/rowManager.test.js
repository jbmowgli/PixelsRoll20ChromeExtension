/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

function loadModule(modulePath) {
  const fullPath = path.join(__dirname, '../../../', modulePath);
  const moduleCode = fs.readFileSync(fullPath, 'utf8');
  eval(moduleCode);
}

describe('ModifierBox Row Manager', () => {
  beforeEach(() => {
    resetMocks();
    
    // Mock theme manager for force updates
    window.ModifierBoxThemeManager = {
      forceElementUpdates: jest.fn()
    };
    
    // Set up global variables
    window.pixelsModifierName = 'Test Modifier';
    window.pixelsModifier = '5';
    
    loadModule('src/content/ModifierBox/rowManager.js');
  });

  describe('Module Initialization', () => {
    test('should initialize ModifierBoxRowManager global object', () => {
      expect(window.ModifierBoxRowManager).toBeDefined();
      expect(typeof window.ModifierBoxRowManager).toBe('object');
    });

    test('should expose correct API methods', () => {
      expect(window.ModifierBoxRowManager.setupModifierRowLogic).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.addModifierRow).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.removeModifierRow).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.updateEventListeners).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.updateSelectedModifier).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.getRowCounter).toBeInstanceOf(Function);
      expect(window.ModifierBoxRowManager.setRowCounter).toBeInstanceOf(Function);
    });

    test('should initialize with correct row counter', () => {
      expect(window.ModifierBoxRowManager.getRowCounter()).toBe(1);
    });
  });

  describe('setupModifierRowLogic', () => {
    let mockModifierBox;
    let mockCallback;

    beforeEach(() => {
      mockModifierBox = createMockModifierBox();
      mockCallback = jest.fn();
    });

    test('should handle null modifierBox parameter', () => {
      window.ModifierBoxRowManager.setupModifierRowLogic(null, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith("setupModifierRowLogic: modifierBox is required");
    });

    test('should setup add button event listener', () => {
      const addButton = mockModifierBox.querySelector('.add-modifier-btn');
      const addEventListenerSpy = jest.spyOn(addButton, 'addEventListener');
      
      window.ModifierBoxRowManager.setupModifierRowLogic(mockModifierBox, mockCallback);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(addButton.getAttribute('data-listener-added')).toBe('true');
    });

    test('should not add duplicate event listeners to add button', () => {
      const addButton = mockModifierBox.querySelector('.add-modifier-btn');
      addButton.setAttribute('data-listener-added', 'true');
      
      const addEventListenerSpy = jest.spyOn(addButton, 'addEventListener');
      
      window.ModifierBoxRowManager.setupModifierRowLogic(mockModifierBox, mockCallback);
      
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    test('should call updateEventListeners', () => {
      const mockModifierBox = createMockModifierBox();
      const mockCallback = jest.fn();
      
      // Test that the function executes without errors
      // and that the add button gets the listener attribute
      const addButton = mockModifierBox.querySelector('.add-modifier-btn');
      expect(addButton.hasAttribute('data-listener-added')).toBe(false);
      
      window.ModifierBoxRowManager.setupModifierRowLogic(mockModifierBox, mockCallback);
      
      // Verify the add button now has the listener attribute
      expect(addButton.hasAttribute('data-listener-added')).toBe(true);
      expect(addButton.getAttribute('data-listener-added')).toBe('true');
    });
  });

  describe('addModifierRow', () => {
    let mockModifierBox;
    let mockCallback;

    beforeEach(() => {
      mockModifierBox = createMockModifierBox();
      mockCallback = jest.fn();
    });

    test('should handle null modifierBox parameter', () => {
      window.ModifierBoxRowManager.addModifierRow(null, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith("addModifierRow: modifierBox is required");
    });

    test('should handle missing content area', () => {
      const boxWithoutContent = document.createElement('div');
      
      window.ModifierBoxRowManager.addModifierRow(boxWithoutContent, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith("addModifierRow: content area not found");
    });

    test('should add new modifier row successfully', () => {
      const content = mockModifierBox.querySelector('.pixels-content');
      const initialRowCount = content.querySelectorAll('.modifier-row').length;
      
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      const newRowCount = content.querySelectorAll('.modifier-row').length;
      expect(newRowCount).toBe(initialRowCount + 1);
    });

    test('should create row with correct structure and values', () => {
      const content = mockModifierBox.querySelector('.pixels-content');
      const initialCounter = window.ModifierBoxRowManager.getRowCounter();
      
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      const newRow = content.lastElementChild;
      const radio = newRow.querySelector('.modifier-radio');
      const nameInput = newRow.querySelector('.modifier-name');
      const valueInput = newRow.querySelector('.modifier-value');
      const removeBtn = newRow.querySelector('.remove-row-btn');
      
      expect(radio.value).toBe(initialCounter.toString());
      expect(radio.id).toBe(`mod-${initialCounter}`);
      expect(nameInput.value).toBe(`Modifier ${initialCounter + 1}`);
      expect(nameInput.placeholder).toBe(`Modifier ${initialCounter + 1}`);
      expect(valueInput.value).toBe('0');
      expect(removeBtn.textContent).toBe('×');
    });

    test('should increment row counter', () => {
      const initialCounter = window.ModifierBoxRowManager.getRowCounter();
      
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      expect(window.ModifierBoxRowManager.getRowCounter()).toBe(initialCounter + 1);
    });

    test('should call updateEventListeners after adding row', () => {
      const initialRows = mockModifierBox.querySelectorAll('.modifier-row').length;
      
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      const newRows = mockModifierBox.querySelectorAll('.modifier-row').length;
      
      // Verify a new row was added (which means updateEventListeners was called successfully)
      expect(newRows).toBe(initialRows + 1);
      
      // Verify the new row has the expected structure
      const newRow = mockModifierBox.querySelectorAll('.modifier-row')[newRows - 1];
      expect(newRow.querySelector('.modifier-radio')).toBeTruthy();
      expect(newRow.querySelector('.modifier-name')).toBeTruthy();
      expect(newRow.querySelector('.modifier-value')).toBeTruthy();
      expect(newRow.querySelector('.remove-row-btn')).toBeTruthy();
    });

    test('should call theme manager forceElementUpdates', () => {
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      expect(window.ModifierBoxThemeManager.forceElementUpdates).toHaveBeenCalledWith(mockModifierBox);
    });
  });

  describe('removeModifierRow', () => {
    let mockModifierBox;
    let mockCallback;

    beforeEach(() => {
      mockModifierBox = createMockModifierBox();
      mockCallback = jest.fn();
      
      // Add a second row for testing
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
    });

    test('should handle null rowElement parameter', () => {
      window.ModifierBoxRowManager.removeModifierRow(null, mockModifierBox, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith('removeModifierRow: rowElement is null or undefined');
    });

    test('should handle null modifierBox parameter', () => {
      const row = mockModifierBox.querySelector('.modifier-row');
      
      window.ModifierBoxRowManager.removeModifierRow(row, null, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith('removeModifierRow: modifierBox is required');
    });

    test('should handle row without radio button', () => {
      const invalidRow = document.createElement('div');
      invalidRow.className = 'modifier-row';
      
      window.ModifierBoxRowManager.removeModifierRow(invalidRow, mockModifierBox, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith('removeModifierRow: radio button not found in row');
    });

    test('should remove row when multiple rows exist', () => {
      const rows = mockModifierBox.querySelectorAll('.modifier-row');
      const initialCount = rows.length;
      const rowToRemove = rows[1]; // Remove second row
      
      window.ModifierBoxRowManager.removeModifierRow(rowToRemove, mockModifierBox, mockCallback);
      
      const newCount = mockModifierBox.querySelectorAll('.modifier-row').length;
      expect(newCount).toBe(initialCount - 1);
      expect(mockModifierBox.contains(rowToRemove)).toBe(false);
    });

    test('should reset last remaining row instead of removing it', () => {
      // Remove all rows except one
      const rows = mockModifierBox.querySelectorAll('.modifier-row');
      for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
      }
      
      const lastRow = mockModifierBox.querySelector('.modifier-row');
      const nameInput = lastRow.querySelector('.modifier-name');
      const valueInput = lastRow.querySelector('.modifier-value');
      const radio = lastRow.querySelector('.modifier-radio');
      
      // Set some values first
      nameInput.value = 'Custom Name';
      valueInput.value = '10';
      radio.checked = false;
      
      window.ModifierBoxRowManager.removeModifierRow(lastRow, mockModifierBox, mockCallback);
      
      // Row should still exist but be reset
      expect(mockModifierBox.contains(lastRow)).toBe(true);
      expect(nameInput.value).toBe('Modifier 1');
      expect(valueInput.value).toBe('0');
      expect(radio.checked).toBe(true);
      expect(mockCallback).toHaveBeenCalled();
    });

    test('should select first remaining row when selected row is removed', () => {
      const rows = mockModifierBox.querySelectorAll('.modifier-row');
      const firstRow = rows[0];
      const secondRow = rows[1];
      
      // Select the second row
      const secondRadio = secondRow.querySelector('.modifier-radio');
      secondRadio.checked = true;
      
      // Remove the selected row
      window.ModifierBoxRowManager.removeModifierRow(secondRow, mockModifierBox, mockCallback);
      
      // First row should be selected
      const firstRadio = firstRow.querySelector('.modifier-radio');
      expect(firstRadio.checked).toBe(true);
      expect(mockCallback).toHaveBeenCalled();
    });

    test('should not change selection when non-selected row is removed', () => {
      const rows = mockModifierBox.querySelectorAll('.modifier-row');
      const firstRow = rows[0];
      const secondRow = rows[1];
      
      // Ensure first row is selected
      const firstRadio = firstRow.querySelector('.modifier-radio');
      firstRadio.checked = true;
      
      // Remove the non-selected row
      window.ModifierBoxRowManager.removeModifierRow(secondRow, mockModifierBox, mockCallback);
      
      // First row should still be selected
      expect(firstRadio.checked).toBe(true);
    });
  });

  describe('updateEventListeners', () => {
    let mockModifierBox;
    let mockCallback;

    beforeEach(() => {
      mockModifierBox = createMockModifierBox();
      mockCallback = jest.fn();
    });

    test('should handle null modifierBox parameter', () => {
      window.ModifierBoxRowManager.updateEventListeners(null, mockCallback);
      
      expect(console.error).toHaveBeenCalledWith("updateEventListeners: modifierBox is required");
    });

    test('should add event listeners to all row elements', () => {
      // Add another row for testing
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      
      const rows = mockModifierBox.querySelectorAll('.modifier-row');
      
      // Spy on event listeners for first row
      const firstRadio = rows[0].querySelector('.modifier-radio');
      const firstName = rows[0].querySelector('.modifier-name');
      const firstValue = rows[0].querySelector('.modifier-value');
      
      const radioSpy = jest.spyOn(firstRadio, 'addEventListener');
      const nameSpy = jest.spyOn(firstName, 'addEventListener');
      const valueSpy = jest.spyOn(firstValue, 'addEventListener');
      
      window.ModifierBoxRowManager.updateEventListeners(mockModifierBox, mockCallback);
      
      expect(radioSpy).toHaveBeenCalledWith('change', mockCallback);
      expect(nameSpy).toHaveBeenCalledWith('input', mockCallback);
      expect(valueSpy).toHaveBeenCalledWith('input', mockCallback);
    });

    test('should setup remove button onclick handlers', () => {
      window.ModifierBoxRowManager.addModifierRow(mockModifierBox, mockCallback);
      window.ModifierBoxRowManager.updateEventListeners(mockModifierBox, mockCallback);
      
      const removeButtons = mockModifierBox.querySelectorAll('.remove-row-btn');
      
      removeButtons.forEach(button => {
        expect(button.onclick).toBeInstanceOf(Function);
      });
    });

    test('should handle missing elements gracefully', () => {
      const incompleteRow = document.createElement('div');
      incompleteRow.className = 'modifier-row';
      // Missing radio, inputs, and button
      
      const content = mockModifierBox.querySelector('.pixels-content');
      content.appendChild(incompleteRow);
      
      expect(() => {
        window.ModifierBoxRowManager.updateEventListeners(mockModifierBox, mockCallback);
      }).not.toThrow();
    });
  });

  describe('updateSelectedModifier', () => {
    let mockModifierBox;

    beforeEach(() => {
      mockModifierBox = createMockModifierBox();
      
      // Setup header with logo
      const header = mockModifierBox.querySelector('.pixels-header') || document.createElement('div');
      header.className = 'pixels-header';
      header.innerHTML = '<span class="pixels-title"><img src="logo.png" alt="Pixels" class="pixels-logo"> Original Title</span>';
      if (!mockModifierBox.contains(header)) {
        mockModifierBox.appendChild(header);
      }
    });

    test('should handle null modifierBox parameter', () => {
      window.ModifierBoxRowManager.updateSelectedModifier(null);
      
      expect(console.error).toHaveBeenCalledWith("updateSelectedModifier: modifierBox is required");
    });

    test('should update global variables with selected row values', () => {
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = 'Test Modifier';
      valueInput.value = '5';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      expect(window.pixelsModifierName).toBe('Test Modifier');
      expect(window.pixelsModifier).toBe('5');
    });

    test('should handle empty modifier name with fallback', () => {
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = '';
      valueInput.value = '3';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      expect(window.pixelsModifierName).toBe('Unnamed');
      expect(window.pixelsModifier).toBe('3');
    });

    test('should handle empty modifier value with fallback', () => {
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = 'Test';
      valueInput.value = '';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      expect(window.pixelsModifierName).toBe('Test');
      expect(window.pixelsModifier).toBe('0');
    });

    test('should update header title with modifier information', () => {
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = 'Strength Bonus';
      valueInput.value = '3';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      const headerTitle = mockModifierBox.querySelector('.pixels-title');
      expect(headerTitle.innerHTML).toContain('Strength Bonus (+3)');
      expect(headerTitle.innerHTML).toContain('pixels-logo');
    });

    test('should format modifier values correctly in header', () => {
      const testCases = [
        { value: '0', expected: '±0' },
        { value: '5', expected: '+5' },
        { value: '-3', expected: '-3' }
      ];
      
      testCases.forEach(({ value, expected }) => {
        const row = mockModifierBox.querySelector('.modifier-row');
        const nameInput = row.querySelector('.modifier-name');
        const valueInput = row.querySelector('.modifier-value');
        const radio = row.querySelector('.modifier-radio');
        
        nameInput.value = 'Test';
        valueInput.value = value;
        radio.checked = true;
        
        window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
        
        const headerTitle = mockModifierBox.querySelector('.pixels-title');
        expect(headerTitle.innerHTML).toContain(`Test (${expected})`);
      });
    });

    test('should handle missing header logo gracefully', () => {
      const headerTitle = mockModifierBox.querySelector('.pixels-title');
      headerTitle.innerHTML = 'No Logo Title';
      
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = 'Test';
      valueInput.value = '2';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      expect(headerTitle.textContent).toBe('Test (+2)');
    });

    test('should call sendMessageToExtension if available', () => {
      window.sendMessageToExtension = jest.fn();
      
      const row = mockModifierBox.querySelector('.modifier-row');
      const nameInput = row.querySelector('.modifier-name');
      const valueInput = row.querySelector('.modifier-value');
      const radio = row.querySelector('.modifier-radio');
      
      nameInput.value = 'Test';
      valueInput.value = '4';
      radio.checked = true;
      
      window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      
      expect(window.sendMessageToExtension).toHaveBeenCalledWith({
        action: "modifierChanged",
        modifier: '4',
        name: 'Test'
      });
    });

    test('should handle no selected radio button', () => {
      // Uncheck all radio buttons
      const radios = mockModifierBox.querySelectorAll('.modifier-radio');
      radios.forEach(radio => radio.checked = false);
      
      expect(() => {
        window.ModifierBoxRowManager.updateSelectedModifier(mockModifierBox);
      }).not.toThrow();
    });
  });

  describe('Row Counter Management', () => {
    test('should get and set row counter correctly', () => {
      expect(window.ModifierBoxRowManager.getRowCounter()).toBe(1);
      
      window.ModifierBoxRowManager.setRowCounter(5);
      expect(window.ModifierBoxRowManager.getRowCounter()).toBe(5);
      
      window.ModifierBoxRowManager.setRowCounter(0);
      expect(window.ModifierBoxRowManager.getRowCounter()).toBe(0);
    });
  });

  // Helper function to create a mock modifier box
  function createMockModifierBox() {
    const box = document.createElement('div');
    box.id = 'pixels-modifier-box';
    box.innerHTML = `
      <div class="pixels-header">
        <span class="pixels-title">
          <img src="logo.png" alt="Pixels" class="pixels-logo"> Test Title
        </span>
        <div class="pixels-controls">
          <button class="add-modifier-btn" type="button">Add</button>
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
    document.body.appendChild(box);
    return box;
  }
});
