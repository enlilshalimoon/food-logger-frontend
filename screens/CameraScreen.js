import React, { useRef, useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";


export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const compressPhoto = async (photoUri) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
          photoUri,
          [{ resize: { width: 800 } }], // Resize to 800px width
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
  };
  
  const takePhoto = async () => {
      if (!cameraRef.current) return;
  
      setIsLoading(true);
      try {
          const photo = await cameraRef.current.takePictureAsync();
          const compressedPhotoUri = await compressPhoto(photo.uri);
  
          const formData = new FormData();
          formData.append("photo", {
              uri: compressedPhotoUri,
              type: "image/jpeg",
              name: "photo.jpg",
          });
  
          const response = await fetch("http://192.168.1.38:3000/api/vision", {
              method: "POST",
              body: formData,
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });
  
          const result = await response.json();
          Alert.alert("Analysis Result", result.analysis || "No data returned.");
      } catch (error) {
          console.error("Error taking photo or sending to backend:", error);
          Alert.alert("Error", "Failed to process the photo.");
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
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
