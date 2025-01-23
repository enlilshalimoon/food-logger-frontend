import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CaptureButton({ isLoading, onCapture }) {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onCapture}>
          <Ionicons name="camera" size={40} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});