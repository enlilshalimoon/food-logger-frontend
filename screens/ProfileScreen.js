import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.toggleRow}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={theme.mode === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme.primary}
          trackColor={{ false: "#ddd", true: theme.primary }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
});