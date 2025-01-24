import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Use this for Expo projects
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen({ navigation }) {
  return (
    <LinearGradient colors={['#E3FDFD', '#C9E9F8']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Your App</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Calorie Counter */}
      <View style={styles.calorieCounter}>
        <Text style={styles.caloriesText}>2000 cal left</Text>
      </View>

      {/* Camera Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Ionicons name="camera" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  calorieCounter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});