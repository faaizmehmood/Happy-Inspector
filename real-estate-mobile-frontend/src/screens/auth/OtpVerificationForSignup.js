import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ToastAndroid, Platform, TouchableOpacity } from "react-native";
import { OTPTextInput } from '@sectiontn/otp-input';
import { Button } from "react-native-paper";
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "../../constants/api_Url";

const OtpVerificationForSignup = ({ navigation, route }) => {
    const { fullname, email, password } = route.params; // Retrieve otpId from route params
    const { userData, setUserData } = userContext();
    const [userEnteredOTP, setUserEnteredOTP] = useState(""); // State to store OTP value
    const [otpId, setOtpId] = useState(userData.otpId);
    const { setLoading } = useLoader();
    // OTP Expiry Time
    const [otpExpiryTime, setOtpExpiryTime] = useState(0);
    const [restartTimer, setRestartTimer] = useState(false);
    // Fetch the user details from the backend API
    const fetchUserDetails = async () => {
        const response = await axios.get(
            `${apiUrl}/api/user/fetchUserDetails`,
            {
                withCredentials: true,
            }
        );

        return response.data.userDetails;
    };

    // Store the user data in the async storage
    const storeDataInSecureStorage = async () => {
        const userDetails = await fetchUserDetails();

        try {
            await SecureStore.setItemAsync(
                "isAuthenticated",
                JSON.stringify(true)
            );
            await SecureStore.setItemAsync(
                "userData",
                JSON.stringify(userDetails)
            );

            setUserData(userDetails);
        } catch (e) {
            console.log("Error saving data", e);
        }
    };

    const handleOtpSubmit = async () => {
        setLoading(true);
        // Add OTP submission logic here
        if (otpExpiryTime <= 0) {
            setLoading(false);
            ToastAndroid.show("OTP Expired!", ToastAndroid.SHORT);
            return;
        } else {
            try {
                const response = await axios.post(
                    `${apiUrl}/api/auth/createUserAccount`,
                    {
                        fullname: fullname,
                        email: email,
                        password: password,
                        userEnteredOTP: userEnteredOTP,
                        otpId: otpId,
                        deviceType: "mobile",
                        signupType: "normal",
                    },
                    {
                        withCredentials: true,
                    }
                );

                // console.log("Create User Account Response", response.data);

                await storeDataInSecureStorage();

                setLoading(false);

                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

                navigation.navigate("PersonalDetails", {
                    userEmail: response.data.userData.email,
                });
            } catch (error) {
                setLoading(false);
                ToastAndroid.show(
                    error.response.data.message,
                    ToastAndroid.SHORT
                );

                console.log("Error", error);
            }
        }
    };

    const getTimeDifference = (expiry) => {
        const currentTime = new Date().getTime();
        const expiryTime = new Date(expiry).getTime();

        return Math.floor((expiryTime - currentTime) / 1000);
    };

    useEffect(() => {
        if (getTimeDifference(userData.otpExpiry) > 120) {
            return setOtpExpiryTime(120);
        }
        setOtpExpiryTime(getTimeDifference(userData.otpExpiry));
    }, [userData.otpExpiry]);

    useEffect(() => {
        const timer = setInterval(() => {
            setOtpExpiryTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [restartTimer, otpExpiryTime]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Resend OTP logic

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiUrl}/api/auth/resendOTP`,
                {
                    otpId: otpId,
                },
                {
                    withCredentials: true,
                }
            );
            console.log("Resend OTP response", response.data);

            setOtpId(response.data.otpId);
            setOtpExpiryTime(getTimeDifference(response.data.otpExpiry));

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

            setRestartTimer((prev) => !prev);

            setLoading(false);

            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        } catch (error) {
            setLoading(false);
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);

            console.log("Error resend OTP:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Check your Inbox</Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Text style={styles.subheading}>
                        We have sent the code to{" "}
                    </Text>
                    <Text style={[styles.emailText]}>{email}</Text>
                </View>
            </View>
            <View style={styles.form}>
                <View style={styles.otpVerificationGroup}>

                    <OTPTextInput
                        inputCount={4}
                        containerStyle={{ width: "100%", height: 65 }}
                        textInputStyle={styles.otpInputField}
                        tintColor={"#2A85FF"}
                        offTintColor={"#CCE2FF"}
                        onTextChangeHandler={(pin) => {
                            setUserEnteredOTP(pin);
                        }}
                        editable={true}
                        autoFocus={false}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    />

                    <Text style={styles.expiryText}>
                        Code expires in: {formatTime(otpExpiryTime)}
                    </Text>
                    <Text style={styles.resendText}>
                        Didn't receive the code?{" "}
                        <Text
                            style={[
                                styles.resendLink,
                                {
                                    color:
                                        otpExpiryTime !== 0
                                            ? "#6C727F"
                                            : "#000929",
                                },
                            ]}
                            disabled={otpExpiryTime !== 0}
                            onPress={() => handleResendOTP()}
                        >
                            Resend
                        </Text>
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleOtpSubmit}
                    disabled={userEnteredOTP.length < 4}
                    style={[styles.button, userEnteredOTP.length < 4 ? { backgroundColor: "#cbcbcb" } : { backgroundColor: "#2A85FF" }]}
                >

                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

            </View>
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
        textAlign: "center",
    },
    subheading: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 14,
        color: "#808494",
        textAlign: "center",
    },
    emailText: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 14,
        color: "#000929",
    },
    form: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    button: {
        borderRadius: 8,
        justifyContent: "center",
        alignItems: 'center',
        padding: 15,
    },
    buttonText: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 14,
        color: "#ffff",
    },
    otpVerificationGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 0,
        paddingTop: 0,
        gap: 20,
    },
    expiryText: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 14,
        color: "#808494",
    },
    resendText: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 14,
        color: "#6C727F",
    },
    resendLink: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 14,
        color: "#000929",
    },
    otpInputField: {
        width: 65,
        height: 65,
        borderWidth: 2,
        borderRadius: 8,
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 24,
        borderBottomWidth: 2,
        color: "#000929",
        borderColor: "#CCE2FF",
        backgroundColor: "#F3F8FF",
    },
});

export default OtpVerificationForSignup;
