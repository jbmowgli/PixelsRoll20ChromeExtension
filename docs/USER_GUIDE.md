# Pixels Roll20 Chrome Extension - User Guide

Welcome to the comprehensive user guide for the Pixels Roll20 Chrome Extension! This extension brings the magic of Pixels dice to your Roll20 gaming sessions.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Connecting Your Pixels Dice](#connecting-your-pixels-dice)
4. [Using the Modifier Box](#using-the-modifier-box)
5. [Theme Adaptation](#theme-adaptation)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Features](#advanced-features)
8. [FAQ](#faq)

## Installation

### Prerequisites
- Google Chrome browser (version 88 or later)
- Pixels dice (modern or legacy versions supported)
- Roll20 account and active game session

### Installing the Extension

1. **Download the Extension**
   - Clone or download the repository from GitHub
   - Ensure all files are in a single folder

2. **Load into Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" and select the extension folder
   - The Pixels Roll20 extension should appear in your extensions list

3. **Verify Installation**
   - Look for the Pixels dice icon in your Chrome toolbar
   - The icon should be visible when visiting Roll20 pages

## Quick Start

### First Time Setup

1. **Open Roll20**
   - Navigate to your Roll20 game session
   - Ensure you're on a game page (URL contains `/game/`)

2. **Access the Extension**
   - Click the Pixels dice icon in your Chrome toolbar
   - The extension popup will appear

3. **Connect Your Dice**
   - Click the "Connect" button in the popup
   - Your browser will show a Bluetooth device picker
   - Select your Pixels dice from the list
   - Wait for the connection to establish

4. **Start Rolling**
   - Roll your Pixels dice physically
   - The result will automatically appear in Roll20 chat
   - Modifiers from the modifier box will be applied automatically

## Connecting Your Pixels Dice

### Supported Devices
- **Modern Pixels Dice**: Latest generation with enhanced connectivity
- **Legacy Pixels Dice**: Older generation with backward compatibility
- Multiple dice can be connected simultaneously

### Connection Process

1. **Prepare Your Dice**
   - Ensure your Pixels dice are charged
   - Place them within Bluetooth range of your computer
   - Wake up the dice by rolling them gently

2. **Initiate Connection**
   - Click the extension icon in Chrome toolbar
   - Click "Connect" button
   - Browser will display Bluetooth device picker

3. **Select Your Dice**
   - Look for devices named "Pixels" or similar
   - Select your dice from the list
   - Click "Pair" or "Connect"

4. **Verify Connection**
   - Extension popup will show connection status
   - Connected dice will display green status indicators
   - Test by rolling your dice - results should appear in Roll20

### Connection Troubleshooting

**Dice Not Appearing in List:**
- Ensure dice are awake (roll them gently)
- Check that Bluetooth is enabled on your computer
- Make sure dice are not connected to another device
- Try refreshing the device picker

**Connection Fails:**
- Reset the dice (refer to Pixels documentation)
- Clear browser cache and reload Roll20
- Restart Chrome and try again
- Check for Chrome browser updates

## Using the Modifier Box

The modifier box is a floating interface that allows you to manage different dice roll modifiers for various situations in your game.

### Opening the Modifier Box

1. **From Extension Popup:**
   - Click the Pixels icon in Chrome toolbar
   - Click "Show Modifier Box" button

2. **Box Appearance:**
   - A floating box appears over your Roll20 interface
   - Box adapts to Roll20's current theme (light/dark)
   - Can be moved by dragging the header

### Managing Modifiers

#### Adding Modifiers
1. Click the "Add" button in the modifier box header
2. A new row appears with default name "Modifier X"
3. Customize the name and value as needed

#### Editing Modifiers
- **Name Field**: Click to edit the modifier name (e.g., "Advantage", "Blessed", "Sharpshooter")
- **Value Field**: Enter positive or negative numbers (-99 to +99)
- **Selection**: Click the radio button to activate a modifier

#### Removing Modifiers
- Click the "×" button next to any modifier row
- If only one modifier remains, it resets to default instead of being removed
- This ensures there's always at least one modifier available

### Modifier Examples

**Common D&D 5e Modifiers:**
- Advantage: +0 (advantage is handled separately)
- Bless: +4 (1d4 average)
- Bardic Inspiration: +3 (1d6 average)
- Sharpshooter: -5
- Great Weapon Master: -5

**Pathfinder Modifiers:**
- Flanking: +2
- High Ground: +1
- Power Attack: -2
- Precise Shot: +1

### Modifier Box Features

#### Theme Adaptation
- Automatically detects Roll20's current theme
- Adapts colors and styling to match
- Updates in real-time when you change Roll20 themes

#### Positioning
- Floats over Roll20 interface
- Draggable by clicking and holding the header
- Remembers position during session
- Automatically repositions if Roll20 interface changes

#### Minimization
- Click the "−" button to minimize the box
- Shows only the header when minimized
- Click "−" again to restore full view

## Theme Adaptation

The extension automatically adapts to Roll20's theme settings for a seamless experience.

### Supported Themes
- **Light Theme**: Clean white/light gray interface
- **Dark Theme**: Dark background with light text
- **Custom Themes**: Adapts to user-customized Roll20 themes

### Automatic Detection
- Theme changes are detected instantly
- Modifier box updates colors immediately
- No user action required

### Color Adaptation
- **Background**: Matches Roll20's primary background
- **Text**: Ensures readability with proper contrast
- **Borders**: Harmonizes with Roll20's interface elements
- **Buttons**: Consistent with Roll20's button styling

## Troubleshooting

### Common Issues

#### Extension Not Working
**Symptoms**: Extension popup doesn't appear or doesn't function
**Solutions**:
1. Refresh the Roll20 page
2. Disable and re-enable the extension
3. Check that you're on a Roll20 game page (not character sheet or other pages)
4. Reload the extension in Chrome extensions settings

#### Dice Not Connecting
**Symptoms**: Bluetooth picker shows no devices or connection fails
**Solutions**:
1. Ensure Bluetooth is enabled on your computer
2. Wake up your Pixels dice by rolling them
3. Check that dice aren't connected to another device
4. Try clearing browser cache and cookies
5. Restart Chrome browser

#### Dice Results Not Appearing
**Symptoms**: Dice connect but rolls don't show in Roll20 chat
**Solutions**:
1. Check that you're in the correct Roll20 game
2. Verify dice connection status in extension popup
3. Test with a simple roll without modifiers
4. Check Roll20 chat permissions and settings

#### Modifier Box Not Showing
**Symptoms**: Clicking "Show Modifier Box" has no effect
**Solutions**:
1. Check if box is minimized or positioned off-screen
2. Refresh the Roll20 page and try again
3. Disable browser extensions that might interfere
4. Check browser console for error messages

#### Theme Not Updating
**Symptoms**: Modifier box doesn't match Roll20 theme
**Solutions**:
1. Close and reopen the modifier box
2. Refresh the Roll20 page
3. Switch Roll20 themes back and forth to trigger update

### Browser Compatibility

#### Supported Browsers
- **Google Chrome**: Recommended (version 88+)
- **Microsoft Edge**: Chromium-based versions
- **Other Chromium Browsers**: May work but not officially supported

#### Unsupported Browsers
- Firefox (different extension architecture)
- Safari (lacks required Bluetooth APIs)
- Internet Explorer (deprecated)

### Performance Tips

1. **Close Unused Tabs**: Reduces memory usage and improves Bluetooth performance
2. **Keep Dice Charged**: Low battery can cause connection issues
3. **Minimize Distance**: Keep dice close to computer for reliable connection
4. **Avoid Interference**: Other Bluetooth devices may cause connectivity issues

## Advanced Features

### Multiple Dice Support
- Connect multiple Pixels dice simultaneously
- Each die operates independently
- Results from all connected dice appear in Roll20 chat

### Macro Integration
- Dice results use proper Roll20 macro format
- Includes modifier values in roll output
- Compatible with Roll20's dice rolling system

### Session Persistence
- Modifier configurations persist within browser session
- Connection settings maintained while browser remains open
- Fresh setup required after browser restart

### Developer Features
- Test page available for development and debugging
- Console logging for troubleshooting
- Bluetooth connection health monitoring

## FAQ

### General Questions

**Q: Do I need special software to use this extension?**
A: No, just Google Chrome and the extension files. No additional software required.

**Q: Will this work with virtual tabletops other than Roll20?**
A: Currently, the extension is specifically designed for Roll20. Other platforms are not supported.

**Q: Can I use this with dice other than Pixels?**
A: No, this extension is specifically designed for Pixels dice and their Bluetooth protocol.

### Technical Questions

**Q: Why do I need to enable Developer Mode in Chrome?**
A: The extension isn't published in the Chrome Web Store, so it must be loaded as an unpacked extension.

**Q: Does this extension collect any personal data?**
A: No, the extension only interacts with your Pixels dice and Roll20. No data is collected or transmitted to external servers.

**Q: Can other players see my modifier settings?**
A: No, modifier settings are local to your browser. Other players only see the final dice results in chat.

### Dice-Specific Questions

**Q: How many dice can I connect at once?**
A: The extension supports multiple dice connections, but practical limits depend on your computer's Bluetooth capabilities.

**Q: Do I need to reconnect my dice every time?**
A: Yes, you'll need to reconnect each time you start a new browser session.

**Q: What happens if my dice battery dies during a game?**
A: The extension will show a disconnection status. Charge your dice and reconnect to continue playing.

### Troubleshooting Questions

**Q: The extension popup is empty or shows errors. What should I do?**
A: Try refreshing the Roll20 page, then click the extension icon again. If problems persist, reload the extension.

**Q: My rolls are showing up twice in chat. Why?**
A: This might happen if you have multiple extensions or scripts interfering. Try disabling other extensions temporarily.

**Q: The modifier box disappeared. How do I get it back?**
A: Click the extension icon and select "Show Modifier Box" again. If it doesn't appear, refresh the page and try again.

---

## Need More Help?

If you're still experiencing issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Look for error messages in Chrome's developer console (F12)
3. Try the test page at `tests/test.html` to isolate issues
4. Refer to the Pixels dice official documentation for device-specific problems

Remember: This extension enhances your Roll20 experience with physical dice - have fun and roll well! 🎲
