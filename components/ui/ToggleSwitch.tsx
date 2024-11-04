import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

interface ToggleSwitchProps {
  currentOption: number;
  onToggle: (option: number) => void;
  options: string[];
}

const ToggleSwitch = ({
  currentOption,
  onToggle,
  options,
}: ToggleSwitchProps) => {
  const screenWidth = Dimensions.get("window").width;
  const toggleWidth = (2 / 3) * screenWidth;
  return (
    <View style={[styles.container, { width: toggleWidth }]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            currentOption === index && styles.selectedOption,
          ]}
          onPress={() => onToggle(index)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  option: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#383838",
  },
  selectedOption: {
    backgroundColor: "gray",
  },
  optionText: {
    color: "#ffffff",
  },
});

export default ToggleSwitch;
