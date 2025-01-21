import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useCallback, useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import ElementSelectedDropDown from "../../../components/ElementSelectedDropDown";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomRadioButtons from "../../../components/CustomRadioButtons";
import { Feather, Ionicons } from "@expo/vector-icons";
import CheckListDeleteIcon from "../../../../assets/images/icons/CheckListDeleteIcon.svg";
import * as ImagePicker from "expo-image-picker";
import CrossIcon from "../../../../assets/images/icons/CrossIcon.svg";
import { useLoader } from "../../../lib/loaderContext";
import ImageIcon from "../../../../assets/images/icons/uploadWhiteIcon.svg";
import {
  BrushIcon,
  ExclamationIcon,
  MayBeIcon,
  NoIcon,
  YesIcon,
} from "../../../svg/checkListQuestionSvg";
import { Icon } from "react-native-paper";
// import YesIcon from '../../../../assets/images/icons/CheckListYesIcon.svg'
import Entypo from "@expo/vector-icons/Entypo";
import SelectDropdown from "react-native-select-dropdown";
import CustomOptionSelectionTemplate from "./CustomOptionSelectionTemplate";
import CustomCheckBox from "../../../components/CustomCheckBox";
// import { useImgProvider } from '../../../lib/RoomImageContext'
// const { iconData, setIconData } = useImgProvider();

// let navigationData = {}
// let templateId = null;
// let roomID = null;
// let specificElementData = null;

