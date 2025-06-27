# Troubleshooting Guide

## Quick Diagnostics

### Is the Extension Working?

**Check These First:**
- Extension icon visible in Chrome toolbar? 
- Clicking icon opens popup?
- "Connect" and "Show Modifier Box" buttons present?
- Roll20 page loaded completely?

### Is Bluetooth Working?

**Check These First:**
- Computer Bluetooth enabled?
- Pixels dice charged and responsive?
- Dice within range (< 30 feet)?
- No other devices connected to dice?

### Are Dice Connected?

**Check These First:**
- Extension popup shows connection status?
- Dice LED responds when rolled?
- Roll20 chat receiving messages?
- Modifier box visible and functional?

## Common Issues & Solutions

### Extension Issues

#### Extension Icon Missing
**Symptoms**: No Pixels icon in Chrome toolbar

**Causes & Solutions**:
- **Not Installed**: Follow installation guide completely
- **Disabled**: Check chrome://extensions/ and enable extension
- **Chrome Updated**: Reload extension after Chrome updates
- **Profile Issue**: Try different Chrome profile or incognito mode

#### Popup Won't Open
**Symptoms**: Clicking icon does nothing or shows error

**Causes & Solutions**:
- **Page Compatibility**: Only works on Roll20 game pages
- **Script Errors**: Check browser console (F12) for red errors
- **Cache Issues**: Clear browser cache and reload page
- **Extension Corruption**: Remove and reinstall extension

#### Buttons Don't Work
**Symptoms**: Clicking popup buttons has no effect

**Causes & Solutions**:
- **Script Injection Failed**: Refresh Roll20 page and try again
- **Permissions Missing**: Check extension permissions in Chrome
- **Ad Blockers**: Disable ad blockers that might interfere
- **Other Extensions**: Try disabling other extensions temporarily

### Bluetooth Issues

#### No Devices Found
**Symptoms**: Bluetooth picker shows empty list

**Causes & Solutions**:
- **Bluetooth Disabled**: Enable Bluetooth in system settings
- **Dice Asleep**: Roll dice gently to wake them up
- **Range Issues**: Move dice closer to computer
- **Driver Issues**: Update Bluetooth drivers
- **Chrome Permissions**: Allow Chrome to access Bluetooth

#### Connection Fails
**Symptoms**: Dice appear but won't connect

**Causes & Solutions**:
- **Already Connected**: Disconnect from other devices first
- **Low Battery**: Charge dice fully before connecting
- **Interference**: Move away from other Bluetooth devices
- **Reset Dice**: Follow Pixels reset procedure
- **Chrome Restart**: Close and reopen Chrome browser

#### Frequent Disconnections
**Symptoms**: Dice connect then disconnect repeatedly

**Causes & Solutions**:
- **Power Management**: Disable USB power saving in device manager
- **Distance**: Keep dice close to computer during play
- **Battery Low**: Check dice battery levels
- **System Load**: Close unnecessary programs to reduce CPU usage
- **Bluetooth Stack**: Try different Bluetooth adapter if available

### Roll20 Integration Issues

#### Rolls Not Appearing in Chat
**Symptoms**: Dice roll but nothing shows in Roll20

**Causes & Solutions**:
- **Wrong Game**: Verify you're in correct Roll20 game session
- **Chat Permissions**: Check Roll20 chat permissions and settings
- **Connection Status**: Verify dice connection in extension popup
- **Roll20 Lag**: Wait a few seconds, Roll20 might be slow
- **Script Errors**: Check browser console for JavaScript errors

#### Modifiers Not Applied
**Symptoms**: Rolls appear but modifiers missing

**Causes & Solutions**:
- **Modifier Selection**: Ensure modifier is selected (radio button checked)
- **Modifier Box**: Verify modifier box is visible and functional
- **Values**: Check that modifier values are set correctly
- **Timing**: Apply modifiers before rolling dice
- **Reset**: Close and reopen modifier box to refresh

#### Wrong Roll Format
**Symptoms**: Rolls appear with incorrect formatting

**Causes & Solutions**:
- **Macro Syntax**: Extension uses standard Roll20 format
- **Custom Macros**: May interfere with extension output
- **Roll20 Updates**: Roll20 changes might affect formatting
- **Character Sheets**: Some sheets modify roll output
- **Refresh**: Reload page to reset Roll20 state

### Modifier Box Issues

#### Box Won't Appear
**Symptoms**: "Show Modifier Box" doesn't work

**Causes & Solutions**:
- **Off-Screen**: Box might be positioned outside visible area
- **Minimized**: Box might be minimized (look for small header)
- **Z-Index**: Other UI elements might be covering the box
- **Script Load**: Refresh page to reload all scripts
- **Browser Zoom**: Try different zoom levels in browser

#### Can't Move or Resize
**Symptoms**: Modifier box stuck in place

