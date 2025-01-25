import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoggingScreen({ route, navigation }) {
  const { loading, name, calories, macros } = route.params || {};

  // Handle Log button
  const handleLog = () => {
    if (!calories) {
      Alert.alert("Error", "No food data to log.");
      return;
    }

    const updatedCaloriesLeft = 2000 - calories; // Replace 2000 with your dynamic value
    navigation.navigate('MainScreen', { caloriesLeft: updatedCaloriesLeft });
  };

  return (
    <LinearGradient colors={['#E3FDFD', '#C9E9F8']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Log Food</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Analyzing Food...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.details}>Name: {name}</Text>
          <Text style={styles.details}>Calories: {calories}</Text>
          <Text style={styles.details}>Carbs: {macros?.carbs}g</Text>
          <Text style={styles.details}>Protein: {macros?.protein}g</Text>
          <Text style={styles.details}>Fats: {macros?.fats}g</Text>
          <TouchableOpacity style={styles.logButton} onPress={handleLog}>
            <Text style={styles.logButtonText}>Log Food</Text>
          </TouchableOpacity>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  logButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});