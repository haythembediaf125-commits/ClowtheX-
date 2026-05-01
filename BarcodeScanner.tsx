import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Vibration.vibrate(200);
    Alert.alert('✅ تم المسح', `البيانات: ${data}`, [
      { text: 'موافق', onPress: () => setScanned(false) }
    ]);
  };

  if (hasPermission === null) return <View style={styles.container}><Text>طلب الإذن...</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text>لا يوجد إذن للكاميرا</Text><Button title="إعادة المحاولة" onPress={async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }} /></View>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.helpText}>وجه الكاميرا نحو رمز QR مع إضاءة كافية</Text>
        {scanned && <Button title="مسح مجدداً" onPress={() => setScanned(false)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  scanArea: { width: 250, height: 250, borderWidth: 3, borderColor: '#00FF00', borderRadius: 20, marginBottom: 30 },
  helpText: { color: 'white', fontSize: 16, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 10, marginHorizontal: 20, marginBottom: 20 },
});