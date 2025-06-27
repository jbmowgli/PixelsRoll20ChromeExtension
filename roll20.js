'use strict';

if (typeof window.roll20PixelsLoaded == 'undefined') {
    var roll20PixelsLoaded = true;

    //
    // Global modifier variables (accessed by modifierBox.js)
    //
    window.pixelsModifier = "0";
    window.pixelsModifierName = "None";    //
    // Modifier Box Functions (delegated to modifierBox.js)
    //
    function showModifierBox() {
        if (typeof window.ModifierBox !== 'undefined') {
            if (!window.ModifierBox.isInitialized()) {
                log("ModifierBox module not initialized yet");
            }
            window.ModifierBox.show();
        } else {
            log("ModifierBox module not loaded");
        }
    }

    function hideModifierBox() {
        if (typeof window.ModifierBox !== 'undefined') {
            window.ModifierBox.hide();
        } else {
            log("ModifierBox module not loaded");
        }
    }

    // Make functions available globally for testing
    window.showModifierBox = showModifierBox;
    window.hideModifierBox = hideModifierBox;

    //
    // Message handler for extension communication
    //
    window.sendMessageToExtension = function(data) {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage(data);
        }
    };

    //
    // Helpers
    //

    let log = console.log;

    function getArrayFirstElement(array) {
        //return (Array.isArray(array) && array.length) ? array[0] : undefined;
        return typeof array == "undefined" ? undefined : array[0];
    }

    // Chat on Roll20
    function postChatMessage(message) {
        log("Posting message on Roll20: " + message);

        const chat = document.getElementById("textchat-input");
        const txt = getArrayFirstElement(chat?.getElementsByTagName("textarea"));
        const btn = getArrayFirstElement(chat?.getElementsByTagName("button"));
        //const speakingas = document.getElementById("speakingas");

        if ((typeof txt == "undefined") || (typeof btn == "undefined")) {
            log("Couldn't find Roll20 chat textarea and/or button");
        }
        else {
            const current_msg = txt.value;
            txt.value = message;
            btn.click();
            txt.value = current_msg;
        }
    }    //
    // Pixels bluetooth discovery
    // UUIDs from the official Pixels JS SDK
    //
    // Modern Pixels dice UUIDs
    const PIXELS_SERVICE_UUID = "a6b90001-7a5a-43f2-a962-350c8edc9b5b";
    const PIXELS_NOTIFY_CHARACTERISTIC = "a6b90002-7a5a-43f2-a962-350c8edc9b5b";
    const PIXELS_WRITE_CHARACTERISTIC = "a6b90003-7a5a-43f2-a962-350c8edc9b5b";
    
    // Legacy Pixels dice UUIDs (for older dice)
    const PIXELS_LEGACY_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    const PIXELS_LEGACY_NOTIFY_CHARACTERISTIC = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    const PIXELS_LEGACY_WRITE_CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";    async function connectToPixel() {
        try {
            // Try to find both modern and legacy Pixels dice
            const options = { 
                filters: [
                    { services: [PIXELS_SERVICE_UUID] },              // Modern Pixels dice
                    { services: [PIXELS_LEGACY_SERVICE_UUID] }        // Legacy Pixels dice
                ]
            };
            log('Requesting Bluetooth Device with ' + JSON.stringify(options));

            const device = await navigator.bluetooth.requestDevice(options);
            log('User selected Pixel "' + device.name + '", connected=' + device.gatt.connected);

            // Add disconnect event listener to handle unexpected disconnections
            device.addEventListener('gattserverdisconnected', (event) => {
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
                    await new Promise((resolve) => setTimeout(() => resolve(), delay * 1000));
                }
            }
        }        // Subscribe to notify characteristic
        if (server && notify) {
            try {
                const pixel = new Pixel(device.name, server, device);
                await notify.startNotifications();
                log('Pixels notifications started!');
                notify.addEventListener('characteristicvaluechanged', ev => pixel.handleNotifications(ev));
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
    }    async function attemptReconnection(device, pixel) {
        if (!device.gatt.connected) {
            log('Attempting to reconnect to ' + device.name);
            try {
                const server = await device.gatt.connect();
                
                // Detect which type of Pixel this is and use appropriate UUIDs
                let serviceUuid, notifyUuid;
                try {
                    // Try modern UUIDs first
                    await server.getPrimaryService(PIXELS_SERVICE_UUID);
                    serviceUuid = PIXELS_SERVICE_UUID;
                    notifyUuid = PIXELS_NOTIFY_CHARACTERISTIC;
                    log('Reconnecting to modern Pixels die');
                } catch (error) {
                    // Fall back to legacy UUIDs
                    await server.getPrimaryService(PIXELS_LEGACY_SERVICE_UUID);
                    serviceUuid = PIXELS_LEGACY_SERVICE_UUID;
                    notifyUuid = PIXELS_LEGACY_NOTIFY_CHARACTERISTIC;
                    log('Reconnecting to legacy Pixels die');
                }
                
                const service = await server.getPrimaryService(serviceUuid);
                const notify = await service.getCharacteristic(notifyUuid);
                
                await notify.startNotifications();
                notify.addEventListener('characteristicvaluechanged', ev => pixel.handleNotifications(ev));
                
                pixel.reconnect(server);
                sendTextToExtension('Reconnected to ' + pixel.name);
                log('Successfully reconnected to ' + device.name);
                
                // Restart connection monitoring
                startConnectionMonitoring(pixel);
            } catch (error) {
                log('Failed to reconnect to ' + device.name + ': ' + error);
                // Try again in 10 seconds
                setTimeout(() => {
                    attemptReconnection(device, pixel);
                }, 10000);
            }
        }
    }function startConnectionMonitoring(pixel) {
        // Check connection status every 30 seconds
        pixel._connectionMonitor = setInterval(() => {
            if (pixel._device && !pixel._device.gatt.connected) {
                log('Connection lost detected for ' + pixel.name);
                handleDeviceDisconnection(pixel._device);
                clearInterval(pixel._connectionMonitor);
            }
        }, 30000);
    }

    // Global connection cleanup - runs every 60 seconds
    setInterval(() => {
        // Remove permanently disconnected pixels after 5 minutes of inactivity
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        pixels = pixels.filter(pixel => {
            if (!pixel.isConnected && (now - pixel.lastActivity) > fiveMinutes) {
                log(`Removing stale pixel connection: ${pixel.name}`);
                pixel.disconnect(); // Ensure cleanup
                return false;
            }
            return true;
        });
        
        // Update status if pixels were removed
        sendStatusToExtension();
    }, 60000);//
    // Holds a bluetooth connection to a pixel dice
    //
    class Pixel {
        constructor(name, server, device) {
            this._name = name;
            this._server = server;
            this._device = device;
            this._hasMoved = false;
            this._status = 'Ready';
            this._isConnected = true;
            this._connectionMonitor = null;
            this._lastActivity = Date.now();
        }

        get isConnected() {
            return this._isConnected && this._server != null && this._device && this._device.gatt.connected;
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

        markDisconnected() {
            this._isConnected = false;
            this._server = null;
            if (this._connectionMonitor) {
                clearInterval(this._connectionMonitor);
                this._connectionMonitor = null;
            }
            log(`Pixel ${this._name} marked as disconnected`);
        }

        reconnect(server) {
            this._server = server;
            this._isConnected = true;
            this._lastActivity = Date.now();
            log(`Pixel ${this._name} reconnected successfully`);
        }

        disconnect() {
            this.markDisconnected();
            this._server?.disconnect();
            log(`Pixel ${this._name} manually disconnected`);
        }        handleNotifications(event) {
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
                this._handleFaceEvent(value.getUint8(1), value.getUint8(2))
            }
        }

        _handleFaceEvent(ev, face) {
            if (!this._hasMoved) {
                if (ev != 1) {
                    this._hasMoved = true;
                }
            }
            else if (ev == 1) {
                this._face = face;
                let txt = this._name + ': face up = ' + (face + 1);
                log(txt);

                const diceValue = face + 1;
                const modifier = parseInt(window.pixelsModifier) || 0;
                const result = diceValue + modifier;
                
                log('Dice value: ' + diceValue + ', Modifier: ' + modifier + ', Result: ' + result);
                log('pixelsModifierName: "' + window.pixelsModifierName + '"');
                log('Formula before replacement: ' + pixelsFormula);

                let message = pixelsFormula
                    .replaceAll("#modifier_name", window.pixelsModifierName)
                    .replaceAll("#face_value", diceValue.toString())
                    .replaceAll("#pixel_name", this._name)
                    .replaceAll("#modifier", modifier.toString())
                    .replaceAll("#result", result.toString());
                
                log('Formula after replacement: ' + message);
                
                message.split("\\n").forEach(s => postChatMessage(s));

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

    //
    // Communicate with extension
    //

    function sendMessageToExtension(data) {
        chrome.runtime.sendMessage(data);
    }

    function sendTextToExtension(txt) {
        sendMessageToExtension({ action: "showText", text: txt });
    }    function sendStatusToExtension() {
        const connectedPixels = pixels.filter(p => p.isConnected);
        const totalPixels = pixels.length;
        
        if (totalPixels == 0) {
            sendTextToExtension("No Pixel connected");
        } else if (totalPixels == 1) {
            const status = connectedPixels.length == 1 ? "connected" : "disconnected";
            sendTextToExtension(`1 Pixel ${status}`);
        } else {
            sendTextToExtension(`${connectedPixels.length}/${totalPixels} Pixels connected`);
        }
    }

    //
    // Initialize
    //

    log("Starting Pixels Roll20 extension");

    var pixels = [];
    var pixelsFormula = "&{template:default} {{name=#modifier_name}} {{Pixel Die=[[#face_value]]}} {{Modifier=[[#modifier]]}} {{Total=[[#face_value + #modifier]]}}";

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        log("Received message from extension: " + msg.action);
        if (msg.action == "getStatus") {
            sendStatusToExtension();            
        }
        else if (msg.action == "setModifier") {
            if (window.pixelsModifier != msg.modifier) {
                window.pixelsModifier = msg.modifier || "0";
                log("Updated modifier: " + window.pixelsModifier);
                // Update floating box if it exists and ModifierBox is loaded
                if (typeof window.ModifierBox !== 'undefined') {
                    const modifierBox = window.ModifierBox.getElement();
                    if (modifierBox) {
                        const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
                        if (selectedRadio) {
                            const index = parseInt(selectedRadio.value);
                            const rows = modifierBox.querySelectorAll('.modifier-row');
                            const row = rows[index];
                            if (row) {
                                const valueInput = row.querySelector('.modifier-value');
                                if (valueInput) valueInput.value = window.pixelsModifier;
                            }
                        }
                    }
                }
            }
        }
        else if (msg.action == "showModifier") {
            log("Received showModifier message");
            showModifierBox();
        }
        else if (msg.action == "hideModifier") {
            log("Received hideModifier message");
            hideModifierBox();
        }        else if (msg.action == "connect") {
            log("Connect button clicked, attempting to connect to Pixel");
            try {
                connectToPixel();
            } catch (error) {
                log("Error in connectToPixel: " + error);
                sendTextToExtension("Failed to connect: " + error.message);
            }
        }else if (msg.action == "disconnect") {
            log("Manual disconnect requested");
            pixels.forEach(pixel => {
                pixel.disconnect();
            });
            pixels = [];
            sendStatusToExtension();
        }
    });

    sendStatusToExtension();
    
    // Show modifier box by default
    log("Attempting to show modifier box automatically...");
    setTimeout(() => {
        try {
            showModifierBox();
            log("Modifier box shown successfully on page load");
        } catch (error) {
            log("Error showing modifier box: " + error);
        }
    }, 1000);
}