**Causes & Solutions**:
- **Drag Handle**: Use header area (title bar) for dragging
- **Browser Compatibility**: Some browsers limit positioning
- **Page Zoom**: Reset browser zoom to 100%
- **CSS Conflicts**: Other extensions might interfere with styling
- **Refresh**: Reload page to reset positioning

#### Theme Not Matching
**Symptoms**: Modifier box colors don't match Roll20 theme

**Causes & Solutions**:
- **Theme Detection**: Close and reopen modifier box
- **Custom Themes**: Extension supports standard Roll20 themes only
- **Cache**: Clear browser cache and reload
- **Script Order**: Refresh page to ensure proper script loading
- **Force Update**: Switch Roll20 themes back and forth

### Performance Issues

#### Slow Response
**Symptoms**: Delays between rolling and results appearing

**Causes & Solutions**:
- **System Resources**: Close unnecessary programs and browser tabs
- **Bluetooth Congestion**: Reduce other Bluetooth device usage
- **Network Lag**: Check internet connection stability
- **Roll20 Performance**: Roll20 server might be slow
- **Chrome Performance**: Restart Chrome to clear memory

#### High CPU Usage
**Symptoms**: Computer fan running, browser sluggish

**Causes & Solutions**:
- **Background Processes**: Close unnecessary browser tabs
- **Extension Conflicts**: Disable other extensions temporarily
- **Chrome Updates**: Ensure Chrome is up to date
- **Hardware**: Older computers may struggle with real-time processing
- **Power Settings**: Use high-performance power plan

## Advanced Troubleshooting

### Browser Console Debugging

#### Accessing Console
1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Look for red error messages
4. Note any messages mentioning "Pixels" or "Roll20"

#### Common Error Messages

**"Failed to execute 'requestDevice'"**
- Bluetooth permission denied or not available
- Enable Bluetooth in browser and system settings

**"Script error: Extension context invalidated"**
- Extension was reloaded or updated
- Refresh the Roll20 page

**"Cannot read property of undefined"**
- Script loading order issue
- Refresh page to reload all scripts

### Network and Connectivity

#### Checking Bluetooth Status
```bash
# Windows (PowerShell)
Get-PnpDevice | Where-Object {$_.Class -eq "Bluetooth"}

# macOS (Terminal)
system_profiler SPBluetoothDataType

# Linux (Terminal)
bluetoothctl show
```

#### Testing Browser Bluetooth API
1. Open Chrome and navigate to `chrome://flags/`
2. Search for "Bluetooth"
3. Ensure experimental features are enabled
4. Test with `chrome://bluetooth-internals/`

### System-Specific Issues

#### Windows Troubleshooting
- **Driver Issues**: Update Bluetooth drivers through Device Manager
- **Power Management**: Disable "Allow computer to turn off this device"
- **Antivirus**: Whitelist Chrome and extension folder
- **Windows Updates**: Ensure latest updates installed

#### macOS Troubleshooting
- **Privacy Settings**: Allow Chrome Bluetooth access in System Preferences
- **Bluetooth Reset**: Reset Bluetooth module (hold Shift+Option, click Bluetooth icon)
- **Chrome Permissions**: Check Chrome has necessary system permissions
- **Firewall**: Ensure Chrome isn't blocked by firewall

#### Linux Troubleshooting
- **Bluetooth Service**: Ensure bluetoothd service is running
- **User Permissions**: Add user to bluetooth group
- **Browser Sandbox**: Chrome's sandbox might limit Bluetooth access
- **Distribution**: Some distributions need additional packages

### Data Recovery and Reset

#### Reset Extension Settings
1. Go to `chrome://extensions/`
2. Find Pixels Roll20 extension
3. Click "Details"
4. Click "Extension options" (if available)
5. Clear any stored settings

#### Clear Extension Data
```javascript
// Run in browser console on Roll20 page
localStorage.removeItem('pixels_extension_data');
chrome.storage.local.clear();
```

#### Complete Reset
1. Disconnect all Pixels dice
2. Remove extension from Chrome
3. Clear browser cache and cookies
4. Restart Chrome
5. Reinstall extension fresh

## Getting Additional Help

### Before Seeking Help

**Gather This Information**:
- Chrome version (chrome://version/)
- Operating system and version
- Pixels dice model/generation
- Exact error messages from console
- Steps that reproduce the issue

### Documentation Resources

- **USER_GUIDE.md**: Complete feature documentation
- **INSTALLATION.md**: Setup and configuration help
- **QUICK_REFERENCE.md**: Fast solutions for common issues

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Pixels Community**: Connect with other Pixels users
- **Roll20 Forums**: Roll20-specific integration questions

### Professional Support

For persistent issues that affect gameplay:

1. **Document the Problem**: Screenshots, error messages, steps to reproduce
2. **Try Multiple Solutions**: Attempt several troubleshooting steps
3. **Test Isolation**: Try extension on different computer/browser
4. **Contact Developers**: Submit detailed issue report on GitHub

---

**Remember**: Most issues are resolved by refreshing the Roll20 page and reconnecting your dice. When in doubt, restart fresh! 🎲
