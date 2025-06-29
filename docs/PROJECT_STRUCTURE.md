# Project Structure

This document outlines the organization of the Pixels Roll20 Chrome Extension project.

## Directory Structure

```
PixelsRoll20ChromeExtension/
├── src/                          # Source code
│   ├── background/               # Background script
│   │   └── background.js         # Extension background script
│   ├── content/                  # Content scripts (injected into Roll20)
│   │   ├── common/               # Shared utilities (camelCase naming)
│   │   │   ├── themeDetector.js  # Roll20 theme detection module
│   │   │   ├── cssLoader.js      # CSS loading utility
│   │   │   └── htmlLoader.js     # HTML template loading utility
│   │   ├── modifierBox/          # Modifier box component (camelCase naming)
│   │   │   ├── index.js          # Main component entry point
│   │   │   ├── modifierBox.js    # Core modifier box functionality
│   │   │   ├── modifierBox.html  # HTML template
│   │   │   ├── themeManager.js   # Theme styling and updates
│   │   │   ├── dragHandler.js    # Drag functionality
│   │   │   ├── rowManager.js     # Row management (add/remove modifiers)
│   │   │   └── styles/           # CSS stylesheets
│   │   │       ├── modifierBox.css    # Base styles
│   │   │       ├── minimized.css      # Minimized state styles
│   │   │       └── lightTheme.css     # Light theme overrides
│   │   └── roll20.js             # Main Roll20 integration and Bluetooth handling
│   ├── popup/                    # Extension popup
│   │   ├── popup.html           # Popup UI
│   │   ├── popup.css            # Popup styles
│   │   └── popup.js             # Popup logic and script injection
│   └── options/                  # Extension options page
│       ├── options.html         # Options UI
│       ├── options.css          # Options styles
│       └── options.js           # Options logic
├── assets/                       # Static assets
│   ├── images/                   # Images and icons
│   │   └── logo-128.png         # Extension icon
│   ├── screenshots/              # Project screenshots
│   └── New Screenshots/          # Updated screenshots
├── tests/                        # Test infrastructure
│   └── jest/                     # Jest unit tests
│       ├── setup.js              # Test environment setup
│       ├── ModifierBox/          # ModifierBox component tests
│       │   ├── index.test.js     # Main component tests
│       │   ├── themeManager.test.js # Theme management tests
│       │   ├── dragHandler.test.js  # Drag functionality tests
│       │   └── rowManager.test.js   # Row management tests
│       ├── roll20-basic.test.js  # Basic Roll20 integration tests
│       ├── roll20-simple.test.js # Simple Roll20 functionality tests
│       ├── experimental/         # Experimental test suites
│       └── README.md            # Testing documentation
├── docs/                         # Documentation
│   ├── DEVELOPER_GUIDE.md       # Developer setup and guidelines
│   ├── INSTALLATION.md          # Installation instructions
│   ├── USER_GUIDE.md            # Comprehensive user documentation
│   ├── TROUBLESHOOTING.md       # Common issues and solutions
│   ├── QUICK_REFERENCE.md       # Quick command reference
│   ├── PROJECT_STRUCTURE.md     # This file
│   └── PRIVACY_POLICY.md        # Privacy policy
├── Copilot-Feedback/            # GitHub Copilot documentation (gitignored)
├── .github/                     # GitHub configuration
│   └── copilot-instructions.md  # GitHub Copilot configuration
├── .copilot/                    # Copilot configuration
│   └── instructions.md          # Development instructions for Copilot
├── .husky/                      # Git hooks
│   └── pre-commit              # Pre-commit hook script
├── coverage/                    # Test coverage reports (gitignored)
├── node_modules/               # Dependencies (gitignored)
├── manifest.json               # Chrome extension manifest
├── package.json                # NPM configuration and scripts
├── package-lock.json           # NPM dependency lock file
├── .prettierrc                 # Prettier configuration
├── .prettierignore            # Prettier exclusion rules
├── .gitignore                 # Git exclusion rules
├── README.md                  # Project documentation
├── LICENSE                    # License file
├── test.html                  # Manual testing page
└── test-resize.html           # UI resize testing page
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

##### Common Utilities (`src/content/common/`)

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

##### ModifierBox Component (`src/content/modifierBox/`)

- **index.js**: Main component entry point and coordination
  - Component initialization and lifecycle management
  - Integration with Roll20 page and other components
- **modifierBox.js**: Core modifier box functionality (singleton pattern)
  - Main modifier box business logic
  - Component coordination and state management
  - HTML template loading and fallback handling
- **modifierBox.html**: HTML template
  - Clean separation of HTML structure
  - Logo URL placeholder for dynamic replacement
- **themeManager.js**: Theme styling and updates
  - Dynamic CSS injection and theme adaptation
  - External CSS file loading and management
  - Roll20 theme detection integration
- **dragHandler.js**: Drag functionality
  - Mouse-based drag and drop behavior
  - Position updating during drag operations
  - Event handling and state management
- **rowManager.js**: Row management
  - Add/remove modifier rows
  - Radio button and input event handling
  - Global variable synchronization
- **styles/**: CSS stylesheets directory
  - **modifierBox.css**: Base modifier box styles
  - **minimized.css**: Styles for minimized state with text truncation
  - **lightTheme.css**: Light theme color overrides

##### Roll20 Integration (`src/content/roll20.js`)

- **roll20.js**: Main Roll20 integration and Bluetooth handling
  - Bluetooth connection management with Pixels dice
  - Dice roll handling and macro integration
  - Message passing with extension popup
  - Chat message posting to Roll20
  - ModifierBox component integration

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

- **images/**: Extension icons and images (logo-128.png)
- **screenshots/**: Development and user screenshots
- **New Screenshots/**: Updated promotional screenshots

### Tests (`tests/`)

- **jest/**: Jest unit test infrastructure
  - **setup.js**: Jest test environment setup and mocks
  - **ModifierBox/**: Component-specific test suites (camelCase directory)
    - **index.test.js**: Main modifier box component tests
    - **themeManager.test.js**: Theme management tests
    - **dragHandler.test.js**: Drag functionality tests
    - **rowManager.test.js**: Row management tests
  - **roll20-basic.test.js**: Basic Roll20 integration tests
  - **roll20-simple.test.js**: Simple Roll20 functionality tests
  - **experimental/**: Experimental test suites (in development)
  - **README.md**: Testing documentation and guidelines

### Development Configuration

- **.copilot/**: GitHub Copilot configuration
  - **instructions.md**: Development instructions for AI assistance
- **.github/**: GitHub-specific configuration
  - **copilot-instructions.md**: GitHub Copilot configuration
- **.husky/**: Git hooks configuration
  - **pre-commit**: Pre-commit hook for code quality
- **Copilot-Feedback/**: AI-generated documentation (gitignored)
- **.prettierrc**: Prettier code formatting configuration
- **.prettierignore**: Prettier exclusion rules
- **.gitignore**: Git exclusion rules
- **package.json**: NPM configuration, scripts, and dependencies
- **package-lock.json**: NPM dependency lock file

## Development Workflow

1. **Content Scripts**: Modify files in `src/content/` for Roll20 integration features
   - **Common utilities**: Update shared functionality in `src/content/common/`
   - **ModifierBox**: Update component files in `src/content/modifierBox/`
   - **Roll20 integration**: Update main integration in `src/content/roll20.js`
2. **UI Changes**: Update popup files in `src/popup/` for extension interface
3. **Testing**: Use comprehensive Jest test suite
   - **Unit Testing**: Run `npm test` for automated Jest tests (141 tests)
   - **Coverage**: Run `npm run test:coverage` for test coverage reports
   - **Watch Mode**: Run `npm run test:watch` for development
   - **Manual Testing**: Use `test.html` and `test-resize.html` for browser testing
4. **Code Quality**: Pre-commit hooks ensure quality
   - **Automatic formatting**: Prettier runs on all staged files
   - **Test validation**: All tests must pass before commit
5. **Assets**: Add images/icons to `assets/images/`

## Build Process

The extension loads files directly from their organized locations with camelCase naming conventions. No build step is required - the manifest.json references the correct paths in the standardized structure.

### Code Quality Tools

- **Prettier**: Automatic code formatting (`.prettierrc` configuration)
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run formatting and tests on staged files only
- **Jest**: Comprehensive unit testing with 141 stable tests

## Testing Infrastructure

The project includes robust Jest test coverage with pre-commit validation:

### Working Test Suites (141 tests passing)

- **ModifierBox Components**: 96 tests covering UI, themes, drag & drop, row management
- **Roll20 Integration**: 45 tests covering messaging, Bluetooth, error handling

### Test Files Status

```
✅ tests/jest/ModifierBox/index.test.js          - 31 tests passing
✅ tests/jest/ModifierBox/dragHandler.test.js    - 26 tests passing
✅ tests/jest/ModifierBox/themeManager.test.js   - 24 tests passing
✅ tests/jest/ModifierBox/rowManager.test.js     - 15 tests passing
✅ tests/jest/roll20-basic.test.js               - 21 tests passing
✅ tests/jest/roll20-simple.test.js              - 24 tests passing

