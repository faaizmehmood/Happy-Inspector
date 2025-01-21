import * as React from "react";
import { Alert, BackHandler, Platform, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../dashboard/Dashboard";
import Properties from "../properties/Properties";
import Report from "../reports/Report";
import Template from "../templates/Template";
import {
  DashboardLabelSvg,
  InspectionLabelSvg,
  MyTeamsLabelSvg,
  PropertiesLabelSvg,
  ReportLabelSvg,
  TemplateLabelSvg,
} from "../../svg/BottomTabLabelsSvg";
import Inspection from "../inspections/Inspection";
import MyTeamsDetail from "../myTeams/MyTeamsDetail";
import { userContext } from "../../lib/userContext";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "../../constants/api_Url";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const navigation = useNavigation();
  const { userData, setUserData } = userContext();

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

  // Store the user data in the async storage
  const storeDataInSecureStorage = async () => {
    const userDetails = await fetchUserDetails();

    // console.log('userDetails', userDetails)

    try {
      await SecureStore.setItemAsync("isAuthenticated", JSON.stringify(true));
      await SecureStore.setItemAsync("userData", JSON.stringify(userDetails));

      setUserData(userDetails);
    } catch (e) {
      console.log("Error saving data", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  // React.useEffect(() => {
  //     if (Platform.OS === 'android') {
  //         const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //             Alert.alert(
  //                 'Exit',
  //                 'Do you want to exit App?',
  //                 [
  //                     {
  //                         text: 'Cancel',
  //                         onPress: () => null,
  //                         style: 'cancel',
  //                     },
  //                     {
  //                         text: 'Exit',
  //                         onPress: () => BackHandler.exitApp(),
  //                     },
  //                 ],
  //             );
  //             return true;
  //         });

  //         return () => backHandler.remove();

  //     } else {
  //         navigation.setOptions({
  //             gestureEnabled: false,
  //         })
  //         return () => {
  //             navigation.setOptions({
  //                 gestureEnabled: true,
  //             })
  //         }
  //     }
  // }, []);

  React.useEffect(() => {
    storeDataInSecureStorage();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Inspection"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
          let IconComponent;

          if (route.name === "Dashboard") {
            IconComponent = DashboardLabelSvg;
          } else if (route.name === "Properties") {
            IconComponent = PropertiesLabelSvg;
          } else if (route.name === "Inspection") {
            IconComponent = InspectionLabelSvg;
          } else if (route.name === "Report") {
            IconComponent = ReportLabelSvg;
          } else if (route.name === "Template") {
            IconComponent = TemplateLabelSvg;
          } else if (route.name === "MyTeams") {
            IconComponent = MyTeamsLabelSvg;
          }

          return (
            <View
              style={[
                {
                  alignItems: "center",
                  borderTopWidth: focused ? 2.5 : 0,
                  borderTopColor: focused ? "#007BFF" : "transparent",
                  paddingTop: 9.8,
                  marginBottom: Platform.OS == "android" ? "9%" : 0,
                },
                route.name === "Report" && {
                  paddingHorizontal: "15%",
                },
              ]}
            >
              <IconComponent color={focused ? "#007BFF" : null} />
              {focused && (
                <Text
                  style={{
                    color: "#007BFF",
                    fontSize: 10.5,
                    fontFamily: "PlusJakartaSans_600SemiBold",
                  }}
                >
                  {route.name}
                </Text>
              )}
            </View>
          );
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          height: Platform.OS == "android" ? 60 : 0,
          paddingLeft: "2%",
          paddingRight: "1%",
          //   overflow: "hidden",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      {userData?.role === "TOPTIER" && (
        <Tab.Screen name="MyTeams" component={MyTeamsDetail} />
      )}
      <Tab.Screen name="Properties" component={Properties} />
      <Tab.Screen name="Inspection" component={Inspection} />
      <Tab.Screen name="Report" component={Report} />
      {userData?.role !== "SUBUSER" && (
        <Tab.Screen name="Template" component={Template} />
      )}
    </Tab.Navigator>
  );
}
