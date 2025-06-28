# Project Structure

This document outlines the organization of the Pixels Roll20 Chrome Extension project.

## Directory Structure

```
PixelsRoll20ChromeExtension/
├── src/                          # Source code
│   ├── background/               # Background script
│   │   └── background.js         # Extension background script
│   ├── content/                  # Content scripts (injected into Roll20)
│   │   ├── Common/               # Shared utilities
│   │   │   ├── themeDetector.js  # Roll20 theme detection module
│   │   │   ├── cssLoader.js      # CSS loading utility
│   │   │   └── htmlLoader.js     # HTML template loading utility
│   │   ├── ModifierBox/          # Modifier box component
│   │   │   ├── modifierBox.js    # Main modifier box module
│   │   │   ├── modifierBox.html  # HTML template
│   │   │   ├── themeManager.js   # Theme styling and updates
│   │   │   ├── dragHandler.js    # Drag functionality
│   │   │   ├── positionManager.js # Positioning logic
│   │   │   ├── rowManager.js     # Row management (add/remove modifiers)
│   │   │   └── styles/           # CSS stylesheets
│   │   │       ├── modifierBox.css    # Base styles
│   │   │       ├── minimized.css      # Minimized state styles
│   │   │       └── lightTheme.css     # Light theme overrides
│   │   └── Roll20Integration/    # Roll20 platform integration
│   │       └── index.js          # Main Roll20 integration and Bluetooth handling
│   ├── popup/                    # Extension popup
│   │   ├── popup.html           # Popup UI
│   │   ├── popup.css            # Popup styles
│   │   └── popup.js             # Popup logic and script injection
│   └── options/                  # Extension options page
│       ├── options.html         # Options UI
│       ├── options.css          # Options styles
│       └── options.js           # Options logic
├── assets/                       # Static assets
│   └── images/                   # Images and icons
│       └── logo-64.png          # Extension icon
├── tests/                        # Test files
│   ├── test.html                # Main test page for development
│   └── bluetooth-test.html      # Bluetooth functionality tests
├── docs/                         # Documentation
├── manifest.json                 # Chrome extension manifest
├── README.md                     # Project documentation
├── LICENSE                       # License file
└── PROJECT_STRUCTURE.md         # This file
```

## File Descriptions

### Core Extension Files

- **manifest.json**: Chrome extension configuration and permissions
- **README.md**: Project documentation and setup instructions
- **LICENSE**: Project license information

### Source Code (`src/`)

#### Background Scripts (`src/background/`)
- **background.js**: Extension background script handling extension lifecycle

#### Content Scripts (`src/content/`)

The content scripts are organized by component for better maintainability:

##### Common Utilities (`src/content/Common/`)
- **themeDetector.js**: Roll20 theme detection and monitoring
  - Automatic theme detection (light/dark)
  - Real-time theme change monitoring
  - Color extraction for UI adaptation
- **cssLoader.js**: CSS loading utility
  - Dynamic CSS file loading for Chrome extensions
  - Fallback handling for test environments
- **htmlLoader.js**: HTML template loading utility
  - External HTML template loading
  - Template caching and placeholder replacement

##### ModifierBox Component (`src/content/ModifierBox/`)
- **modifierBox.js**: Main modifier box module (singleton pattern)
  - Core modifier box functionality
  - Component coordination and initialization
  - HTML template loading and fallback handling
- **modifierBox.html**: HTML template
  - Clean separation of HTML structure
  - Logo URL placeholder for dynamic replacement
- **themeManager.js**: Theme styling and updates
  - Dynamic CSS injection and theme adaptation
  - External CSS file loading and management
- **dragHandler.js**: Drag functionality
  - Mouse-based drag and drop behavior
  - Position updating during drag operations
- **positionManager.js**: Positioning logic
  - Intelligent positioning relative to Roll20 UI
  - Window resize handling
- **rowManager.js**: Row management
  - Add/remove modifier rows
  - Radio button and input event handling
  - Global variable synchronization
