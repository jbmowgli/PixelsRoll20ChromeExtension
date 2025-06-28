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
        let dragOffset = { x: 0, y: 0 };

        const header = modifierBox.querySelector('.pixels-header');
        if (!header) {
            console.error("setupDragFunctionality: header not found");
            return;
        }

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = modifierBox.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            modifierBox.style.left = (e.clientX - dragOffset.x) + 'px';
            modifierBox.style.top = (e.clientY - dragOffset.y) + 'px';
            modifierBox.style.right = 'auto';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        console.log("Drag functionality setup completed");
    }

    console.log("ModifierBoxDragHandler module initialized");
})();
