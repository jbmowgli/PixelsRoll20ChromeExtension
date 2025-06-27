# Developer Guide

## Development Environment Setup

### Prerequisites

- Git version control
- Google Chrome browser (latest)
- Code editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension API

### Repository Setup

```bash
# Clone the repository
git clone https://github.com/[repository-url]/PixelsRoll20ChromeExtension.git
cd PixelsRoll20ChromeExtension

# Load extension for development
# 1. Open chrome://extensions/
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

### Development Tools

**Recommended Extensions for VS Code:**
- JavaScript (ES6) code snippets
- Chrome Extension Pack
- GitLens
- Prettier (code formatting)

**Browser Tools:**
- Chrome DevTools (F12)
- Extension Developer Tools
- Bluetooth Internals (chrome://bluetooth-internals/)

## Project Architecture

### File Structure Overview

```
src/
├── background/          # Extension background processes
├── content/            # Scripts injected into Roll20
├── popup/              # Extension popup interface  
├── options/            # Extension options page
assets/                 # Static resources
tests/                  # Development test files
docs/                   # Documentation
```

### Core Components

#### Background Script (`src/background/background.js`)
- Extension lifecycle management
- Cross-tab communication
- Persistent storage coordination

#### Content Scripts (`src/content/`)
- **roll20.js**: Main Roll20 integration and Bluetooth handling
- **modifierBox.js**: Floating UI component with singleton pattern
- **theme-detector.js**: Roll20 theme detection and monitoring

#### Popup Interface (`src/popup/`)
- Extension control interface
- Script injection coordination
- User interaction handling

## Development Workflow

### Making Changes

1. **Edit Files**: Modify source files as needed
2. **Reload Extension**: Click reload button in chrome://extensions/
3. **Test Changes**: Use tests/test.html for UI testing
4. **Debug**: Use Chrome DevTools for troubleshooting

### Testing Environment

#### Test Page (`tests/test.html`)
```html
<!-- Simulates Roll20 environment for development -->
<script src="../src/content/theme-detector.js"></script>
<script src="../src/content/modifierBox.js"></script>
<script src="../src/content/roll20.js"></script>
```

#### Testing Bluetooth
- Use tests/bluetooth-test.html for Bluetooth-specific testing
- Mock Roll20 environment for UI development
- Test theme changes and responsiveness

### Debugging Techniques

#### Chrome DevTools
```javascript
// Console debugging
console.log('Debug message:', variable);
console.error('Error occurred:', error);

// Inspect extension state
chrome.storage.local.get(null, console.log);
```

#### Extension Debugging
1. **Background Page**: chrome://extensions/ → "Inspect views: background page"
2. **Content Scripts**: F12 on Roll20 page, check Sources tab
3. **Popup**: Right-click extension icon → "Inspect popup"

## Code Style Guidelines

### JavaScript Standards

```javascript
// Use strict mode
'use strict';

// Consistent naming conventions
const CONSTANTS = 'UPPER_CASE';
let variableName = 'camelCase';
function functionName() {}
class ClassName {}

// Error handling
try {
    // risky operation
} catch (error) {
    console.error('Operation failed:', error);
}
```

### CSS Guidelines

```css
/* Use specific selectors to avoid conflicts */
#pixels-modifier-box .modifier-row {
    /* styles */
}

/* Include !important only when necessary for Roll20 compatibility */
.pixels-extension-element {
    color: #ffffff !important;
}
```

### HTML Structure

```html
<!-- Use semantic HTML -->
<div class="modifier-row" role="group" aria-label="Dice modifier">
    <input type="radio" id="mod-1" name="modifier-select">
    <label for="mod-1">Modifier name</label>
</div>
```

## API Documentation

### ModifierBox Module

#### Public Methods

```javascript
// Create and show modifier box
window.ModifierBox.create();
window.ModifierBox.show();

// Hide modifier box
window.ModifierBox.hide();

// Check status
window.ModifierBox.isVisible();
window.ModifierBox.isInitialized();

// Update theme
window.ModifierBox.updateTheme();
```

#### Events and Callbacks

```javascript
// Modifier selection changed
window.addEventListener('modifierChanged', (event) => {
    console.log('New modifier:', event.detail);
});
```

### Theme Detector Module

```javascript
// Get current theme information
const themeColors = window.ThemeDetector.getThemeColors();

