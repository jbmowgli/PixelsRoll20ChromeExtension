// Theme detection utility for Roll20
// This file contains functions to detect Roll20's current theme and monitor changes

(function() {
    'use strict';

    // Roll20 theme detection
    const ThemeDetector = {
        // Detect current Roll20 theme
        detectTheme() {
            // Check for Roll20's theme classes on body or html
            const body = document.body;
            const html = document.documentElement;
            
            // Roll20 typically uses these selectors for themes
            if (body.classList.contains('darkmode') || html.classList.contains('darkmode')) {
                return 'dark';
            }
            if (body.classList.contains('lightmode') || html.classList.contains('lightmode')) {
                return 'light';
            }
            
            // Check for data attributes
            if (body.dataset.theme) {
                return body.dataset.theme;
            }
            if (html.dataset.theme) {
                return html.dataset.theme;
            }
            
            // Check CSS custom properties
            const computedStyle = getComputedStyle(document.documentElement);
            const bgColor = computedStyle.getPropertyValue('--background-color') || 
                           computedStyle.getPropertyValue('--main-bg') ||
                           computedStyle.backgroundColor;
            
            // Analyze background color to determine theme
            if (bgColor) {
                const rgb = this.parseColor(bgColor);
                if (rgb) {
                    const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
                    return brightness < 128 ? 'dark' : 'light';
                }
            }
            
            // Check Roll20's chat container styles as fallback
            const chatContainer = document.querySelector('.textchatcontainer, #textchat');
            if (chatContainer) {
                const chatStyle = getComputedStyle(chatContainer);
                const chatBg = chatStyle.backgroundColor;
                if (chatBg) {
                    const rgb = this.parseColor(chatBg);
                    if (rgb) {
                        const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
                        return brightness < 128 ? 'dark' : 'light';
                    }
                }
            }
            
            // Default fallback
            return 'dark';
        },

        // Parse color string to RGB values
        parseColor(colorStr) {
            if (!colorStr) return null;
            
            // Handle rgb() format
            const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                return {
                    r: parseInt(rgbMatch[1]),
                    g: parseInt(rgbMatch[2]),
                    b: parseInt(rgbMatch[3])
                };
            }
            
            // Handle rgba() format
            const rgbaMatch = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
            if (rgbaMatch) {
                return {
                    r: parseInt(rgbaMatch[1]),
                    g: parseInt(rgbaMatch[2]),
                    b: parseInt(rgbaMatch[3])
                };
            }
            
            // Handle hex format
            const hexMatch = colorStr.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
            if (hexMatch) {
                return {
                    r: parseInt(hexMatch[1], 16),
                    g: parseInt(hexMatch[2], 16),
                    b: parseInt(hexMatch[3], 16)
                };
            }
            
            return null;
        },

        // Get Roll20 theme colors
        getThemeColors() {
            const theme = this.detectTheme();
            const computedStyle = getComputedStyle(document.documentElement);
            
            // Try to extract actual Roll20 colors
            const colors = {
                theme: theme,
                primary: computedStyle.getPropertyValue('--primary-color') || '#4CAF50',
                background: computedStyle.getPropertyValue('--background-color') || 
                           computedStyle.getPropertyValue('--main-bg') || 
                           (theme === 'dark' ? '#2b2b2b' : '#ffffff'),
                surface: computedStyle.getPropertyValue('--surface-color') ||
                        (theme === 'dark' ? '#1a1a1a' : '#f5f5f5'),
                border: computedStyle.getPropertyValue('--border-color') ||
                       (theme === 'dark' ? '#555555' : '#cccccc'),
                text: computedStyle.getPropertyValue('--text-color') ||
                     (theme === 'dark' ? '#ffffff' : '#000000'),
                textSecondary: computedStyle.getPropertyValue('--text-secondary') ||
                              (theme === 'dark' ? '#cccccc' : '#666666'),
                input: computedStyle.getPropertyValue('--input-bg') ||
                      (theme === 'dark' ? '#333333' : '#ffffff'),
                inputBorder: computedStyle.getPropertyValue('--input-border') ||
                            (theme === 'dark' ? '#555555' : '#cccccc'),
                button: computedStyle.getPropertyValue('--button-bg') ||
                       (theme === 'dark' ? '#444444' : '#e0e0e0'),
                buttonHover: computedStyle.getPropertyValue('--button-hover') ||
                            (theme === 'dark' ? '#555555' : '#d0d0d0')
            };
            
            // Try to detect actual Roll20 colors by sampling chat container
            const chatContainer = document.querySelector('.textchatcontainer, #textchat');
            if (chatContainer) {
                const chatStyle = getComputedStyle(chatContainer);
                if (chatStyle.backgroundColor && chatStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    colors.background = chatStyle.backgroundColor;
                }
                if (chatStyle.borderColor && chatStyle.borderColor !== 'rgba(0, 0, 0, 0)') {
                    colors.border = chatStyle.borderColor;
                }
                if (chatStyle.color) {
                    colors.text = chatStyle.color;
                }
            }
            
            return colors;
        },

        // Monitor theme changes
        onThemeChange(callback) {
            let currentTheme = this.detectTheme();
            
            // Create mutation observer to watch for theme changes
            const observer = new MutationObserver((mutations) => {
                const newTheme = this.detectTheme();
                if (newTheme !== currentTheme) {
                    currentTheme = newTheme;
                    callback(newTheme, this.getThemeColors());
                }
            });
            
            // Watch for class changes on body and html
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'data-theme', 'style']
            });
            
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'data-theme', 'style']
            });
            
            // Also watch for style changes in head
            const head = document.head;
            if (head) {
                observer.observe(head, {
                    childList: true,
                    subtree: true
                });
            }
            
            return observer;
        }
    };

    // Export to global scope
    window.ThemeDetector = ThemeDetector;
})();
