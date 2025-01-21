import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ToastAndroid,
  ScrollView,
  Alert,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import DefaultProfileImg from "../../../assets/images/icons/default-profile.svg";
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import * as SecureStore from "expo-secure-store";
import { userContext } from "../../lib/userContext";
import { apiUrl } from "../../constants/api_Url";
import { CountryPicker } from "react-native-country-codes-picker";

const PersonalDetails = ({ navigation, route }) => {
  const { userData, setUserData } = userContext();
  const { setLoading } = useLoader();

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [countryFlag, setCountryFlag] = useState('🇨🇦');
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [localImage, setLocalImage] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri);
      setImageUploaded(true);
    }
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Phone number must be only digits")
      .min(10, "Phone number must be at least 10 characters")
      .max(10, "Phone number must be at most 10 characters")
      .required("Phone number is required"),
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Personal Details</Text>
          <Text style={styles.subheading}>
            Please start your profile below by filling in your personal
            information
          </Text>
        </View>
        <Formik
          initialValues={{
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);

            const data = new FormData();

            if (localImage !== "") {
              let imageType = `image/${localImage?.split('.').pop()}`
              let imageName = localImage?.split('/').pop()

              data.append('image', {
                uri: localImage,
                type: imageType,
                name: imageName
              });
            }

            data.append("userPhoneNumber", countryCode + values?.phoneNumber);
            data.append("userEmail", route?.params?.userEmail ? route?.params?.userEmail : userData?.email);

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

            try {
              const data = new FormData();

              if (localImage) {
                let imageType = `image/${localImage?.split('.').pop()}`;
                let imageName = localImage?.split('/').pop();

                data.append('image', {
                  uri: localImage.startsWith('file://') ? localImage : `file://${localImage}`,
                  type: imageType,
                  name: imageName,
                });
              }

              data.append("userPhoneNumber", `${countryFlag}${countryCode}${values?.phoneNumber}`);
              data.append("userEmail", route?.params?.userEmail || userData?.email);

              const response = await axios.patch(
                `${apiUrl}/api/user/addPersonalDetails`,
                data,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                  },
                  withCredentials: true,
                }
              );

              if (response?.status === 200 || response?.status === 201) {

                // console.log('response?.data', response?.data)

                const updatedUserData = {
                  ...userData,
                  personalPhoneNumber: `${countryFlag}${countryCode}${values?.phoneNumber}`,
                  profilePicture: response?.data?.profilePicture,
                };

                ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);

                await SecureStore.setItemAsync(
                  "userData",
                  JSON.stringify(updatedUserData)
                );
                setUserData(updatedUserData);
                setLoading(false);
                navigation.navigate("BusinessDetails")
              }
            } catch (error) {
              if (error?.response) {
                const errorMessage = error?.response.data;
                console.log("Backend Error Message in addPersonalDetails:", errorMessage);
                setLoading(false);
                Alert.alert('Error', errorMessage?.message);
              } else {
                console.log("Network Error in addPersonalDetails:", error);
                Alert.alert('Error', 'A network error occurred. Please try again.');
              }
            }

          }
          }
        >
          {({ handleSubmit, values, initialValues }) => {
            // Check if form values have changed from initial values
            useEffect(() => {
              const hasChanged =
                Object.keys(values).some(
                  (key) => values[key] !== initialValues[key]
                ) || localImage !== "";

              setIsDataModified(hasChanged);
            }, [values, localImage]);
            return (
              <View style={styles.form}>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Avatar</Text>
                  <View style={styles.ProfileContent}>
                    {localImage !== "" ? (
                      <Image
                        source={{ uri: localImage ? localImage : userData?.profilePictureURL }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <DefaultProfileImg style={styles.profileImage} />
                    )}
                    <View
                      style={{
                        display: "flex",
                        gap: 16,
                      }}
                    >
                      <Button
                        style={[styles.profileUploadButton]}
                        labelStyle={styles.profileUploadLabel}
                        onPress={pickImage}
                      >
                        {imageUploaded ? "Re-upload" : "Upload"}
                      </Button>
                      {imageUploaded && (
                        <Button
                          style={[styles.profileRemoveButton]}
                          labelStyle={styles.profileRemoveLabel}
                          onPress={() => { setLocalImage(""); setImageUploaded(false) }}
                        >
                          Remove
                        </Button>
                      )}
                    </View>
                  </View>
                </View>

                <View style={[styles.inputGroup, { marginVertical: '8%' }]}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
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
                    onPress={() => navigation.navigate("BusinessDetails")}
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
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
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
  },
  buttonGroup: {
    justifyContent: 'flex-end',
    gap: 16,
    flex: 1,
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

export default PersonalDetails;
