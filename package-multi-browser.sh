#!/bin/bash

# Multi-Browser Extension Package Script
# Creates packages for both Chrome Web Store and Firefox Add-ons

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configuration
VERSION="1.0.0"
SOURCE_DIR=$(pwd)
CHROME_PACKAGE_DIR="chrome-store-package"
FIREFOX_PACKAGE_DIR="firefox-addon-package"
CHROME_ZIP="PixelsRoll20Extension-Chrome-v${VERSION}.zip"
FIREFOX_ZIP="PixelsRoll20Extension-Firefox-v${VERSION}.zip"

# Parse command line arguments
BROWSER="both"
if [ "$1" = "chrome" ] || [ "$1" = "firefox" ] || [ "$1" = "both" ]; then
    BROWSER="$1"
fi

echo -e "${GREEN}Multi-Browser Extension Packager${NC}"
echo -e "${CYAN}Building packages for: ${BROWSER}${NC}"
echo ""

# Common files/folders to include in both packages
COMMON_ITEMS=(
    "LICENSE"
    "src/common"
    "src/content"
    "src/popup"
    "src/options"
    "src/background"
    "assets"
    "docs/PRIVACY_POLICY.md"
    "docs/USER_GUIDE.md"
    "docs/INSTALLATION.md"
    "docs/QUICK_REFERENCE.md"
    "docs/TROUBLESHOOTING.md"
)

# Function to copy common files
copy_common_files() {
    local package_dir="$1"
    
    for item in "${COMMON_ITEMS[@]}"; do
        source_path="$SOURCE_DIR/$item"
        dest_path="$package_dir/$item"
        
        if [ -e "$source_path" ]; then
            # Create destination directory if needed
            dest_parent=$(dirname "$dest_path")
            mkdir -p "$dest_parent"
            
            if [ -d "$source_path" ]; then
                cp -r "$source_path" "$dest_path"
                echo -e "${YELLOW}  Copied directory: $item${NC}"
            else
                cp "$source_path" "$dest_path"
                echo -e "${YELLOW}  Copied file: $item${NC}"
            fi
        else
            echo -e "${RED}  Warning: $item not found${NC}"
        fi
    done
}

# Function to create ZIP package
create_zip() {
    local package_dir="$1"
    local zip_name="$2"
    local zip_path="$SOURCE_DIR/$zip_name"
    
    echo -e "${GREEN}Creating ZIP file: $zip_name${NC}"
    
    # Remove existing ZIP if it exists
    if [ -f "$zip_path" ]; then
        rm -f "$zip_path"
    fi
    
    # Create ZIP from package directory
    cd "$package_dir"
    zip -r "../$zip_name" . > /dev/null
    cd "$SOURCE_DIR"
    
    # Clean up temporary directory
    rm -rf "$package_dir"
    
    # Report results
    if [ -f "$zip_path" ]; then
        file_size=$(du -m "$zip_path" | cut -f1)
        echo -e "${GREEN}✓ Package created: $zip_name (${file_size} MB)${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to create: $zip_name${NC}"
        return 1
    fi
}

# Package for Chrome
package_chrome() {
    echo -e "${MAGENTA}=== Packaging for Chrome ===${NC}"
    
    # Remove existing package directory
    if [ -d "$CHROME_PACKAGE_DIR" ]; then
        rm -rf "$CHROME_PACKAGE_DIR"
    fi
    
    # Create package directory
    mkdir -p "$CHROME_PACKAGE_DIR"
    
    # Copy manifest for Chrome
    cp "manifest.json" "$CHROME_PACKAGE_DIR/manifest.json"
    echo -e "${YELLOW}  Copied Chrome manifest${NC}"
    
    # Copy common files
    copy_common_files "$CHROME_PACKAGE_DIR"
    
    # Create ZIP
    create_zip "$CHROME_PACKAGE_DIR" "$CHROME_ZIP"
}

# Package for Firefox
package_firefox() {
    echo -e "${MAGENTA}=== Packaging for Firefox ===${NC}"
    
    # Check if Firefox manifest exists
    if [ ! -f "manifest-firefox.json" ]; then
        echo -e "${RED}Error: manifest-firefox.json not found!${NC}"
        echo -e "${YELLOW}Run this script from the project root directory.${NC}"
        return 1
    fi
    
    # Remove existing package directory
    if [ -d "$FIREFOX_PACKAGE_DIR" ]; then
        rm -rf "$FIREFOX_PACKAGE_DIR"
    fi
    
    # Create package directory
    mkdir -p "$FIREFOX_PACKAGE_DIR"
    
    # Copy manifest for Firefox
    cp "manifest-firefox.json" "$FIREFOX_PACKAGE_DIR/manifest.json"
    echo -e "${YELLOW}  Copied Firefox manifest${NC}"
    
    # Copy common files
    copy_common_files "$FIREFOX_PACKAGE_DIR"
    
    # Create ZIP
    create_zip "$FIREFOX_PACKAGE_DIR" "$FIREFOX_ZIP"
}

# Main execution
SUCCESS_COUNT=0
TOTAL_COUNT=0

if [ "$BROWSER" = "chrome" ] || [ "$BROWSER" = "both" ]; then
    package_chrome
    if [ $? -eq 0 ]; then
        ((SUCCESS_COUNT++))
    fi
    ((TOTAL_COUNT++))
    echo ""
fi

if [ "$BROWSER" = "firefox" ] || [ "$BROWSER" = "both" ]; then
    package_firefox
    if [ $? -eq 0 ]; then
        ((SUCCESS_COUNT++))
    fi
    ((TOTAL_COUNT++))
    echo ""
fi

# Summary
echo -e "${MAGENTA}=== Packaging Summary ===${NC}"
echo -e "${GREEN}Successfully created: $SUCCESS_COUNT/$TOTAL_COUNT packages${NC}"

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    
    if [ "$BROWSER" = "chrome" ] || [ "$BROWSER" = "both" ]; then
        if [ -f "$CHROME_ZIP" ]; then
            echo -e "${WHITE}Chrome Web Store:${NC}"
            echo -e "  1. Go to: https://chrome.google.com/webstore/devconsole/"
            echo -e "  2. Upload: $CHROME_ZIP"
            echo ""
        fi
    fi
    
    if [ "$BROWSER" = "firefox" ] || [ "$BROWSER" = "both" ]; then
        if [ -f "$FIREFOX_ZIP" ]; then
            echo -e "${WHITE}Firefox Add-ons (AMO):${NC}"
            echo -e "  1. Go to: https://addons.mozilla.org/developers/"
            echo -e "  2. Upload: $FIREFOX_ZIP"
            echo ""
        fi
    fi
    
    echo -e "${YELLOW}Remember to test both packages before submitting!${NC}"
else
    echo -e "${RED}No packages were created successfully.${NC}"
    exit 1
fi