const CreateElementTemplate = ({
  handleElementData,
  elementImg,
  elementData,
  templateId,
  roomID,
  questionArray,
  elementIndex,
  saveQuestionArray,
  onPressSelectAnswer,
}) => {
  const checkList = elementData?.checklist;
  const elementId = elementData?._id;
  // const elementId=elementData
  // console.log(checkList);

  const navigation = useNavigation();
  const route = useRoute();
  const { setLoading } = useLoader();
  const [selectedCheckBoxForImages, setSelectedCheckBoxForImages] = useState(
    elementData?.imageRequired
      ? elementData?.imageRequired == true
        ? "yes"
        : null
      : null
  );

  const checkBoxOptions = [{ label: "Required", value: "yes" }];
  const handleSelectedCheckBoxForImage = useCallback((value) => {
    setSelectedCheckBoxForImages(value || null);
    onPressSelectAnswer(value);
    // setFormData((prev) => ({
    //     ...prev,
    //     notAvailableOption: value,
    // }));
  }, []);
  // templateId = route?.params?.data?.templateId
  // roomID = route?.params?.data?.roomID
  // console.log('templateId',templateId,roomID,'roomID');
  // elementsArr = route?.params?.data?.elementsArr
  // specificElementData = route?.params?.data?.item
  // navigationData = { templateId, roomID, elementsArr }

  const [formData, setFormData] = useState({
    presentAnswerType: null,
    cleanAnswerType: null,
    damageAnswerType: null,
    condition: "",
    conditionAnswerSelection: null,
    elementImage: elementData?.image?.url,
    note: "",
  });

  const [selectedIconIndex, setSelectedIconIndex] = useState({
    presentArrIndex: 0,
    clearArrIndex: 0,
  });

  const [selectedValue, setSelectedValue] = useState({
    presentAnswerType: null,
    cleanAnswerType: null,
    damageAnswerType: null,
  });

  const buttonStatusDetails = [
    {
      name: "Rearrange Elements",
      icon: require("../../../../assets/images/icons/rearrangeRoom.webp"),
    },
    {
      name: "Delete Elements",
      icon: require("../../../../assets/images/icons/deleteRoom.webp"),
    },
  ];

  const presentOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const cleanOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Maybe", value: "Maybe" },
    { label: "LittleBit", value: "LittleBit" },
  ];
  const damageOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Maybe", value: "Maybe" },
  ];

  const handleSelectedPresentAnswerType = useCallback((value) => {
    setSelectedValue((prev) => ({
      ...prev,
      presentAnswerType: value || null,
    }));
    setFormData((prev) => ({
      ...prev,
      presentAnswerType: value,
    }));
  }, []);

  const handleSelectedCleanAnswerType = useCallback((value) => {
    setSelectedValue((prev) => ({
      ...prev,
      cleanAnswerType: value || null,
    }));
    setFormData((prev) => ({
      ...prev,
      cleanAnswerType: value,
    }));
  }, []);

  const handleSelectedDamageAnswerType = useCallback((value) => {
    setSelectedValue((prev) => ({
      ...prev,
      damageAnswerType: value || null,
    }));
    setFormData((prev) => ({
      ...prev,
      damageAnswerType: value,
    }));
  }, []);

  const handleChangeText = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    try {
      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          elementImage: result?.assets[0]?.uri,
        }));
        handleElementData(result?.assets?.[0], elementId);
      }
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {};

  const questionPresentArr = [
    { value: "Yes", icon: <YesIcon /> },
    { value: "No", icon: <NoIcon /> },
    { value: "Maybe", icon: <MayBeIcon /> },
  ];

  const handlePresentQuestionIconPress = (index) => {
    setSelectedIconIndex((prev) => ({
      ...prev,
      presentArrIndex: index,
    }));
  };

  const questionCleanArr = [
    { value: "Yes", icon: <BrushIcon /> },
    { value: "No", icon: <NoIcon /> },
    { value: "Some", icon: <BrushIcon /> },
    { value: "Extra", icon: <BrushIcon /> },
  ];

  const handleCleanQuestionIconPress = (index) => {
    setSelectedIconIndex((prev) => ({
      ...prev,
      clearArrIndex: index,
    }));
  };
  // const [elementIndex, setElementIndex] = useState(null);

  // const handleElementIndex = (index) => {
  //     setElementIndex(elementIndex === index ? null : index)
  // }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.borderLineStyle} />

        <View style={styles.innerContainer}>
          <Text style={[styles.inputLabelText]}>Element Image</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* {formData?.elementImage ?
                            <View style={styles.imageContainer}>
                                <TouchableOpacity style={styles.crossIcon} onPress={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        elementImage: null
                                    }));
                                }}>
                                    <CrossIcon />
                                </TouchableOpacity>
                                <Image source={{ uri: formData?.elementImage }} resizeMode='cover' resizeMethod='resize' style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                            </View>
                            : */}
            <TouchableOpacity
              disabled
              style={styles.imageUploadButton}
              onPress={pickImage}
            >
              <ImageIcon />
              <Text style={styles.imageUploadButtonText}>
                Upload or capture an image
              </Text>
            </TouchableOpacity>

            {/* } */}
          </View>
          <CustomCheckBox
            options={checkBoxOptions}
            onChange={handleSelectedCheckBoxForImage}
            value={selectedCheckBoxForImages}
            screenName={"FinalizingInspection"}
            // disabled={selectedCheckBoxValueSendReport == 'yes' ? true : false}
          />

          <View style={[styles.inputInnerContainer, { marginVertical: "4%" }]}>
            <TextInput
              editable={false}
              value={formData?.note}
              onChangeText={(text) => handleChangeText("note", text)}
              style={styles.input}
              placeholder="Write a note"
              placeholderTextColor="#7A8094"
            />
          </View>

          <Text style={styles.inputTextLabel}>Checklist</Text>
          {checkList?.map((item, index) => {
            if (item?.type == "dropDown") {
              // const isSelected = elementIndex === index
              return (
                <View key={index}>
                  <Text style={styles.inputLabelText}>
                    {index + 1}. {item?.text}
                    {item?.answerRequired ? " *" : ""}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <SelectDropdown
                      data={item?.options}
                      disabled={item?.options?.length === 0}
                      defaultButtonText={item?.text}
                      onSelect={(selectedItem, index) => {
                        setFormData((prev) => ({
                          ...prev,
                          templateID: selectedItem?._id
                            ? selectedItem?._id
                            : null,
                        }));
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.searchContainer}>
                            <Text
                              style={[
                                styles.dropDownButtonContainer,
                                !selectedItem?.text && { color: "#7A8094" },
                              ]}
                            >
                              Select Answer
                              {/* {selectedItem?.option ? selectedItem?.option : 'Select Template'} */}
                            </Text>

                            <Ionicons
                              name={isOpened ? "chevron-up" : "chevron-down"}
                              size={18}
                              color="#9EA3AE"
                              style={{ paddingHorizontal: "3%" }}
                            />
                          </View>
                        );
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View
                            style={[
                              styles.dropdownItem,
                              { justifyContent: "space-between" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                { paddingLeft: 0 },
                              ]}
                            >
                              {item?.option}
                            </Text>
                            {/* {isSelected && (
                            <CheckBlueTickIcon />
                        )} */}
                          </View>
                        );
                      }}
                      dropdownOverlayColor="transparent"
                      dropdownStyle={styles.dropdownContainer}
                    />
                  </View>
                </View>
              );
            }
            if (item?.type == "textArea") {
              return (
                <View key={index}>
                  <Text style={styles.inputLabelText}>
                    {index + 1}. {item?.text}
                    {item?.answerRequired ? " *" : ""}
                  </Text>
                  <View style={styles.inputInnerContainer}>
                    <TextInput
                      value={formData?.condition}
                      onChangeText={(text) =>
                        handleChangeText("condition", text)
                      }
                      style={styles.input}
                      placeholder="Answer"
                      placeholderTextColor="#7A8094"
                      editable={false}
                    />
                  </View>
                </View>
              );
            } else if (item?.type == "radio") {
              return (
                <View style={{ marginTop: 10 }} key={index}>
                  <CustomOptionSelectionTemplate index={index} item={item} />
                </View>
              );
            }
          })}

          <View style={styles.buttonParentContainer}>
            <TouchableOpacity
              style={[
                styles.transparentButton,
                // showData?.formValid && {backgroundColor: '#007BFF' }
              ]}
              // disabled={!showData?.formValid}
              onPress={() => {
                navigation.navigate("AddNewQuestionTemplate", {
                  templateId,
                  roomID,
                  elementId,
                  saveQuestionArray,
                  questionArray,
                  elementIndex,
                });
              }}
            >
              <Feather
                name="plus"
                size={19}
                color="#007BFF"
                style={{ paddingRight: "1.2%", paddingTop: "0.5%" }}
              />
              <Text
                style={[
                  styles.newInspectionButtonText,
                  { color: "#007BFF", fontSize: 13 },
                ]}
              >
                Add new Question
              </Text>
            </TouchableOpacity>

            {questionArray?.[elementIndex]?.checklist?.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.transparentButton,
                  // showData?.formValid && {backgroundColor: '#007BFF' }
                ]}
                // disabled={!showData?.formValid}
                onPress={() => {
                  navigation.navigate("DeleteQuestionTemplate", {
                    templateId,
                    roomID,
                    elementId,
                    questionArray,
                    elementIndex,
                  });
                }}
              >
                <View style={{ marginRight: "3.5%" }}>
                  <CheckListDeleteIcon />
                </View>
                <Text
                  style={[
                    styles.newInspectionButtonText,
                    { color: "#FF613E", fontSize: 13 },
                  ]}
                >
                  Remove Question
                </Text>
              </TouchableOpacity>
            ) : (
              ""
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  borderLineStyle: {
    borderWidth: 1,
    borderColor: "#DAEAFF",
  },
  innerContainer: {
    // paddingBottom: 0,
    paddingTop: 0,
    padding: 16,
  },
  inputTextLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16.5,
    color: "#000929",
    marginBottom: "3%",
  },
  searchInput: {
    flexDirection: "row",
    paddingVertical: 6,
    padding: 5,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15,
  },
  inputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#EEEEEE",
    borderColor: "#DAEAFF",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    paddingLeft: 11,
    color: "#000929",
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
  },
  imageContainer: {
    position: "relative",
    width: 110,
    height: 115,
    borderRadius: 5,
    overflow: "hidden",
  },
  crossIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
    zIndex: 1,
  },
  imageUploadButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
    padding: "3%",
    borderWidth: 1.5,
    borderColor: "#DAEAFF",
    borderRadius: 8,
  },
  imageUploadButtonText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13,
    paddingHorizontal: "3%",
    color: "#fff",
  },
  inputLabelText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13.7,
    paddingLeft: "0.5%",
    color: "#000929",
    marginVertical: "3%",
  },
  buttonParentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
    marginHorizontal: "5.5%",
  },
  transparentButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingTop: "3.5%",
  },
  newInspectionButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  parentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#e1eeff84",
    borderRadius: 10,
    width: "65%",
    paddingVertical: "1.5%",
  },
  parentCleanQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#e1eeff84",
    borderRadius: 10,
    paddingVertical: "1.5%",
  },
  iconTextContainer: {
    backgroundColor: "#2A85FF",
    width: "33%",
    paddingVertical: "4%",
    borderRadius: 8,
  },
  cleanQuestionIconTextContainer: {
    backgroundColor: "#2A85FF",
    width: "22%",
    paddingVertical: "3%",
    borderRadius: 8,
  },
  iconText: {
    // paddingTop: '2%',
    fontSize: 12,
    textAlign: "center",
  },
  roomElementParentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomsElementTextContainer: {
    flex: 1,
    paddingVertical: 6,
    padding: 5,
  },
  elementCountText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12.5,
    color: "#8D939F",
  },
  roomsElementText: {
    paddingVertical: 6,
    padding: 5,
    color: "#000929",
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
  },
  elementDetailContainer: {
    borderWidth: 2,
    borderColor: "#DAEAFF",
    backgroundColor: "#ffff",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: "1%",
    marginBottom: "3%",
  },
  textIcon: {
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    marginHorizontal: "1%",
    backgroundColor: "#F3F8FF",
    borderColor: "#DAEAFF",
    borderRadius: 10,
    marginBottom: "3%",
  },
  dropDownButtonContainer: {
    flex: 1,
    padding: 8,
    paddingVertical: 11,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
  },
  dropdownItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCE2FF",
  },
  dropdownItemText: {
    textAlignVertical: "center",
    fontSize: 16,
    paddingLeft: "5%",
    paddingVertical: "1%",
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#4D5369",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),

    borderRadius: 5,
    marginTop: "-5%",
    marginLeft: "1%",
    padding: 5,
    paddingTop: "2%",
    borderRadius: 10,
    paddingHorizontal: "4%",
    paddingBottom: "4%",
  },
});

export default memo(CreateElementTemplate);