// Monitor theme changes
window.ThemeDetector.onThemeChange((newTheme) => {
    console.log('Theme changed to:', newTheme);
});
```

### Bluetooth Integration

```javascript
// Connection management
async function connectToPixel() {
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

## Extension Components

### Manifest Configuration

```json
{
    "manifest_version": 2,
    "permissions": [
        "activeTab",
        "storage", 
        "declarativeContent"
    ],
    "content_security_policy": "script-src 'self'; object-src 'self'"
}
```

### Message Passing

```javascript
// Popup to Content Script
chrome.tabs.sendMessage(tabId, {
    action: 'connect',
    data: { deviceId: 'pixels-001' }
});

// Content Script to Extension
chrome.runtime.sendMessage({
    action: 'rollResult',
    value: 20,
    modifier: 3
});
```

### Storage Management

```javascript
// Save data
chrome.storage.sync.set({
    'modifier': currentModifier,
    'settings': userSettings
});

// Load data
chrome.storage.sync.get(['modifier'], (result) => {
    console.log('Saved modifier:', result.modifier);
});
```

## Contributing Guidelines

### Development Process

1. **Fork Repository**: Create personal fork for development
2. **Create Branch**: Use descriptive branch names
3. **Make Changes**: Follow coding standards and test thoroughly
4. **Submit PR**: Include detailed description of changes

### Branch Naming

```bash
# Feature development
git checkout -b feature/modifier-persistence

# Bug fixes  
git checkout -b fix/bluetooth-connection-issue

# Documentation
git checkout -b docs/api-documentation
```

### Commit Messages

```bash
# Good commit messages
git commit -m "Add modifier persistence with localStorage"
git commit -m "Fix theme detection for custom Roll20 themes"
git commit -m "Update user guide with troubleshooting section"

# Poor commit messages (avoid these)
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
```

### Testing Requirements

#### Before Submitting PR

1. **Functionality Testing**: All features work as expected
2. **Cross-Browser Testing**: Test in different Chrome versions
3. **Theme Testing**: Verify light/dark theme compatibility
4. **Bluetooth Testing**: Test with actual Pixels dice
5. **Documentation**: Update relevant documentation

#### Test Cases

```javascript
// Example test structure
function testModifierBoxCreation() {
    const box = window.ModifierBox.create();
    console.assert(box !== null, 'Modifier box should be created');
    console.assert(window.ModifierBox.isInitialized(), 'Should be initialized');
}
```

### Code Review Checklist

**Before Review:**
- [ ] Code follows project style guidelines
- [ ] All new features are documented
- [ ] Tests pass on test page
- [ ] No console errors in browser
- [ ] Extension loads without errors

**Review Focuses:**
- Security implications of changes
- Performance impact on Roll20
- Compatibility with existing features
- Code maintainability and readability

## Advanced Development

### Custom Modifications

#### Adding New Themes

```javascript
// Extend theme detector
window.ThemeDetector.addCustomTheme('myTheme', {
    background: '#custom-bg',
    text: '#custom-text',
    // ... other colors
});
```

#### Custom Modifier Types

```javascript
// Extend modifier box functionality
window.ModifierBox.addModifierType('advantage', {
    display: 'Advantage/Disadvantage',
    handler: (roll) => {
        // custom logic for advantage rolls
    }
});
```

### Performance Optimization

#### Memory Management

```javascript
// Proper cleanup
function cleanup() {
    // Remove event listeners
    element.removeEventListener('click', handler);
    
    // Clear intervals/timeouts
    clearInterval(intervalId);
    
    // Nullify references
    largeObject = null;
}
```

#### Efficient DOM Manipulation

```javascript
// Batch DOM operations
const fragment = document.createDocumentFragment();
for (let item of items) {
    const element = createItemElement(item);
    fragment.appendChild(element);
}
container.appendChild(fragment);
```

### Security Considerations

#### Content Script Isolation

```javascript
// Avoid polluting global namespace
(function() {
    'use strict';
    
    // Extension code here
    // Use window.extensionAPI for necessary global access
})();
```

#### Data Validation

```javascript
// Validate all user inputs
function validateModifierValue(value) {
    const num = parseInt(value);
    return !isNaN(num) && num >= -99 && num <= 99;
}
```

## Release Process

### Version Management

```json
// Update manifest.json version
{
    "version": "1.2.3",
    "version_name": "1.2.3 Beta"
}
```

### Release Checklist

1. **Code Freeze**: No new features during release preparation
2. **Testing**: Comprehensive testing across all supported scenarios
3. **Documentation**: Update all documentation for new features
4. **Version Bump**: Update version numbers consistently
5. **Tag Release**: Create git tag for version
6. **Distribution**: Package extension for distribution

### Packaging for Distribution

```bash
# Create distribution package
zip -r pixels-roll20-extension-v1.2.3.zip \
    src/ \
    assets/ \
    manifest.json \
    README.md \
    LICENSE
```

---

**Happy coding!** Remember to test thoroughly and maintain backward compatibility when possible. 🚀
