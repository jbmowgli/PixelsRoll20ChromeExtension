# Project Structure

## Overview

The Pixels Roll20 Chrome Extension is organized into logical directories for maintainability and clarity. This document describes the project structure and the purpose of each file and directory.

## Directory Structure

```
PixelsRoll20ChromeExtension/
├── manifest.json                 # Chrome extension manifest
├── README.md                     # Project overview and features
├── LICENSE                       # MIT license file
├── src/                         # Source code directory
│   ├── content/                 # Content scripts (injected into Roll20 pages)
│   │   ├── roll20.js           # Main Roll20 integration and Bluetooth handling
│   │   ├── modifierBox.js      # Floating modifier box UI and logic
│   │   └── theme-detector.js   # Theme detection and adaptation
│   ├── popup/                  # Extension popup interface
│   │   ├── popup.html          # Popup UI layout
│   │   └── popup.js            # Popup functionality and script injection
│   ├── options/                # Extension options page
│   │   ├── options.html        # Options page layout
│   │   └── options.js          # Options page functionality
│   └── background/             # Background scripts
│       └── background.js       # Background service worker
├── assets/                     # Static assets
│   └── images/                 # Extension icons and images
│       └── logo-64.png         # Extension icon (64x64px)
├── tests/                      # Test files and development tools
│   ├── test.html              # General testing page
│   └── bluetooth-test.html    # Bluetooth-specific testing
└── docs/                      # Documentation
    ├── USER_GUIDE.md          # Comprehensive user manual
    ├── INSTALLATION.md        # Installation instructions
    ├── QUICK_REFERENCE.md     # Quick reference guide
    ├── TROUBLESHOOTING.md     # Troubleshooting guide
    ├── DEVELOPER_GUIDE.md     # Developer documentation
    └── PROJECT_STRUCTURE.md   # This file
```

## Core Files

### manifest.json
The Chrome extension manifest file that defines:
- Extension metadata (name, version, description)
- Required permissions (Bluetooth, activeTab, scripting)
- Content script injection rules
- Popup and options page configuration
- Background script registration

### src/content/roll20.js
The main content script that handles:
- Bluetooth connection to Pixels dice
- Roll data processing and parsing
- Roll20 macro formatting and injection
- Message passing with popup
- Auto-reconnection and health monitoring
- Integration with modifier box

### src/content/modifierBox.js
Singleton module managing the floating modifier interface:
- Draggable floating box UI
- Modifier row management (add/remove/edit)
- Theme adaptation and styling
- State persistence during session
- Integration with roll processing

### src/content/theme-detector.js
Theme detection and adaptation system:
- Real-time Roll20 theme detection
- Dynamic CSS variable updates
- Theme change monitoring
- Color scheme adaptation

## User Interface Files

### src/popup/
- **popup.html**: Extension popup layout with connection status and controls
- **popup.js**: Popup functionality, script injection, and status management

### src/options/
- **options.html**: Extension options page (currently minimal)
- **options.js**: Options page functionality (future expansion point)

## Testing and Development

### tests/
- **test.html**: General testing page for UI and functionality verification
- **bluetooth-test.html**: Dedicated Bluetooth connection testing interface

## Documentation

### docs/
Complete documentation suite:
- **USER_GUIDE.md**: Comprehensive user manual (333 lines)
- **INSTALLATION.md**: Step-by-step installation guide
- **QUICK_REFERENCE.md**: Quick actions and troubleshooting
- **TROUBLESHOOTING.md**: Detailed problem resolution guide
- **DEVELOPER_GUIDE.md**: Technical documentation for contributors
- **PROJECT_STRUCTURE.md**: This file - project organization guide

## Design Patterns

### Modular Architecture
- **Separation of Concerns**: Each file has a specific responsibility
- **Singleton Pattern**: ModifierBox ensures single instance
- **Event-Driven**: Message passing between components
- **Theme Adaptation**: Dynamic styling based on Roll20 theme

### File Organization
- **src/**: All source code organized by function
- **content/**: Scripts injected into Roll20 pages
- **popup/**: Extension popup interface
- **options/**: Extension options interface
- **background/**: Background service workers
- **assets/**: Static resources (icons, images)
- **tests/**: Development and testing tools
- **docs/**: Complete documentation suite

## Development Workflow

### Adding New Features
1. Determine the appropriate directory based on functionality
2. Follow existing naming conventions
3. Update manifest.json if new files are added
4. Add tests in the tests/ directory
5. Update relevant documentation in docs/
6. Follow the established patterns (singleton, event-driven, etc.)

### Modifying Existing Features
1. Locate the relevant file using this structure guide
2. Understand the module's responsibility and interfaces
3. Maintain backward compatibility where possible
4. Update tests and documentation as needed
5. Test theme adaptation if UI changes are made

## Key Interactions

### Content Script Communication
- **roll20.js** ↔ **modifierBox.js**: Roll processing and modifier application
- **theme-detector.js** ↔ **modifierBox.js**: Theme updates and styling
- **popup.js** ↔ **roll20.js**: Connection management and status updates

### Data Flow
1. User rolls Pixels dice
2. **roll20.js** receives Bluetooth data
3. **modifierBox.js** provides active modifier
4. **roll20.js** formats and injects Roll20 macro
5. Result appears in Roll20 chat

### Theme Adaptation Flow
1. **theme-detector.js** monitors Roll20 theme changes
2. Calculates appropriate colors and styles
3. **modifierBox.js** receives theme updates
4. UI adapts in real-time to match Roll20

## Future Expansion

### Recommended Practices
- Maintain the directory structure
- Follow the singleton pattern for UI components
- Use the existing theme adaptation system
- Add comprehensive tests for new features
- Update all relevant documentation
- Follow the established naming conventions

### Potential Areas for Growth
- **src/utils/**: Shared utility functions
- **src/config/**: Configuration management
- **assets/sounds/**: Audio feedback
- **tests/unit/**: Unit test organization
- **docs/api/**: API documentation

This structure supports maintainability, testability, and future enhancement while keeping the codebase organized and accessible.
