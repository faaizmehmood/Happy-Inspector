import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export const Loader = () => {
  return (
    <View style={styles.outerContainer}>
      <ActivityIndicator size={45} color="#2A85FF" />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    zIndex: 1,
  },
});

export default Loader;
