import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateMacros } from '../services/apiService'; // Import service function
import { AppContext } from '../context/AppContext'; // Import AppContext

export default function MacroSummaryScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext); // Access global state and dispatch
  const { onboardingResponses } = state; // Extract responses from context
  const [macros, setMacros] = useState(null); // Store macros data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    console.log('Received onboarding responses from context:', onboardingResponses);

    if (!onboardingResponses || Object.keys(onboardingResponses).length === 0) {
      console.error('No onboarding responses found in context');
      setMacros({ error: 'No onboarding responses found. Please restart the onboarding process.' });
      setLoading(false);
      return;
    }

    const fetchMacros = async () => {
      try {
        const data = await calculateMacros(onboardingResponses); // Use centralized service
        setMacros(data); // Save macros data

        // Dispatch macros to global context for future use
        dispatch({ type: 'SET_MACROS', payload: data });
        console.log(state.macros)
      } catch (error) {
        console.error('Error fetching macros:', error.response?.data || error.message);
        setMacros({ error: 'Failed to calculate macros. Please try again.' });
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchMacros();
  }, [onboardingResponses, dispatch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A67CE" />
        <Text style={styles.loadingText}>Calculating your macros...</Text>
      </View>
    );
  }

  if (macros?.error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{macros.error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#E3FDFD', '#C9E9F8']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Your Macro Summary</Text>
        <Text style={styles.value}>Calories: {macros.calories} kcal</Text>
        <Text style={styles.value}>Protein: {macros.macros.protein} g</Text>
        <Text style={styles.value}>Carbs: {macros.macros.carbs} g</Text>
        <Text style={styles.value}>Fats: {macros.macros.fats} g</Text>
      </View>

      <TouchableOpacity
      style={styles.acceptButton}
      onPress={() =>
        navigation.navigate('MainScreen', {
          newFood: {
            name: 'Onboarding Macros', // You can use a placeholder name
            calories: macros.calories,
            macros: macros.macros,
          },
        })
      }
    >
      <Text style={styles.acceptText}>Accept</Text>
    </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A67CE',
    textAlign: 'center',
    marginBottom: 20,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  acceptButton: {
    marginTop: 30,
    backgroundColor: '#6A67CE',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});