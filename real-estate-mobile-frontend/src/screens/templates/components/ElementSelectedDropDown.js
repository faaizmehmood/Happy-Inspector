import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Feather } from "@expo/vector-icons";

const ElementSelectedDropDown = ({
  goBackTo,
  buttonStatusDetails,
  navigationData,
  disabled,
}) => {
  const navigation = useNavigation();
  const { templateId, roomID, elementsArr } = navigationData;
  return (
    <>
      {elementsArr?.length > 0 && (
        <SelectDropdown
          disabled={disabled}
          data={buttonStatusDetails}
          defaultButtonText={buttonStatusDetails[0]?.name}
          onSelect={(selectedItem, index) => {
            if (selectedItem?.name === "Delete Elements") {
              navigation.navigate("DeleteElementTemplate", {
                goBackTo,
                templateId,
                roomID,
                elementsArr,
              });
            } else {
              navigation.navigate("RearrangeElementsTemplate", {
                templateId,
                roomID,
                elementsArr,
              });
            }
          }}
          renderButton={(selectedItem, index) => {
            return (
              <View style={styles.dropdownButton}>
                <Feather
                  name="more-vertical"
                  size={20}
                  color={disabled ? "lightgrey" : "black"}
                />
              </View>
            );
          }}
          renderItem={(item, index) => {
            return (
              <View style={styles.dropdownRow}>
                {item?.icon && (
                  <Image
                    source={item?.icon}
                    resizeMode="center"
                    style={{ height: 20, width: 23 }}
                  />
                )}
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>{item?.name}</Text>
                </View>
              </View>
            );
          }}
          dropdownOverlayColor="transparent"
          dropdownStyle={styles.dropdownStyle}
        />
      )}
    </>
  );
};

export default memo(ElementSelectedDropDown);

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  dropdownButton: {
    paddingHorizontal: "1.5%",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    overflow: "hidden",
    paddingVertical: 12,
  },
  dropdownItem: {
    paddingLeft: "8%",
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#4D5369",
  },
  dropdownStyle: {
    width: 200,
    marginLeft: width > 365 ? "-45%" : "-48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingBottom: "2%",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#eee",
        marginTop: "2%",
      },
      android: {
        marginTop: "-5.5%",
      },
    }),
  },
});
