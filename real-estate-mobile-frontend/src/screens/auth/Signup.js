import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleLogo from "../../../assets/images/icons/google-logo.svg";
import FacebookLogo from "../../../assets/images/icons/facebook-logo.svg";
import { useLoader } from "../../lib/loaderContext";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "../../constants/api_Url";

const Signup = ({ navigation }) => {
  const { setUserData } = userContext();
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const { setLoading } = useLoader();
  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(4, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please enter your details.
        </Text>
        <Formik
          initialValues={{ fullname: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const response = await axios.post(
                `${apiUrl}/api/auth/createSignupOTP`,
                {
                  email: values.email,
                },
                {
                  withCredentials: true,
                }
              );
              await SecureStore.setItemAsync("otpId", response.data.otpId);
              await SecureStore.setItemAsync(
                "otpExpiry",
                response.data.otpExpiry
              );
              setUserData((prevData) => ({
                ...prevData,
                otpId: response.data.otpId,
                otpExpiry: response.data.otpExpiry,
              }));
              setLoading(false);

              ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

              navigation.navigate("OtpVerificationForSignup", {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
              });
            } catch (err) {
              setLoading(false);
              ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);

              console.log(err);
            }
          }}
        >
          {({ handleSubmit }) => (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <Field
                  name="fullname"
                  component={CustomInputName}
                  placeholder="Full name"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  nameFocused={nameFocused}
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
                />
                <ErrorMessage
                  name="email"
                  component={Text}
                  style={styles.error}
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>Password</Text>
                <Field
                  name="password"
                  component={CustomPasswordInput}
                  placeholder="Enter Password"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  passwordFocused={passwordFocused}
                  isPasswordSecure={isPasswordSecure}
                  setIsPasswordSecure={setIsPasswordSecure}
                />
                <ErrorMessage
                  name="password"
                  component={Text}
                  style={styles.error}
                />
              </View>
              <Text style={styles.minPassInst}>
                Must be at least 8 characters.
              </Text>
              <View style={styles.socialLoginButtonGroup}>
                <Button
                  type="submit"
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                >
                  Signup
                </Button>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider}></View>
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider}></View>
                </View>
                <Button
                  mode="outlined"
                  onPress={() => console.log("Pressed")}
                  style={styles.outlinedButton}
                >
                  <View style={styles.buttonContent}>
                    <GoogleLogo width={24} />
                    <Text style={styles.outlinedButtonLabel}>
                      Continue with Google
                    </Text>
                  </View>
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => console.log("Pressed")}
                  style={styles.outlinedButton}
                >
                  <View style={styles.buttonContent}>
                    <FacebookLogo width={24} />
                    <Text style={styles.outlinedButtonLabel}>
                      Continue with Facebook
                    </Text>
                  </View>
                </Button>
              </View>
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Login
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const CustomInputName = ({
  field,
  form: { touched, errors, setFieldValue },
  nameFocused,
  ...props
}) => (
  <TextInput
    {...props}
    name={field.name}
    value={field.value}
    onChangeText={(text) => setFieldValue(field.name, text)}
    style={[
      styles.input,
      nameFocused ? styles.focusedInput : { backgroundColor: "#F3F8FF" },
    ]}
  />
);
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

const CustomPasswordInput = ({
  field,
  form: { touched, errors, setFieldValue },
  passwordFocused,
  isPasswordSecure,
  setIsPasswordSecure,
  ...props
}) => (
  <View
    style={[
      styles.passwordInputContainer,
      passwordFocused
        ? { backgroundColor: "white" }
        : { backgroundColor: "#F3F8FF" },
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
      onPress={() => setIsPasswordSecure(!isPasswordSecure)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 20,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#808494",
    marginTop: 8,
  },
  form: {
    marginTop: 24,
    width: "100%",
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
  passwordInputContainer: {
    borderColor: "#CCE2FF",
    borderWidth: 1,
    backgroundColor: "#F3F8FF",
    borderRadius: 8,
    height: 50,
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
  minPassInst: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: "#6C727F",
    marginBottom: 24,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#2A85FF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  buttonLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  divider: {
    borderColor: "#D6D6D6",
    borderBottomWidth: 1,
    flex: 1,
  },
  dividerText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: "#A0A0A0",
    marginHorizontal: 18,
  },
  outlinedButton: {
    borderColor: "#D6DDEB",
    borderRadius: 8,
    marginBottom: 16,
    height: 50,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
  },
  outlinedButtonLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: "#000929",
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  loginText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    marginTop: 4,
    color: "#808494",
    textAlign: "center",
  },
  loginLink: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#000929",
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

export default Signup;
