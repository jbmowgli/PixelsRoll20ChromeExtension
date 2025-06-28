'use strict';

//
// Drag Handler Module - Handles drag functionality for the modifier box
//
(function() {
    // Export functions to global scope
    window.ModifierBoxDragHandler = {
        setupDragFunctionality: setupDragFunctionality
    };

    function setupDragFunctionality(modifierBox) {
        if (!modifierBox) {
            console.error("setupDragFunctionality: modifierBox is required");
            return;
        }

        let isDragging = false;
        let isResizing = false;
        let dragOffset = { x: 0, y: 0 };

        const header = modifierBox.querySelector('.pixels-header');
        if (!header) {
            console.error("setupDragFunctionality: header not found");
            return;
        }

        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'pixels-resize-handle';
        resizeHandle.style.cssText = `
            position: absolute !important;
            bottom: 0 !important;
            right: 0 !important;
            width: 20px !important;
            height: 20px !important;
            cursor: se-resize !important;
            background: linear-gradient(-45deg, transparent 25%, #666 35%, transparent 45%, #666 55%, transparent 65%, #666 75%, transparent 85%) !important;
            border-bottom-right-radius: 8px !important;
            z-index: 10 !important;
        `;
        modifierBox.appendChild(resizeHandle);
        // Ensure the modifier box maintains fixed positioning for dragging
        modifierBox.style.position = 'fixed';
        
        // Set initial position if not already set
        if (!modifierBox.style.left || modifierBox.style.left === 'auto') {
            modifierBox.style.left = (window.innerWidth - 420) + 'px';
        }
        if (!modifierBox.style.top || modifierBox.style.top === 'auto') {
            modifierBox.style.top = '100px';
        }
        modifierBox.style.right = 'auto';
        modifierBox.style.bottom = 'auto';

        // Drag functionality
        header.addEventListener('mousedown', (e) => {
            // Skip if clicking on buttons or other interactive elements
            if (e.target.tagName === 'BUTTON' || e.target === resizeHandle) return;
            
            isDragging = true;
            const rect = modifierBox.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
            e.stopPropagation();
        });

        // Resize functionality
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            const rect = modifierBox.getBoundingClientRect();
            // Store initial dimensions and mouse position
            dragOffset.x = e.clientX;
            dragOffset.y = e.clientY;
            dragOffset.initialWidth = rect.width;
            dragOffset.initialHeight = rect.height;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
            e.stopPropagation();
        });

        function onMouseMove(e) {
            if (isDragging) {
                const newLeft = e.clientX - dragOffset.x;
                const newTop = e.clientY - dragOffset.y;
                modifierBox.style.left = newLeft + 'px';
                modifierBox.style.top = newTop + 'px';
            } else if (isResizing) {
                // Calculate size change based on mouse movement
                const deltaX = e.clientX - dragOffset.x;
                const deltaY = e.clientY - dragOffset.y;
                
                const newWidth = dragOffset.initialWidth + deltaX;
                const newHeight = dragOffset.initialHeight + deltaY;
                
                // Set minimum dimensions
                const minWidth = 300;
                const minHeight = 200;
                
                // Set maximum dimensions to prevent it from becoming too large
                const maxWidth = 600;
                const maxHeight = 800;
                
                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    modifierBox.style.width = newWidth + 'px';
                }
                if (newHeight >= minHeight && newHeight <= maxHeight) {
                    modifierBox.style.height = newHeight + 'px';
                }
            }
        }

        function onMouseUp() {
            isDragging = false;
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        console.log("Drag and resize functionality setup completed");
    }

    console.log("ModifierBoxDragHandler module initialized");
})();
