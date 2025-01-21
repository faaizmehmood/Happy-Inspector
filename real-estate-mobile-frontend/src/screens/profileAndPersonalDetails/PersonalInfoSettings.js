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
import DefaultProfileImg from "../../../assets/images/icons/default-profile.svg";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import EditIcon from "../../../assets/images/icons/edit-icon.svg";
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { countriesData } from "../../constants/countriesData";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { userContext } from "../../lib/userContext";
import { useLoader } from "../../lib/loaderContext";
import { apiUrl } from "../../constants/api_Url";
import CustomizeHeader from "./components/CustomizeHeader";
import { CountryPicker } from "react-native-country-codes-picker";

const PersonalInfoSettings = ({ navigation }) => {
  const { userData, setUserData } = userContext();
  const { setLoading } = useLoader();
  const [show, setShow] = useState(false);

  const [countryCode, setCountryCode] = useState(userData?.personalPhoneNumber ?
    `+${userData?.personalPhoneNumber?.split('+')[1]?.slice(0, -10)}` : '+1'
  );
  const [countryFlag, setCountryFlag] = useState(userData?.personalPhoneNumber ? userData?.personalPhoneNumber?.split('+')[0] : '🇨🇦');

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [fieldsEditable, setFieldsEditable] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);
  const [tempImage, setTempImage] = useState(userData?.profilePicture?.url);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
      // console.log('result.assets[0].uri', result.assets[0].uri);

    }
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    personalPhoneNumber: Yup.string()
      .min(10, "Phone number must be at least 10 characters")
      .required("Phone number is required"),
  });

  return (
    <>
      <View style={styles.container}>
        <CustomizeHeader
          goBack
          title={'Personal Info'}
          editIcon={fieldsEditable ? false : true}
          onPressEditButton={() => setFieldsEditable(true)
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.label}>Avatar</Text>
          <View style={styles.ProfileContent}>
            {tempImage ? (
              <Image
                source={{ uri: tempImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            ) : (
              <DefaultProfileImg style={styles.profileImage} />
            )}
            {fieldsEditable && (
              <Button
                style={[styles.profileUploadButton]}
                labelStyle={styles.profileUploadLabel}
                onPress={pickImage}
              >
                Upload
              </Button>
            )}
          </View>
          <Formik
            initialValues={{
              fullname: userData.fullname,
              email: userData.email,
              personalPhoneNumber: userData?.personalPhoneNumber ? `${userData?.personalPhoneNumber?.split('+')[1]?.slice(-10)}` : '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const data = new FormData();

                if (tempImage && tempImage !== userData?.profilePicture?.url) {
                  let imageType = `image/${tempImage?.split('.').pop()}`;
                  let imageName = tempImage?.split('/').pop();

                  data.append('image', {
                    uri: tempImage.startsWith('file://') ? tempImage : `file://${tempImage}`,
                    type: imageType,
                    name: imageName,
                  });
                }

                data.append("personalPhoneNumber", `${countryFlag}${countryCode}${values?.personalPhoneNumber}`);
                data.append("fullname", userData?.fullname);

                const response = await axios.patch(
                  `${apiUrl}/api/user/changePersonalInfo`,
                  data,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Accept: "application/json",
                    },
                    withCredentials: true,
                  }
                );

                // for (let [key, value] of data.entries()) {
                //   if (key === 'image' && typeof value === 'object') {
                //     console.log(`Key: ${key}`);
                //     console.log(`  URI: ${value.uri}`);
                //     console.log(`  Type: ${value.type}`);
                //     console.log(`  Name: ${value.name}`);
                //   } else {
                //     console.log(`Key: ${key}, Value: ${value}`);
                //   }
                // }

                if (response?.status == 200 || response?.status == 201) {

                  const updatedUserData = {
                    ...userData,
                    fullname: response?.data?.userDetails?.fullname,
                    email: response?.data?.userDetails?.email,
                    personalPhoneNumber: response?.data?.userDetails?.personalPhoneNumber,
                    profilePicture: response?.data?.userDetails?.profilePicture,
                  };

                  await SecureStore.setItemAsync(
                    "userData",
                    JSON.stringify(updatedUserData)
                  );
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
                  console.log("Backend Error Message in changePersonalInfo:", errorMessage);
                  setLoading(false);
                  Alert.alert('Error', errorMessage?.message);
                } else {
                  setLoading(false);
                  console.log("Network Error in changePersonalInfo:", error);
                  Alert.alert('Error', 'A network error occurred. Please try again.');
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
                  countryCode !== userData.countryCode;

                setIsDataModified(hasChanged);
              }, [values, tempImage]);

              return (
                <View style={styles.form}>
                  <View style={styles.formFields}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Name</Text>
                      <Field
                        name="fullname"
                        component={CustomInput}
                        placeholder="Enter Full Name"
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => setNameFocused(false)}
                        nameFocused={nameFocused}
                        disabled={!fieldsEditable}
                      />
                      <ErrorMessage
                        name="fullname"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <Field
                        name="email"
                        component={CustomInput}
                        placeholder="hi@example.com"
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        emailFocused={emailFocused}
                        disabled={!fieldsEditable}
                      />
                      <ErrorMessage
                        name="email"
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
                            >{countryFlag}</Text>
                            <Text
                              style={{
                                color: `${!fieldsEditable ? "#777B8B" : "#000929"
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
                          name="personalPhoneNumber"
                          component={CustomInputPhone}
                          placeholder="Enter Phone Number"
                          onFocus={() => setPhoneNumberFocused(true)}
                          onBlur={() => setPhoneNumberFocused(false)}
                          phoneNumberFocused={phoneNumberFocused}
                          disabled={!fieldsEditable}
                        />
                      </View>
                      <ErrorMessage
                        name="personalPhoneNumber"
                        component={Text}
                        style={styles.error}
                      />
                    </View>
                  </View>
                  <Button
                    type="submit"
                    mode="contained"
                    onPress={handleSubmit}
                    style={[
                      styles.button,
                      fieldsEditable ? { display: "flex" } : { display: "none" },
                      isDataModified
                        ? { backgroundColor: "#2A85FF" }
                        : { backgroundColor: "#DEDEDE" },
                    ]}
                    labelStyle={styles.buttonLabel}
                  // keep the button disabled if no changes have been made
                  // disabled={!isDataModified}
                  >
                    Save Changes
                  </Button>

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
  button: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    marginTop: '60%'
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
  dropdownMenuStyle: {
    // backgroundColor:'red',
    marginTop: -30,
    height: 110,
    width: '88%',
    borderRadius: 10
  }
});

const CustomInput = ({
  field,
  form: { touched, errors, setFieldValue },
  nameFocused,
  emailFocused,
  phoneNumberFocused,
  disabled,
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
  nameFocused,
  emailFocused,
  phoneNumberFocused,
  disabled,
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
      editable={!disabled}
      name={field.name}
      keyboardType="number-pad"
      value={field.value}
      onChangeText={(text) => setFieldValue(field.name, text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ''))}
      style={[
        disabled ? styles.disabledInputPhone : styles.inputPhone,
        isFocused ? styles.focusedInput : null,
      ]}
    />
  );
};

export default PersonalInfoSettings;