- **styles/**: CSS stylesheets directory
  - **modifierBox.css**: Base modifier box styles
  - **minimized.css**: Styles for minimized state with text truncation
  - **lightTheme.css**: Light theme color overrides

##### Roll20Integration Component (`src/content/Roll20Integration/`)
- **index.js**: Main Roll20 integration and Bluetooth handling
  - Bluetooth connection management with Pixels dice
  - Dice roll handling and macro integration
  - Message passing with extension popup
  - Chat message posting to Roll20

#### Popup (`src/popup/`)
- **popup.html**: Extension popup interface (clean HTML structure)
- **popup.css**: Popup styles (separated from HTML)
- **popup.js**: Popup logic and content script injection

#### Options (`src/options/`)
- **options.html**: Extension options page (clean HTML structure)
- **options.css**: Options styles (separated from HTML)
- **options.js**: Options configuration logic

### Assets (`assets/`)
- **images/**: Extension icons and images

### Tests (`tests/`)
- **test.html**: Development test page for UI components
- **bluetooth-test.html**: Bluetooth functionality testing
- **modifier-box-test.html**: Browser-based modifier box testing
- **jest/**: Jest unit tests directory
  - **setup.js**: Jest test environment setup and mocks
  - **ModifierBox/**: Component-specific test suites
    - **index.test.js**: Main modifier box module tests
    - **themeManager.test.js**: Theme management tests
    - **dragHandler.test.js**: Drag functionality tests
    - **positionManager.test.js**: Positioning logic tests
    - **rowManager.test.js**: Row management tests

## Development Workflow

1. **Content Scripts**: Modify files in `src/content/` for Roll20 integration features
2. **UI Changes**: Update popup files in `src/popup/` for extension interface
3. **Testing**: Use files in `tests/` for development and debugging
   - **Browser Testing**: Open `tests/test.html` for manual UI testing
   - **Unit Testing**: Run `npm test` for automated Jest tests
   - **Coverage**: Run `npm run test:coverage` for test coverage reports
4. **Assets**: Add images/icons to `assets/images/`

## Build Process

The extension loads files directly from their organized locations. No build step is required - the manifest.json references the correct paths in the new structure.

## Testing Infrastructure

The project includes robust Jest test coverage:

### Working Test Suites (141 tests passing)
- **ModifierBox**: 96 tests covering UI, themes, drag & drop, row management
- **Roll20 Integration**: 45 tests covering messaging, Bluetooth, error handling

### Test Files Status
```
✅ tests/jest/ModifierBox/index.test.js          - 31 tests passing
✅ tests/jest/ModifierBox/dragHandler.test.js    - 26 tests passing  
✅ tests/jest/ModifierBox/themeManager.test.js   - 24 tests passing
✅ tests/jest/ModifierBox/rowManager.test.js     - 15 tests passing
✅ tests/jest/roll20-basic.test.js               - 21 tests passing
✅ tests/jest/roll20-simple.test.js              - 24 tests passing

⚠️  tests/jest/roll20.test.js                   - Complex mocking issues
⚠️  tests/jest/BluetoothConnection.test.js      - Bluetooth API mocking
⚠️  tests/jest/ExtensionMessaging.test.js       - Chrome API mocking
⚠️  tests/jest/ChatIntegration.test.js          - DOM integration
⚠️  tests/jest/Pixel.test.js                    - Advanced scenarios
⚠️  tests/jest/roll20-*.test.js (others)        - Experimental tests
```

### Test Commands
```bash
# Run stable tests only
npm test -- tests/jest/roll20-basic.test.js tests/jest/roll20-simple.test.js tests/jest/ModifierBox/

# Run all tests (includes failing ones)
npm test
```

## Legacy Testing Section

The project also includes both manual and automated testing:

- **Manual Testing**: Browser-based test files for UI and integration testing
- **Unit Testing**: Jest test suites with comprehensive coverage of ModifierBox components
- **Mock Setup**: Chrome extension APIs and browser dependencies are mocked for testing
- **Test Commands**:
  - `npm test`: Run all tests
  - `npm run test:watch`: Run tests in watch mode
  - `npm run test:coverage`: Generate coverage reports
