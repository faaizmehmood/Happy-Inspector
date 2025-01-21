import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ToastAndroid } from "react-native";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-native-paper";
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import * as SecureStore from "expo-secure-store";
import { userContext } from "../../lib/userContext";
import { apiUrl } from "../../constants/api_Url";

const ForgotPassword = ({ navigation }) => {
  const [emailFocused, setEmailFocused] = useState(false);
  const { setLoading } = useLoader();
  const { setUserData } = userContext();

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/forgotPassword`,
        {
          email: values.email,
        },
        {
          withCredentials: true,
        }
      );
      await SecureStore.setItemAsync("otpId", response.data.otpId);
      await SecureStore.setItemAsync("otpExpiry", response.data.otpExpiry);
      setUserData((prevData) => ({
        ...prevData,
        otpId: response.data.otpId,
        otpExpiry: response.data.otpExpiry,
      }));
      setLoading(false);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      navigation.navigate("OtpVerification", {
        email: values.email,
      });
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
      console.log("Error", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Forget Password</Text>
          <Text style={styles.subheading}>
            Enter your email for the verification process, we will send a
            4-digit code to your email.
          </Text>
        </View>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleFormSubmit(values)}
        >
          {({ handleSubmit, isValid, dirty }) => (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <Field
                  name="email"
                  component={CustomInput}
                  placeholder="hi@example.com"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  emailFocused={emailFocused}
                />
                <ErrorMessage
                  name="email"
                  component={Text}
                  style={styles.error}
                />
              </View>
              <Button
                type="submit"
                mode="contained"
                onPress={handleSubmit}
                style={[
                  styles.button,
                  // !isValid ||
                  !dirty ? styles.disabledButton : styles.enabledButton,
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

const CustomInput = ({
  field,
  form: { touched, errors, setFieldValue },
  emailFocused,
  ...props
}) => (
  <TextInput
    {...props}
    name={field.name}
    value={field.value}
    onChangeText={(text) => setFieldValue(field.name, text)}
    style={[
      styles.input,
      emailFocused ? styles.focusedInput : { backgroundColor: "#F3F8FF" },
    ]}
  />
);

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
    marginTop: 24,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#000929",
    marginBottom: 8,
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
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  enabledButton: {
    backgroundColor: "#2A85FF",
  },
  disabledButton: {
    backgroundColor: "#cbcbcb",
  },
  buttonLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: "white",
  },
  focusedInput: {
    backgroundColor: "white",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
});

export default ForgotPassword;
