import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, memo, useEffect } from "react";
import SelectDropdown from "react-native-select-dropdown";
import CheckBlueTickIcon from "../../assets/images/icons/CheckBlueTickIcon.svg";
import { Ionicons } from "@expo/vector-icons";

const SelectedDropDownComp = ({
  dropDownArray,
  screenType,
  handleDropDownButton,
  selectedDropDownItem,
}) => {
  let checkSelectedDropDownItem =
    screenType === "newPropertyDropDown"
      ? selectedDropDownItem?.value
        ? selectedDropDownItem
        : dropDownArray[0]
      : selectedDropDownItem !== null && selectedDropDownItem !== undefined
      ? selectedDropDownItem
      : dropDownArray[0];

  // console.log('checkSelectedDropDownItem', checkSelectedDropDownItem)
  // console.log('selectedDropDownItem', selectedDropDownItem)
  // console.log('dropDownArray[0]', dropDownArray[0])

  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    if (checkSelectedDropDownItem) {
      setSelectedItem(checkSelectedDropDownItem);
    }
  }, [checkSelectedDropDownItem]);

  const onSelectItem = (item) => {
    setSelectedItem(item);
    if (screenType === "newPropertyDropDown") {
      handleDropDownButton(null, item);
      return;
    }
    handleDropDownButton(item);
  };

  const renderButtonContent = (item, isOpened) => {
    const defaultText =
      screenType === "template"
        ? "All Templates"
        : item?.value
        ? item.value
        : dropDownArray[0]?.value || screenType === "templateButton"
        ? "New Inspection"
        : item?.value
        ? item.value
        : dropDownArray[0]?.value;
    return (
      <>
        <Text
          style={[
            screenType === "newPropertyDropDown"
              ? [
                  styles.selectCategoryButtonText,
                  {
                    color:
                      item?.value === "Category"
                        ? "grey"
                        : selectedItem?.value === "Category"
                        ? "grey"
                        : "#000",
                  },
                ]
              : screenType === "templateButton"
              ? styles.newInspectionButtonText
              : screenType === "dateRangeDropDown"
              ? styles.mediumLightText
              : styles.buttonText,
          ]}
        >
          {defaultText?.toString()?.length >= 20
            ? `${defaultText?.toString()?.slice(0, 20)}...`
            : defaultText}
        </Text>
        <Ionicons
          name={isOpened ? "chevron-up" : "chevron-down"}
          size={screenType === "templateButton" ? 18 : 16}
          color={screenType === "templateButton" ? "white" : "#6C727F"}
          style={{ marginTop: "2%" }}
        />
      </>
    );
  };

  const renderDropdownItem = (item, index, isSelected) => (
    <View
      style={[
        styles.dropdownItem,
        screenType === "templateButton" ||
        screenType === "propertiesDropDown" ||
        screenType === "newPropertyDropDown"
          ? {
              paddingVertical:
                screenType === "newPropertyDropDown" ? "3%" : "5%",
              paddingHorizontal: 0,
            }
          : { justifyContent: "space-between" },
      ]}
    >
      {screenType === "templateButton" ||
      screenType === "propertiesDropDown" ||
      screenType === "newPropertyDropDown" ? (
        <>
          {item?.icon && item?.icon}
          <Text style={[styles.dropdownItemText, { fontSize: 13.4 }]}>
            {item?.value?.toString()?.length >= 20
              ? `${item?.value?.toString()?.slice(0, 20)}...`
              : item?.value}
          </Text>
        </>
      ) : screenType === "dateRangeDropDown" ? (
        <>
          <Text
            style={[
              styles.dropdownItemText,
              { fontSize: 13.4, paddingVertical: 0 },
            ]}
          >
            {item?.value?.toString()?.length >= 20
              ? `${item?.value?.toString()?.slice(0, 20)}...`
              : item?.value}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.dropdownItemText,
              { paddingLeft: 0, paddingRight: 5 },
            ]}
          >
            {item?.value?.toString()?.length >= 20
              ? `${item?.value?.toString()?.slice(0, 20)}...`
              : item?.value}
          </Text>
          {(isSelected || item?.key === selectedItem?.key) && (
            <CheckBlueTickIcon />
          )}
        </>
      )}
    </View>
  );

  return (
    <SelectDropdown
      data={dropDownArray}
      defaultButtonText={dropDownArray[0]?.value}
      onSelect={onSelectItem}
      renderButton={(item, isOpened) =>
        screenType === "newPropertyDropDown" ? (
          <View style={styles.selectCategoryButton}>
            {renderButtonContent(item || selectedItem, isOpened)}
          </View>
        ) : screenType === "templateButton" ? (
          <View style={styles.newInspectionButton}>
            {renderButtonContent(
              item || screenType === "templateButton"
                ? "New Inspection"
                : selectedItem,
              isOpened
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.button}>
            {renderButtonContent(item || selectedItem, isOpened)}
          </TouchableOpacity>
        )
      }
      renderItem={(item, index, isSelected) =>
        renderDropdownItem(item, index, isSelected)
      }
      dropdownOverlayColor="transparent"
      dropdownStyle={
        screenType === "templateButton"
          ? styles.templateButtonDropdownContainer
          : screenType === "dateRangeDropDown"
          ? styles.dateRangeDropDown
          : screenType === "propertiesDropDown"
          ? styles.propertyDropDownContainer
          : styles.dropdownContainer
      }
    />
  );
};

export default memo(SelectedDropDownComp);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginHorizontal: 4,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#000929",
  },
  mediumLightText: {
    // flex: 1,
    marginHorizontal: 4,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#6C727F",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 0,
    marginLeft: "5%",
    borderBottomWidth: 1,
    borderBottomColor: "#CCE2FF",
  },
  dropdownItemText: {
    textAlignVertical: "center",
    fontSize: 14,
    paddingLeft: "5%",
    paddingVertical: "1%",
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#4D5369",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#eee",
      },
      android: {
        elevation: 10,
      },
    }),
    // elevation: 10,
    borderRadius: 10,
    marginTop: Platform.OS == "android" ? "-10%" : "2%",
    marginLeft: "1%",
    paddingTop: "1%",
    paddingLeft: "1%",
    padding: "4%",
  },
  propertyDropDownContainer: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#eee",
        marginTop: "2%",
      },
      android: {
        elevation: 10,
        marginTop: "-6%",
      },
    }),
    borderRadius: 10,
    paddingTop: "1%",
    paddingLeft: "1%",
    padding: "4%",
  },
  dateRangeDropDown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginLeft: "-0.1%",
    paddingTop: "1%",
    paddingLeft: "1%",
    padding: "4%",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#eee",
        marginTop: "2%",
      },
      android: {
        elevation: 10,
        marginTop: "-10%",
      },
    }),
  },
  templateButtonDropdownContainer: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#eee",
        marginTop: "2%",
      },
      android: {
        elevation: 10,
        marginTop: "-10%",
      },
    }),
    borderRadius: 10,
    paddingRight: "2%",
    paddingBottom: "4%",
    width: "60%",
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: "6%",
    paddingHorizontal: "5%",
    marginRight: "5%",
    width: "100%",
  },
  newInspectionButtonText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
    marginRight: 8,
  },
  selectCategoryButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F3F8FF",
    borderWidth: 2,
    padding: "3%",
    borderColor: "#DAEAFF",
  },
  selectCategoryButtonText: {
    fontSize: 14.5,
    fontFamily: "PlusJakartaSans_500Medium",
    marginRight: 3,
  },
});
