# Developer Guide

## Setup

### Requirements
- Chrome browser
- Code editor
- Basic JavaScript knowledge

### Getting Started
1. Clone the repo
2. Open chrome://extensions/
3. Enable Developer Mode
4. Click "Load unpacked" and select the project folder

## Project Structure

```
src/
├── background/     # Extension background script
├── content/       # Roll20 page scripts
├── popup/         # Extension popup
├── options/       # Settings page
```

### Key Files
- `src/content/roll20.js` - Main Roll20 integration
- `src/content/ModifierBox/` - Modifier box UI components
- `src/content/Common/themeDetector.js` - Theme detection
- `manifest.json` - Extension configuration

## Development

### Testing
Use `test.html` to test the modifier box without Roll20:
```html
<script src="src/content/Common/themeDetector.js"></script>
<script src="src/content/ModifierBox/index.js"></script>
```

### Debugging
- Background script: chrome://extensions/ → "Inspect views"
- Content scripts: F12 on Roll20 page
- Popup: Right-click extension icon → "Inspect popup"

## Code Guidelines

### JavaScript
```javascript
'use strict';

// Use camelCase for variables
let modifierValue = 0;

// Use PascalCase for classes
class ModifierBox {}

// Use UPPER_CASE for constants
const PIXELS_SERVICE_UUID = 'service-uuid';
```

### CSS
```css
/* Use specific selectors to avoid conflicts */
#pixels-modifier-box .modifier-row {
    /* styles */
}

/* Use !important sparingly, only for Roll20 overrides */
.pixels-element {
    color: #ffffff !important;
}
```

## API Reference

### ModifierBox
```javascript
// Basic usage
window.ModifierBoxManager.createModifierBox();
window.ModifierBoxManager.hideModifierBox();
window.ModifierBoxManager.showModifierBox();
```

### Theme Detection
```javascript
// Get current theme
const colors = window.ThemeDetector.getThemeColors();

// Listen for theme changes  
window.ThemeDetector.onThemeChange((newTheme) => {
    console.log('Theme changed:', newTheme);
});
```

### Bluetooth
```javascript
// Connect to Pixels dice
async function connectPixel() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [PIXELS_SERVICE_UUID] }]
        });
        // handle connection
    } catch (error) {
        console.error('Connection failed:', error);
    }
}
```

## Storage & Messaging

### Chrome Storage
```javascript
// Save settings
chrome.storage.sync.set({ modifier: 5 });

// Load settings
chrome.storage.sync.get(['modifier'], (result) => {
    console.log('Modifier:', result.modifier);
});
```

### Message Passing
```javascript
// Popup to content script
chrome.tabs.sendMessage(tabId, {
    action: 'connect',
    data: { deviceId: 'pixels-001' }
});
```

## Contributing

### Process
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Testing Checklist
- [ ] Extension loads without errors
- [ ] Modifier box works in light/dark themes
- [ ] Bluetooth connection works
- [ ] No console errors
- [ ] UI is responsive

That's it! The codebase is pretty straightforward once you get familiar with the structure.
