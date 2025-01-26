import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function MainScreen({ navigation, route }) {
  const { state, dispatch } = useContext(AppContext);
  const { macros, caloriesLeft } = state;

  // If the Logging Screen or other flow returns a newly logged food,
  // we can capture it from `route.params`.
  // (Alternatively, you could store logged foods in context, too.)
  const [loggedFoods, setLoggedFoods] = useState([]);

  // On mount or whenever route params change, check if new food was passed
// Effect to handle new food logging
useEffect(() => {
  console.log("New food received in MainScreen:", route.params?.newFood);

  if (route.params?.newFood) {
    const { name, calories, macros } = route.params.newFood;

    // Check if this is not onboarding data to avoid logging it as a food item
    if (name !== "Onboarding Macros") {
      // Update logged foods
      setLoggedFoods((prev) => [...prev, { name, calories }]);

      // Dispatch action to update macros and calories in context
      if (dispatch) {
        dispatch({
          type: "UPDATE_MACROS",
          payload: {
            foodCalories: calories,
            foodMacros: macros,
          },
        });
      }
    }
  }
}, [route.params?.newFood, dispatch]);

// Effect to track changes in macros (for debugging or additional logic)
useEffect(() => {
  console.log("Updated macros in MainScreen:", macros);

  // Add any other logic if needed to react to changes in `macros`
}, [macros]);

  return (
    <LinearGradient colors={['#E3FDFD', '#C9E9F8']} style={styles.container}>

      {/* Big "Calories Left" in top-left */}
      <View style={styles.header}>
        <Text style={styles.caloriesLeftLabel}>Calories Left</Text>
        <Text style={styles.caloriesLeftValue}>
          {caloriesLeft ?? macros?.calories ?? 0}
        </Text>
      </View>

      {/* Middle Card: Display foods logged (or other info) */}
      <View style={styles.middleCard}>
        <Text style={styles.cardTitle}>Food Logged</Text>
        {loggedFoods.length === 0 ? (
          <Text style={styles.placeholderText}>
            No foods logged yet.
          </Text>
        ) : (
          <ScrollView style={{ maxHeight: 200 }}>
            {loggedFoods.map((food, index) => (
              <Text key={index} style={styles.loggedFoodText}>
                • {food.name || 'Unknown'} - {food.calories} cal
              </Text>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Optionally show macros (if you'd like) */}
      {macros && (
        <View style={styles.macrosCard}>
          <Text style={styles.macrosTitle}>Your Macros</Text>
          <Text style={styles.macrosText}>Protein: {macros.protein || 0}g</Text>
          <Text style={styles.macrosText}>Carbs: {macros.carbs || 0}g</Text>
          <Text style={styles.macrosText}>Fats: {macros.fats || 0}g</Text>
        </View>
      )}

      {/* Footer / "Log Food" button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logFoodButton}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.logFoodButtonText}> Log Food</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  caloriesLeftLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6A67CE',
  },
  caloriesLeftValue: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  middleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A67CE',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
  },
  loggedFoodText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  macrosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A67CE',
    marginBottom: 10,
  },
  macrosText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
    alignItems: 'center',
  },
  logFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A67CE',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  logFoodButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
  },
});