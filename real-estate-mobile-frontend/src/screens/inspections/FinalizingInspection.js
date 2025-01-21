import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomCheckBox from "../../components/CustomCheckBox";
import SelectDropdown from "react-native-select-dropdown";
// import { useStoreUser } from '../../store';
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import { useLoader } from "../../lib/loaderContext";
import { useStoreFinalizedData } from "../../store/InspectionFinializedData";

const FinalizingInspection = ({ route }) => {
  const selectRole = [
    "Property Manager",
    "Inspector",
    "Tenant",
    "Landlord",
    "Contractor",
    "Other",
  ];
  const navigation = useNavigation();
  const inspectionId = route?.params?.inspectionId;

  const { setLoading } = useLoader();

  // const { dataArray, addData, removeData } = useStoreUser();
  const [property, setProperty] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [inspectorRole, setInspectorRole] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [collaboratorsValue, setCollaboratorsValue] = useState("");

  const handleRemoveData = (item) => {
    InspectionDeleteCollaborator(inspectionId, item?._id);
    // removeData(index);
  };

  const [formData, setFormData] = useState({
    inspectionDate: new Date(),
    notAvailableOption: "",
    sendaCopyOption: "",
  });

  const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState(null);
  const [selectedCheckBoxValueSendaCopy, setSelectedCheckBoxValueSendaCopy] =
    useState(null);
  const [showDateTime, setShowDateTime] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [reportName, setReportName] = useState(false);

  const gotoRoomInspection = () => {
    navigation.navigate("DeleteRooms");
  };
  // const selectProperty = [{ name: 'Beverly Springfield' }, { name: 'Springfield' }, { name: 'Beverly' }]

  // const checkBoxOptions = [{ label: 'Not available? Send them report for signature.', value: 'yes' }];
  const checkBoxOptions = [{ label: "Skip Signature", value: "yes" }];
  const checkBoxOptions1 = [{ label: "Send a copy", value: "yes" }];

  const handleSelectedCheckBox = useCallback((value) => {
    setSelectedCheckBoxValue(value || null);
    setFormData((prev) => ({
      ...prev,
      notAvailableOption: value,
    }));
  }, []);
  const handleSelectedCheckBoxSendaCopyOption = useCallback((value) => {
    setSelectedCheckBoxValueSendaCopy(value || null);
    setFormData((prev) => ({
      ...prev,
      sendaCopyOption: value,
    }));
  }, []);

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
      setDateTime(selectedDate);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      showingPropertyData();
      // showingInspectionData();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      // showingPropertyData();
      showingInspectionData();
    }, [collaboratorsValue])
  );

  const showingInspectionData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/inspection/getSpecificInspection/${inspectionId}`,
        { withCredentials: true }
      );
      if (response?.status === 200) {
        setReportName(response?.data?.inspectorName);
        setPropertyName(response?.data?.property?.name);
        setInspectorName(response?.data?.inspectorName);
        setInspectorRole(response?.data?.inspectorRole);
        // setProperty(response?.data?.properties ? response?.data?.properties : [])
        setCollaborators(response?.data?.collaborators);
        setPropertyId(response?.data?.property?._id);
        // console.log(response?.data?.collaborators);
      }
    } catch (error) {
      console.log("error in showingPropertyData", error);
    }
  };

  const InspectionDeleteCollaborator = async (
    selectInspectionId,
    selectCollaboratorId
  ) => {
    const data = {
      inspectionId: selectInspectionId,
      collaboratorId: selectCollaboratorId,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/api/inspection/inspectionDeleteCollaborator`,
        data,
        { withCredentials: true }
      );
      // setCollaborators()
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        setCollaboratorsValue(!collaboratorsValue);
        // navigation.goBack()
      }
    } catch (error) {
      console.log("Error in /InspectionUpdateRoom:", error);
      setLoading(false);
    }
  };

  const showingPropertyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/property/getProperties`, {
        withCredentials: true,
      });
      if (response?.status === 200) {
        setProperty(
          response?.data?.properties ? response?.data?.properties : []
        );
      }
    } catch (error) {
      console.log("error in showingPropertyData", error);
    }
  };
  // const handleSave = async (

  // ) => {
  //     const emails = dataArray?.map(item => item?.email);
  //     const data = {
  //         inspectionId:inspectionId,
  //          collaboratorEmails:emails,
  //          reportData:{
  //             propertyId:propertyId,
  //             reportName:reportName,
  //             inspectionDate:new Date(formData.inspectionDate)
  //          },
  //          inspectorData:{
  //             inspectorName:inspectorName,
  //             inspectorRole:inspectorRole

  //          }
  //     };
  //     console.log('data----->>>',data);

  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${apiUrl}/api/inspection/finalizeInspection`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },

  //      withCredentials: true, // Include cookies/credentials

  //       body: JSON.stringify({
  //         data
  //         // inspectionId:inspectionId,
  //         // collaboratorEmails:emails,
  //         // reportData:{
  //         //    propertyId:propertyId,
  //         //    reportName:reportName,
  //         //    inspectionDate:showDateTime
  //         // },
  //         // inspectorData:{
  //         //    inspectorName:inspectorName,
  //         //    inspectorRole:inspectorRole
  //         // }

  //       }),

  //     });
  //     const result = await response.json();
  //     navigation.navigate('FinalizingInspectionSignature',{inspectorName:inspectorName,data:data})

  //     if (result?.status === 200) {
  //       setLoading(false)
  //     //   navigation.navigate('ShowRooms', { id: result?.inspectionid })
  //   }
  //   else{
  //       setLoading(false)

  //       alert(result?.message)
  //   }

  //   } catch (e) {
  //     setLoading(false)
  //     console.log(e);
  //     throw e;
  //   }
  // };
  const setInspectionData = useStoreFinalizedData(
    (state) => state.setInspectionData
  );
  const handleSave = () => {
    // const emails = collaborators?.map(item => item?.collaboratorEmail);
    const data = {
      inspectionId: inspectionId,
      //  collaboratorEmails:emails,
      reportData: {
        propertyId: propertyId,
        reportName: reportName,
        // inspectionDate:formData?.inspectionDate
        // inspectionDate:dateTime
        inspectionDate: "2020-12-17T16:14:00.000Z",
      },
      inspectorData: {
        inspectorName: inspectorName,
        inspectorRole: inspectorRole,
      },
    };

    // setInspectionData(data); // Save data to the store
    navigation.navigate("FinalizingInspectionSignature", { data: data });
  };

  // const handleSaves = async () => {
  //     // if (!validation) return;

  //     // let newImg = [];
  //     // if (roomData?.images?.length) {
  //     //     newImg = await uploadImagesToCloudinary();
  //     // }

  //     // setRoomData((prev) => ({
  //     //     ...prev,
  //     //     images: updatedImages
  //     // }));

  //     const emails = dataArray?.map(item => item.email);
  //     // console.log(emails);

  //     const data = {
  //         inspectionId:inspectionId,
  //          collaboratorEmails:emails,
  //          reportData:{
  //             propertyId:propertyId,
  //             reportName:reportName,
  //             inspectionDate:dateTime
  //          },
  //          inspectorData:{
  //             inspectorName:inspectorName,
  //             inspectorRole:inspectorRole

  //          }
  //     };

  //     try {
  //         setLoading(true)
  //         const response = await axios.post(`${apiUrl}/api/inspection/finalizeInspection`, data, { withCredentials: true });

  //         if (response.status === 200 || response.status === 201) {
  //             setLoading(false)
  //             navigation.goBack()
  //         }
  //     } catch (error) {
  //         console.log('Error in /InspectionUpdateRoom:', error);
  //         setLoading(false)
  //     }
  // };

  const truncateString = (str, length) => {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    }
    return str;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomHeader
        title={"Finalizing Inspection"}
        goBack={true}
        showMoreIcon={false}
        onPress={gotoRoomInspection}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.subHeaderContainer}>
                    <Text style={styles.roomInspectionText}>Finalizing the Inspection</Text>
                </View> */}

        {/* <View style={styles.subHeaderContainer}>
                    <Text style={[styles.roomInspectionText, { fontSize: 14.7, paddingBottom: '2.5%' }]}>Inspection OverView</Text>
                    <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#DAEAFF' }} />
                </View> */}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabelText}>Report Name</Text>
          <View
            style={[styles.inputInnerContainer, { backgroundColor: "#fff" }]}
          >
            <TextInput
              value={reportName}
              onChangeText={(text) => setReportName(text)}
              style={styles.input}
              placeholder="Inspection after tenant"
              placeholderTextColor="#7A8094"
            />
          </View>

          <Text style={styles.inputLabelText}>Select Property</Text>
          {/* <View style={[styles.inputInnerContainer, { backgroundColor: '#fff' }]}>
                        <TextInput
                            // value={formData?.conditionAnswerSelection}
                            // onChangeText={(text) => handleChangeText('conditionAnswerSelection', text)}
                            style={styles.input}
                            placeholder="Select Answer"
                            placeholderTextColor="#7A8094"
                        />
                        <Ionicons name={"chevron-down"} size={16} color="#6C727F" style={{ marginTop: '2%', paddingHorizontal: '3%' }} />
                    </View> */}

          <SelectDropdown
            data={property}
            // disabled={item?.options?.length === 0}
            // defaultButtonText={item?.text}
            // onSelect={(selectedItem, index) => {
            //     setFormData((prev) => ({
            //         ...prev,
            //         templateID: selectedItem?._id ? selectedItem?._id : null,
            //     }));
            // }}
            onSelect={(selectedItem) => {
              setPropertyName(selectedItem?.name); // Update the state here
              setPropertyId(selectedItem?._id); // Update the state here
            }}
            renderButton={(selectedItem, isOpened) => {
              // console.log(selectedItem?._id);
              // setPropertyId(selectedItem?._id)
              // setPropertyName(selectedItem?.name)

              return (
                <View style={styles.searchContainer}>
                  <Text
                    style={[
                      styles.dropDownButtonContainer,
                      !propertyName && { color: "#7A8094" },
                    ]}
                  >
                    {propertyName ? propertyName : "Select Property"}
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

          <Text style={styles.inputLabelText}>Date Of Inspection</Text>
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
              display="calendar"
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
        </View>

        <View style={styles.subHeaderContainer}>
          <Text
            style={[
              styles.roomInspectionText,
              { fontSize: 14.7, paddingBottom: "2.5%" },
            ]}
          >
            Users for Signature
          </Text>
          <View
            style={{ borderBottomWidth: 1.5, borderBottomColor: "#DAEAFF" }}
          />

          <View style={styles.nameRoleContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabelText}>Your Name</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabelText, { textAlign: "left" }]}>
                Your Role
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 15,
            }}
          >
            <View
              style={[
                styles.inputInnerContainer,
                {
                  backgroundColor: "#fff",
                  flex: 1,
                  marginHorizontal: 0,
                  width: "50%",
                },
              ]}
            >
              <TextInput
                value={inspectorName}
                onChangeText={(text) => setInspectorName(text)}
                style={styles.input}
                placeholder="Enter Name"
                placeholderTextColor="#7A8094"
              />
            </View>
            <View style={{ width: "50%" }}>
              <SelectDropdown
                data={selectRole}
                onSelect={(selectedItem) => {
                  setInspectorRole(selectedItem); // Update the state here
                }}
                // disabled={item?.options?.length === 0}
                // defaultButtonText={item?.text}
                // onSelect={(selectedItem, index) => {
                //     setFormData((prev) => ({
                //         ...prev,
                //         templateID: selectedItem?._id ? selectedItem?._id : null,
                //     }));
                // }}
                renderButton={(selectedItem, isOpened) => {
                  // console.log(selectedItem);
                  // setInspectorRole(selectedItem)

                  return (
                    <View style={styles.searchContainer}>
                      <Text
                        style={[
                          styles.dropDownButtonContainer,
                          !inspectorRole && { color: "#7A8094" },
                        ]}
                      >
                        {inspectorRole ? inspectorRole : "Select Role"}
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
                        {item}
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
            {/* <View style={[styles.inputInnerContainer, { backgroundColor: "#fff", flex: 1, marginHorizontal: 0 }]}>
                            <TextInput
                                // value={roomData?.name}
                                // onChangeText={(text) => handleChangeText('name', text)}
                                style={styles.input}
                                placeholder="Your Role"
                                placeholderTextColor="#7A8094"
                            />
                            <Ionicons name={"chevron-down"} size={16} color="#6C727F" style={{ marginTop: '2%', paddingHorizontal: '5%' }} />
                        </View> */}
          </View>

          {/* <Text style={styles.inputLabelText}>Add People in Inspection</Text>

                    <View style={[styles.inputInnerContainer, styles.addPeopleContainer]}>
                        <Text style={styles.input}> 1.  Sarah</Text>
                        <Entypo name="chevron-small-right" size={28} color="#6C727F" style={{ paddingHorizontal: '2%' }} />
                    </View> */}
          {/* 
                    <View style={{ marginVertical: '1%' }}>
                        <CustomCheckBox
                            options={checkBoxOptions}
                            onChange={handleSelectedCheckBox}
                            value={selectedCheckBoxValue}
                            screenName={'FinalizingInspection'}
                        />
                    </View>
                    <View style={{ marginVertical: '1%' }}>
                        <CustomCheckBox
                            options={checkBoxOptions1}
                            onChange={handleSelectedCheckBoxSendaCopyOption}
                            value={selectedCheckBoxValueSendaCopy}
                            screenName={'FinalizingInspection'}
                        />
                    </View> */}

          <Text style={styles.inputLabelText}>Add People in Inspection</Text>

          {collaborators?.length > 0 &&
            collaborators?.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    key={index}
                    // onPress={()=>handleRemoveData(index)}
                    style={[
                      styles.inputInnerContainer,
                      styles.addPeopleContainer,
                      { marginVertical: 3 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.collaboratorInput,
                        { width: "58%", paddingHorizontal: "1%" },
                      ]}
                    >
                      {" "}
                      {index + 1}. {truncateString(item?.collaboratorName, 20)}
                    </Text>
                    <Text
                      style={[
                        styles.collaboratorInput,
                        {
                          color: "#9EA3AE",
                          paddingHorizontal: "1%",
                          width: "43%",
                        },
                      ]}
                    >
                      {" "}
                      {item?.collaboratorRole}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddingPeopleInspection", {
                        item,
                        inspectionId,
                        updateCollaboratorEnable: true,
                      })
                    }
                  >
                    <Feather
                      name="edit"
                      size={18}
                      color="#007BFF"
                      style={{ paddingHorizontal: "2%" }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveData(item)}>
                    <Entypo
                      name="cross"
                      size={18}
                      color="red"
                      style={{ paddingHorizontal: "2%" }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}

          <TouchableOpacity
            style={[
              styles.transparentButton,
              // showData?.formValid && {backgroundColor: '#007BFF' }
            ]}
            // disabled={!showData?.formValid}
            onPress={() => {
              navigation.navigate("AddingPeopleInspection", { inspectionId });
            }}
          >
            <Feather
              name="plus"
              size={19}
              color="#007BFF"
              style={{ paddingRight: "1.2%" }}
            />
            <Text
              style={[
                styles.newInspectionButtonText,
                { color: "#007BFF", fontSize: 13 },
              ]}
            >
              Add People
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.newInspectionButton,
              ,
              { marginBottom: "5%", marginVertical: "8%" },
              // showData?.formValid && { backgroundColor: '#007BFF' }
            ]}
            // disabled={!showData?.formValid}
            onPress={handleSave}
          >
            <Text style={styles.newInspectionButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
            <Text style={styles.saveButtonText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinalizingInspection;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subHeaderContainer: {
    paddingTop: "3%",
    paddingHorizontal: "6%",
  },
  roomDetailsText: {
    paddingTop: "3%",
    paddingHorizontal: "6%",
  },
  roomInspectionText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16.5,
    color: "#000929",
  },
  inputContainer: {
    paddingHorizontal: "5%",
  },
  addPeopleContainer: {
    width: "88%",
    backgroundColor: "#fff",
    // flex: 1,
    marginHorizontal: 0,
    paddingVertical: "3%",
    paddingHorizontal: "1%",
  },
  inputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    marginHorizontal: "1%",
    backgroundColor: "#daeaff6a",
    borderColor: "#DAEAFF",
    borderRadius: 10,
  },
  inputLabelText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13.7,
    paddingLeft: "0.5%",
    color: "#000929",
    marginVertical: "3%",
  },
  input: {
    padding: 8,
    paddingLeft: 11,
    color: "#000929",
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
  },
  collaboratorInput: {
    color: "#000929",
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
  nameRoleContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "space-between",
    marginTop: "2%",
    marginBottom: "1%",
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
  },
  transparentButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: "3%",
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
    marginBottom: "5%",
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#007BFF",
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
});
