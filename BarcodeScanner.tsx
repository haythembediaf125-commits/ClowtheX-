import React, { useRef, useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, StyleSheet } from 'react-native';

const BarcodeScanner = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const videoRef = useRef(null);
    const scanBoxRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (hasPermission === true) {
            startScanning();
        }
    }, [hasPermission]);

    const startScanning = () => {
        if (videoRef.current) {
            videoRef.current.setFeature('videoResolution', '1920x1080');
            videoRef.current.setRequestFrameSRate(60);  // Setting FPS to 60
        }
    };

    const handleBarCodeScanned = ({ type, data }) => {
        if (!scanned) {
            setScanned(true);
            // Handle the scanned data
            console.log(`Scanned: ${data} of type: ${type}`);
            // Restart scanning after a delay
            setTimeout(() => setScanned(false), 1000);  // Preventing duplicate scans
        }
    };

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                ref={videoRef} // Ref for video access
                videoResolution={{ width: 1920, height: 1080 }}
                frameRate={60} // Increased FPS
                scanBoxSize={{ width: 300, height: 300 }} // Optimized scan box size
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BarcodeScanner;