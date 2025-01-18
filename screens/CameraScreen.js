import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  // Just to confirm that Camera is indeed an object with "Name: Camera"
  console.log('Camera import:', Camera);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      const options = { base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log('Captured Photo Base64:', photo.base64?.slice(0, 50) + '...');

      // Example fetch
      const response = await fetch('http://192.168.1.168:3001/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: photo.base64 }),
      });

      const data = await response.json();
      console.log('Labels from Backend:', data.labels);

      if (data.labels) {
        Alert.alert('Labels Detected', data.labels.join(', '));
      } else {
        Alert.alert('No labels detected', 'Vision API did not return any results.');
      }
    } catch (error) {
      console.error('Error sending photo to backend:', error);
      Alert.alert('Error', 'Failed to send photo to backend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.messageContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.messageContainer}>
        <Text>No access to camera. Please enable it in your device settings.</Text>
      </View>
    );
  }

  // Render the camera if permission is granted
  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.camera} ref={cameraRef} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <Button title="Take Photo" onPress={takePhoto} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
