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

## Quick Setup

1. Download and extract this repository
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the folder
5. Go to Roll20, click the extension icon
6. Click "Connect" and select your dice

## Usage

- **Connect dice**: Click extension icon → "Connect"
- **Show modifier box**: Click "Show Modifier Box"
- **Add modifiers**: Click "Add" in the modifier box
- **Roll dice**: Physical rolls automatically appear in chat

## Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Setup instructions
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Essential actions
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common problems
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical docs

## Project Structure

```
src/
├── content/         # Roll20 integration scripts
├── popup/          # Extension popup
├── background/     # Background scripts
└── options/        # Settings page
```

## Technical Notes

- **Modern Pixels**: UUID `a6b90001-7a5a-43f2-a962-350c8edc9b5b`
- **Legacy Pixels**: UUID `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- Uses Roll20's macro system for dice results
- Chrome extension with Bluetooth Web API

## Troubleshooting

- **Not working?** → Refresh Roll20 page, reconnect dice
- **No devices?** → Roll dice to wake them, check Bluetooth
- **No results?** → Check connection status in popup

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more help.

## About Pixels

Pixels are smart dice with LEDs and sensors. Learn more at [gamewithpixels.com](https://gamewithpixels.com/).

## License

This project is licensed under the MIT License. Based on the original [Pixels Roll20 Chrome Extension](https://github.com/GameWithPixels/PixelsRoll20ChromeExtension) by Olivier Basille and the GameWithPixels team.
