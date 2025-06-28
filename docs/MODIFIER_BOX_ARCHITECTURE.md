# Modifier Box Module Architecture

The `modifierBox.js` file has been refactored into a modular architecture for better maintainability and separation of concerns. The functionality is now split across several focused modules:

## Module Structure

### Core Module
- **`modifierBox.js`** - Main singleton coordinator that manages the modifier box lifecycle and orchestrates other modules

### Sub-modules (in `src/content/modules/`)

#### 1. **themeManager.js**
- **Purpose**: Handles all styling and theme-related functionality
- **Responsibilities**:
  - CSS style generation and injection
  - Theme detection integration
  - Dynamic theme updates
  - Theme monitoring and cleanup
- **Exports**: `ModifierBoxThemeManager`

#### 2. **dragHandler.js**
- **Purpose**: Manages drag and drop functionality for the modifier box
- **Responsibilities**:
  - Mouse event handling for dragging
  - Position calculations during drag
  - Drag state management
- **Exports**: `ModifierBoxDragHandler`

#### 3. **positionManager.js**
- **Purpose**: Handles positioning logic and responsive layout
- **Responsibilities**:
  - Initial positioning relative to Roll20 chat container
  - Fallback positioning when chat container not found
  - Window resize handling
  - Position listener setup and cleanup
- **Exports**: `ModifierBoxPositionManager`

#### 4. **rowManager.js**
- **Purpose**: Manages modifier rows (add, remove, update)
- **Responsibilities**:
  - Adding new modifier rows
  - Removing modifier rows with safety checks
  - Event listener management for row interactions
  - Global variable synchronization
  - Header title updates
- **Exports**: `ModifierBoxRowManager`

## Benefits of Refactoring

### 1. **Separation of Concerns**
Each module has a single, well-defined responsibility, making the code easier to understand and maintain.

### 2. **Reduced File Size**
The main `modifierBox.js` file went from 642 lines to approximately 120 lines, with functionality distributed across focused modules.

### 3. **Better Testability**
Individual modules can be tested in isolation, improving test coverage and debugging.

### 4. **Improved Maintainability**
- Easier to locate and fix bugs in specific functionality
- Changes to one aspect (e.g., styling) don't risk breaking other features
- Clear module boundaries prevent unintended side effects

### 5. **Enhanced Reusability**
Modules can potentially be reused in other parts of the extension or in different projects.

## Module Dependencies

```
modifierBox.js (main)
├── themeManager.js
├── dragHandler.js  
├── positionManager.js
└── rowManager.js
```

The main module checks for the availability of all sub-modules before proceeding, ensuring graceful failure if any module fails to load.

## Loading Order

The modules must be loaded in the correct order as specified in `manifest.json`:

1. `theme-detector.js` (existing dependency)
2. `modules/themeManager.js`
3. `modules/dragHandler.js`
4. `modules/positionManager.js`
5. `modules/rowManager.js`
6. `modifierBox.js` (main coordinator)
7. `roll20.js` (existing dependency)

## Error Handling

The main module includes comprehensive error checking:
- Validates that all required modules are loaded before initialization
- Provides clear error messages when modules are missing
- Gracefully handles null/undefined states

## Future Enhancements

This modular structure makes it easier to:
- Add new features to specific modules without affecting others
- Replace individual modules with improved implementations
- Add unit tests for each module
- Create module-specific documentation
- Implement lazy loading for performance optimization

## Migration Notes

The refactoring maintains full backward compatibility:
- All existing public APIs remain unchanged
- Global variables and extension integration points are preserved
- No changes required to other parts of the extension
