import React, { memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  Platform,
} from "react-native";
import ChevronBack from "../../assets/images/icons/chevron-back.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import SelectDropdown from "react-native-select-dropdown";
import QuestionTickIcon from "../../assets/images/icons/QuestionTickIcon.svg";
import QuestionCrossIcon from "../../assets/images/icons/QuestionCrossIcon.svg";

function CustomHeader({
  disabled,
  title,
  goBack,
  rightDropDown,
  editRoomName,
  style,
  showMoreIconArray,
  showMoreIcon,
  onPress,
  onGotoNext,
}) {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState(
    editRoomName?.length > 0 ? title : ""
  );
  const [showRoomInputBox, setShowRoomInputBox] = useState(false);

  const buttonStatusDetails = [
    {
      name: "Rearrange Rooms",
      icon: require("../../assets/images/icons/rearrangeRoom.webp"),
    },
    {
      name: "Delete Rooms",
      icon: require("../../assets/images/icons/deleteRoom.webp"),
    },
  ];

  return (
    <SafeAreaView>
      <View
        style={[
          styles.headerContainer,
          style,
          rightDropDown && { marginRight: "5%" },
        ]}
      >
        {goBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={24} height={24} />
          </TouchableOpacity>
        )}

        {!editRoomName && title ? (
          <View
            style={[
              styles.textContainer,
              showMoreIcon && { paddingLeft: "4%" },
              rightDropDown && { alignItems: "flex-start" },
            ]}
          >
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {showRoomInputBox ? (
              <View style={styles.inputContainer}>
                <TextInput
                  value={roomName}
                  onChangeText={(text) => setRoomName(text)}
                  style={styles.searchInput}
                  placeholder="Room Name"
                  placeholderTextColor="#9f9fa1"
                />
                {roomName?.length >= 3 && (
                  <TouchableOpacity
                    style={{ marginRight: "3%" }}
                    onPress={() => {
                      setShowRoomInputBox(false);
                      onPress(roomName?.trim());
                    }}
                  >
                    <QuestionTickIcon />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setRoomName(roomName ? roomName : title);
                    setShowRoomInputBox(false);
                  }}
                >
                  <QuestionCrossIcon />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.textContainer,
                  showMoreIcon && { paddingLeft: "4%" },
                  rightDropDown && { alignItems: "flex-start" },
                ]}
              >
                <Text style={styles.headerTitle}>{roomName}</Text>
              </View>
            )}
          </View>
        )}

        {rightDropDown && (
          <TouchableOpacity style={styles.textIconContainer}>
            <Text style={styles.iconText}>FR</Text>
            <Ionicons
              name={"chevron-down"}
              size={18}
              color="#000929"
              style={{ marginTop: "5%", paddingLeft: "2%" }}
            />
          </TouchableOpacity>
        )}

        {showMoreIcon && (
          <View style={{ marginTop: "2%" }}>
            <SelectDropdown
              disabled={disabled}
              data={
                showMoreIconArray?.length > 0
                  ? showMoreIconArray
                  : buttonStatusDetails
              }
              defaultButtonText={
                showMoreIconArray?.length > 0
                  ? showMoreIconArray[0].name
                  : buttonStatusDetails[0].name
              }
              onSelect={(selectedItem, index) => {
                if (selectedItem?.name === "Delete Rooms") {
                  onPress();
                } else {
                  onGotoNext();
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
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </View>
                  </View>
                );
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
        )}

        {editRoomName && editRoomName?.length && (
          <View style={{ marginTop: "2%" }}>
            <SelectDropdown
              disabled={disabled}
              data={editRoomName}
              defaultButtonText={editRoomName[0]?.name}
              onSelect={(selectedItem, index) => {
                if (selectedItem?.name === "Edit Room Name") {
                  setShowRoomInputBox(true);
                  // onPress(true);
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
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </View>
                  </View>
                );
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: "4%",
    paddingBottom: "1.5%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 18,
    color: "#000929",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DAEAFF",
    paddingHorizontal: "3%",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 0,
    paddingRight: 8,
    height: 40,
    padding: 5,
    color: "#000",
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15,
  },
  textContainer: {
    flex: 1,
    paddingRight: "6%",
    justifyContent: "center",
    alignItems: "center",
  },
  textIconContainer: {
    borderWidth: 2,
    padding: "1.5%",
    borderColor: "#CCE2FF",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
  },
  iconText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15,
    color: "#ffff",
    padding: "1.7%",
    paddingHorizontal: "2.2%",
    borderRadius: 25,
    backgroundColor: "#007BFF",
    textAlign: "center",
  },
  dropdownButton: {
    paddingHorizontal: 12,
    marginRight: "2%",
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
    marginLeft: width > 365 ? "-42%" : "-45%",
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

export default memo(CustomHeader);
