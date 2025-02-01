import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Import AppContext
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const questions = [
  "What's your fitness goal?",
  "How old are you?",
  "What's your current weight?",
  "What's your target weight?",
  "Do you have any dietary restrictions?",
  "How many times a week do you exercise?",
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Track current question
  const [responses, setResponses] = useState({}); // Store responses
  const [answer, setAnswer] = useState(''); // Current answer
  const fadeAnim = useState(new Animated.Value(1))[0]; // Fade animation
  const { dispatch } = useContext(AppContext); // Access context

  const handleNext = () => {
    if (!answer.trim()) return; // Prevent empty answers

    // Update responses with the current answer
    const updatedResponses = { ...responses, [currentIndex]: answer };
    setResponses(updatedResponses);
    setAnswer(''); // Reset answer input

    if (currentIndex < questions.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => prev + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      dispatch({ type: 'SET_ONBOARDING_RESPONSES', payload: updatedResponses });
      console.log('Dispatching responses:', updatedResponses); // Debugging
      navigation.navigate('MacroSummaryScreen', { responses: updatedResponses });
    }
  };

  const handleSkip = () => {
    // Set default macros, calories, and initialize loggedFoods
    dispatch({
      type: "SET_MACROS",
      payload: {
        macros: { protein: 150, carbs: 200, fats: 50 }, // Default macros
        calories: 2000, // Default calories
      },
    });
  
    dispatch({
      type: "SET_LOGGED_FOODS",
      payload: [], // Initialize logged foods
    });
  
    // Navigate to MainScreen without route params
    navigation.navigate("MainScreen");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#E3FDFD', '#C9E9F8']} style={styles.container}>
        {/* Fade Animated View for Question */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.questionText}>{questions[currentIndex]}</Text>
        </Animated.View>

        {/* Input Box */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your answer here"
            placeholderTextColor="#A0A0A0"
            value={answer}
            onChangeText={setAnswer}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons name="arrow-forward" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Onboarding</Text>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A67CE',
    textAlign: 'left', // Align text to the left
    marginBottom: 20, // Space between the question and input box
  },
  inputWrapper: {
    flexDirection: 'row', // Align input and button horizontally
    alignItems: 'center',
    marginBottom: 40, // Space below the input
  },
  input: {
    flex: 1, // Take up remaining horizontal space
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: '#6A67CE',
    width: 70,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15, // Space between input box and button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});