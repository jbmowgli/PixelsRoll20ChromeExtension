# Chrome Web Store Publication Checklist

## Pre-Publication Requirements

### ✅ Documentation Complete
- [x] Privacy Policy created (`docs/PRIVACY_POLICY.md`)
- [x] Chrome Store listing content prepared (`docs/CHROME_STORE_LISTING.md`)
- [x] User documentation updated and game-agnostic
- [x] Attribution and license properly maintained

### ✅ Manifest Updates
- [x] Updated to Manifest V3
- [x] Version set to 1.0.0 for initial release
- [x] Proper permissions declared (activeTab, scripting, bluetooth)
- [x] Content scripts properly configured
- [x] Service worker (background script) updated

### ✅ Code Quality
- [x] All files organized in logical directory structure
- [x] Content scripts use modern JavaScript
- [x] Error handling implemented
- [x] No console.log statements in production code
- [x] Code comments and documentation

## Publication Steps

### 1. Final Testing
- [ ] Test extension in clean Chrome profile
- [ ] Verify all features work without developer tools
- [ ] Test Bluetooth permissions and connections
- [ ] Verify Roll20 integration works correctly
- [ ] Test theme adaptation
- [ ] Test modifier box functionality

### 2. Asset Preparation
- [ ] Create high-quality screenshots (1280x800 or 640x400)
  - Extension popup interface
  - Modifier box in use
  - Roll results in Roll20 chat
  - Theme adaptation examples
- [ ] Ensure icon assets are optimized
- [ ] Prepare promotional images if desired

### 3. Chrome Web Store Account
- [ ] Create/access Chrome Web Store Developer account
- [ ] Pay one-time $5 developer registration fee
- [ ] Verify developer account

### 4. Package Extension
- [ ] Remove any development/test files from package
- [ ] Verify manifest.json is correct
- [ ] Create ZIP file of extension directory
- [ ] Test ZIP package in clean environment

### 5. Store Listing
- [ ] Use content from `docs/CHROME_STORE_LISTING.md`
- [ ] Upload screenshots and assets
- [ ] Set privacy practices correctly
- [ ] Choose appropriate category (Productivity)
- [ ] Set mature content rating (Everyone)

### 6. Privacy & Permissions
- [ ] Justify all permissions in store listing
- [ ] Link to privacy policy
- [ ] Confirm no data collection practices
- [ ] Set appropriate privacy declarations

## Important Notes

### Attribution Requirements
- Original work by Olivier Basille and GameWithPixels team is properly credited
- MIT License maintained with proper attribution
- Enhanced edition clearly identified

### Store Policies Compliance
- No trademark violations (proper disclaimers about Roll20/Pixels)
- Clear functionality description
- No misleading claims
- Privacy policy accurately reflects data practices

### Technical Requirements
- Manifest V3 compliance
- Proper permission usage
- No remote code execution
- Secure Bluetooth handling

## Post-Publication

### 1. Monitor Reviews
- [ ] Respond to user feedback
- [ ] Address technical issues quickly
- [ ] Update documentation as needed

### 2. Maintenance
- [ ] Monitor Chrome API changes
- [ ] Keep up with Roll20 updates
- [ ] Test with new Pixels dice firmware

### 3. Updates
- [ ] Increment version numbers appropriately
- [ ] Document changes in release notes
- [ ] Test thoroughly before publishing updates

## Legal Considerations

### Trademarks
- "Roll20" is a trademark of The Orr Group, LLC
- "Pixels" is a trademark of Systemic Games
- Extension provides integration but is not endorsed by either company

### Open Source
- Source code can remain open on GitHub
- Contributors should be acknowledged
- MIT License allows commercial distribution

### Compliance
- GDPR compliance (no personal data collection)
- Chrome Web Store policies
- Accessibility guidelines where applicable
