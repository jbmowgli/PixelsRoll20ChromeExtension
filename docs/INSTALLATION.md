# Installation Guide

## System Requirements

### Hardware Requirements

- Computer with Bluetooth capability
- Pixels dice (modern or legacy versions)
- Stable internet connection

### Software Requirements

- **Google Chrome** browser (version 88 or later)
- **Roll20** account with access to game sessions
- **Developer Mode** enabled in Chrome

### Supported Operating Systems

- Windows 10/11
- macOS 10.15 or later  
- Linux (Ubuntu 18.04+ or equivalent)

## Installation Steps

### Step 1: Prepare Your System

#### Enable Bluetooth
1. **Windows**: Settings → Bluetooth & devices → Enable Bluetooth
2. **macOS**: System Preferences → Bluetooth → Turn Bluetooth On
3. **Linux**: Check distribution-specific Bluetooth setup

#### Update Chrome Browser
1. Open Chrome browser
2. Click menu (⋮) → Help → About Google Chrome
3. Chrome will automatically update if needed
4. Restart browser after update

### Step 2: Download the Extension

#### Option A: Git Clone (Recommended)
```bash
git clone https://github.com/[repository-url]/PixelsRoll20ChromeExtension.git
cd PixelsRoll20ChromeExtension
```

#### Option B: Direct Download
1. Visit the GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract ZIP file to desired location
4. Remember the folder path for installation

### Step 3: Install in Chrome

#### Enable Developer Mode
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" switch (top-right corner)
4. Page will refresh showing developer options

#### Load the Extension
1. Click "Load unpacked" button
2. Navigate to the extension folder
3. Select the folder containing `manifest.json`
4. Click "Select Folder" or "Open"

#### Verify Installation
1. Extension appears in Chrome extensions list
2. Pixels dice icon visible in Chrome toolbar
3. Extension shows as "Enabled"

### Step 4: Configure Permissions

#### Required Permissions
The extension will request these permissions:

- **Active Tab**: Access to current tab content
- **Storage**: Save extension settings
- **Bluetooth**: Connect to Pixels dice

#### Grant Permissions
1. Chrome may prompt for permission approval
2. Click "Allow" for all requested permissions
3. Permissions can be managed later in Chrome settings

### Step 5: Test Installation

#### Basic Function Test
1. Navigate to any Roll20 game session
2. Click the Pixels extension icon
3. Extension popup should appear
4. All buttons should be visible and clickable

#### Bluetooth Test
1. Ensure Pixels dice are charged and nearby
2. Click "Connect" in extension popup
3. Bluetooth device picker should appear
4. Your Pixels dice should be listed

## Post-Installation Setup

### Prepare Your Dice

#### Charge Your Dice
- Ensure all Pixels dice are fully charged
- Charging typically takes 1-2 hours
- Check battery status using Pixels official app

#### Test Dice Functionality
- Roll dice to wake them up
- Verify they're responding to movement
- Check LED functionality

### Configure Roll20

#### Browser Settings
- Allow Chrome to access microphone/camera if needed
- Disable pop-up blockers for Roll20 domain
- Clear browser cache if experiencing issues

#### Roll20 Account
- Ensure you're logged into Roll20
- Join or create a game session
- Verify chat functionality works normally

## Verification Steps

### Extension Health Check

1. **Extension Icon**: Visible in Chrome toolbar
2. **Popup Function**: Opens when clicked
3. **Permissions**: All required permissions granted
4. **Console Errors**: No errors in browser console (F12)

### Bluetooth Connectivity

1. **Device Discovery**: Pixels dice appear in Bluetooth picker
2. **Connection**: Dice connect successfully
3. **Status Display**: Extension shows connection status
4. **Roll Detection**: Physical rolls trigger responses

### Roll20 Integration

1. **Page Recognition**: Extension works on Roll20 game pages
2. **Chat Integration**: Rolls appear in Roll20 chat
3. **Modifier Box**: Floating interface appears correctly
4. **Theme Adaptation**: Interface matches Roll20 theme

## Troubleshooting Installation

### Common Installation Issues

#### Extension Not Loading
**Problem**: "Load unpacked" fails or extension doesn't appear

**Solutions**:
- Verify you selected the correct folder (containing manifest.json)
- Check that all files are present and not corrupted
- Ensure Chrome Developer Mode is enabled
- Try refreshing the extensions page

#### Permission Errors
**Problem**: Extension can't access required features

**Solutions**:
- Manually grant permissions in Chrome settings
- Check that antivirus isn't blocking the extension
- Restart Chrome after installation
- Clear browser data and reinstall

#### Bluetooth Not Working
**Problem**: Can't connect to Pixels dice

**Solutions**:
- Verify Bluetooth is enabled on computer
- Check that dice are charged and responsive
- Ensure no other devices are connected to dice
- Try restarting Bluetooth service

### Advanced Troubleshooting

#### Developer Console
1. Press F12 to open developer tools
2. Check Console tab for error messages
3. Look for red error messages related to the extension
4. Copy error messages for further troubleshooting

#### Extension Logs
1. Go to `chrome://extensions/`
2. Find Pixels Roll20 extension
3. Click "Inspect views: background page"
4. Check console for background script errors

#### Clean Reinstall
1. Remove extension from Chrome
2. Clear browser cache and cookies
3. Restart Chrome browser
4. Reinstall extension from scratch

## Updating the Extension

### Manual Updates

#### Git Repository Updates
```bash
cd PixelsRoll20ChromeExtension
git pull origin main
```

#### File Replacement Updates
1. Download latest version
2. Replace old files with new ones
3. Reload extension in Chrome
4. Test functionality after update

### Reload Extension
1. Go to `chrome://extensions/`
2. Find Pixels Roll20 extension
3. Click reload button (🔄)
4. Verify extension works after reload

## Uninstalling the Extension

### Complete Removal

1. **Remove from Chrome**:
   - Go to `chrome://extensions/`
   - Find Pixels Roll20 extension
   - Click "Remove" button
   - Confirm removal

2. **Clean Up Files**:
   - Delete extension folder from computer
   - Clear any cached data
   - Remove from browser bookmarks if added

3. **Reset Settings**:
   - Clear extension data from Chrome storage
   - Reset any modified browser permissions
   - Restart Chrome to complete cleanup

## Getting Help

### Before Seeking Help

1. **Check Requirements**: Verify system meets all requirements
2. **Try Basic Fixes**: Restart browser, reconnect dice, refresh page
3. **Read Documentation**: Review USER_GUIDE.md for detailed help
4. **Check Console**: Look for error messages in developer console

### Documentation Resources

- **USER_GUIDE.md**: Comprehensive usage instructions
- **QUICK_REFERENCE.md**: Fast troubleshooting guide
- **PROJECT_STRUCTURE.md**: Technical documentation

### Community Support

- GitHub Issues: Report bugs and request features
- Pixels Community: Connect with other Pixels users
- Roll20 Forums: General Roll20 integration questions

---

**Installation complete!** You're now ready to bring the magic of Pixels dice to your Roll20 sessions. Roll on! 🎲
