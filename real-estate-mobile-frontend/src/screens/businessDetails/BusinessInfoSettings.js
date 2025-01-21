import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ToastAndroid,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DefaultBusinessLogo from "../../../assets/images/icons/company-logo.svg";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import EditIcon from "../../../assets/images/icons/edit-icon.svg";
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { countriesData } from "../../constants/countriesData";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { useLoader } from "../../lib/loaderContext";
import { apiUrl } from "../../constants/api_Url";
import CustomizeHeader from "../profileAndPersonalDetails/components/CustomizeHeader";
import { CountryPicker } from "react-native-country-codes-picker";

const BusinessInfoSettings = ({ navigation }) => {
  const { userData, setUserData } = userContext();
  const { setLoading } = useLoader();

  const [businessNameFocused, setBusinessNameFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [websiteFocused, setWebsiteFocused] = useState(false);
  const [fieldsEditable, setFieldsEditable] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);

  const [tempImage, setTempImage] = useState(
    userData?.businessLogo?.url ? userData?.businessLogo?.url : null
  );

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState(
    userData?.businessPhoneNumber
      ? `+${userData?.businessPhoneNumber?.split("+")[1]?.slice(0, -10)}`
      : "+1"
  );
  const [countryFlag, setCountryFlag] = useState(
    userData?.businessPhoneNumber
      ? userData?.businessPhoneNumber?.split("+")[0]
      : "🇨🇦"
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
    }
  };
  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required("Name is required"),
    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .required("Address is required"),
    phoneNumber: Yup.string()
      .min(10, "Phone number must be at least 10 characters")
      .required("Phone number is required"),
    website: Yup.string()
      // .url("Invalid URL format")
      .required("Website is required"),
  });

  // Toggle editable state
  const toggleEdit = () => setFieldsEditable(!fieldsEditable);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !fieldsEditable ? (
          <Pressable onPress={toggleEdit}>
            <EditIcon width={24} height={36} />
          </Pressable>
        ) : null,
    });
  }, [navigation, fieldsEditable]);

  // console.log('userData', userData)

  return (
    <>
      <View style={styles.container}>
        <CustomizeHeader
          goBack
          title={"Business Info"}
          editIcon={fieldsEditable ? false : true}
          onPressEditButton={() => setFieldsEditable(true)}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Logo</Text>
          <View style={styles.ProfileContent}>
            {tempImage && tempImage !== "" ? (
              <Image
                source={{ uri: tempImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            ) : (
              <DefaultBusinessLogo style={styles.businessLogo} />
            )}
            {fieldsEditable && (
              <Button
                style={[
                  styles.profileUploadButton,
                  fieldsEditable ? { display: "flex" } : { display: "none" },
                ]}
                labelStyle={styles.profileUploadLabel}
                onPress={pickImage}
              >
                Upload
              </Button>
            )}
          </View>
          <Formik
            initialValues={{
              businessName: userData.businessName,
              address: userData.businessAddress,
              phoneNumber: userData?.businessPhoneNumber
                ? `${userData?.businessPhoneNumber?.split("+")[1]?.slice(-10)}`
                : "",
              website: userData.businessWebsite,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setLoading(true);
                const data = new FormData();

                if (tempImage && tempImage !== userData?.businessLogo?.url) {
                  let imageType = `image/${tempImage?.split(".").pop()}`;
                  let imageName = tempImage?.split("/").pop();

                  data.append("image", {
                    uri: tempImage.startsWith("file://")
                      ? tempImage
                      : `file://${tempImage}`,
                    type: imageType,
                    name: imageName,
                  });
                }

                data.append(
                  "businessPhoneNumber",
                  `${countryFlag}${countryCode}${values?.phoneNumber}`
                );
                data.append("businessName", values?.businessName);
                data.append("businessWebsite", values?.website);
                data.append("businessAddress", values?.address);

                const response = await axios.patch(
                  `${apiUrl}/api/user/changeBusinessInfo`,
                  data,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Accept: "application/json",
                    },
                    withCredentials: true,
                  }
                );

                if (response?.status == 200 || response?.status == 201) {
                  const updatedUserData = {
                    ...userData,
                    businessName: response?.data.userDetails?.businessName,
                    businessAddress:
                      response?.data.userDetails?.businessAddress,
                    businessPhoneNumber:
                      response?.data.userDetails?.businessPhoneNumber,
                    businessWebsite:
                      response?.data.userDetails?.businessWebsite,
                    businessLogo: response?.data.userDetails?.businessLogo,
                  };

                  await SecureStore.setItemAsync(
                    "userData",
                    JSON.stringify(updatedUserData)
                  );

                  // Update the context
                  setUserData(updatedUserData);

                  ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

                  setLoading(false);
                  setFieldsEditable(false);
                  setIsDataModified(false);
                  navigation.goBack();
                }
              } catch (error) {
                if (error?.response) {
                  const errorMessage = error?.response.data;
                  console.log(
                    "Backend Error Message in changePersonalInfo:",
                    errorMessage
                  );
                  setLoading(false);
                  Alert.alert("Error", errorMessage?.message);
                } else {
                  console.log("Network Error in changePersonalInfo:", error);
                  Alert.alert(
                    "Error",
                    "A network error occurred. Please try again."
                  );
                }
              }
            }}
          >
            {({ handleSubmit, values, initialValues }) => {
              // Check if form values have changed from initial values
              useEffect(() => {
                const hasChanged =
                  Object.keys(values).some(
                    (key) => values[key] !== initialValues[key]
                  ) ||
                  tempImage !== "" ||
                  countryCode !==
                    userData.businessPhoneNumber.slice(0, -10).split("+")[1];

                setIsDataModified(hasChanged);
              }, [values, tempImage]);
              return (
                <View style={styles.form}>
                  <View style={styles.formFields}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Company Name</Text>
                      <Field
                        name="businessName"
                        component={CustomInput}
                        placeholder="Enter Company Name"
                        onFocus={() => setBusinessNameFocused(true)}
                        onBlur={() => setBusinessNameFocused(false)}
                        businessNameFocused={businessNameFocused}
                        disabled={!fieldsEditable}
                      />
                      <ErrorMessage
                        name="businessName"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Address</Text>
                      <Field
                        name="address"
                        component={CustomInput}
                        placeholder="Enter Address"
                        onFocus={() => setAddressFocused(true)}
                        onBlur={() => setAddressFocused(false)}
                        addressFocused={addressFocused}
                        disabled={!fieldsEditable}
                      />
                      <ErrorMessage
                        name="address"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          disabled={!fieldsEditable}
                          style={[
                            !fieldsEditable
                              ? styles.disabledDropDownButtonStyle
                              : styles.dropdownButtonStyle,
                          ]}
                          onPress={() => setShow(true)}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {/* <Image
                                                      source={{
                                                        uri: `https://flagcdn.com/w20/${countryFlag?.toLowerCase()}.png`,
                                                      }}
                                                      style={{
                                                        width: 20,
                                                        height: 16,
                                                        borderRadius: 4,
                                                      }}
                                                    /> */}
                            <Text
                              style={{
                                fontFamily: "PlusJakartaSans_500Medium",
                                fontSize: 18,
                                marginTop: -2,
                              }}
                            >
                              {countryFlag}
                            </Text>
                            <Text
                              style={{
                                color: `${
                                  !fieldsEditable ? "#777B8B" : "#000929"
                                }`,
                                fontFamily: "PlusJakartaSans_500Medium",
                                fontSize: 14,
                              }}
                            >
                              {countryCode}
                            </Text>
                          </View>
                          <Icon
                            name={show ? "chevron-up" : "chevron-down"}
                            style={{ fontSize: 16, color: "#9EA3AE" }}
                          />
                        </TouchableOpacity>
                        <Field
                          name="phoneNumber"
                          component={CustomInputPhone}
                          placeholder="Enter Phone Number"
                          onFocus={() => setPhoneNumberFocused(true)}
                          onBlur={() => setPhoneNumberFocused(false)}
                          phoneNumberFocused={phoneNumberFocused}
                          disabled={!fieldsEditable}
                        />
                      </View>
                      <ErrorMessage
                        name="phoneNumber"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Business Website</Text>
                      <Field
                        name="website"
                        component={CustomInput}
                        placeholder="https://www.example.com"
                        onFocus={() => setWebsiteFocused(true)}
                        onBlur={() => setWebsiteFocused(false)}
                        websiteFocused={websiteFocused}
                        disabled={!fieldsEditable}
                      />
                      <ErrorMessage
                        name="website"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                  </View>
                  {fieldsEditable && (
                    <Button
                      type="submit"
                      mode="contained"
                      onPress={handleSubmit}
                      style={[
                        styles.button,
                        fieldsEditable
                          ? { display: "flex" }
                          : { display: "none" },
                        isDataModified
                          ? { backgroundColor: "#2A85FF" }
                          : { backgroundColor: "#DEDEDE" },
                      ]}
                      labelStyle={styles.buttonLabel}
                      disabled={!isDataModified}
                    >
                      Save Changes
                    </Button>
                  )}

                  <CountryPicker
                    enableModalAvoiding={true}
                    onBackdropPress={() => setShow(false)}
                    searchMessage="Search Country"
                    show={show}
                    style={{
                      // Styles for whole modal [View]
                      modal: {
                        flex: 0.5,
                      },
                      // Styles for modal backdrop [View]
                      // backdrop: {

                      // },
                      // // Styles for bottom input line [View]
                      // line: {

                      // },
                      // // Styles for list of countries [FlatList]
                      // itemsList: {

                      // },
                      // // Styles for input [TextInput]
                      // textInput: {
                      //     height: 80,
                      //     borderRadius: 0,
                      // },
                      // // Styles for country button [TouchableOpacity]
                      // countryButtonStyles: {
                      //     height: 80
                      // },
                      // // Styles for search message [Text]
                      // searchMessageText: {

                      // },
                      // // Styles for search message container [View]
                      // countryMessageContainer: {

                      // },
                      // // Flag styles [Text]
                      // flag: {

                      // },
                      // // Dial code styles [Text]
                      // dialCode: {

                      // },
                      // // Country name styles [Text]
                      // countryName: {

                      // }
                    }}
                    pickerButtonOnPress={(item) => {
                      setShow(false);
                      setCountryFlag(item?.flag);
                      setCountryCode(item?.dial_code);
                    }}
                  />
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "column",
    gap: 16,
  },
  content: {
    display: "flex",
  },
  label: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#000929",
  },
  ProfileContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
    gap: 20,
  },
  businessLogo: {
    width: 100,
    height: 100,
  },
  profileUploadButton: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 40,
    width: 142,
  },
  profileUploadLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  form: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  formFields: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  inputLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#000929",
  },
  input: {
    borderColor: "#CCE2FF",
    borderWidth: 1,
    backgroundColor: "#F3F8FF",
    borderRadius: 8,
    fontSize: 14,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#000929",
  },
  disabledInput: {
    borderColor: "#DEDEDE",
    borderWidth: 1,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    fontSize: 14,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#777B8B",
  },
  inputPhone: {
    flex: 1,
    borderColor: "#CCE2FF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#F3F8FF",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 14,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#000929",
  },
  disabledInputPhone: {
    flex: 1,
    borderColor: "#DEDEDE",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#eeeeee",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 14,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#777B8B",
  },
  focusedInput: {
    backgroundColor: "white",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    marginTop: "30%",
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "white",
  },
  dropdownButtonStyle: {
    display: "flex",
    borderColor: "#CCE2FF",
    borderWidth: 1,
    backgroundColor: "#F3F8FF",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    gap: 8,
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDropDownButtonStyle: {
    display: "flex",
    borderColor: "#dedede",
    borderWidth: 1,
    backgroundColor: "#eeeeee",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    gap: 8,
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const CustomInput = ({
  field,
  form: { touched, errors, setFieldValue },
  businessNameFocused,
  addressFocused,
  phoneNumberFocused,
  websiteFocused,
  disabled,
  ...props
}) => {
  const isFocused =
    field.name === "businessName"
      ? businessNameFocused
      : field.name === "address"
      ? addressFocused
      : field.name === "website"
      ? websiteFocused
      : phoneNumberFocused;
  return (
    <TextInput
      {...props}
      editable={!disabled}
      name={field.name}
      value={field.value}
      onChangeText={(text) => setFieldValue(field.name, text)}
      style={[
        disabled ? styles.disabledInput : styles.input,
        isFocused ? styles.focusedInput : null,
      ]}
    />
  );
};
const CustomInputPhone = ({
  field,
  form: { touched, errors, setFieldValue },
  businessNameFocused,
  addressFocused,
  phoneNumberFocused,
  websiteFocused,
  disabled,
  ...props
}) => {
  const isFocused =
    field.name === "businessName"
      ? businessNameFocused
      : field.name === "address"
      ? addressFocused
      : field.name === "website"
      ? websiteFocused
      : phoneNumberFocused;
  return (
    <TextInput
      {...props}
      editable={!disabled}
      name={field.name}
      value={field.value}
      onChangeText={(text) => setFieldValue(field.name, text)}
      style={[
        disabled ? styles.disabledInputPhone : styles.inputPhone,
        isFocused ? styles.focusedInput : null,
      ]}
    />
  );
};
export default BusinessInfoSettings;
