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

## How To Install

1. Download the content of this repository (*).
2. Open Chrome extension manager (`chrome://extensions/`).
3. Enable "Developer mode" (toggle in top right).
4. If you downloaded this repository as a zip file, unzip it.
5. Click "Load Unpacked" and browse to the folder where you downloaded the extension.

## How To Use

### Basic Usage

1. Open a game on Roll20's [website](https://roll20.net/).
2. Click on the extension icon (puzzle piece) in Chrome's toolbar.
3. Select the "Pixels on Roll20" extension.
4. Click "Connect to Pixel" to pair with your dice.
5. Your Pixels dice rolls will now appear in the Roll20 chat!

### Using the Modifier System

1. In the extension popup, click "Show Modifier Box" to display the floating modifier interface.
2. **Add Modifiers**: Click the "+" button to add new modifier rows.
3. **Set Values**: Enter names and modifier values (e.g., "Bless: +1d4", "Guidance: +1d4").
4. **Select Active Modifier**: Use radio buttons to choose which modifier applies to rolls.
5. **Remove Modifiers**: Click the "−" button to remove unwanted rows.
6. **Hide When Done**: Click "Hide Modifier Box" in the popup to hide the interface.

### Advanced Features

- **Drag to Reposition**: Click and drag the modifier box to move it around the screen.
- **Automatic Integration**: Selected modifiers are automatically added to your roll results.
- **Multiple Dice**: Connect multiple Pixels dice simultaneously.
- **Auto-Reconnection**: Disconnected dice will automatically attempt to reconnect.

## File Structure

```text
├── manifest.json           # Extension manifest
├── popup.html              # Extension popup interface  
├── popup.js                # Popup logic and script injection
├── roll20.js               # Main extension logic, Bluetooth, and Roll20 integration
├── modifierBox.js          # Modifier box UI module (singleton)
├── background.js           # Extension background script
├── options.html/js         # Extension options (unused)
├── test.html               # Test page for development
└── images/                 # Extension icons
```

## Technical Details

### Bluetooth Support

- **Modern Pixels Dice**: Service UUID `a6b90001-7a5a-43f2-a962-350c8edc9b5b`
- **Legacy Pixels Dice**: Service UUID `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- **Auto-Detection**: Automatically detects and uses appropriate UUIDs for your dice

### Roll20 Integration

- Uses Roll20's macro system with proper template formatting
- Supports complex roll expressions with modifiers
- Preserves original roll values while adding modifier information

## Troubleshooting

### Common Issues

- **Device picker doesn't appear**: Ensure you're on an HTTPS page and Bluetooth is enabled
- **Connection fails**: Try refreshing the page and reconnecting
- **Modifier box not showing**: Check that you clicked "Show Modifier Box" in the popup
- **Dice not found**: Ensure your Pixels dice are powered on and in range

### Debug Information

If you're having problems, check the DevTools Console:

1. Press F12 in Chrome
2. Select the "Console" tab
3. Look for error messages or connection logs

## Development

### Testing

Open `test.html` in your browser to test modifier box functionality and Bluetooth connections without needing Roll20.

### Contributing

This is a community fork. Feel free to submit issues or pull requests for improvements.

## Support & Issues

For issues with this enhanced version, please open a [GitHub issue](https://github.com/your-repo/issues).

For general Pixels dice support, visit the [official Pixels support](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension/issues).

## License

This project maintains the same MIT License as the original. See [LICENSE](LICENSE) for details.

**Note**: Connections are lost upon reloading the page, but the extension will attempt to automatically reconnect to previously paired dice.
