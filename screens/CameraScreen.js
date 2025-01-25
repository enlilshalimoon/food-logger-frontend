import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import CameraOverlay from '../components/CameraOverlay';
import CaptureButton from '../components/CaptureButton';
import { sendPhotoToBackend } from '../services/apiService';
import * as FileSystem from 'expo-file-system';



export default function CameraScreen({ navigation }) {
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
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Captured photo URI:", photo.uri);

      // Navigate to LoggingScreen with a loading state
      navigation.navigate('LoggingScreen', {
        loading: true,
      });

      // Send photo to the backend
      const result = await sendPhotoToBackend(photo.uri);
      console.log("Backend response:", result);

      // Navigate back to LoggingScreen with the backend response
      navigation.navigate('LoggingScreen', {
        loading: false,
        name: result.name,
        calories: result.calories,
        macros: result.macros,
      });
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", error.message || "Failed to process the photo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) return null;

  if (hasPermission === false)
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );

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