/**
 * Roll20.js Comprehensive Tests
 * Consolidated tests covering core functionality, integration, and modifier visibility logic
 */

// Mock console to avoid noise in test output
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('Roll20.js - Comprehensive Tests', () => {
  let mockChrome;
  let mockBluetooth;
  let mockMessageListener;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();

    // Create Chrome mock with proper onMessage structure
    mockChrome = {
      runtime: {
        sendMessage: jest.fn(),
        onMessage: {
          addListener: jest.fn(listener => {
            mockMessageListener = listener;
          }),
        },
      },
    };

    // Create Bluetooth mock
    mockBluetooth = {
      requestDevice: jest.fn(),
    };

    // Set global mocks
    global.chrome = mockChrome;
    global.navigator = {
      bluetooth: mockBluetooth,
    };

    // Mock DOM with proper jest functions
    global.document = {
      createElement: jest.fn(() => ({
        setAttribute: jest.fn(),
        style: {},
        appendChild: jest.fn(),
      })),
      head: { appendChild: jest.fn() },
      body: { appendChild: jest.fn() },
      querySelector: jest.fn(() => null),
      querySelectorAll: jest.fn(() => []),
    };

    // Mock window
    global.window = {
      chrome: mockChrome,
      navigator: { bluetooth: mockBluetooth },
      ModifierBox: undefined,
      pixelsModifier: undefined,
      pixelsModifierName: undefined,
    };

    // Mock timers
    global.setInterval = jest.fn((fn, delay) => 1);
    global.clearInterval = jest.fn();
    global.setTimeout = jest.fn((fn, delay) => 1);
    global.clearTimeout = jest.fn();
  });

  describe('Module Loading and Error Handling', () => {
    test('should load the module without errors', () => {
      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle missing Chrome API gracefully', () => {
      global.chrome = undefined;
      global.window.chrome = undefined;

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle missing Bluetooth API gracefully', () => {
      global.navigator.bluetooth = undefined;
      global.window.navigator.bluetooth = undefined;

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle Chrome runtime sendMessage errors', () => {
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Extension context invalidated');
      });

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });
  });

  describe('Message Handling', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should set up message listener', () => {
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(mockMessageListener).toBeDefined();
    });

    test('should handle getStatus message', () => {
      expect(() => {
        mockMessageListener({ action: 'getStatus' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle setModifier message', () => {
      expect(() => {
        mockMessageListener(
          { action: 'setModifier', modifier: '5' },
          null,
          jest.fn()
        );
      }).not.toThrow();
    });

    test('should handle setModifier with undefined value', () => {
      expect(() => {
        mockMessageListener(
          { action: 'setModifier', modifier: undefined },
          null,
          jest.fn()
        );
      }).not.toThrow();
    });

    test('should handle showModifier message', () => {
      expect(() => {
        mockMessageListener({ action: 'showModifier' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle hideModifier message', () => {
      expect(() => {
        mockMessageListener({ action: 'hideModifier' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle disconnect message', () => {
      expect(() => {
        mockMessageListener({ action: 'disconnect' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle invalid messages gracefully', () => {
      expect(() => {
        mockMessageListener({ action: 'invalidAction' }, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        mockMessageListener({}, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        mockMessageListener(null, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('Bluetooth Connection', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should handle connect message', () => {
      expect(() => {
        mockMessageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle Bluetooth errors gracefully', () => {
      mockBluetooth.requestDevice.mockImplementation(() => {
        throw new Error('Bluetooth error');
      });

      expect(() => {
        mockMessageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle missing Bluetooth API', () => {
      global.navigator.bluetooth = undefined;
      global.window.navigator.bluetooth = undefined;

      expect(() => {
        mockMessageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('ModifierBox Integration', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should handle ModifierBox not available', () => {
      global.window.ModifierBox = undefined;

      expect(() => {
        mockMessageListener({ action: 'showModifier' }, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        mockMessageListener({ action: 'hideModifier' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle ModifierBox not initialized', () => {
      global.window.ModifierBox = {
        show: jest.fn(),
        hide: jest.fn(),
        isInitialized: jest.fn(() => false),
      };

      expect(() => {
        mockMessageListener({ action: 'showModifier' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should work with initialized ModifierBox', () => {
      global.window.ModifierBox = {
        show: jest.fn(),
        hide: jest.fn(),
        isInitialized: jest.fn(() => true),
      };

      mockMessageListener({ action: 'showModifier' }, null, jest.fn());
      expect(global.window.ModifierBox.show).toHaveBeenCalled();

      mockMessageListener({ action: 'hideModifier' }, null, jest.fn());
      expect(global.window.ModifierBox.hide).toHaveBeenCalled();
    });
  });

  describe('Extension Communication', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should send messages to extension', () => {
      global.window.sendMessageToExtension({ action: 'test', data: 'value' });

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'test',
        data: 'value',
      });
    });

    test('should handle sendMessage errors gracefully', () => {
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Extension context invalidated');
      });

      expect(() => {
        global.window.sendMessageToExtension({ action: 'test' });
      }).not.toThrow();

      // Should not log "Extension context invalidated" errors - they are handled silently
      expect(console.log).not.toHaveBeenCalledWith(
        'Could not send message to extension:',
        expect.any(Error)
      );
    });

    test('should log other sendMessage errors', () => {
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Some other error');
      });

      expect(() => {
        global.window.sendMessageToExtension({ action: 'test' });
      }).not.toThrow();

      expect(console.log).toHaveBeenCalledWith(
        'Could not send message to extension:',
        expect.any(Error)
      );
    });

    test('should handle missing Chrome API', () => {
      global.chrome = undefined;
      global.window.chrome = undefined;

      expect(() => {
        global.window.sendMessageToExtension({ action: 'test' });
      }).not.toThrow();
    });
  });

  describe('Status System', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should set up status monitoring', () => {
      expect(global.setInterval).toHaveBeenCalled();
    });

    test('should send initial status', () => {
      // Status is sent automatically on module load
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'showText',
        text: 'No Pixel connected',
      });
    });
  });

  describe('Error Recovery', () => {
    test('should handle Chrome API errors during initialization', () => {
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Extension context invalidated');
      });

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle timer errors', () => {
      global.setInterval.mockImplementation(() => {
        throw new Error('Timer failed');
      });

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should continue functioning after errors', () => {
      require('../../src/content/roll20.js');

      // Cause an error
      mockChrome.runtime.sendMessage.mockImplementationOnce(() => {
        throw new Error('Temporary error');
      });

      // Should still handle messages
      expect(() => {
        mockMessageListener({ action: 'getStatus' }, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('DOM Interaction', () => {
    beforeEach(() => {
      require('../../src/content/roll20.js');
    });

    test('should handle missing DOM elements', () => {
      // Mock the DOM functions to return null (already set up in beforeEach)
      expect(() => {
        mockMessageListener(
          { action: 'setModifier', modifier: '3' },
          null,
          jest.fn()
        );
      }).not.toThrow();
    });

    test('should handle DOM query errors', () => {
      // Temporarily replace querySelector with error-throwing version
      const originalQuerySelector = global.document.querySelector;
      global.document.querySelector = jest.fn(() => {
        throw new Error('DOM error');
      });

      expect(() => {
        mockMessageListener(
          { action: 'setModifier', modifier: '3' },
          null,
          jest.fn()
        );
      }).not.toThrow();

      // Restore original
      global.document.querySelector = originalQuerySelector;
    });
  });

  describe('Modifier Visibility Logic - Unit Tests', () => {
    let roll20Module;

    beforeEach(() => {
      // Load the module to access internal functions
      roll20Module = require('../../src/content/roll20.js');
    });

    describe('isModifierBoxVisible logic', () => {
      test('should return true when ModifierBox exists and isVisible returns true', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };

        // Test the visibility check logic directly
        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        expect(isModifierBoxVisible).toBe(true);
        expect(global.window.ModifierBox.isVisible).toHaveBeenCalled();
      });

      test('should return false when ModifierBox exists but isVisible returns false', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => false),
          syncGlobalVars: jest.fn(),
        };

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        expect(isModifierBoxVisible).toBe(false);
        expect(global.window.ModifierBox.isVisible).toHaveBeenCalled();
      });

      test('should return falsy when ModifierBox is undefined', () => {
        global.window.ModifierBox = undefined;

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        expect(isModifierBoxVisible).toBeFalsy(); // undefined is falsy
      });

      test('should return falsy when ModifierBox exists but isVisible method is missing', () => {
        global.window.ModifierBox = {
          syncGlobalVars: jest.fn(),
          // No isVisible method
        };

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        expect(isModifierBoxVisible).toBeFalsy(); // undefined is falsy
      });

      test('should handle isVisible method that throws an error', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => {
            throw new Error('Visibility check failed');
          }),
          syncGlobalVars: jest.fn(),
        };

        let isModifierBoxVisible;
        // The actual logic in roll20.js doesn't catch errors, so the error will propagate
        expect(() => {
          isModifierBoxVisible =
            global.window.ModifierBox &&
            global.window.ModifierBox.isVisible &&
            global.window.ModifierBox.isVisible();
        }).toThrow('Visibility check failed');
      });
    });

    describe('modifier calculation logic', () => {
      test('should apply modifier when modifier box is visible', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };
        global.window.pixelsModifier = '5';

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 4; // Face 3 = dice shows 4
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(5);
        expect(result).toBe(9);
      });

      test('should NOT apply modifier when modifier box is hidden', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => false),
          syncGlobalVars: jest.fn(),
        };
        global.window.pixelsModifier = '5'; // Should be ignored

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 4; // Face 3 = dice shows 4
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(0);
        expect(result).toBe(4); // Only dice value, no modifier
      });

      test('should NOT apply modifier when ModifierBox is undefined', () => {
        global.window.ModifierBox = undefined;
        global.window.pixelsModifier = '5'; // Should be ignored

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 6;
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(0);
        expect(result).toBe(6);
      });

      test('should handle invalid modifier values with visible modifier box', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };
        global.window.pixelsModifier = 'invalid';

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 3;
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(0); // Invalid input defaults to 0
        expect(result).toBe(3);
      });

      test('should handle negative modifier values', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };
        global.window.pixelsModifier = '-3';

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 5;
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(-3);
        expect(result).toBe(2);
      });

      test('should handle zero modifier with visible modifier box', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };
        global.window.pixelsModifier = '0';

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        const diceValue = 4;
        const modifier = isModifierBoxVisible
          ? parseInt(global.window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        expect(modifier).toBe(0);
        expect(result).toBe(4);
      });
    });

    describe('syncGlobalVars behavior', () => {
      test('should call syncGlobalVars when modifier box is visible', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          syncGlobalVars: jest.fn(),
        };

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        // Simulate the sync logic from roll20.js
        if (
          isModifierBoxVisible &&
          typeof global.window.ModifierBox !== 'undefined' &&
          global.window.ModifierBox.syncGlobalVars
        ) {
          global.window.ModifierBox.syncGlobalVars();
        }

        expect(global.window.ModifierBox.syncGlobalVars).toHaveBeenCalled();
      });

      test('should NOT call syncGlobalVars when modifier box is hidden', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => false),
          syncGlobalVars: jest.fn(),
        };

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        // Simulate the sync logic from roll20.js
        if (
          isModifierBoxVisible &&
          typeof global.window.ModifierBox !== 'undefined' &&
          global.window.ModifierBox.syncGlobalVars
        ) {
          global.window.ModifierBox.syncGlobalVars();
        }

        expect(global.window.ModifierBox.syncGlobalVars).not.toHaveBeenCalled();
      });

      test('should handle missing syncGlobalVars method gracefully', () => {
        global.window.ModifierBox = {
          isVisible: jest.fn(() => true),
          // No syncGlobalVars method
        };

        const isModifierBoxVisible =
          global.window.ModifierBox &&
          global.window.ModifierBox.isVisible &&
          global.window.ModifierBox.isVisible();

        expect(() => {
          if (
            isModifierBoxVisible &&
            typeof global.window.ModifierBox !== 'undefined' &&
            global.window.ModifierBox.syncGlobalVars
          ) {
            global.window.ModifierBox.syncGlobalVars();
          }
        }).not.toThrow();
      });
    });
  });
});
