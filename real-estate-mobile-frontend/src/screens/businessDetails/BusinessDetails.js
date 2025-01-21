import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import { countriesData } from "../../constants/countriesData";
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "../../constants/api_Url";
import { CountryPicker } from "react-native-country-codes-picker";

const BusinessDetails = ({ navigation, route }) => {
  const { setLoading } = useLoader();
  const { userData, setUserData } = userContext();

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [countryFlag, setCountryFlag] = useState('🇨🇦');
  const [businessNameFocused, setBusinessNameFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [websiteFocused, setWebsiteFocused] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required("Name is required"),
    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .required("Address is required"),
    phoneNumber: Yup.string()
      .min(10, "Phone number must be at least 10 characters")
      .max(10, "Phone number must be at most 10 characters")
      .required("Phone number is required"),
    website: Yup.string()
      // .url("Invalid URL format")
      .required("Website is required"),
  });

  const updateDataInSecureStorage = async (formData) => {
    const updatedUserData = {
      ...userData,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessPhoneNumber: formData.businessPhoneNumber,
      businessWebsite: formData.businessWebsite,
    };

    try {
      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);

      // navigation.navigate("Profile");

      navigation.navigate("PaymentPlanScreen");
    } catch (e) {
      console.log("Error saving data", e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Business Details</Text>
          <Text style={styles.subheading}>
            Please fill your Business information
          </Text>
        </View>
        <Formik
          initialValues={{
            businessName: "",
            address: "",
            phoneNumber: "",
            website: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);

            const formData = {
              businessName: values.businessName || '',
              businessAddress: values.address || '',
              businessPhoneNumber: `${countryFlag}${countryCode}${values?.phoneNumber}`,
              businessWebsite: values.website || '',
              userEmail: userData?.email || '',
            };

            // console.log('formData', formData)
            try {
              const response = await axios.patch(
                `${apiUrl}/api/user/addBusinessDetails`,
                formData
              );

              await updateDataInSecureStorage(formData);

              setLoading(false);

              ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
            } catch (error) {
              setLoading(false);
              ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
              console.log("Error", error);
            }
          }}
        >
          {({ handleSubmit, dirty, isValid, values, initialValues }) => {
            // Check if form values have changed from initial values
            useEffect(() => {
              const hasChanged = Object.keys(values).some(
                (key) => values[key] !== initialValues[key]
              );

              setIsDataModified(hasChanged);
            }, [values]);

            return (
              <View style={styles.form}>
                <View style={styles.formFields}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Business Name</Text>
                    <Field
                      name="businessName"
                      component={CustomInput}
                      placeholder="Inspection Company"
                      onFocus={() => setBusinessNameFocused(true)}
                      onBlur={() => setBusinessNameFocused(false)}
                      businessNameFocused={businessNameFocused}
                    />
                    <ErrorMessage
                      name="businessName"
                      component={Text}
                      style={styles.error}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Business Address</Text>
                    <Field
                      name="address"
                      component={CustomInput}
                      placeholder="Highland Lake, FL"
                      onFocus={() => setAddressFocused(true)}
                      onBlur={() => setAddressFocused(false)}
                      addressFocused={addressFocused}
                    />
                    <ErrorMessage
                      name="address"
                      component={Text}
                      style={styles.error}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Business Phone Number</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.dropdownButtonStyle}
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
                          >{countryFlag}</Text>
                          <Text
                            style={{
                              color: "#000929",
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
                        placeholder="234-567-8910"
                        onFocus={() => setPhoneNumberFocused(true)}
                        onBlur={() => setPhoneNumberFocused(false)}
                        phoneNumberFocused={phoneNumberFocused}
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
                      placeholder="www.example.com"
                      onFocus={() => setWebsiteFocused(true)}
                      onBlur={() => setWebsiteFocused(false)}
                      websiteFocused={websiteFocused}
                    />
                    <ErrorMessage
                      name="website"
                      component={Text}
                      style={styles.error}
                    />
                  </View>
                </View>
                <View style={styles.buttonGroup}>
                  <Button
                    type="submit"
                    mode="contained"
                    onPress={handleSubmit}
                    style={[
                      styles.button,
                      isDataModified
                        ? { backgroundColor: "#2A85FF" }
                        : { backgroundColor: "#DEDEDE" },
                    ]}
                    labelStyle={styles.buttonLabel}
                    disabled={!isDataModified}
                  >
                    Continue
                  </Button>
                  <Button
                    type="submit"
                    mode="contained"
                    onPress={() => navigation.navigate("PaymentPlanScreen")}
                    style={[styles.skipButton]}
                    labelStyle={styles.skipButtonLabel}
                  >
                    Skip
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
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
      </ScrollView>
    </View>
  );
};

const CustomInput = ({
  field,
  form: { touched, errors, setFieldValue },
  businessNameFocused,
  addressFocused,
  phoneNumberFocused,
  websiteFocused,
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
      name={field.name}
      value={field.value}
      onChangeText={(text) => setFieldValue(field.name, text)}
      style={[styles.input, isFocused ? styles.focusedInput : null]}
    />
  );
};

const CustomInputPhone = ({
  field,
  form: { touched, errors, setFieldValue },
  nameFocused,
  emailFocused,
  phoneNumberFocused,
  ...props
}) => {
  const isFocused =
    field.name === "name"
      ? nameFocused
      : field.name === "email"
        ? emailFocused
        : phoneNumberFocused;
  return (
    <TextInput
      {...props}
      name={field.name}
      value={field.value}
      onChangeText={(text) => setFieldValue(field.name, text)}
      style={[styles.inputPhone, isFocused ? styles.focusedInput : null]}
      keyboardType="phone-pad"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 36,
    paddingTop: 0,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginVertical: 24,
  },
  heading: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 20,
    color: "#000929",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#808494",
    textAlign: "center",
  },
  form: {
    flex: 1,
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
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
  buttonGroup: {
    flexDirection: "column",
    gap: 16,
  },
  button: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  skipButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#CCE2FF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "white",
  },
  skipButtonLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#2A85FF",
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
  label: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#000929",
  },
  ProfileContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileUploadButton: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 40,
    width: 142,
  },
  profileRemoveButton: {
    borderWidth: 2,
    borderColor: "#CCE2FF",
    borderRadius: 8,
    height: 40,
    width: 142,
  },
  profileUploadLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  profileRemoveLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#2a85ff",
  },
});

export default BusinessDetails;
