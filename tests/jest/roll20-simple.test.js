/**
 * Roll20.js Simple Tests - Core Integration Functionality
 * Focused on message handling, Bluetooth, and ModifierBox integration
 */

// Mock console to avoid noise in test output
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('Roll20.js - Simple Integration Tests', () => {
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

      expect(global.window.pixelsModifier).toBe('5');
    });

    test('should handle setModifier with undefined value', () => {
      expect(() => {
        mockMessageListener(
          { action: 'setModifier', modifier: undefined },
          null,
          jest.fn()
        );
      }).not.toThrow();

      expect(global.window.pixelsModifier).toBe('0'); // Default fallback
    });

    test('should handle showModifier message', () => {
      global.window.ModifierBox = {
        show: jest.fn(),
        isInitialized: jest.fn(() => true),
      };

      expect(() => {
        mockMessageListener({ action: 'showModifier' }, null, jest.fn());
      }).not.toThrow();

      expect(global.window.ModifierBox.show).toHaveBeenCalled();
    });

    test('should handle hideModifier message', () => {
      global.window.ModifierBox = {
        hide: jest.fn(),
      };

      expect(() => {
        mockMessageListener({ action: 'hideModifier' }, null, jest.fn());
      }).not.toThrow();

      expect(global.window.ModifierBox.hide).toHaveBeenCalled();
    });

    test('should handle disconnect message', () => {
      expect(() => {
        mockMessageListener({ action: 'disconnect' }, null, jest.fn());
      }).not.toThrow();
    });

    test('should handle invalid messages gracefully', () => {
      expect(() => {
        mockMessageListener(null, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        mockMessageListener({}, null, jest.fn());
      }).not.toThrow();

      expect(() => {
        mockMessageListener({ action: 'unknown' }, null, jest.fn());
      }).not.toThrow();
    });
  });

  describe('Bluetooth Connection', () => {
    beforeEach(() => {
      // Set up complete Bluetooth mock chain
      const mockDevice = {
        id: 'test-device-id',
        name: 'Test Pixel',
        addEventListener: jest.fn(),
        gatt: {
          connected: false,
          connect: jest.fn().mockResolvedValue({
            connected: true,
            getPrimaryService: jest.fn().mockResolvedValue({
              getCharacteristic: jest.fn().mockResolvedValue({
                startNotifications: jest.fn().mockResolvedValue(undefined),
                addEventListener: jest.fn(),
              }),
            }),
          }),
        },
      };

      mockBluetooth.requestDevice.mockResolvedValue(mockDevice);

      require('../../src/content/roll20.js');
    });

    test('should handle connect message', () => {
      expect(() => {
        mockMessageListener({ action: 'connect' }, null, jest.fn());
      }).not.toThrow();

      // Note: Actual Bluetooth connection is async and tested separately
      // Here we just verify the message handling doesn't crash
    });

    test('should handle Bluetooth errors gracefully', () => {
      mockBluetooth.requestDevice.mockRejectedValue(
        new Error('Bluetooth unavailable')
      );

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
});
