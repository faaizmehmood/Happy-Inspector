import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import DefaultProfileImg from "../../../assets/images/icons/default-profile.svg";
import ProfileSettingsCard from "../../components/profileSettingsCard/ProfileSettingsCard";
import { userContext } from "../../lib/userContext";
import LogoutIcon from '../../../assets/images/icons/LogOut.svg'
import * as SecureStore from 'expo-secure-store';
import { StoreUserRole } from "../../store";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '7115900390-27t0172r1b4b7uqoua76s1ia3pvfgq9g.apps.googleusercontent.com', // Replace with your Web Client ID
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

const Profile = ({ navigation }) => {
  const { userData } = userContext();
  const { clearRole } = StoreUserRole();

  const profileSettings = [
    {
      id: 1,
      title: "Personal Info",
      screenPath: "PersonalInfoSettings",
    },
    {
      id: 2,
      title: "Business Info",
      screenPath: "BusinessInfoSettings",
    },
    {
      id: 3,
      title: "Change Password",
      // screenPath: "PaymentPlanScreen", 
      screenPath: "ChangePassword",
    },
    userData?.role !== "SUBUSER" && {
      id: 4,
      title: "Upgrade Plan",
      screenPath: "PaymentPlanScreen",
    },
  ].filter(Boolean);;

   const signOutUser = async () => {
      try {
        // const isSignedIn = await GoogleSignin.signIn(); // Check if user is signed in
        // if (isSignedIn) {
          await GoogleSignin.signOut();
          console.log('User signed out successfully');
        // } 
        // else {
        //   console.log('No user is signed in');
        // }
      } catch (error) {
        console.log('Error signing out: ', error);
      }
    };

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to log out?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout canceled"),
          style: "cancel", // Gives the "No" button a distinct look
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync("isAuthenticated");
              await SecureStore.deleteItemAsync("userData");
              clearRole();
              signOutUser();
              navigation.navigate('Login')
              console.log("User logged out and data removed.");
              // Add navigation or redirection logic here
            } catch (error) {
              console.error("Error during logout:", error);
            }
          }
          // Add your logout logic here
        },
      ],
      { cancelable: false } // Prevents closing the alert by tapping outside
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {userData?.profilePicture?.url ? (
          <Image
            source={{ uri: userData?.profilePicture?.url }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        ) : (
          <DefaultProfileImg style={styles.profileImage} />
        )}
        <Text style={styles.profileName}>{userData.fullname}</Text>
      </View>
      <View style={styles.settingCardConaitner}>
        {profileSettings.map((profileSetting) => (
          <ProfileSettingsCard
            key={profileSetting.id}
            title={profileSetting.title}
            screenPath={profileSetting.screenPath}
            navigation={navigation}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        style={styles.cardContainer}
      // onPress={() => navigation.navigate(screenPath, userData)}
      >
        <LogoutIcon />
        <Text style={styles.cardTitle}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileName: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    marginTop: 12,
  },
  settingCardConaitner: {
    marginTop: 32,
    flexDirection: "column",
    gap: 16,
  },
  cardContainer: {
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FBC0C0",
    paddingHorizontal: 14,
    // paddingVertical: 13.5,
    borderRadius: 8,
    height: 50,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  cardTitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#F13333",
    marginLeft: 10
  },
});

export default Profile;
