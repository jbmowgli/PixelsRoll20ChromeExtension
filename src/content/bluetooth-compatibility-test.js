// Firefox Bluetooth Compatibility Test
// Add this to your Roll20 integration to test Firefox behavior

function testBluetoothCompatibility() {
    console.group('🔍 Bluetooth Compatibility Test');
    
    // Test 1: Basic API availability
    const hasNavigatorBluetooth = 'bluetooth' in navigator;
    console.log('navigator.bluetooth exists:', hasNavigatorBluetooth);
    
    if (hasNavigatorBluetooth) {
        // Test 2: Method availability
        const hasRequestDevice = 'requestDevice' in navigator.bluetooth;
        const hasGetAvailability = 'getAvailability' in navigator.bluetooth;
        
        console.log('requestDevice method:', hasRequestDevice);
        console.log('getAvailability method:', hasGetAvailability);
        
        // Test 3: Try to get availability
        if (hasGetAvailability) {
            navigator.bluetooth.getAvailability()
                .then(available => {
                    console.log('Bluetooth adapter available:', available);
                })
                .catch(error => {
                    console.error('getAvailability failed:', error);
                });
        }
    } else {
        console.warn('❌ Web Bluetooth API not available');
        console.log('Browser:', navigator.userAgent);
        console.log('Suggested action: Enable manual dice input mode');
    }
    
    console.groupEnd();
}

// Run the test when extension loads
testBluetoothCompatibility();

// Export for manual testing
window.testBluetoothCompatibility = testBluetoothCompatibility;
