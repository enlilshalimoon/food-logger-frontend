import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import { ThemeContext } from "../context/ThemeContext";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { getMacrosFromText } from "../services/apiService";

export default function MainScreen({ navigation, route }) {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  const { macros, caloriesLeft } = state;

  const [loggedFoods, setLoggedFoods] = useState([]);
  const [manualFoodInput, setManualFoodInput] = useState("");
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track API loading state

  // Handle new food logging from route params
  useEffect(() => {
    if (route.params?.newFood) {
      const { name, calories, macros } = route.params.newFood;

      if (name !== "Onboarding Macros") {
        addFood({ name, calories, macros });
      }
    }
  }, [route.params?.newFood]);

  // Add food to logged foods and update macros
  const addFood = ({ name, calories, macros }) => {
    setLoggedFoods((prev) => [...prev, { name, calories, macros }]);
    dispatch({
      type: "UPDATE_MACROS",
      payload: { foodCalories: calories, foodMacros: macros },
    });
  };

  // Handle removing food
  const handleRemoveFood = (index) => {
    const removedFood = loggedFoods[index];
    setLoggedFoods((prev) => prev.filter((_, i) => i !== index));

    dispatch({
      type: "UPDATE_MACROS",
      payload: {
        foodCalories: -removedFood.calories,
        foodMacros: {
          protein: -removedFood.macros.protein,
          carbs: -removedFood.macros.carbs,
          fats: -removedFood.macros.fats,
        },
      },
    });
  };

  // Handle manual food submission
  const handleManualFoodSubmit = async () => {
    const trimmedInput = manualFoodInput.trim();

    if (!trimmedInput || isLoading) return;

    setIsLoading(true); // Start loading

    try {
      // Call API to get macros from text
      const response = await getMacrosFromText(trimmedInput);

      if (response && Array.isArray(response)) {
        response.forEach((item) => {
          if (item.name && item.calories !== undefined && item.macros) {
            addFood({
              name: item.name,
              calories: item.calories,
              macros: item.macros,
            });
          } else {
            console.warn("⚠️ Skipping invalid item:", item);
          }
        });
      } else {
        console.error("❌ Error: Invalid response format from backend.", response);
      }
    } catch (error) {
      console.error("🔥 Error logging food:", error);
    } finally {
      setIsLoading(false); // Stop loading
      setManualFoodInput("");
      setIsAddingFood(false);
    }
  };

  // Render swipe-to-delete action
  const renderRightActions = (index) => (
    <TouchableOpacity
      style={[styles.deleteButton, { backgroundColor: theme.primary }]}
      onPress={() => handleRemoveFood(index)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  // Render "Add Food" input
  const renderAddFoodInput = () => (
    <View style={styles.manualFoodEntry}>
      <TextInput
        style={[styles.textInput, { color: theme.text }]}
        placeholder="Enter food description (e.g., sandwich with cheese)"
        placeholderTextColor="#999"
        value={isLoading ? "Loading..." : manualFoodInput} // Show "Loading..." during API call
        onChangeText={setManualFoodInput}
        multiline={true}  // Enables multiline input
        textAlignVertical="top"  // Ensures text starts at the top
        editable={!isLoading} // Disable typing while loading
      />
      <TouchableOpacity
        style={[styles.enterButton, { backgroundColor: theme.primary }]}
        onPress={handleManualFoodSubmit}
        disabled={isLoading} // Disable button while loading
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.enterButtonText}>
          {isLoading ? "Processing..." : "Enter"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.container}>
      {/* Top Row: Menu on Left, Profile on Right */}
      <View style={styles.headerTopRow}>
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log("Menu pressed")}>
          <Ionicons name="menu" size={28} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("ProfileScreen")}>
          <Ionicons name="person-circle-outline" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Second Row: Calories on Left, Macros on Right */}
      <View style={styles.headerSecondRow}>
        <View style={styles.caloriesContainer}>
          <Text style={[styles.caloriesLeftLabel, { color: theme.primary }]}>Calories Left</Text>
          <Text style={[styles.caloriesLeftValue, { color: theme.text }]}>
            {caloriesLeft ?? macros?.calories ?? 0}
          </Text>
        </View>
        <View style={styles.macrosContainer}>
          <Text style={[styles.macrosTitle, { color: theme.primary }]}>Your Macros</Text>
          <Text style={[styles.macrosText, { color: theme.text }]}>Protein: {macros.protein || 0}g</Text>
          <Text style={[styles.macrosText, { color: theme.text }]}>Carbs: {macros.carbs || 0}g</Text>
          <Text style={[styles.macrosText, { color: theme.text }]}>Fats: {macros.fats || 0}g</Text>
        </View>
      </View>

      {/* Food Logged Section */}
      <View style={styles.loggedFoodsSection}>
        <Text style={[styles.loggedFoodsTitle, { color: theme.primary }]}>Logged Foods</Text>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {loggedFoods.map((food, index) => (
            <Swipeable key={index} renderRightActions={() => renderRightActions(index)}>
              <View style={styles.foodRow}>
                <Text style={[styles.foodName, { color: theme.text }]}>{food.name}</Text>
                <Text style={[styles.foodCalories, { color: theme.text }]}>{food.calories} cal</Text>
              </View>
            </Swipeable>
          ))}

          {/* Add Food Button (Moves with List) */}
          {isAddingFood ? (
            renderAddFoodInput()
          ) : (
            <TouchableOpacity
              style={[styles.addFoodButton, { backgroundColor: theme.primary, marginTop: 20 }]}
              onPress={() => setIsAddingFood(true)}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.addFoodButtonText}>Add Food</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Restore Camera Button at the Bottom Center */}
        <TouchableOpacity
          style={[styles.cameraButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Ionicons name="camera" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },
  headerSecondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  caloriesContainer: {},
  macrosContainer: {
    alignItems: "flex-end",
  },
  caloriesLeftLabel: {
    fontSize: 22,
    fontWeight: "bold",
  },
  caloriesLeftValue: {
    fontSize: 34,
    fontWeight: "bold",
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  macrosText: {
    fontSize: 14,
  },
  loggedFoodsSection: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 20, // Adds spacing so the button doesn’t stick to the last item
  },
  loggedFoodsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  foodName: {
    fontSize: 16,
  },
  foodCalories: {
    fontSize: 16,
  },
  manualFoodEntry: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    fontSize: 16,
  },
  enterButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  enterButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#fff",
  },
  addFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  cameraButton: {
    position: "absolute",
    bottom: 80, // Adjust to position correctly above the Add Food button
    alignSelf: "center",
    padding: 15,
    borderRadius: 50,
    elevation: 5, // Shadow effect for iOS/Android
  },
  addFoodButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },
});