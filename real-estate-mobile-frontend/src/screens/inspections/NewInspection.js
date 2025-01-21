import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useCallback, lazy } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import CheckBlueTickIcon from "../../../assets/images/icons/CheckBlueTickIcon.svg";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import { useLoader } from "../../lib/loaderContext";
const UpgradeModal = lazy(() =>
  import("../inspections/InspectionComponents/UpgradeModal")
);
import { userContext } from "../../lib/userContext";

const NewInspection = () => {
  const { userData } = userContext();
  const currentRole = userData?.role;

  const { setLoading } = useLoader();
  const navigation = useNavigation();
  const route = useRoute();
  const totalInspection = route?.params?.totalInspection;

  const [isformValid, setIsformValid] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [data, setData] = useState({
    propertyDetails: [],
    templateDetails: [],
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate("PaymentPlanScreen", { goBack: true });
      setLoading(false);
    }, 1000);
    // Add your upgrade logic here
  };

  const [formData, setFormData] = useState({
    propertyID: null,
    inspectionDate: null,
    templateID: null,
    propertyAddress: {},
  });

  useEffect(() => {
    const { propertyID, inspectionDate, templateID } = formData;

    let checkValidation = route?.params?.showTemplate
      ? propertyID &&
        inspectionDate &&
        route?.params?.showTemplate &&
        templateID
      : propertyID && inspectionDate;

    if (checkValidation) {
      setIsformValid(true);
    } else {
      setIsformValid(false);
    }
  }, [formData]);

  useFocusEffect(
    useCallback(() => {
      setFormData({});
      setData({
        propertyDetails: [],
        templateDetails: [],
      });
      showingTempleData();
      showingPropertyData();
    }, [])
  );

  const showingTempleData = async () => {
    if (route?.params?.showTemplate) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/template/getTemplates`,
          { withCredentials: true }
        );
        if (response?.status === 200) {
          setData((prev) => ({
            ...prev,
            templateDetails: response?.data?.templates
              ? response?.data?.templates
              : [],
          }));
        }
      } catch (error) {
        console.log("error in showingTempleData", error);
      }
    }
  };

  const showingPropertyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/property/getProperties`, {
        withCredentials: true,
      });
      if (response?.status === 200) {
        setData((prev) => ({
          ...prev,
          propertyDetails: response?.data?.properties
            ? response?.data?.properties
            : [],
        }));
      }
    } catch (error) {
      console.log("error in showingPropertyData", error);
    }
  };

  const onDobChange = (event, selectedDate) => {
    setShowDateTime(false);
    if (event.type === "dismissed") {
      setFormData((prev) => ({
        ...prev,
        inspectionDate: undefined,
      }));
      return;
    }

    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        inspectionDate: selectedDate,
      }));
    }
  };

  // const checkRoleForTier = () =>{
  //     if (currentRole == 'freeTier') {

  //     }
  // }

  //check condition according role
  const checkRoleForTier = (draft) => {
    if (currentRole == "FREETIER") {
      if (totalInspection == 0 || totalInspection == "") {
        handleSave(draft);
      } else {
        setModalVisible(true);
      }
    } else if (currentRole == "STANDARDTIER") {
      if (totalInspection < 10) {
        handleSave(draft);
      } else {
        setModalVisible(true);
      }
    } else if (currentRole == "TOPTIER" || currentRole == "SUBUSER") {
      handleSave(draft);
    }
  };
  const handleSave = async (draft) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/inspection/createBasicInspectionDraft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          withCredentials: true, // Include cookies/credentials

          body: JSON.stringify({
            propertyId: formData?.propertyID,
            name:
              formData?.propertyAddress?.unit +
              ", " +
              formData?.propertyAddress?.street +
              " - Inspection",
            creationDate: formData?.inspectionDate,
            templateId:
              route?.params?.showTemplate && formData?.templateID
                ? formData?.templateID
                : null,
          }),
        }
      );

      const result = await response.json();

      if (result?.message === "Inspection created successfully!") {
        setLoading(false);
        if (draft == true) {
          navigation.goBack();
        } else {
          navigation.navigate("ShowRooms", { id: result?.inspectionid });
        }
      } else {
        setLoading(false);

        alert(result?.message);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  // const handleSaves = async () => {
  //     try {
  //         setLoading(true)
  //         let data = {
  //             propertyId: formData?.propertyID,
  //             name: formData?.propertyAddress?.unit + ", " + formData?.propertyAddress?.street + " - Inspection",
  //             creationDate: formData?.inspectionDate,
  //             templateId: (route?.params?.showTemplate && formData?.templateID) ? formData?.templateID : null,
  //         }
  //         console.log(data);

  //         const response = await axios.post(`${apiUrl}/api/inspection/createBasicInspectionDraft`, data, { withCredentials: true })
  //         console.log(response,'----->>>>>>>>--->>>');

  //         if (response?.status === 201) {
  //             navigation.navigate('ShowRooms', { id: response?.data?.inspectionid })
  //         }
  //     } catch (error) {
  //         console.log('error in handleSave', error)
  //     } finally {
  //         setLoading(false)
  //     }
  // };

  // const handleSaveAsDraft = async () => {
  //     try {
  //         setLoading(true)
  //         let data = {
  //             propertyId: formData?.propertyID,
  //             name: propertyAddress.unit + ", " + propertyAddress.street + " - Inspection",
  //             creationDate: formData?.inspectionDate,
  //             templateId: (route?.params?.showTemplate && formData?.templateID) ? formData?.templateID : null,
  //         }
  //         const response = await axios.post(`${apiUrl}/api/inspection/createBasicInspectionDraft`, data, { withCredentials: true })
  //         if (response?.status === 201) {
  //             navigation.goBack();
  //         }
  //     } catch (error) {
  //         console.log('error in handleSaveAsDraft', error)
  //     } finally {
  //         setLoading(false)
  //     }
  // };
  // const handleDropdownClick = () => {
  //     if (data?.propertyDetails?.length === 0) {
  //         // Show toast message
  //         ToastAndroid.show("Cannot disable dropdown", ToastAndroid.SHORT);
  //     }
  // };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* <Text style={styles.inputTextLabel}>Report Name</Text>

                    <View style={styles.searchContainer}>
                        <TextInput
                            value={formData.reportName}
                            onChangeText={(text) => handleChangeText('reportName', text)}
                            style={styles.searchInput}
                            placeholder="Name"
                            placeholderTextColor="#7A8094"
                        />
                    </View> */}

          <Text style={styles.inputTextLabel}>Select Property</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <SelectDropdown
              // onFocus={handleDropdownClick}
              data={data?.propertyDetails}
              disabled={data?.propertyDetails?.length === 0}
              defaultButtonText={data?.propertyDetails[0]?.name}
              onSelect={(selectedItem, index) => {
                setFormData((prev) => ({
                  ...prev,
                  propertyID: selectedItem?._id ? selectedItem?._id : null,
                  propertyAddress: selectedItem?.address,
                }));
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.searchContainer}>
                    <Text
                      style={[
                        styles.dropDownButtonContainer,
                        !selectedItem?.name && { color: "#7A8094" },
                      ]}
                    >
                      {selectedItem?.name
                        ? selectedItem?.name
                        : "Select Property"}
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
                    <Text style={[styles.dropdownItemText, { paddingLeft: 0 }]}>
                      {item?.name}
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

          <Text style={styles.inputTextLabel}>Date Of Inspection</Text>
          <TouchableOpacity onPress={() => setShowDateTime(true)}>
            <View style={styles.dateIconContainer}>
              <Text
                style={[
                  styles.DobText,
                  formData.inspectionDate && { color: "#333" },
                ]}
              >
                {formData.inspectionDate
                  ? new Date(formData.inspectionDate).toLocaleDateString()
                  : "Select your Date"}
              </Text>
              <CustomCalenderIcon color={"#7A8094"} />
            </View>
          </TouchableOpacity>

          {Platform.OS === "ios" && showDateTime && (
            <DateTimePicker
              mode="date"
              display="inline"
              value={formData.inspectionDate || new Date()}
              onChange={onDobChange}
              maximumDate={new Date()}
              visible={showDateTime}
            />
          )}
          {Platform.OS === "android" && showDateTime && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={formData.inspectionDate || new Date()}
              onChange={onDobChange}
              maximumDate={new Date()}
            />
          )}

          {route?.params?.showTemplate && (
            <>
              <Text style={styles.inputTextLabel}>Select Template</Text>

              <View style={styles.templateContainer}>
                <SelectDropdown
                  data={data?.templateDetails}
                  disabled={data?.templateDetails?.length === 0}
                  defaultButtonText={data?.templateDetails[0]?.name}
                  onSelect={(selectedItem, index) => {
                    setFormData((prev) => ({
                      ...prev,
                      templateID: selectedItem?._id ? selectedItem?._id : null,
                    }));
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.searchContainer}>
                        <Text
                          style={[
                            styles.dropDownButtonContainer,
                            !selectedItem?.name && { color: "#7A8094" },
                          ]}
                        >
                          {selectedItem?.name
                            ? selectedItem?.name
                            : "Select Template"}
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
                          style={[styles.dropdownItemText, { paddingLeft: 0 }]}
                        >
                          {item?.name}
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
            </>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.newInspectionButton,
            isformValid && { backgroundColor: "#007BFF" },
          ]}
          disabled={!isformValid}
          onPress={() => checkRoleForTier(false)}
          // onPress={handleSave}
        >
          <Text style={styles.newInspectionButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.newInspectionButton,
            { marginBottom: "5%" },
            isformValid && { backgroundColor: "#007BFF" },
          ]}
          disabled={!isformValid}
          onPress={() => checkRoleForTier(true)}
        >
          <Text style={styles.newInspectionButtonText}>Save as Draft</Text>
        </TouchableOpacity>
      </ScrollView>
      <UpgradeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpgrade={handleUpgrade}
        alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
      />
    </SafeAreaView>
  );
};

export default NewInspection;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    paddingBottom: 0,
    padding: 16,
    marginVertical: "2%",
  },
  inputTextLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15,
    color: "#000929",
    marginBottom: "3%",
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
  searchInput: {
    flex: 1,
    padding: 8,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
  },
  dropDownButtonContainer: {
    flex: 1,
    padding: 8,
    paddingVertical: 11,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
  },
  dateIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    backgroundColor: "#F3F8FF",
    borderColor: "#DAEAFF",
    marginHorizontal: "1%",
    borderRadius: 10,
    padding: 11,
    marginBottom: "3%",
  },
  DobText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#7A8094",
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
    marginTop: "6%",
    marginHorizontal: "5.5%",
  },
  newInspectionButtonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
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
    elevation: 10,
    borderRadius: 5,
    marginTop: "-5%",
    marginLeft: "1%",
    padding: 5,
    paddingTop: "2%",
    borderRadius: 10,
    paddingHorizontal: "4%",
    paddingBottom: "4%",
  },
  templateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});
