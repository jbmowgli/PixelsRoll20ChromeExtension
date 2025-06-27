'use strict';

if (typeof window.roll20PixelsLoaded == 'undefined') {
    var roll20PixelsLoaded = true;

    //
    // Floating Modifier Box
    //
    let modifierBox = null;
    let isModifierBoxVisible = false;

    function createModifierBox() {
        log("Creating modifier box...");
        if (modifierBox) return;

        // Create the floating box
        modifierBox = document.createElement('div');
        modifierBox.id = 'pixels-modifier-box';
        modifierBox.setAttribute('data-testid', 'pixels-modifier-box');
        modifierBox.className = 'PIXELS_EXTENSION_BOX_FIND_ME';
          modifierBox.innerHTML = `
            <div class="pixels-header">
                <span class="pixels-title">🎲 Dice Modifiers</span>
                <div class="pixels-controls">
                    <button class="pixels-minimize" title="Minimize">−</button>
                    <button class="pixels-close" title="Close">×</button>
                </div>
            </div>            <div class="pixels-content">
                <div class="modifier-row">
                    <input type="radio" name="modifier-select" value="0" class="modifier-radio" id="mod-0" checked>
                    <input type="text" class="modifier-name" placeholder="None" value="None" data-index="0">
                    <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="0">
                    <button class="remove-row-btn" type="button">×</button>
                </div>
                <button class="add-modifier-btn">+ Add Row</button>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');        style.textContent = `
            #pixels-modifier-box {
                position: fixed;
                width: 280px;
                min-width: 250px;
                max-width: 400px;
                background: #2b2b2b;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                z-index: 999999;
                user-select: none;
                color: white;
                resize: both;
                overflow: hidden;
            }            .pixels-header {
                background: #1a1a1a;
                padding: 8px 12px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid #555;
            }
            .pixels-title {
                color: #4CAF50;
                font-size: 12px;
                font-weight: bold;
            }
            .pixels-controls {
                display: flex;
                gap: 4px;
            }
            .pixels-controls button {
                background: none;
                border: none;
                color: #ccc;
                font-size: 14px;
                font-weight: bold;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .pixels-controls button:hover {
                background: #444;
                color: #fff;
            }
            .pixels-content {
                padding: 8px;
                box-sizing: border-box;
                max-height: 300px;
                overflow-y: auto;
            }
            .modifier-row {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 6px;
                position: relative;
            }
            .modifier-radio {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }
            .modifier-name {
                flex: 1;
                padding: 4px 6px;
                border: 1px solid #555;
                border-radius: 3px;
                background: #333;
                color: #fff;
                font-size: 12px;
                min-width: 0;
                box-sizing: border-box;
            }
            .modifier-value {
                width: 50px;
                padding: 4px;
                border: 1px solid #555;
                border-radius: 3px;
                background: #333;
                color: #fff;
                font-size: 12px;
                text-align: center;
                box-sizing: border-box;
                flex-shrink: 0;
            }
            .remove-row-btn {
                width: 20px;
                height: 20px;
                border: 1px solid #777;
                border-radius: 3px;
                background: #555;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .remove-row-btn:hover {
                background: #666;
            }
            .modifier-row:first-child .remove-row-btn {
                display: none;
            }
            .modifier-name:focus, .modifier-value:focus {
                outline: none;
                border-color: #777;
                background: #3a3a3a;
            }
            .add-modifier-btn {
                width: 100%;
                padding: 6px;
                border: 1px solid #555;
                border-radius: 4px;
                background: #444;
                color: #ccc;
                font-size: 11px;
                cursor: pointer;
                margin-top: 4px;
            }
            .add-modifier-btn:hover {
                background: #555;
                color: #fff;
            }
            #pixels-modifier-box.minimized .pixels-content {
                display: none;
            }
            #pixels-modifier-box.minimized {
                width: auto !important;
                min-width: 120px;
                resize: none;
            }
        `;
        document.head.appendChild(style);

        // Add drag functionality
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        modifierBox.querySelector('.pixels-header').addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = modifierBox.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            modifierBox.style.left = (e.clientX - dragOffset.x) + 'px';
            modifierBox.style.top = (e.clientY - dragOffset.y) + 'px';
            modifierBox.style.right = 'auto';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }        // Add close functionality
        modifierBox.querySelector('.pixels-close').addEventListener('click', () => {
            hideModifierBox();
        });

        // Add minimize functionality
        modifierBox.querySelector('.pixels-minimize').addEventListener('click', () => {
            modifierBox.classList.toggle('minimized');
        });

        // Add row functionality
        setupModifierRowLogic();document.body.appendChild(modifierBox);
        isModifierBoxVisible = true;        // Position relative to textchatcontainer
        positionModifierBox();
        
        // Add window resize listener to reposition the box
        window.addEventListener('resize', positionModifierBox);
          log("Modifier box created and added to page");
    }

    function setupModifierRowLogic() {
        if (!modifierBox) return;

        let rowCounter = 1; // Start from 1 since we have row 0

        // Add event listener for the add button
        const addButton = modifierBox.querySelector('.add-modifier-btn');
        addButton.addEventListener('click', () => {
            addModifierRow();
        });

        // Add event listeners for existing radio buttons and inputs
        updateEventListeners();

        function addModifierRow() {
            const content = modifierBox.querySelector('.pixels-content');
            const addButton = content.querySelector('.add-modifier-btn');
            
            // Create new row
            const newRow = document.createElement('div');
            newRow.className = 'modifier-row';
            newRow.innerHTML = `
                <input type="radio" name="modifier-select" value="${rowCounter}" class="modifier-radio" id="mod-${rowCounter}">
                <input type="text" class="modifier-name" placeholder="Modifier ${rowCounter + 1}" value="Modifier ${rowCounter + 1}" data-index="${rowCounter}">
                <input type="number" class="modifier-value" value="0" min="-99" max="99" data-index="${rowCounter}">
                <button class="remove-row-btn" type="button">×</button>
            `;
            
            // Insert before the add button
            content.insertBefore(newRow, addButton);
            rowCounter++;
            
            // Update event listeners for all rows
            updateEventListeners();
            
            log(`Added modifier row ${rowCounter - 1}`);
        }        function removeModifierRow(rowElement, rowIndex) {
            // Find the actual data-index from the radio button
            const radio = rowElement.querySelector('.modifier-radio');
            const index = parseInt(radio.value);
            
            // Don't remove the first row (index 0)
            if (index === 0) {
                log("Cannot remove the first modifier row");
                return;
            }
            
            // Check if this row was selected
            const wasSelected = radio.checked;
            
            // Remove the row
            rowElement.remove();
            
            // If the removed row was selected, select the first row
            if (wasSelected) {
                const firstRadio = modifierBox.querySelector('.modifier-radio[value="0"]');
                if (firstRadio) {
                    firstRadio.checked = true;
                    updateSelectedModifier();
                }
            }
            
            log(`Removed modifier row with index ${index}`);
        }        function updateEventListeners() {
            // Remove existing listeners by cloning and replacing elements
            const rows = modifierBox.querySelectorAll('.modifier-row');
            
            rows.forEach((row, rowIndex) => {
                // Radio button change
                const radio = row.querySelector('.modifier-radio');
                radio.addEventListener('change', updateSelectedModifier);
                
                // Name input change
                const nameInput = row.querySelector('.modifier-name');
                nameInput.addEventListener('input', updateSelectedModifier);
                
                // Value input change
                const valueInput = row.querySelector('.modifier-value');
                valueInput.addEventListener('input', updateSelectedModifier);
                
                // Remove button click
                const removeButton = row.querySelector('.remove-row-btn');
                if (removeButton) {
                    removeButton.addEventListener('click', () => {
                        removeModifierRow(row, rowIndex);
                    });
                }
            });
        }function updateSelectedModifier() {
            const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
            if (selectedRadio) {
                const index = parseInt(selectedRadio.value);
                const rows = modifierBox.querySelectorAll('.modifier-row');
                const row = rows[index];
                if (row) {
                    const nameInput = row.querySelector('.modifier-name');
                    const valueInput = row.querySelector('.modifier-value');
                    
                    pixelsModifierName = nameInput.value || "Unnamed";
                    pixelsModifier = valueInput.value || "0";
                    
                    log(`Selected modifier: ${pixelsModifierName} = ${pixelsModifier}`);
                    sendMessageToExtension({ 
                        action: "modifierChanged", 
                        modifier: pixelsModifier,
                        name: pixelsModifierName 
                    });
                }
            }
        }

        // Initialize with the first row selected
        updateSelectedModifier();
    }function positionModifierBox() {
        if (!modifierBox) {
            log("positionModifierBox called but modifierBox is null");
            return;
        }
        
        log("Positioning modifier box...");
        const chatContainer = document.querySelector('.textchatcontainer');
        if (chatContainer) {
            log("Found chat container, positioning relative to it");
            const rect = chatContainer.getBoundingClientRect();
            const boxWidth = modifierBox.offsetWidth || 280; // Use actual width or default
            // Position to the left of the chat container, aligned with its bottom
            modifierBox.style.left = (rect.left - boxWidth - 20) + 'px'; // Dynamic width + 20px gap
            modifierBox.style.top = (rect.bottom - 80) + 'px'; // Align with bottom, smaller offset
        } else {
            log("Chat container not found, using fallback position");
            // Fallback to default position if chat container not found
            modifierBox.style.top = '100px';
            modifierBox.style.right = '20px';
            modifierBox.style.left = 'auto';
        }
    }    function showModifierBox() {
        log("showModifierBox called");
        if (!modifierBox) {
            createModifierBox();
        } else {
            log("Modifier box already exists, showing it");
            modifierBox.style.display = 'block';
            isModifierBoxVisible = true;
            // Reposition in case the page layout has changed
            positionModifierBox();
        }        // Update the selected modifier based on current values
        if (modifierBox) {
            const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
            if (selectedRadio) {
                const index = parseInt(selectedRadio.value);
                const rows = modifierBox.querySelectorAll('.modifier-row');
                const row = rows[index];
                if (row) {
                    const nameInput = row.querySelector('.modifier-name');
                    const valueInput = row.querySelector('.modifier-value');
                    if (nameInput) nameInput.value = pixelsModifierName;
                    if (valueInput) valueInput.value = pixelsModifier;
                }
            }
        }
    }

    function hideModifierBox() {
        log("hideModifierBox called");
        if (modifierBox) {
            modifierBox.style.display = 'none';
            isModifierBoxVisible = false;
            log("Modifier box hidden");
        } else {
            log("Cannot hide - modifierBox is null");
        }
    }

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
    }

    //
    // Pixels bluetooth discovery
    //

    const PIXELS_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()
    const PIXELS_NOTIFY_CHARACTERISTIC = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()
    const PIXELS_WRITE_CHARACTERISTIC = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()

    async function connectToPixel() {
        const options = { filters: [{ services: [PIXELS_SERVICE_UUID] }] };
        log('Requesting Bluetooth Device with ' + JSON.stringify(options));

        const device = await navigator.bluetooth.requestDevice(options);
        log('User selected Pixel "' + device.name + '", connected=' + device.gatt.connected);

        let server, notify;
        const connect = async () => {
            console.log('Connecting to ' + device.name)
            server = await device.gatt.connect();
            const service = await server.getPrimaryService(PIXELS_SERVICE_UUID);
            notify = await service.getCharacteristic(PIXELS_NOTIFY_CHARACTERISTIC);
            //const write = await service.getCharacteristic(PIXELS_WRITE_CHARACTERISTIC);
        }

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
        }

        // Subscribe to notify characteristic
        if (server && notify) {
            try {
                const pixel = new Pixel(device.name, server);
                await notify.startNotifications();
                log('Pixels notifications started!');
                notify.addEventListener('characteristicvaluechanged', ev => pixel.handleNotifications(ev));
                sendTextToExtension('Just connected to ' + pixel.name);
                pixels.push(pixel);
            } catch (error) {
                log('Error connecting to Pixel notifications: ' + error);
                await delay(1000);
            }
        }
    }

    //
    // Holds a bluetooth connection to a pixel dice
    //
    class Pixel {
        constructor(name, server) {
            this._name = name;
            this._server = server;
            this._hasMoved = false;
            this._status = 'Ready';
        }

        get isConnected() {
            return this._server != null;
        }

        get name() {
            return this._name;
        }

        get lastFaceUp() {
            return this._face;
        }

        disconnect() {
            this._server?.disconnect();
            this._server = null;
        }

        handleNotifications(event) {
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
        }        _handleFaceEvent(ev, face) {
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
                const modifier = parseInt(pixelsModifier) || 0;
                const result = diceValue + modifier;
                
                log('Dice value: ' + diceValue + ', Modifier: ' + modifier + ', Result: ' + result);
                log('pixelsModifierName: "' + pixelsModifierName + '"');
                log('Formula before replacement: ' + pixelsFormula);

                let message = pixelsFormula
                    .replaceAll("#modifier_name", pixelsModifierName)
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
    }

    function sendStatusToExtension() {
        if (pixels.length == 0)
            sendTextToExtension("No Pixel connected");
        else if (pixels.length == 1)
            sendTextToExtension("1 Pixel connected");
        else
            sendTextToExtension(pixels.length + " Pixels connected");
    }

    //
    // Initialize
    //    log("Starting Pixels Roll20 extension");

    var pixels = []
    var pixelsFormula = "&{template:default} {{name=#modifier_name}} {{Dice=#face_value}}{{Mod=#modifier}} {{Result=[[#face_value + #modifier]]}}";
    var pixelsModifier = "0";
    var pixelsModifierName = "Manual Entry";    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        log("Received message from extension: " + msg.action);
        if (msg.action == "getStatus") {
            sendStatusToExtension();            
        }
        else if (msg.action == "setFormula") {
            if (pixelsFormula != msg.formula) {
                pixelsFormula = msg.formula;
                log("Updated Roll20 formula: " + pixelsFormula);
            }
        }        else if (msg.action == "setModifier") {
            if (pixelsModifier != msg.modifier) {
                pixelsModifier = msg.modifier || "0";
                log("Updated modifier: " + pixelsModifier);                // Update floating box if it exists
                if (modifierBox) {
                    const selectedRadio = modifierBox.querySelector('input[name="modifier-select"]:checked');
                    if (selectedRadio) {
                        const index = parseInt(selectedRadio.value);
                        const rows = modifierBox.querySelectorAll('.modifier-row');
                        const row = rows[index];
                        if (row) {
                            const valueInput = row.querySelector('.modifier-value');
                            if (valueInput) valueInput.value = pixelsModifier;
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
        }
        else if (msg.action == "connect") {
            connectToPixel();
        }
        else if (msg.action == "disconnect") {
            log("disconnect");
            pixels.forEach(pixel => pixel.disconnect());
            pixels = []
            sendStatusToExtension();
        }
    });    sendStatusToExtension();
    
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
