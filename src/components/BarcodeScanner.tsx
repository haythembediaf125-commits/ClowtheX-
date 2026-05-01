// Import necessary libraries
import React, { useEffect, useRef, useState } from 'react';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const scanBoxDimensions = { width: 300, height: 200 }; // optimized for faster detection

  useEffect(() => {
    const startScanning = () => {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, frameRate: 60 } })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setScanning(true);
        });
    };
    startScanning();

    return () => {
      // cleanup
      if (videoRef.current) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Debouncing function to prevent duplicate scans
  const debouncedScan = (() => {
    let timeout;
    return () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        // scan logic here
      }, 300);
    };
  })();

  return (
    <div>
      <video ref={videoRef} width="640" height="480" style={{ border: '2px solid green' }} />
      <div style={{ width: scanBoxDimensions.width, height: scanBoxDimensions.height, border: '2px dashed red' }} />
    </div>
  );
};

export default BarcodeScanner;