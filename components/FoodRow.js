import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function FoodRow({
  food,
  index,
  theme,
  onDelete,
  onAdjust,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [adjustmentText, setAdjustmentText] = useState("");

  return (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.primary }]}
          onPress={() => onDelete(index)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    >
      <View style={styles.foodRow}>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={[styles.foodName, { color: theme.text }]}>{food.name}</Text>
          <Text style={[styles.foodCalories, { color: theme.text }]}>
            {food.calories} cal
          </Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedCard}>
            <Text style={[styles.expandedCardText, { color: theme.text }]}>
              Adjust your food (e.g., I only ate half the sandwich)
            </Text>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholderTextColor="#999"
              value={adjustmentText}
              onChangeText={setAdjustmentText}
              onSubmitEditing={() => {
                onAdjust(index, adjustmentText);
                setAdjustmentText("");
                setIsExpanded(false);
              }}
            />
          </View>
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },
  foodName: {
    fontSize: 16,
  },
  foodCalories: {
    fontSize: 16,
  },
});