🧪 tests/jest/experimental/                      - Development test suites
   ├── BluetoothConnection.test.js              - Bluetooth API mocking challenges
   ├── ExtensionMessaging.test.js               - Chrome API mocking complexity
   ├── ChatIntegration.test.js                  - DOM integration scenarios
   ├── Pixel.test.js                            - Advanced Pixels dice scenarios
   └── roll20-*.test.js                         - Complex Roll20 integration tests
```

### Test Commands

```bash
# Run all stable tests (recommended)
npm test

# Run tests in watch mode for development
npm run test:watch

# Generate coverage reports
npm run test:coverage

# Run specific test suites
npm test -- tests/jest/ModifierBox/
npm test -- tests/jest/roll20-basic.test.js
```

### Pre-Commit Testing

- **Automatic execution**: All tests run before each commit
- **Quality gate**: Commits blocked if any tests fail
- **Fast feedback**: Tests complete in ~0.6 seconds

## Project Standards and Conventions

### Naming Conventions

The project follows consistent **camelCase** naming for files and directories:

- ✅ `src/content/modifierBox/` (not `ModifierBox/`)
- ✅ `src/content/common/` (not `Common/`)
- ✅ `tests/jest/ModifierBox/` (test directories may use PascalCase for clarity)

### Code Quality Standards

- **Prettier**: Automatic code formatting enforced via pre-commit hooks
- **Jest**: Comprehensive unit testing with 141 stable tests
- **ESLint**: Code quality and consistency (integrated with Jest)
- **Git Hooks**: Pre-commit validation prevents broken commits

### Documentation Standards

- **GitHub Copilot Integration**: All summary documents in `Copilot-Feedback/`
- **Comprehensive Docs**: Developer guides, troubleshooting, and API references
- **Inline Documentation**: JSDoc comments for complex functions
- **README Files**: Component-specific documentation where appropriate

### Development Environment

- **Node.js**: Package management and testing infrastructure
- **Chrome Extension APIs**: Manifest V3 compliance
- **Modern JavaScript**: ES6+ features with browser compatibility
- **Modular Architecture**: Clear separation of concerns and responsibilities

## Quick Reference

### Common Development Commands

```bash
# Setup and dependencies
npm install                    # Install dependencies and setup git hooks

# Testing
npm test                      # Run all stable tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage reports

# Code quality
npm run format              # Format all files with Prettier
npm run format:check        # Check formatting without writing

# Manual testing
# Open test.html in browser for UI component testing
# Open test-resize.html for responsive behavior testing
```

### Key Configuration Files

- **manifest.json**: Chrome extension configuration
- **package.json**: NPM scripts and dependencies
- **.prettierrc**: Code formatting rules
- **.husky/pre-commit**: Git hook for quality checks
- **tests/jest/setup.js**: Test environment configuration

### Project Health

- ✅ **141 tests passing** with comprehensive coverage
- ✅ **Pre-commit hooks** enforcing code quality
- ✅ **Consistent naming** following camelCase conventions
- ✅ **Modern tooling** with Prettier, Husky, and Jest
- ✅ **Documentation** up-to-date and comprehensive
