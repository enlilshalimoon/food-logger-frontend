import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CameraOverlay({ caloriesLeft }) {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.caloriesText}>{caloriesLeft} calories left</Text>
      <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person-circle" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuButton: {
    flex: 1,
  },
  profileButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  caloriesText: {
    flex: 2,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});