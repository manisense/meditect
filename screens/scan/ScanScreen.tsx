import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { Camera, CameraType, requestCameraPermissionsAsync } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scanFrameSize = Math.min(width, height) * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  topBarContainer: {
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  topBarButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: scanFrameSize,
    height: scanFrameSize,
    borderRadius: 16,
    borderWidth: 0,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderTopRightRadius: 16,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderBottomRightRadius: 16,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 24,
    textAlign: 'center',
  },
  bottomBarContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scanningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
  },
  previewContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  previewLoader: {
    position: 'absolute',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9F9F9',
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#246BFD',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const ScanScreen = () => {
  const [type, setType] = useState<'front' | 'back'>('back');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestCameraPermission = async () => {
    try {
      const { status } = await requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleCameraCapture = async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      setCapturedImage(photo.uri);
      // TODO: Add logic to process the captured image
      setTimeout(() => {
        setIsScanning(false);
        setCapturedImage(null);
      }, 3000);
    } catch (error) {
      console.error('Error capturing image:', error);
      setIsScanning(false);
      alert('Failed to capture image. Please try again.');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#246BFD" /></View>;
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#666" />
        <Text style={styles.permissionText}>Camera permission is required to scan medicines</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={isFlashOn ? 'torch' : 'off'}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.topBarContainer}>
            <View style={styles.topBar}>
              <Text style={styles.headerText}>Scan Medicine</Text>
              <View style={styles.topBarButtons}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setIsFlashOn(!isFlashOn)}
                >
                  <Ionicons 
                    name={isFlashOn ? "flash" : "flash-off"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => {
                    setType(type === 'back' ? 'front' : 'back');
                  }}
                >
                  <Ionicons name="camera-reverse" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
          
          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            {!isScanning && (
              <Text style={styles.instructionText}>
                Position medicine label within the frame
              </Text>
            )}
          </View>
          
          <SafeAreaView style={styles.bottomBarContainer}>
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.scanningText}>Analyzing...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={handleCameraCapture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </View>
      </Camera>
      
      {capturedImage && (
        <View style={[StyleSheet.absoluteFill, styles.previewContainer]}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <ActivityIndicator size="large" color="#246BFD" style={styles.previewLoader} />
        </View>
      )}
    </View>
  );
};

export default ScanScreen;
