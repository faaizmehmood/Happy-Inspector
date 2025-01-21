import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ToastAndroid, TouchableOpacity, Platform } from "react-native";
import { OTPTextInput } from '@sectiontn/otp-input';
import axios from "axios";
import { useLoader } from "../../lib/loaderContext";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "../../constants/api_Url";

const OtpVerification = ({ navigation, route }) => {
    const { userData, setUserData } = userContext();
    const { email } = route.params; // Retrieve otpId from route params
    const [userEnteredOtp, setUserEnteredOtp] = useState("");
    const { setLoading } = useLoader();

    const handleOtpSubmit = async () => {
        setLoading(true);

        if (otpExpiryTime <= 0) {
            setLoading(false);
            ToastAndroid.show("OTP Expired!", ToastAndroid.SHORT);
            return;
        } else {
            const data = {
                otpId: userData.otpId,
                userEnteredOTP: userEnteredOtp,
            };

            try {
                const response = await axios.post(
                    `${apiUrl}/api/auth/verfiyPasswordResetOTP`,
                    data,
                    {
                        withCredentials: true,
                    }
                );

                setLoading(false);
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                navigation.navigate("ResetPassword", {
                    email: email,
                });
            } catch (error) {
                setLoading(false);
                ToastAndroid.show(
                    error.response.data.message,
                    ToastAndroid.SHORT
                );
                console.log("Error verifying OTP:", error);
            }
        }
    };

    // OTP Expiry Time
    const [otpExpiryTime, setOtpExpiryTime] = useState(0);
    const [restartTimer, setRestartTimer] = useState(false);

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
                    otpId: userData.otpId,
                },
                {
                    withCredentials: true,
                }
            );

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
        <>
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
                                setUserEnteredOtp(pin);
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
                        disabled={userEnteredOtp.length < 4}
                        style={[styles.button, userEnteredOtp.length < 4 ? { backgroundColor: "#cbcbcb" } : { backgroundColor: "#2A85FF" }]}
                    >

                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
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
        color: '#ffff'
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
        color: "#000929",
        borderColor: "#CCE2FF",
        backgroundColor: "#F3F8FF",
    },
});

export default OtpVerification;
