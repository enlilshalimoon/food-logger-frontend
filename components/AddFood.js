import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../services/apiService";

export default function AddFood({ theme, onAddFood }) {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [manualFoodInput, setManualFoodInput] = useState("");

  const handleManualFoodSubmit = async () => {
    if (manualFoodInput.trim()) {
      try {
        const response = await apiService.getMacrosFromText(manualFoodInput);
        if (response && response.success) {
          onAddFood(response.data); // Send food data to MainScreen
        }
      } catch (error) {
        console.error("Error calculating macros:", error);
      } finally {
        setIsAddingFood(false);
        setManualFoodInput("");
      }
    }
  };

  return (
    <View>
      {!isAddingFood && (
        <TouchableOpacity
          style={[styles.addFoodButton, { backgroundColor: theme.primary }]}
          onPress={() => setIsAddingFood(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addFoodButtonText}>Add Food</Text>
        </TouchableOpacity>
      )}
      {isAddingFood && (
        <View style={styles.expandedCard}>
          <Text style={[styles.expandedCardText, { color: theme.text }]}>
            Tell us what you had (e.g., I had a sandwich with cheese)
          </Text>
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            placeholderTextColor="#999"
            value={manualFoodInput}
            onChangeText={setManualFoodInput}
            onSubmitEditing={handleManualFoodSubmit}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  addFoodButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  expandedCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  expandedCardText: {
    fontSize: 14,
    marginBottom: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
});