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
- `src/content/modifierBox/` - Modifier box UI components
- `src/content/common/themeDetector.js` - Theme detection
- `manifest.json` - Extension configuration

## Development

### Testing

Use `test.html` to test the modifier box without Roll20:

```html
<script src="src/content/common/themeDetector.js"></script>
<script src="src/content/modifierBox/modifierBox.js"></script>
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
window.ThemeDetector.onThemeChange(newTheme => {
  console.log('Theme changed:', newTheme);
});
```

### Bluetooth

```javascript
// Connect to Pixels dice
async function connectPixel() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [PIXELS_SERVICE_UUID] }],
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
chrome.storage.sync.get(['modifier'], result => {
  console.log('Modifier:', result.modifier);
});
```

### Message Passing

```javascript
// Popup to content script
chrome.tabs.sendMessage(tabId, {
  action: 'connect',
  data: { deviceId: 'pixels-001' },
});
```

## Testing

The project includes comprehensive Jest test coverage for all major components:

### Working Tests (141 tests passing)

**ModifierBox Tests (96 tests)**

- `tests/jest/modifierBox/index.test.js` - Core ModifierBox functionality
- `tests/jest/modifierBox/dragHandler.test.js` - Drag and drop behavior
- `tests/jest/modifierBox/themeManager.test.js` - Theme switching and detection
- `tests/jest/modifierBox/rowManager.test.js` - Row management and validation

**Roll20 Integration Tests (45 tests)**

- `tests/jest/roll20-basic.test.js` - Basic module loading and error handling
- `tests/jest/roll20-simple.test.js` - Message handling, Bluetooth, and ModifierBox integration

### Running Tests

```bash
# Run all working tests
npm test -- tests/jest/roll20-basic.test.js tests/jest/roll20-simple.test.js tests/jest/modifierBox/

# Run specific test suites
npm test -- tests/jest/modifierBox/        # ModifierBox tests only
npm test -- tests/jest/roll20-basic.test.js # Basic roll20 tests only
npm test -- tests/jest/roll20-simple.test.js # Simple integration tests only

# Run all tests (includes some failing advanced tests)
npm test
```

### Test Coverage

Current test coverage focuses on:

- ✅ ModifierBox UI components and interactions
- ✅ Roll20 message handling and Chrome extension communication
- ✅ Error handling and edge cases
- ✅ Bluetooth connection error scenarios
- ✅ DOM interaction safety
- ✅ Extension lifecycle management

Advanced test suites are available but may have some failures due to complex mocking requirements:

- `tests/jest/roll20.test.js` - Comprehensive Roll20 integration tests
- `tests/jest/BluetoothConnection.test.js` - Detailed Bluetooth connection tests
- `tests/jest/ExtensionMessaging.test.js` - Extension messaging system tests
- `tests/jest/ChatIntegration.test.js` - Roll20 chat integration tests
- `tests/jest/Pixel.test.js` - Pixel dice class tests

### Test Architecture

The tests use a robust mocking strategy:

- Chrome extension APIs are mocked with proper error handling
- Bluetooth APIs are mocked to simulate connection scenarios
- DOM interactions are safely mocked to prevent errors
- ModifierBox components are tested with realistic HTML structures

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
