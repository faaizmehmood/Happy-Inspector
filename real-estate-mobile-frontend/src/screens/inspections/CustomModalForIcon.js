import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
} from "react-native";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useImgProvider } from "../../lib/RoomImageContext";
import { IconsArr2 } from "../../constants/questionData2";
import ChevronBack from "../../../assets/images/icons/chevron-back.svg";

const CustomModalForIcon = ({ visible, onClose, updateIconId }) => {
  const navigation = useNavigation();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIcons, setSelectedIcons] = useState(null);
  const [selectedIconsId, setSelectedIconsId] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const { setIconData } = useImgProvider();
  const numColumns = IconsArr2?.length < 6 ? IconsArr2?.length : 6;
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    setFormValid(selectedIcon !== null);
  }, [selectedIcon]);

  const renderItem = ({ item }) => {
    const isSelected = item?.id === selectedIcon?.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIcon(isSelected ? null : item);
          setSelectedIcons(item?.icon);
          setSelectedIconsId(item?.id);
          // setIconData(item)
        }}
        style={[
          styles.iconContainer,
          isSelected
            ? styles.selectedIconStyle
            : { paddingHorizontal: 5, paddingVertical: "1.5%" },
          { width: screenWidth / numColumns - 8 },
        ]}
      >
        {item?.icon && item?.icon}
      </TouchableOpacity>
    );
  };

  const submit = () => {
    updateIconId(selectedIcons, selectedIconsId);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "5%",
              }}
            >
              <TouchableOpacity onPress={onClose}>
                <ChevronBack width={24} height={24} />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={onClose}>
            <Image source={require('../../../assets/images/images/Icon.png')} 
            /></TouchableOpacity> */}
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_600SemiBold",
                  fontSize: 18,
                  color: "#000929",
                  textAlign: "center",
                  marginLeft: "29%",
                }}
              >
                Select Icon
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={IconsArr2}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={renderItem}
                numColumns={numColumns}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.newInspectionButton,
                formValid && { backgroundColor: "#007BFF" },
                { marginBottom: "5%" },
              ]}
              disabled={!formValid}
              onPress={submit}
            >
              <Text style={styles.newInspectionButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>

          {/* <Button title="Close" onPress={onClose} /> */}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModalForIcon;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   justifyContent: "center",
    //   alignItems: "center",
  },
  openButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "white",
    //   justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    //   padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    height: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 20,
    textAlign: "center",
  },
  mainContainer: {
    flex: 1,
  },
  inputContainer: {
    // flex:1,
    marginTop: "10%",
    // marginBottom: '5%',
    // paddingHorizontal: '5%',
    // paddingLeft: '6%',
    // backgroundColor:'yellow',
    height: "25%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  selectedIconStyle: {
    backgroundColor: "#daeaff",
    paddingHorizontal: 5,
    paddingVertical: "1.5%",
    borderRadius: 5,
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
    ...Platform.select({
      ios: {
        marginTop: "5%",
      },
      android: {},
    }),

    // marginHorizontal: '5.5%',
  },
  newInspectionButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#DAEAFF",
    paddingTop: "3%",
    paddingBottom: "4%",
    marginBottom: "4%",
    // marginHorizontal: '5.5%',
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#007BFF",
  },
});
