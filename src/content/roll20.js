'use strict';

if (typeof window.roll20PixelsLoaded == 'undefined') {
  var roll20PixelsLoaded = true; //
  // Global modifier variables (accessed by modifierBox.js)
  //
  window.pixelsModifier = '0';
  window.pixelsModifierName = 'Modifier 1'; //
  // Modifier Box Functions (delegated to modifierBox.js)
  //
  function showModifierBox() {
    // Don't show modifier box in Roll20 popup windows
    if (isRoll20PopupWindow()) {
      log('Skipping modifier box display - this is a Roll20 popup window');
      return;
    }
    
    if (typeof window.ModifierBox !== 'undefined') {
      if (!window.ModifierBox.isInitialized()) {
        log('ModifierBox module not initialized yet');
      }
      // Handle async show function
      if (window.ModifierBox.show.constructor.name === 'AsyncFunction') {
        window.ModifierBox.show().catch(error => {
          console.error('Failed to show modifier box:', error);
        });
      } else {
        window.ModifierBox.show();
      }
    } else {
      log('ModifierBox module not loaded');
    }
  }

  function hideModifierBox() {
    if (typeof window.ModifierBox !== 'undefined') {
      window.ModifierBox.hide();
    } else {
      log('ModifierBox module not loaded');
    }
  }

  // Pure function to check if a URL indicates a Roll20 popup window
  function checkUrlForPopup(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    const urlLower = url.toLowerCase();
    return (
      urlLower.includes('popout') ||        // Journal popouts: /editor/popout
      urlLower.includes('popout=true')       // Character sheet popouts: ?popout=true
    );
  }

  // Detect if this is a Roll20 popup window (journal entry, character sheet, etc.)
  function isRoll20PopupWindow() {
    try {
      const url = window.location.href;
      const isPopup = checkUrlForPopup(url);
      
      if (isPopup) {
        log('Detected Roll20 popup window - modifier box will not be shown');
        log('URL:', url);
      } else {
        log('Main Roll20 page detected - modifier box will be shown');
      }
      
      return isPopup;
    } catch (error) {
      log('Error detecting popup window:', error);
      return false;
    }
  }

  // Make functions available globally for testing
  window.showModifierBox = showModifierBox;
  window.hideModifierBox = hideModifierBox;
  window.isRoll20PopupWindow = isRoll20PopupWindow;
  window.checkUrlForPopup = checkUrlForPopup; // Pure function for easier testing

  //
  // Message handler for extension communication
  //
  window.sendMessageToExtension = function (data) {
    try {
      if (
        typeof chrome !== 'undefined' &&
        chrome.runtime &&
        chrome.runtime.sendMessage
      ) {
        chrome.runtime.sendMessage(data);
      }
    } catch (error) {
      // Only log if it's not the common "Extension context invalidated" error
      if (!error.message.includes('Extension context invalidated')) {
        console.log('Could not send message to extension:', error);
      }
      // Extension context invalidated is normal when extension is reloaded - ignore silently
    }
  };

  //
  // Helpers
  //

  let log = console.log;

  function getArrayFirstElement(array) {
    //return (Array.isArray(array) && array.length) ? array[0] : undefined;
    return typeof array == 'undefined' ? undefined : array[0];
  }

  // Chat on Roll20
  function postChatMessage(message) {
    log('Posting message on Roll20: ' + message);

    const chat = document.getElementById('textchat-input');
    const txt = getArrayFirstElement(chat?.getElementsByTagName('textarea'));
    const btn = getArrayFirstElement(chat?.getElementsByTagName('button'));
    //const speakingas = document.getElementById("speakingas");

    if (typeof txt == 'undefined' || typeof btn == 'undefined') {
      log("Couldn't find Roll20 chat textarea and/or button");
    } else {
      const current_msg = txt.value;
      txt.value = message;
      btn.click();
      txt.value = current_msg;
    }
  } //
  // Pixels bluetooth discovery
  // UUIDs from the official Pixels JS SDK
  //
  // Modern Pixels dice UUIDs
  const PIXELS_SERVICE_UUID = 'a6b90001-7a5a-43f2-a962-350c8edc9b5b';
  const PIXELS_NOTIFY_CHARACTERISTIC = 'a6b90002-7a5a-43f2-a962-350c8edc9b5b';
  const PIXELS_WRITE_CHARACTERISTIC = 'a6b90003-7a5a-43f2-a962-350c8edc9b5b';

  // Legacy Pixels dice UUIDs (for older dice)
  const PIXELS_LEGACY_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  const PIXELS_LEGACY_NOTIFY_CHARACTERISTIC =
    '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  const PIXELS_LEGACY_WRITE_CHARACTERISTIC =
    '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  async function connectToPixel() {
    try {
      // Try to find both modern and legacy Pixels dice
      const options = {
        filters: [
          { services: [PIXELS_SERVICE_UUID] }, // Modern Pixels dice
          { services: [PIXELS_LEGACY_SERVICE_UUID] }, // Legacy Pixels dice
        ],
      };
      log('Requesting Bluetooth Device with ' + JSON.stringify(options));

      const device = await navigator.bluetooth.requestDevice(options);
      log(
        'User selected Pixel "' +
          device.name +
          '", connected=' +
          device.gatt.connected
      );

      // Add disconnect event listener to handle unexpected disconnections
      device.addEventListener('gattserverdisconnected', event => {
        log('Pixel device disconnected: ' + event.target.name);
        handleDeviceDisconnection(event.target);
      });

      let server, notify;
      const connect = async () => {
        console.log('Connecting to ' + device.name);
        server = await device.gatt.connect();

        // Try to detect which type of Pixel this is and use appropriate UUIDs
        let serviceUuid, notifyUuid, writeUuid;
        try {
          // Try modern UUIDs first
          await server.getPrimaryService(PIXELS_SERVICE_UUID);
          serviceUuid = PIXELS_SERVICE_UUID;
          notifyUuid = PIXELS_NOTIFY_CHARACTERISTIC;
          writeUuid = PIXELS_WRITE_CHARACTERISTIC;
          log('Connected to modern Pixels die');
        } catch (error) {
          // Fall back to legacy UUIDs
          await server.getPrimaryService(PIXELS_LEGACY_SERVICE_UUID);
          serviceUuid = PIXELS_LEGACY_SERVICE_UUID;
          notifyUuid = PIXELS_LEGACY_NOTIFY_CHARACTERISTIC;
          writeUuid = PIXELS_LEGACY_WRITE_CHARACTERISTIC;
          log('Connected to legacy Pixels die');
        }

        const service = await server.getPrimaryService(serviceUuid);
        notify = await service.getCharacteristic(notifyUuid);
        //const write = await service.getCharacteristic(writeUuid);
      };

      // Attempt to connect up to 3 times
      const maxAttempts = 3;
      for (let i = maxAttempts - 1; i >= 0; --i) {
        try {
          await connect();
          break;
        } catch (error) {
          log('Error connecting to Pixel: ' + error);
          // Wait a bit before trying again
          if (i) {
            const delay = 2;
            log('Trying again in ' + delay + ' seconds...');
            await new Promise(resolve =>
              setTimeout(() => resolve(), delay * 1000)
            );
          }
        }
      } // Subscribe to notify characteristic
      if (server && notify) {
        try {
          // Check if this device is already connected
          const existingPixel = pixels.find(p => p.name === device.name);
          if (existingPixel) {
            log(
              'Device ' +
                device.name +
                ' is already connected, skipping duplicate connection'
            );
            return;
          }

          const pixel = new Pixel(device.name, server, device);
          await notify.startNotifications();
          log('Pixels notifications started!');
          pixel.setNotifyCharacteristic(notify);
          sendTextToExtension('Just connected to ' + pixel.name);
          pixels.push(pixel);

          // Start connection monitoring
          startConnectionMonitoring(pixel);
        } catch (error) {
          log('Error connecting to Pixel notifications: ' + error);
          // Handle notification error
          if (server) {
            server.disconnect();
          }
        }
      }
    } catch (error) {
      log('Error during device selection or connection: ' + error);
      sendTextToExtension('Failed to connect to Pixel: ' + error.message);
    }
  }

  function handleDeviceDisconnection(device) {
    log('Handling disconnection for device: ' + device.name);

    // Find the pixel in our array
    const pixelIndex = pixels.findIndex(p => p.name === device.name);
    if (pixelIndex !== -1) {
      const pixel = pixels[pixelIndex];
      pixel.markDisconnected();

      // Update status
      sendTextToExtension('Pixel ' + device.name + ' disconnected');
      sendStatusToExtension();

      // Attempt to reconnect after a delay
      setTimeout(() => {
        attemptReconnection(device, pixel);
      }, 5000); // Wait 5 seconds before attempting reconnection
    }
  }
  async function attemptReconnection(device, pixel) {
    if (!device.gatt.connected) {
      log('Attempting to reconnect to ' + device.name);
      try {
        // First, ensure we're disconnected cleanly
        if (device.gatt.connected) {
          device.gatt.disconnect();
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }

        const server = await device.gatt.connect();

        // Wait a moment for the connection to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify connection is still active
        if (!server.connected) {
          throw new Error('Connection lost immediately after connecting');
        }

        // Detect which type of Pixel this is and use appropriate UUIDs
        let service, notifyUuid;
        try {
          // Try modern UUIDs first
          service = await server.getPrimaryService(PIXELS_SERVICE_UUID);
          notifyUuid = PIXELS_NOTIFY_CHARACTERISTIC;
          log('Reconnecting to modern Pixels die');
        } catch (error) {
          // Fall back to legacy UUIDs
          service = await server.getPrimaryService(PIXELS_LEGACY_SERVICE_UUID);
          notifyUuid = PIXELS_LEGACY_NOTIFY_CHARACTERISTIC;
          log('Reconnecting to legacy Pixels die');
        }
        const notify = await service.getCharacteristic(notifyUuid);

        await notify.startNotifications();

        pixel.reconnect(server, notify);
        sendTextToExtension('Reconnected to ' + pixel.name);
        log('Successfully reconnected to ' + device.name);

        // Restart connection monitoring
        startConnectionMonitoring(pixel);

        // Reset retry count on successful reconnection
        pixel._reconnectAttempts = 0;
      } catch (error) {
        log('Failed to reconnect to ' + device.name + ': ' + error);

        // Implement exponential backoff
        pixel._reconnectAttempts = (pixel._reconnectAttempts || 0) + 1;
        const maxAttempts = 5;

        if (pixel._reconnectAttempts < maxAttempts) {
          const delay = Math.min(
            5000 * Math.pow(2, pixel._reconnectAttempts - 1),
            60000
          ); // Cap at 1 minute
          log(
            `Retry ${pixel._reconnectAttempts}/${maxAttempts} in ${delay / 1000} seconds`
          );

          setTimeout(() => {
            attemptReconnection(device, pixel);
          }, delay);
        } else {
          log(
            `Max reconnection attempts reached for ${device.name}. Giving up.`
          );
          sendTextToExtension(
            `Failed to reconnect to ${pixel.name} after ${maxAttempts} attempts`
          );
        }
      }
    }
  }
  function startConnectionMonitoring(pixel) {
    // Check connection status every 30 seconds
    try {
      pixel._connectionMonitor = setInterval(() => {
        if (pixel._device && !pixel._device.gatt.connected) {
          log('Connection lost detected for ' + pixel.name);
          handleDeviceDisconnection(pixel._device);
          clearInterval(pixel._connectionMonitor);
        }
      }, 30000);
    } catch (error) {
      console.log('Could not set up connection monitoring:', error);
    }
  }

  // Global connection cleanup - runs every 60 seconds
  try {
    setInterval(() => {
      // Remove permanently disconnected pixels after 5 minutes of inactivity
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      pixels = pixels.filter(pixel => {
        if (!pixel.isConnected && now - pixel.lastActivity > fiveMinutes) {
          log(`Removing stale pixel connection: ${pixel.name}`);
          pixel.disconnect(); // Ensure cleanup
          return false;
        }
        return true;
      });

      // Update status if pixels were removed
      sendStatusToExtension();
    }, 60000);
  } catch (error) {
    console.log('Could not set up global cleanup timer:', error);
  } //
  // Holds a bluetooth connection to a pixel dice
  //
  class Pixel {
    constructor(name, server, device) {
      this._name = name;
      this._server = server;
      this._device = device;
      this._notify = null;
      this._notificationHandler = null;
      this._hasMoved = false;
      this._status = 'Ready';
      this._isConnected = true;
      this._connectionMonitor = null;
      this._lastActivity = Date.now();
    }

    get isConnected() {
      return (
        this._isConnected &&
        this._server != null &&
        this._device &&
        this._device.gatt.connected
      );
    }

    get name() {
      return this._name;
    }

    get lastFaceUp() {
      return this._face;
    }

    get lastActivity() {
      return this._lastActivity;
    }

    setNotifyCharacteristic(notify) {
      // Remove old listener if it exists
      if (this._notify && this._notificationHandler) {
        this._notify.removeEventListener(
          'characteristicvaluechanged',
          this._notificationHandler
        );
      }

      this._notify = notify;
      this._notificationHandler = ev => this.handleNotifications(ev);

      if (this._notify) {
        this._notify.addEventListener(
          'characteristicvaluechanged',
          this._notificationHandler
        );
      }
    }

    markDisconnected() {
      this._isConnected = false;
      this._server = null;

      // Clean up notification listener
      if (this._notify && this._notificationHandler) {
        this._notify.removeEventListener(
          'characteristicvaluechanged',
          this._notificationHandler
        );
        this._notify = null;
        this._notificationHandler = null;
      }

      if (this._connectionMonitor) {
        clearInterval(this._connectionMonitor);
        this._connectionMonitor = null;
      }
      log(`Pixel ${this._name} marked as disconnected`);
    }

    reconnect(server, notify) {
      this._server = server;
      this._isConnected = true;
      this._lastActivity = Date.now();

      // Set up new notification listener
      if (notify) {
        this.setNotifyCharacteristic(notify);
      }

      log(`Pixel ${this._name} reconnected successfully`);
    }

    disconnect() {
      this.markDisconnected();
      this._server?.disconnect();
      log(`Pixel ${this._name} manually disconnected`);
    }
    handleNotifications(event) {
      this._lastActivity = Date.now(); // Track activity for connection monitoring

      let value = event.target.value;
      let arr = [];
      // Convert raw data bytes to hex values just for the sake of showing something.
      // In the "real" world, you'd use data.getUint8, data.getUint16 or even
      // TextDecoder to process raw data bytes.
      for (let i = 0; i < value.byteLength; i++) {
        arr.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
      }

      log('Pixel notification: ' + arr.join(' '));

      if (value.getUint8(0) == 3) {
        this._handleFaceEvent(value.getUint8(1), value.getUint8(2));
      }
    }

    _handleFaceEvent(ev, face) {
      if (!this._hasMoved) {
        if (ev != 1) {
          this._hasMoved = true;
        }
      } else if (ev == 1) {
        this._face = face;
        let txt = this._name + ': face up = ' + (face + 1);
        log(txt);

        // Check if modifier box is visible to determine modifier application
        const isModifierBoxVisible =
          window.ModifierBox &&
          window.ModifierBox.isVisible &&
          window.ModifierBox.isVisible();

        // Sync modifier values from the modifier box before processing roll (only if visible)
        if (
          isModifierBoxVisible &&
          typeof window.ModifierBox !== 'undefined' &&
          window.ModifierBox.syncGlobalVars
        ) {
          window.ModifierBox.syncGlobalVars();
        }

        const diceValue = face + 1;
        const modifier = isModifierBoxVisible
          ? parseInt(window.pixelsModifier) || 0
          : 0;
        const result = diceValue + modifier;

        log(
          'Dice value: ' +
            diceValue +
            ', Modifier: ' +
            modifier +
            ', Result: ' +
            result
        );
        log('pixelsModifierName: "' + window.pixelsModifierName + '"');
        log('Modifier box visible: ' + isModifierBoxVisible);

        // Choose formula based on modifier box visibility
        let formula = isModifierBoxVisible
          ? pixelsFormulaWithModifier
          : pixelsFormulaSimple;

        // Add critical hit message if face value is 20
        if (diceValue === 20 && isModifierBoxVisible) {
          formula = formula.replace('{{Result=[[#face_value + #modifier]]}}', '{{<span style="color: #ff4444; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">CRITICAL!</span>}} {{Result=[[#face_value + #modifier]]}}');
        }
        
        // Add fumble message if face value is 1
        if (diceValue === 1 && isModifierBoxVisible) {
          formula = formula.replace('{{Result=[[#face_value + #modifier]]}}', '{{<span style="color: #888888; font-size: 16px; font-style: italic; opacity: 0.7;">FUMBLE!</span>}} {{Result=[[#face_value + #modifier]]}}');
        }


        log('Formula before replacement: ' + formula);

        let message = formula
          .replaceAll('#modifier_name', window.pixelsModifierName)
          .replaceAll('#face_value', diceValue.toString())
          .replaceAll('#pixel_name', this._name)
          .replaceAll('#modifier', modifier.toString())
          .replaceAll('#result', result.toString());

        log('Formula after replacement: ' + message);

        message.split('\\n').forEach(s => postChatMessage(s));

        sendTextToExtension(txt);
      }
    }

    // function sendMessage() {
    //     const buffer = new ArrayBuffer(16);
    //     const int8View = new Int8Array(buffer);
    //     int8View[0] = 1;
    //     let r = await _writer.writeValue(buffer);
    // }
  }

  // Expose Pixel class for testing
  if (typeof window !== 'undefined') {
    window.Pixel = Pixel;
    window.postChatMessage = postChatMessage;
  } else if (typeof global !== 'undefined') {
    global.Pixel = Pixel;
    global.postChatMessage = postChatMessage;
  }

  //
  // Communicate with extension
  //

  function sendMessageToExtension(data) {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      try {
        chrome.runtime.sendMessage(data);
      } catch (error) {
        console.log('Could not send message to extension:', error.message);
      }
    }
  }

  function sendTextToExtension(txt) {
    sendMessageToExtension({ action: 'showText', text: txt });
  }
  function sendStatusToExtension() {
    const connectedPixels = pixels.filter(p => p.isConnected);
    const totalPixels = pixels.length;

    if (totalPixels == 0) {
      sendTextToExtension('No Pixel connected');
    } else if (totalPixels == 1) {
      const status = connectedPixels.length == 1 ? 'connected' : 'disconnected';
      sendTextToExtension(`1 Pixel ${status}`);
    } else {
      sendTextToExtension(
        `${connectedPixels.length}/${totalPixels} Pixels connected`
      );
    }
  }

  //
  // Initialize
  //

  log('Starting Pixels Roll20 extension');

  var pixels = [];

  // Formula when modifier box is visible (shows modifier details)
  var pixelsFormulaWithModifier =
    '&{template:default} {{name=#modifier_name}} {{Result=[[#face_value + #modifier]]}}';

  // Formula when modifier box is hidden (simplified display)
  var pixelsFormulaSimple =
    '&{template:default} {{name=Result}} {{Pixel Dice=[[#result]]}}';

  // Legacy formula variable for backward compatibility
  var pixelsFormula = pixelsFormulaWithModifier;

  // Only set up message listener if in extension context
  if (
    typeof chrome !== 'undefined' &&
    chrome.runtime &&
    chrome.runtime.onMessage
  ) {
    try {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        // Handle null/undefined messages gracefully
        if (!msg || typeof msg !== 'object') {
          log('Received invalid message: ' + JSON.stringify(msg));
          return;
        }

        log('Received message from extension: ' + msg.action);
        if (msg.action == 'getStatus') {
          sendStatusToExtension();
        } else if (msg.action == 'setModifier') {
          // Instead of overwriting the UI, sync FROM the UI TO the global variables
          // This prevents resetting user-entered values when the popup initializes
          if (typeof window.ModifierBox !== 'undefined') {
            const modifierBox = window.ModifierBox.getElement();
            if (modifierBox) {
              // Check if the modifier box has any user data
              const selectedRadio = modifierBox.querySelector(
                'input[name="modifier-select"]:checked'
              );
              if (selectedRadio) {
                const index = parseInt(selectedRadio.value);
                const rows = modifierBox.querySelectorAll('.modifier-row');
                const row = rows[index];
                if (row) {
                  const valueInput = row.querySelector('.modifier-value');
                  const nameInput = row.querySelector('.modifier-name');
                  
                  // If there's already user data in the UI, sync FROM UI TO global vars
                  if (valueInput && nameInput) {
                    const currentValue = valueInput.value;
                    const currentName = nameInput.value;
                    
                    // Only update if the UI has meaningful data
                    if (currentValue !== '' && currentName !== '') {
                      window.pixelsModifier = currentValue;
                      window.pixelsModifierName = currentName;
                      log('Synced FROM UI: modifier=' + currentValue + ', name=' + currentName);
                      saveModifierSettings();
                      return; // Exit early, don't overwrite UI
                    }
                  }
                }
              }
            }
          }
          
          // If no meaningful UI data exists, then apply the popup's value
          if (window.pixelsModifier != msg.modifier) {
            window.pixelsModifier = msg.modifier || '0';
            log('Updated modifier from popup: ' + window.pixelsModifier);
            saveModifierSettings();
            
            // Only update UI if there's no existing meaningful data
            if (typeof window.ModifierBox !== 'undefined') {
              const modifierBox = window.ModifierBox.getElement();
              if (modifierBox) {
                const selectedRadio = modifierBox.querySelector(
                  'input[name="modifier-select"]:checked'
                );
                if (selectedRadio) {
                  const index = parseInt(selectedRadio.value);
                  const rows = modifierBox.querySelectorAll('.modifier-row');
                  const row = rows[index];
                  if (row) {
                    const valueInput = row.querySelector('.modifier-value');
                    if (valueInput && (valueInput.value === '' || valueInput.value === '0')) {
                      valueInput.value = window.pixelsModifier;
                      log('Updated UI with popup value: ' + window.pixelsModifier);
                    }
                  }
                }
              }
            }
          }
        } else if (msg.action == 'showModifier') {
          log('Received showModifier message');
          showModifierBox();
        } else if (msg.action == 'hideModifier') {
          log('Received hideModifier message');
          hideModifierBox();
        } else if (msg.action == 'connect') {
          log('Connect button clicked, attempting to connect to Pixel');
          try {
            connectToPixel();
          } catch (error) {
            log('Error in connectToPixel: ' + error);
            sendTextToExtension('Failed to connect: ' + error.message);
          }
        } else if (msg.action == 'disconnect') {
          log('Manual disconnect requested');
          pixels.forEach(pixel => {
            pixel.disconnect();
          });
          pixels = [];
          sendStatusToExtension();
        } else if (msg.action == 'getTheme') {
          log('Received theme request');
          // Get current theme from ThemeDetector
          const theme = window.ThemeDetector ? window.ThemeDetector.detectTheme() : 'dark';
          log('Sending theme response: ' + theme);
          sendResponse({ theme: theme });
          return true; // Keep the message channel open for async response
        }
      });
    } catch (error) {
      console.log(
        'Could not set up extension message listener:',
        error.message
      );
    }
  }

  //
  // Local Storage Functions (persistent storage)
  //
  function saveModifierSettings() {
    try {
      const settings = {
        modifier: window.pixelsModifier,
        modifierName: window.pixelsModifierName,
        lastUpdated: Date.now()
      };
      localStorage.setItem('pixels_roll20_settings', JSON.stringify(settings));
      log('Saved modifier settings to localStorage');
    } catch (error) {
      log('Error saving modifier settings:', error);
    }
  }

  function loadModifierSettings() {
    try {
      const stored = localStorage.getItem('pixels_roll20_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        window.pixelsModifier = settings.modifier || '0';
        window.pixelsModifierName = settings.modifierName || 'Modifier 1';
        log(`Loaded modifier settings: ${window.pixelsModifier}, ${window.pixelsModifierName}`);
        return true;
      }
    } catch (error) {
      log('Error loading modifier settings:', error);
    }
    return false;
  }

  function updateModifierSettings(modifier, modifierName) {
    window.pixelsModifier = modifier || '0';
    window.pixelsModifierName = modifierName || 'Modifier 1';
    saveModifierSettings();
    log(`Updated modifier settings: ${modifier}, ${modifierName}`);
  }

  function clearAllModifierSettings() {
    try {
      localStorage.removeItem('pixels_roll20_settings');
      window.pixelsModifier = '0';
      window.pixelsModifierName = 'Modifier 1';
      log('Cleared all modifier settings from localStorage');
    } catch (error) {
      log('Error clearing modifier settings:', error);
    }
  }

  // Make functions available globally
  window.saveModifierSettings = saveModifierSettings;
  window.loadModifierSettings = loadModifierSettings;
  window.updateModifierSettings = updateModifierSettings;
  window.clearAllModifierSettings = clearAllModifierSettings;

  sendStatusToExtension();

  // Load modifier settings from localStorage
  log('Loading modifier settings from localStorage...');
  loadModifierSettings();

  // Show modifier box by default
  log('Attempting to show modifier box automatically...');
  setTimeout(() => {
    try {
      // Only show modifier box if not in a popup window
      if (!isRoll20PopupWindow()) {
        showModifierBox();
        log('Modifier box shown successfully on page load');
      } else {
        log('Skipping automatic modifier box display - this is a Roll20 popup window');
      }
    } catch (error) {
      log('Error showing modifier box: ' + error);
    }
  }, 1000);
}
