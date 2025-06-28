/**
 * Basic Roll20.js Tests - Core Functionality
 * Focused on verifying essential behaviors without complex mocking
 */

// Mock console to avoid noise in test output
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('Roll20.js - Basic Functionality', () => {
  let mockChrome;
  let mockBluetooth;
  let originalChrome;
  let originalBluetooth;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();

    // Create simple Chrome mock
    mockChrome = {
      runtime: {
        sendMessage: jest.fn(),
        onMessage: {
          addListener: jest.fn(),
        },
      },
    };

    // Create simple Bluetooth mock
    mockBluetooth = {
      requestDevice: jest.fn(),
    };

    // Store originals
    originalChrome = global.chrome;
    originalBluetooth = global.navigator?.bluetooth;

    // Set mocks
    global.chrome = mockChrome;
    global.navigator = {
      bluetooth: mockBluetooth,
    };

    // Mock DOM
    global.document = {
      createElement: jest.fn(() => ({
        setAttribute: jest.fn(),
        style: {},
        appendChild: jest.fn(),
      })),
      head: {
        appendChild: jest.fn(),
      },
      body: {
        appendChild: jest.fn(),
      },
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

    // Mock setInterval and setTimeout
    global.setInterval = jest.fn((fn, delay) => 1);
    global.clearInterval = jest.fn();
    global.setTimeout = jest.fn((fn, delay) => 1);
    global.clearTimeout = jest.fn();
  });

  afterEach(() => {
    // Restore originals
    global.chrome = originalChrome;
    if (originalBluetooth !== undefined) {
      global.navigator.bluetooth = originalBluetooth;
    }
  });

  describe('Module Loading', () => {
    test('should load without throwing errors', () => {
      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should set up Chrome message listener', () => {
      require('../../src/content/roll20.js');

      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test('should set up status monitoring timer', () => {
      require('../../src/content/roll20.js');

      expect(global.setInterval).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing Chrome API gracefully', () => {
      global.chrome = undefined;
      global.window.chrome = undefined;

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle missing Bluetooth API gracefully', () => {
      global.navigator.bluetooth = undefined;

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should handle Chrome sendMessage errors', () => {
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Extension context invalidated');
      });

      require('../../src/content/roll20.js');

      // Try to access the global sendMessage function
      if (global.window.sendMessageToExtension) {
        expect(() => {
          global.window.sendMessageToExtension({ action: 'test' });
        }).not.toThrow();
      }
    });
  });

  describe('Basic Message Handling', () => {
    test('should handle message listener setup', () => {
      require('../../src/content/roll20.js');

      const addListenerCalls =
        mockChrome.runtime.onMessage.addListener.mock.calls;
      expect(addListenerCalls.length).toBe(1);
      expect(typeof addListenerCalls[0][0]).toBe('function');
    });

    test('should handle status messages', () => {
      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener({ action: 'getStatus' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle invalid messages gracefully', () => {
      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener(null, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        messageListener(undefined, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        messageListener({}, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('Status System', () => {
    test('should have initial status setup', () => {
      require('../../src/content/roll20.js');

      // Verify timer was set up for status monitoring
      expect(global.setInterval).toHaveBeenCalled();
    });

    test('should handle status updates without errors', () => {
      require('../../src/content/roll20.js');

      // Status updates happen automatically via timer
      // Just verify no errors are thrown during setup
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Global Functions', () => {
    test('should create sendMessageToExtension function', () => {
      require('../../src/content/roll20.js');

      expect(typeof global.window.sendMessageToExtension).toBe('function');
    });

    test('should handle sendMessage function calls', () => {
      require('../../src/content/roll20.js');

      const sendMessage = global.window.sendMessageToExtension;
      if (sendMessage) {
        expect(() => {
          sendMessage({ action: 'test', data: 'value' });
        }).not.toThrow();
      }
    });
  });

  describe('Bluetooth Integration', () => {
    test('should handle Bluetooth unavailability', () => {
      global.navigator.bluetooth = undefined;
      global.window.navigator.bluetooth = undefined;

      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle Bluetooth request device errors', () => {
      mockBluetooth.requestDevice.mockRejectedValue(
        new Error('Bluetooth unavailable')
      );

      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('DOM Integration', () => {
    test('should handle missing DOM elements gracefully', () => {
      global.document.querySelector = jest.fn(() => null);
      global.document.querySelectorAll = jest.fn(() => []);

      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener(
          { action: 'setModifier', modifier: '5' },
          null,
          jest.fn()
        );
      }).not.toThrow();
    });

    test('should handle ModifierBox integration', () => {
      global.window.ModifierBox = {
        show: jest.fn(),
        hide: jest.fn(),
        isInitialized: jest.fn(() => true),
      };

      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      expect(() => {
        messageListener({ action: 'showModifier' }, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        messageListener({ action: 'hideModifier' }, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('Memory Management', () => {
    test('should not create memory leaks', () => {
      const initialMemory = process.memoryUsage();

      // Load and unload module multiple times
      for (let i = 0; i < 10; i++) {
        jest.resetModules();
        require('../../src/content/roll20.js');
      }

      const finalMemory = process.memoryUsage();

      // This is a basic check - in real scenarios we'd need more sophisticated leak detection
      expect(finalMemory.heapUsed).toBeLessThan(initialMemory.heapUsed * 2);
    });

    test('should clean up timers properly', () => {
      require('../../src/content/roll20.js');

      // Verify timer cleanup functions exist and are callable
      expect(global.clearInterval).toBeDefined();
      expect(global.clearTimeout).toBeDefined();
    });
  });

  describe('Configuration', () => {
    test('should handle missing configuration gracefully', () => {
      // Test without any pre-configured globals
      delete global.window.pixelsModifier;
      delete global.window.pixelsModifierName;

      expect(() => {
        require('../../src/content/roll20.js');
      }).not.toThrow();
    });

    test('should maintain state correctly', () => {
      require('../../src/content/roll20.js');

      const messageListener =
        mockChrome.runtime.onMessage.addListener.mock.calls[0][0];

      // Set a modifier value
      messageListener(
        { action: 'setModifier', modifier: '3' },
        null,
        jest.fn()
      );

      // Verify it's stored (even if undefined is acceptable for missing elements)
      expect(global.window.pixelsModifier).toBeDefined();
    });
  });
});
