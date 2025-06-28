'use strict';

//
// Position Manager Module - Handles positioning logic for the modifier box
//
(function() {
    // Export functions to global scope
    window.ModifierBoxPositionManager = {
        positionModifierBox: positionModifierBox,
        setupPositionListeners: setupPositionListeners
    };

    function positionModifierBox(modifierBox) {
        if (!modifierBox) {
            console.log("positionModifierBox called but modifierBox is null");
            return;
        }
        
        console.log("Positioning modifier box...");
        const chatContainer = document.querySelector('.textchatcontainer');
        if (chatContainer) {
            console.log("Found chat container, positioning relative to it");
            const rect = chatContainer.getBoundingClientRect();
            const boxWidth = modifierBox.offsetWidth || 280; // Use actual width or default
            // Position to the left of the chat container, aligned with its bottom
            modifierBox.style.left = (rect.left - boxWidth - 20) + 'px'; // Dynamic width + 20px gap
            modifierBox.style.top = (rect.bottom - 80) + 'px'; // Align with bottom, smaller offset
        } else {
            console.log("Chat container not found, using fallback position");
            // Fallback to default position if chat container not found
            modifierBox.style.top = '100px';
            modifierBox.style.right = '20px';
            modifierBox.style.left = 'auto';
        }
    }

    function setupPositionListeners(modifierBox) {
        if (!modifierBox) {
            console.error("setupPositionListeners: modifierBox is required");
            return;
        }

        // Add window resize listener to reposition the box
        const repositionHandler = () => positionModifierBox(modifierBox);
        window.addEventListener('resize', repositionHandler);

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', repositionHandler);
        };
    }

    console.log("ModifierBoxPositionManager module initialized");
})();
