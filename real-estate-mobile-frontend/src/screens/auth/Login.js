import React, { useEffect, useState } from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginButton,GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';

import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleLogo from "../../../assets/images/icons/google-logo.svg";
import FacebookLogo from "../../../assets/images/icons/facebook-logo.svg";
import * as SecureStore from "expo-secure-store";
import { useLoader } from "../../lib/loaderContext";
import { userContext } from "../../lib/userContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { apiUrl } from "../../constants/api_Url";
// import * as Google from 'expo-auth-session/providers/google'
// import * as WebBrowser from 'expo-web-browser'
// import {GoogleAuthProvider,onAuthStateChanged,signInWithCredential} from "firebase/auth"
// GoogleSignin.configure({
//   // webClientId: '7115900390-v0ea568kj7ei40uhe6j69vu7clrcvlck.apps.googleusercontent.com', // Replace with your Web Client ID
//   webClientId: '7115900390-27t0172r1b4b7uqoua76s1ia3pvfgq9g.apps.googleusercontent.com', // Replace with your Web Client ID
//   offlineAccess: true,
//   scopes: ['profile', 'email'],
// });
// WebBrowser.maybeCompleteAuthSession();
const Login = () => {
useEffect(() => {
  GoogleSignin.configure({
    // webClientId: '7115900390-v0ea568kj7ei40uhe6j69vu7clrcvlck.apps.googleusercontent.com', // Replace with your Web Client ID
    // webClientId: '7115900390-27t0172r1b4b7uqoua76s1ia3pvfgq9g.apps.googleusercontent.com', // Replace with your Web Client ID
    // webClientId: '896671828008-754as8pc0n66psi6oinoeiti7pfmlvbf.apps.googleusercontent.com', // Replace with your Web Client ID
    
    // webClientId: '7115900390-dgonnq5hvmlpiq0u8l725k5ascne0u62.apps.googleusercontent.com.com', // Replace with your Web Client ID
    webClientId: '263742619601-t1ohjpg1dmnecsoljbait2h2nqga3eg0.apps.googleusercontent.com', // Replace with your Web Client ID
    offlineAccess: true,
    scopes: ['profile', 'email'],
  });
  

}, [])


  const navigation = useNavigation();
  const { setUserData } = userContext();

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  // const [request, response , promptAsync] = Google.useAuthRequest({
  //   iosClientId:'7115900390-ldqes5vl805qedudo1m6cd5at4tmd2ll.apps.googleusercontent.com',
  //   androidClientId:'7115900390-79jgg6m6ecm2bg13lfp4josuhi6au1th.apps.googleusercontent.com'
  // })
  const { setLoading } = useLoader();

  const [isSigningIn, setIsSigningIn] = useState(false);

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

  const handleGoogleSignIn = async () => {
    // if (isSigningIn) return; // Avoid multiple sign-in attempts
    // setIsSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices(); // Ensure Google Play Services are available
      const userInfo = await GoogleSignin.signIn(); // Trigger Google Sign-In
      console.log('Google Sign-In Success:', userInfo);
      loginSignupWithSocial(userInfo?.data?.user?.name,userInfo?.data?.user?.email,'google')

      // Firebase Authentication (Optional)
      /*
      const { idToken } = userInfo;
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log('Firebase User:', userCredential.user);
      */

      // Alert.alert('Success', `Welcome, ${userInfo.user.name}`);
    } catch (error) {
      console.log('Error during Google Sign-In:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsSigningIn(false);
    }
  };
  // React.useEffect(()=>{
  //   if (response?.type =='success') {
  //     const {id,token}=response.params;
  //     const credential =GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(AuthenticatorAssertionResponse,credential)
      
  //   }
  // },[response])

  React.useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          Alert.alert("Exit", "Do you want to exit App?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Exit",
              onPress: () => BackHandler.exitApp(),
            },
          ]);
          return true;
        }
      );

      return () => backHandler.remove();
    } else {
      navigation.setOptions({
        gestureEnabled: false,
      });
      return () => {
        navigation.setOptions({
          gestureEnabled: true,
        });
      };
    }
  }, []);

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Fetch the user details from the backend API
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/fetchUserDetails`, {
        withCredentials: true,
      });

      return response?.data?.userDetails;
    } catch (err) {
      console.log("Error Fetching Details", err);
    }
  };
  // const loginSignupWithSocial = async (fullName,email,type,) => {
  //   try {
  //     const response = await axios.post(`${apiUrl}/api/auth/loginSignupWithGoogle`, {
  //       fullname:fullName, 
  //       email:email, 
  //       type:type, 
  //       deviceType:Platform.OS
  //     });
  //     console.log('response',response);
  //     await storeDataInSecureStorage();
      

  //   } catch (err) {
  //     console.log("Error Fetching Details", err);
  //   }
  // };

  const loginSignupWithSocial = async (fullName, email, type) => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/auth/loginSignupWithGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullName,
          email: email,
          type: type,
          deviceType: Platform.OS,
        }),
      });
  
     
  
      const data = await response.json();
      if (data?.message =='User Authenticated!') {
        await storeDataInSecureStorage()

        
      }
      setLoading(false)

  
      // await storeDataInSecureStorage();
    } catch (err) {
      setLoading(false)

      console.log('Error Fetching Details', err);
    }
  };
  

  // Store the user data in the async storage
  const storeDataInSecureStorage = async () => {
    const userDetails = await fetchUserDetails();

    // console.log('userDetails', userDetails)

    try {
      await SecureStore.setItemAsync("isAuthenticated", JSON.stringify(true));
      await SecureStore.setItemAsync("userData", JSON.stringify(userDetails));

      setUserData(userDetails);
      navigation.navigate("BottomTab");
    } catch (e) {
      console.log("Error saving data", e);
    }
  };

   // Function to handle Facebook login
   const handleFacebookLogin = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log("Login success with permissions: ", result.grantedPermissions.toString());
          AccessToken.getCurrentAccessToken().then((data) => {
            console.log('data--->>>',data);
            
            // Fetch user info with access token
            getUserInfo(data.accessToken);
          });
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  };

  const getUserInfo = (accessToken) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: accessToken,
        parameters: {
          fields: {
            string: 'id,name,first_name,last_name,email,picture.type(large)'  // Specify the fields you want to retrieve
          }
        }
      },
      (error, result) => {
        if (error) {
          console.log('Error fetching user info: ', error);
        } else {
          console.log('result',result);
          loginSignupWithSocial(result?.name,result?.email,'facebook')
          
          // setUserInfoFacebook(result)
          // Handle user data here, such as setting it to state or displaying it in the UI
        }
      }
    );
   console.log('------>>>>>>>>>,',infoRequest);
   
    // Start the graph request
    new GraphRequestManager().addRequest(infoRequest).start();
  };
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please enter your details.
        </Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);

            try {
              const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: values.email,
                  password: values.password,
                  deviceType: 'mobile',
                }),
              });
            
              // if (!response.ok) {
              //   const errorData = await response.json();
              //   throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
              // }
              console.log('response',response);
              
            
              const data = await response.json();
              console.log('response coming from login api', data);
            
              await storeDataInSecureStorage();
            
              setLoading(false);
            
              // ToastAndroid.show(
              //     data.message,
              //     ToastAndroid.SHORT
              // );
            } catch (err) {
              console.log('err', err);
            
              setLoading(false);
            
              console.log('error in login api', err);
            
              ToastAndroid.show(err.message, ToastAndroid.SHORT);
            }

            // try {
            //   const response = await axios.post(`${apiUrl}/api/auth/login`, {
            //     email: values.email,
            //     password: values.password,
            //     deviceType: "mobile",
            //   });
            //   // console.log('In test phase')
            //   console.log('response coming from login api', response);

            //   await storeDataInSecureStorage();

            //   setLoading(false);

            //   // ToastAndroid.show(
            //   //     response.data.message,
            //   //     ToastAndroid.SHORT
            //   // );
            // } catch (err) {
            //   console.log("err", err);

            //   setLoading(false);
            //   console.log("error in login api", err);
            //   ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
            // }
          }}

          
        >
          {({ handleSubmit }) => (
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
              <Text
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot Password?
              </Text>
              <View style={styles.socialLoginButtonGroup}>
                <Button
                  type="submit"
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                >
                  Login
                </Button>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider}></View>
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider}></View>
                </View>
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignIn}
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
                  onPress={handleFacebookLogin}
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
                <Text style={styles.signUpText}>
                  Don't have an account?{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate("Signup")}
                  >
                    Sign up for a free trial
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
  forgotPassword: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: "#2A85FF",
    alignSelf: "flex-end",
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
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    // flex: 1,
    backgroundColor: "white",
    width: "100%",
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
  signUpText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    marginTop: 4,
    color: "#808494",
    textAlign: "center",
  },
  signUpLink: {
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

export default Login;





// import React, { useEffect } from 'react';
// import { Button, View, Alert } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { auth, GoogleAuthProvider } from '../../../firebaseConfig';
// import { signInWithCredential } from 'firebase/auth';

// GoogleSignin.configure({
//   webClientId: '612136279732-pc20egl0au7le9ov50lkg0olskcvlpm4.apps.googleusercontent.com', // From Firebase Console
//   offlineAccess: true,
// });

// export default function Login() {
//   useEffect(() => {
//     GoogleSignin.signOut(); // Optional: Clear previous session on app launch
//   }, []);

//   const handleGoogleSignIn = async () => {
//     try {
//       // Google Sign-In
//       await GoogleSignin.hasPlayServices();
//       const { idToken } = await GoogleSignin.signIn();

//       // Authenticate with Firebase
//       const googleCredential = GoogleAuthProvider.credential(idToken);
//       const userCredential = await signInWithCredential(auth, googleCredential);

//       Alert.alert('Sign-In Success', `Welcome ${userCredential.user.displayName}`);
//     } catch (error) {
//       console.log('error',error);
      
//       // console.error('Google Sign-In Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
//     </View>
//   );
// }
// import React, { useState } from 'react';
// import { Button, View, Alert } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// // import { auth } from '../../../firebaseConfig'; // Uncomment if Firebase is configured
// // import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// GoogleSignin.configure({
//   webClientId: '7115900390-27t0172r1b4b7uqoua76s1ia3pvfgq9g.apps.googleusercontent.com', // Replace with your Web Client ID
//   offlineAccess: true,
//   scopes: ['profile', 'email'],
// });

// export default function Login() {
//   const [isSigningIn, setIsSigningIn] = useState(false);

//   const signOutUser = async () => {
//     try {
//       // const isSignedIn = await GoogleSignin.signIn(); // Check if user is signed in
//       // if (isSignedIn) {
//         await GoogleSignin.signOut();
//         console.log('User signed out successfully');
//       // } 
//       // else {
//       //   console.log('No user is signed in');
//       // }
//     } catch (error) {
//       console.log('Error signing out: ', error);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     if (isSigningIn) return; // Avoid multiple sign-in attempts
//     setIsSigningIn(true);

//     try {
//       await GoogleSignin.hasPlayServices(); // Ensure Google Play Services are available
//       const userInfo = await GoogleSignin.signIn(); // Trigger Google Sign-In
//       console.log('Google Sign-In Success:', userInfo);

//       // Firebase Authentication (Optional)
//       /*
//       const { idToken } = userInfo;
//       const googleCredential = GoogleAuthProvider.credential(idToken);
//       const userCredential = await signInWithCredential(auth, googleCredential);
//       console.log('Firebase User:', userCredential.user);
//       */

//       // Alert.alert('Success', `Welcome, ${userInfo.user.name}`);
//     } catch (error) {
//       console.log('Error during Google Sign-In:', error);
//       Alert.alert('Error', error.message);
//     } finally {
//       setIsSigningIn(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button
//         title="Sign in with Google"
//         onPress={handleGoogleSignIn}
//         disabled={isSigningIn}
//       />
//       <Button
//         title="Sign Out"
//         onPress={signOutUser}
//         disabled={isSigningIn}
//       />
//     </View>
//   );
// }






// import React, { useEffect } from 'react';
// import { Button, Alert } from 'react-native';
// import { useAuthRequest } from 'expo-auth-session';
// // import { firebase } from './firebase'; // Ensure you have firebase configured
// import { getAuth, signInWithCredential,GoogleAuthProvider } from 'firebase/auth';
// import { auth,  } from '../../../firebaseConfig';
// // const auth = getAuth();

// export default function App() {
//   const [request, response, promptAsync] = useAuthRequest({
//     clientId: '612136279732-pc20egl0au7le9ov50lkg0olskcvlpm4.apps.googleusercontent.com', // From Google Developer Console
//     scopes: ['profile', 'email'],
//     redirectUri: 'https://auth.expo.io/@bilal/happy-inspector', // Update with your redirect URI
//   });
//   console.log('response--?',response);
  

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;

//       // Authenticate with Firebase
//       const credential = GoogleAuthProvider.credential(id_token);
//       signInWithCredential(auth, credential)
//         .then((userCredential) => {
//           Alert.alert('Welcome', `Hello ${userCredential.user.displayName}`);
//         })
//         .catch((error) => {
//           console.error('Firebase Sign-in Error:', error);
//           Alert.alert('Error', error.message);
//         });
//     }
//   }, [response,request]);

//   return (
//     <>
//       <Button
//         title="Sign in with Google"
//         // disabled={!request}
//         onPress={() => promptAsync()}
//       />
//     </>
//   );
// }
