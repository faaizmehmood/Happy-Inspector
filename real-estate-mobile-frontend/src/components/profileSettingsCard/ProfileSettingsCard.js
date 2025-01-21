import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CardIcon from "../../../assets/images/icons/chevron-right.svg";

export const ProfileSettingsCard = ({ title, screenPath, navigation, userData }) => {


  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate(screenPath, userData)}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <CardIcon style={styles.cardIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#F3F8FF",
    borderWidth: 1,
    borderColor: "#CCE2FF",
    paddingHorizontal: 16,
    paddingVertical: 13.5,
    borderRadius: 8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#000929",
  },
  cardIcon: {
    width: 20,
    height: 20,
  },
});

export default ProfileSettingsCard;
