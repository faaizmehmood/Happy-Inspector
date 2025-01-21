import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ToastAndroid } from "react-native";
import { Button } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import { apiUrl } from "../../constants/api_Url";

const ResetPassword = ({ navigation, route }) => {
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  // Create separate states to manage the secure text entry of the password fields
  const [isCurrentPasswordSecure, setIsCurrentPasswordSecure] =
    useState(true);
  const [isNewPasswordSecure, setIsNewPasswordSecure] = useState(true);

  const { setLoading } = useLoader();

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(4, "Password must be at least 4 characters!")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .min(4, "Password must be at least 4 characters!")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
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
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            // Password change logic
            try {
              const response = await axios.post(
                `${apiUrl}/api/auth/resetPassword`,
                {
                  email: route.params.email,
                  newPassword: values.newPassword,
                },
                {
                  withCredentials: true,
                }
              );
              setLoading(false);
              ToastAndroid.show(
                response.data.message,
                ToastAndroid.SHORT
              );

              // console.log("Response", response.data);
              navigation.navigate("Login");
            } catch (error) {
              setLoading(false);
              ToastAndroid.show(
                error.response.data.message,
                ToastAndroid.SHORT
              );

              console.log("Error", error);
            }
          }}
        >
          {({ handleSubmit, dirty }) => (
            <View style={styles.form}>
              <View style={styles.formFields}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    New Password
                  </Text>
                  <Field
                    name="newPassword"
                    component={CustomPasswordInput}
                    placeholder="Enter Password"
                    onFocus={() =>
                      setNewPasswordFocused(true)
                    }
                    onBlur={() =>
                      setNewPasswordFocused(false)
                    }
                    newPasswordFocused={newPasswordFocused}
                    isPasswordSecure={isNewPasswordSecure}
                    setIsPasswordSecure={
                      setIsNewPasswordSecure
                    }
                  />
                  <ErrorMessage
                    name="newPassword"
                    component={Text}
                    style={styles.error}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Confirm Password
                  </Text>
                  <Field
                    name="confirmPassword"
                    component={CustomPasswordInput}
                    placeholder="Enter Password"
                    onFocus={() =>
                      setConfirmPasswordFocused(true)
                    }
                    onBlur={() =>
                      setConfirmPasswordFocused(false)
                    }
                    confirmPasswordFocused={
                      confirmPasswordFocused
                    }
                    isPasswordSecure={
                      isCurrentPasswordSecure
                    }
                    setIsPasswordSecure={
                      setIsCurrentPasswordSecure
                    }
                  />
                  <ErrorMessage
                    name="confirmPassword"
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
                  dirty
                    ? { backgroundColor: "#2A85FF" }
                    : { backgroundColor: "#DEDEDE" },
                ]}
                labelStyle={styles.buttonLabel}
                disabled={!dirty}
              >
                Continue
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </>
  );
};

const CustomPasswordInput = ({
  field,
  form: { touched, errors, setFieldValue },
  confirmPasswordFocused,
  newPasswordFocused,
  isPasswordSecure,
  setIsPasswordSecure,
  ...props
}) => {
  const isFocused =
    field.name === "currentPassword"
      ? confirmPasswordFocused
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
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "white",
  },
});

export default ResetPassword;
