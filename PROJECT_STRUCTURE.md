# Project Structure

This document outlines the organization of the Pixels Roll20 Chrome Extension project.

## Directory Structure

```
PixelsRoll20ChromeExtension/
├── src/                          # Source code
│   ├── background/               # Background script
│   │   └── background.js         # Extension background script
│   ├── content/                  # Content scripts (injected into Roll20)
│   │   ├── roll20.js            # Main Roll20 integration script
│   │   ├── modifierBox.js       # Floating modifier box module
│   │   └── theme-detector.js    # Roll20 theme detection module
│   ├── popup/                    # Extension popup
│   │   ├── popup.html           # Popup UI
│   │   └── popup.js             # Popup logic and script injection
│   └── options/                  # Extension options page
│       ├── options.html         # Options UI
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
- **roll20.js**: Main integration script injected into Roll20 pages
  - Bluetooth connection management
  - Dice roll handling and macro integration
  - Message passing with extension popup
- **modifierBox.js**: Floating modifier box UI module
  - Singleton pattern implementation
  - Dynamic theme adaptation
  - Modifier management and persistence
- **theme-detector.js**: Roll20 theme detection and monitoring
  - Automatic theme detection (light/dark)
  - Real-time theme change monitoring
  - Color extraction for UI adaptation

#### Popup (`src/popup/`)
- **popup.html**: Extension popup interface
- **popup.js**: Popup logic and content script injection

#### Options (`src/options/`)
- **options.html**: Extension options page
- **options.js**: Options configuration logic

### Assets (`assets/`)
- **images/**: Extension icons and images

### Tests (`tests/`)
- **test.html**: Development test page for UI components
- **bluetooth-test.html**: Bluetooth functionality testing

## Development Workflow

1. **Content Scripts**: Modify files in `src/content/` for Roll20 integration features
2. **UI Changes**: Update popup files in `src/popup/` for extension interface
3. **Testing**: Use files in `tests/` for development and debugging
4. **Assets**: Add images/icons to `assets/images/`

## Build Process

The extension loads files directly from their organized locations. No build step is required - the manifest.json references the correct paths in the new structure.
