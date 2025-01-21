import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from "react-native";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { useLoader } from "../../lib/loaderContext";
import { apiUrl } from "../../constants/api_Url";

const ChangePassword = ({ navigation, route }) => {
  const { setLoading } = useLoader();

  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);
  const [isCurrentPasswordSecure, setIsCurrentPasswordSecure] = useState(true);
  const [isNewPasswordSecure, setIsNewPasswordSecure] = useState(true);

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(4, "Password must be at least 4 characters!")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(4, "Password must be at least 4 characters!")
      .required("New password is required"),
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Change password</Text>
          <Text style={styles.subheading}>
            Enter your current password and new password.
          </Text>
        </View>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);

            try {
              const response = await axios.patch(
                `${apiUrl}/api/user/changePassword`,
                {
                  // _id: route.params._id,
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                },
                {
                  withCredentials: true,
                }
              );
              setLoading(false);
              ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
              navigation.navigate("Profile");
            } catch (error) {
              setLoading(false);
              ToastAndroid.show(
                error.response.data.message,
                ToastAndroid.SHORT
              );

              console.log(error);
            }
          }}
        >
          {({ handleSubmit, values, initialValues }) => {
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
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <Field
                      name="currentPassword"
                      component={CustomPasswordInput}
                      placeholder="Enter Password"
                      onFocus={() => setCurrentPasswordFocused(true)}
                      onBlur={() => setCurrentPasswordFocused(false)}
                      currentPasswordFocused={currentPasswordFocused}
                      isPasswordSecure={isCurrentPasswordSecure}
                      setIsPasswordSecure={setIsCurrentPasswordSecure}
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component={Text}
                      style={styles.error}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <Field
                      name="newPassword"
                      component={CustomPasswordInput}
                      placeholder="Enter Password"
                      onFocus={() => setNewPasswordFocused(true)}
                      onBlur={() => setNewPasswordFocused(false)}
                      newPasswordFocused={newPasswordFocused}
                      isPasswordSecure={isNewPasswordSecure}
                      setIsPasswordSecure={setIsNewPasswordSecure}
                    />
                    <ErrorMessage
                      name="newPassword"
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
                    isDataModified
                      ? { backgroundColor: "#2A85FF" }
                      : { backgroundColor: "#DEDEDE" },
                  ]}
                  labelStyle={styles.buttonLabel}
                  disabled={!isDataModified} // Disable the button if no data changes
                >
                  Continue
                </Button>
              </View>
            );
          }}
        </Formik>
      </View>
    </>
  );
};

const CustomPasswordInput = ({
  field,
  form: { touched, errors, setFieldValue },
  currentPasswordFocused,
  newPasswordFocused,
  isPasswordSecure,
  setIsPasswordSecure,
  ...props
}) => {
  const isFocused =
    field.name === "currentPassword"
      ? currentPasswordFocused
      : newPasswordFocused;

  return (
    <View
      style={[
        styles.passwordInputContainer,
        isFocused ? { backgroundColor: "white" } : null,
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        },
      ]}
    >
      <TextInput
        {...props}
        name={field.name}
        value={field.value}
        onChangeText={(text) => setFieldValue(field.name, text)}
        style={{
          flex: 1,
          fontFamily: "PlusJakartaSans_500Medium",
          color: "#000929",
          height: 40,
        }}
        secureTextEntry={isPasswordSecure}
      />
      <Icon
        name={isPasswordSecure ? "eye-off" : "eye"}
        size={24}
        color="#A0A0A0"
        onPress={() => setIsPasswordSecure((prevState) => !prevState)}
      />
    </View>
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
  },
  subheading: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#808494",
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
  passwordInputContainer: {
    borderColor: "#CCE2FF",
    borderWidth: 1,
    backgroundColor: "#F3F8FF",
    borderRadius: 8,
    // height: 50,
    paddingVertical: 2,
    paddingHorizontal: 16,
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
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "white",
  },
});

export default ChangePassword;
