import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // طلب الإذن عند تحميل الشاشة
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // عند مسح الكود
  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return; // منع تكرار المسح

    setScanned(true);
    Vibration.vibrate(200); // اهتزاز للتأكيد

    // هنا تضع الإجراء المطلوب عند نجاح المسح
    Alert.alert('✅ تم المسح', `تم قراءة الكود: ${data}`, [
      { text: 'موافق', onPress: () => setScanned(false) }
    ]);

    console.log(`Scanned: ${data}, type: ${type}`);
  };

  // حالة انتظار الإذن
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>جاري طلب إذن الكاميرا...</Text>
      </View>
    );
  }
  // حالة رفض الإذن
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>لا يوجد إذن للكاميرا</Text>
        <Button title="إعادة المحاولة" onPress={async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        }} />
      </View>
    );
  }

  // عرض الكاميرا مع منطقة مسح مرجعية
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        // تحديد نوع الرمز فقط QR لزيادة الدقة
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      {/* مساعدة المستخدم: إطار أخضر في المنتصف */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.helpText}>وجه الكاميرا نحو رمز QR مع إضاءة كافية</Text>
        {scanned && <Button title="مسح مجدداً" onPress={() => setScanned(false)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginBottom: 30,
  },
  helpText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});