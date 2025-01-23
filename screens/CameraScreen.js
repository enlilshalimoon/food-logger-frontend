import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import CameraOverlay from '../components/CameraOverlay';
import CaptureButton from '../components/CaptureButton';
import { sendPhotoToBackend } from '../services/apiService';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [caloriesLeft, setCaloriesLeft] = useState(2000); // Placeholder
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      const result = await sendPhotoToBackend(photo.uri);

      const calories = result.calories || 0; // Adjust based on backend
      setCaloriesLeft((prev) => prev - calories);
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) return null;

  if (hasPermission === false)
    return <View><Text>No access to camera</Text></View>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <CameraOverlay caloriesLeft={caloriesLeft} />
        <CaptureButton isLoading={isLoading} onCapture={handleCapture} />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
});