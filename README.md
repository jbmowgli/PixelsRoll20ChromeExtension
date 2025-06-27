# Pixels on Roll20 - Enhanced Edition

**Enhanced fork** of the original Pixels Roll20 Chrome extension with advanced modifier support, robust connection management, and improved user experience.

| :exclamation: :exclamation: :exclamation: This an experimental project, not an official product. :exclamation: :exclamation: :exclamation: |
|--------------------------------------------------------------------------------------------------------------------------------------------|

## About This Fork

This is an enhanced version of the original [Pixels Roll20 Chrome Extension](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension) created by the Pixels team. The original extension was developed by **Olivier Basille** and the **GameWithPixels** team as a proof of concept for connecting Pixels dice to Roll20.

### Original Authors & Attribution

- **Original Project**: [GameWithPixels/PixelsRoll20ChromeExtension](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension)
- **Created by**: Olivier Basille ([@obasille](https://github.com/obasille)) and the GameWithPixels team
- **Original License**: MIT License
- **Copyright**: © 2023 Pixels - Electronic Dice

### Enhancements in This Fork

This enhanced version adds significant new functionality while maintaining compatibility with the original design:

## ✨ New Features

### 🎯 Advanced Modifier System

- **Floating Modifier Box**: A draggable overlay that appears on Roll20 pages
- **Multi-row Support**: Add multiple modifier rows with custom names and values
- **Dynamic Selection**: Radio buttons to select which modifier to apply to rolls
- **Smart Integration**: Modifiers are automatically integrated into Roll20 macro format
- **Persistent UI**: Modifier box remembers position and state across page interactions

### 🔄 Robust Connection Management

- **Auto-Reconnection**: Automatically attempts to reconnect disconnected dice
- **Connection Health Monitoring**: Periodic health checks with stale connection cleanup
- **Enhanced Error Handling**: Better error messages and graceful failure recovery  
- **Dual UUID Support**: Compatible with both modern and legacy Pixels dice
- **Connection Status**: Real-time status reporting for connected/disconnected dice

### 🏗️ Improved Architecture

- **Modular Design**: Extracted modifier box into separate `modifierBox.js` module
- **Singleton Pattern**: Ensures only one modifier box instance exists
- **Clean Separation**: UI logic separated from Bluetooth connection logic
- **Enhanced Popup**: Improved button layout and user interface

### 🐛 Bug Fixes

- Fixed critical syntax error that prevented Bluetooth device picker from appearing
- Corrected Bluetooth UUIDs to use official Pixels dice specifications
- Resolved UI alignment issues in popup interface
- Fixed duplicate script loading and execution order issues

## Foreword

Pixels are full of LEDs, smarts and no larger than regular dice, they can be
customized to light up when and how you desire.
Check the [Pixels website](https://gamewithpixels.com/) for more information.

> **Warning**
> Before jumping into programming please make sure to read the Pixels developer's
> [guide](https://github.com/GameWithPixels/.github/blob/main/doc/DevelopersGuide.md).

## 📚 Documentation

For comprehensive guides and documentation:

- **[Installation Guide](docs/INSTALLATION.md)** - Complete installation instructions
- **[User Guide](docs/USER_GUIDE.md)** - Comprehensive user manual with examples
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Essential actions and shortcuts
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Solutions to common problems
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical documentation for contributors
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Codebase organization and architecture

## Quick Install

1. Download the content of this repository
2. Open Chrome extension manager (`chrome://extensions/`)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load Unpacked" and browse to the extension folder

**For detailed installation instructions, see [docs/INSTALLATION.md](docs/INSTALLATION.md)**

## Quick Start

1. **Install**: Load the extension in Chrome (see [Installation Guide](docs/INSTALLATION.md))
2. **Open Roll20**: Navigate to your game session
3. **Connect**: Click extension icon → "Connect" → Select your Pixels dice
4. **Roll**: Physical dice rolls automatically appear in Roll20 chat

**For complete usage instructions, see [docs/USER_GUIDE.md](docs/USER_GUIDE.md)**

### Modifier System

- **Show Box**: Click "Show Modifier Box" in extension popup
- **Add Modifiers**: Custom names and values (e.g., "Bless: +4")
- **Select Active**: Radio buttons to choose current modifier
- **Auto-Integration**: Selected modifiers automatically added to rolls

**For detailed modifier instructions, see [User Guide](docs/USER_GUIDE.md#using-the-modifier-box)**

## 📁 Project Structure

```text
PixelsRoll20ChromeExtension/
├── src/                    # Source code
│   ├── content/           # Content scripts (Roll20 integration)
│   ├── popup/             # Extension popup interface
│   ├── options/           # Extension options page
│   └── background/        # Background scripts
├── assets/                # Static assets (icons, images)
├── tests/                 # Testing and development tools
├── docs/                  # Comprehensive documentation
└── manifest.json          # Chrome extension manifest
```

**For detailed structure documentation, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)**

## Technical Details

### Bluetooth Support

- **Modern Pixels Dice**: Service UUID `a6b90001-7a5a-43f2-a962-350c8edc9b5b`
- **Legacy Pixels Dice**: Service UUID `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- **Auto-Detection**: Automatically detects and uses appropriate UUIDs for your dice

### Roll20 Integration

- Uses Roll20's macro system with proper template formatting
- Supports complex roll expressions with modifiers
- Preserves original roll values while adding modifier information

## 🔧 Troubleshooting

### Quick Fixes
- **Not Working?** → Refresh Roll20 page, reconnect dice
- **No Bluetooth Devices?** → Wake dice by rolling, check Bluetooth enabled
- **No Chat Results?** → Verify dice connection in popup
- **Box Missing?** → Click "Show Modifier Box" in extension popup

**For comprehensive troubleshooting, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)**

### Debug Information

If problems persist:
1. Press F12 in Chrome → Console tab
2. Look for error messages or connection logs
3. Try the test page at `tests/test.html`

## 🛠️ Development

**For development information, see [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)**

### Testing
- Open `tests/test.html` for UI and Bluetooth testing
- Open `tests/bluetooth-test.html` for connection-specific testing

### Contributing

This is a community fork. Feel free to submit issues or pull requests for improvements.

## Support & Issues

For issues with this enhanced version, please open a [GitHub issue](https://github.com/your-repo/issues).

For general Pixels dice support, visit the [official Pixels support](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension/issues).

## License

This project maintains the same MIT License as the original. See [LICENSE](LICENSE) for details.

**Note**: Connections are lost upon reloading the page, but the extension will attempt to automatically reconnect to previously paired dice.
