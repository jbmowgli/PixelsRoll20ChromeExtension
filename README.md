# Pixels Roll20 Integration

Connect your Pixels dice to Roll20 via Bluetooth for seamless physical dice rolling.

## Features

- Connect Pixels dice via Bluetooth
- Physical rolls appear instantly in Roll20 chat
- Floating modifier box with custom values
- Drag and resize interface
- Supports both modern and legacy Pixels dice
- Auto theme matching (light/dark)
- Multi-dice support

## Quick Start

For detailed setup instructions, see **[Installation Guide](docs/INSTALLATION.md)**.

**TL;DR**: Load extension in Chrome, go to Roll20, click extension icon, connect dice, roll!

## Usage Overview

- **Connect dice**: Click extension icon → "Connect"
- **Show/hide modifier box**: Use popup buttons (only way to fully close)
- **Add modifiers**: Click "Add" in the modifier box
- **Minimize box**: Click "−" button to temporarily hide
- **Roll dice**: Physical rolls automatically appear in chat

### Chat Display Behavior

- **Modifier box visible**: Shows detailed breakdown (die + modifier = total)
- **Modifier box hidden**: Shows simplified result (just final value)
- **Header adapts**: "Modifier Name" when visible, "Result" when hidden

## Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Complete setup instructions
- **[User Guide](docs/USER_GUIDE.md)** - Comprehensive usage documentation
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Essential actions and troubleshooting
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common problems and solutions
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical documentation

## Technical Notes

- Uses Roll20's macro system for dice results
- Chrome extension with Bluetooth Web API
- Chrome Extension Manifest V3 compliant

## License

MIT License - see LICENSE file for details.

## Quick Troubleshooting

For detailed help, see **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)**.

**Quick fixes:** Refresh Roll20 page → Reconnect dice → Check Bluetooth

## About Pixels

Pixels are smart dice with LEDs and sensors. Learn more at [gamewithpixels.com](https://gamewithpixels.com/).

## License

This project is licensed under the MIT License. Based on the original [Pixels Roll20 Chrome Extension](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension) by the GameWithPixels team.
