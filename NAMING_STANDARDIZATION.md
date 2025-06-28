# File and Directory Naming Standardization

## Summary

Successfully standardized all file and directory names in the `src/content` directory to follow consistent camelCase naming conventions, which is the JavaScript community best practice.

## Changes Made

### Directory Structure Updates

**Before:**

```
src/content/
├── Common/          # PascalCase (inconsistent)
├── ModifierBox/     # PascalCase (inconsistent)
└── roll20.js        # camelCase (correct)
```

**After:**

```
src/content/
├── common/          # camelCase (consistent)
├── modifierBox/     # camelCase (consistent)
└── roll20.js        # camelCase (consistent)
```

### Files Updated

The following files were updated to reflect the new directory paths:

#### Core Project Files

1. **manifest.json** - Updated content script and web accessible resource paths
2. **src/content/modifierBox/themeManager.js** - Updated CSS file paths
3. **src/content/modifierBox/modifierBox.js** - Updated HTML template path
4. **src/content/modifierBox/index.js** - Updated HTML template path

#### Test Files

- **tests/jest/ModifierBox/index.test.js** - Updated module load paths
- **tests/jest/ModifierBox/themeManager.test.js** - Updated CSS file references and module paths
- **tests/jest/ModifierBox/dragHandler.test.js** - Updated module load paths
- **tests/jest/ModifierBox/rowManager.test.js** - Updated module load paths

#### Documentation Files

- **PROJECT_STRUCTURE.md** - Updated directory references
- **DEVELOPER_GUIDE.md** - Updated file paths and directory references
- **CLEANUP_SUMMARY.md** - Updated directory references
- **tests/jest/README.md** - Updated directory references

## Rationale

### Why camelCase for JavaScript Projects?

1. **Industry Standard**: camelCase is the established convention for JavaScript file and directory names
2. **Consistency**: Matches existing JavaScript naming conventions (variables, functions, etc.)
3. **Tool Compatibility**: Better compatibility with Node.js module resolution and bundling tools
4. **Readability**: More consistent with the overall codebase style

### Benefits Achieved

- ✅ **Consistent Naming**: All directories now follow the same camelCase convention
- ✅ **Best Practices Alignment**: Follows JavaScript community standards
- ✅ **Maintainability**: Easier for developers to predict file paths
- ✅ **No Breaking Changes**: All tests pass and functionality preserved

## Verification

### Tests Status

All 141 tests continue to pass after the renaming:

- ✅ 6 test suites passing
- ✅ 141 tests passing
- ✅ No broken references or import errors

### File Integrity

- All internal file references updated correctly
- Manifest.json paths updated for Chrome extension compatibility
- Documentation synchronized with new structure

## Impact

### Zero Breaking Changes

- Extension functionality unchanged
- All module imports working correctly
- Test suite fully operational
- Documentation up to date

### Improved Developer Experience

- Consistent naming reduces cognitive load
- Easier to predict file paths
- Aligns with JavaScript ecosystem standards
- Better long-term maintainability

This change establishes a solid foundation for consistent file naming throughout the project while maintaining all existing functionality.
