import { CameraView, CameraType, useCameraPermissions,BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function onBarcodeScanned({data}: BarcodeScanningResult) { 
    if(!scanningEnabled) return;
    try{
      Vibration.vibrate(); // vibrate when detect and scan the barcode
      setScanningEnabled(false)

      console.log(data) // 

      // Call the Flask API to fetch product data
      const response = await fetch(`http://192.168.1.238:5000/products/${data}`);
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }

      const product = await response.json();

      console.log('Product Data:', product);

      if (product.product_name && product.product_name.length > 0) {
        const productName = product.product_name[0];
        const size = product.product_name[1];
        await AsyncStorage.setItem('product_name', productName); // Save to AsyncStorage
        await AsyncStorage.setItem('size', size); // Save to AsyncStorage
        router.replace('/add_food_manual');
      }else {
      alert('Product not found in the database.');
    }


    }catch(error){
      alert("Failed to validate barcode. Please try again.");
      setScanningEnabled(true)
      
    }

    finally {
      setScanningEnabled(true); // Re-enable scanning
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={onBarcodeScanned} barcodeScannerSettings={{barcodeTypes: ['upc_a']}}>

        

        {/* Apply blur across the whole camera view */}
        <MaskedView
          style={{ flex: 1}}
          maskElement={
            
            <View style={styles.maskContainer}>
              <View style={styles.maskBackgroundTopBottom} />
              <View style={styles.maskMiddleContainer}>
                <View style={styles.maskBackgroundSide} />
                <View style={styles.clearGuide} /> 
                <View style={styles.maskBackgroundSide} />
              </View>
              <View style={styles.maskBackgroundTopBottom} />
            </View>
            
          }
        >
          <BlurView intensity={10} style={styles.blurOverlay} />

          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
          </View>

        </MaskedView>
        
        {/* Overlay for the white-bordered box */}
        <View style={styles.overlayGuideBox}>
          <View style={styles.overlayGuideBorder} />
        </View>
        
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  // Blur Overlay Style (covers entire view)
  blurOverlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
  },

  // Mask Container for MaskedView
  maskContainer: {
    flex: 1,
  },

  // Mask Background for Top and Bottom Sections
  maskBackgroundTopBottom: {
    flex: 1,
    backgroundColor: 'black', // Anything black will be blurred
    width: '100%',
  },

  // Middle Section (Contains the clear guide in the center)
  maskMiddleContainer: {
    flexDirection: 'row',
    height: 200, // Match the height of the clear guide
  },

  // Mask Background for the Sides (left and right of the clear area)
  maskBackgroundSide: {
    flex: 1,
    backgroundColor: 'black', // Anything black will be blurred
  },

  // Clear Guide: Transparent center that will be clear
  clearGuide: {
    width: 300, // Adjust the width of the guide area
    height: 200, // Adjust the height of the guide area
    backgroundColor: 'transparent', // Anything transparent will not be blurred

  },

  // Overlay for White Border (sitting on top of the camera view)
  overlayGuideBox: {
    position: 'absolute',
    top: '36.3%', // Adjust to position the white border box
    left: '11.5%', // Adjust based on the guide size
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayGuideBorder: {
    width: 300, // Same size as the guide
    height: 200, // Same size as the guide
    borderColor: 'yellow', // White border
    borderWidth: 3, // Thickness of the border
    borderRadius: 10, // Rounded corners
  },

});
