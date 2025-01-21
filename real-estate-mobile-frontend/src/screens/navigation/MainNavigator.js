import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../auth/Login";
import BusinessInfoSettings from "../businessDetails/BusinessInfoSettings";
import ChangePassword from "../auth/ChangePassword";
import BusinessDetails from "../businessDetails/BusinessDetails";
import OtpVerification from "../auth/OtpVerification";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import OtpVerificationForSignup from "../auth/OtpVerificationForSignup";
import Signup from "../auth/Signup";
import Profile from "../profileAndPersonalDetails/Profile";
import PersonalInfoSettings from "../profileAndPersonalDetails/PersonalInfoSettings";
import PersonalDetails from "../profileAndPersonalDetails/PersonalDetails";

import { useFont } from "../../lib/FontContext";
import { useAuth } from "../../lib/AuthContext";
import { useLoader } from "../../lib/loaderContext";
import Loader from "../../components/loader/Loader";
import CustomHeader from "../../components/CustomHeader";
import BottomTab from "./BottomTab";
import NewInspection from "../inspections/NewInspection";
import ShowRooms from "../inspections/ShowRooms";
import CreateRoomInspection from "../inspections/CreateRoomInspection";
import ReArrangeRooms from "../inspections/ReArrangeRooms";
import DeleteRooms from "../inspections/DeleteRooms";
import DeleteElements from "../inspections/roomElements/DeleteElements";
import RearrangeElements from "../inspections/roomElements/RearrangeElements";
import CreateElement from "../inspections/roomElements/CreateElement";
import CreateRoom from "../inspections/CreateRoom";
import CreateNewQuestion from "../inspections/roomElements/CreateNewQuestion";
import AddNewQuestion from "../inspections/roomElements/AddNewQuestion";
import DeleteQuestion from "../inspections/roomElements/DeleteQuestion";
import CreateElementInspection from "../inspections/roomElements/CreateElementInspection";
import FinalizingInspection from "../inspections/FinalizingInspection";
import AddingPeopleInspection from "../inspections/AddingPeopleInspection";
import FinalizingInspectionSignature from "../inspections/FinalizingInspectionSignature";
import SelectIcon from "../inspections/SelectIcon";
import TeamsMemberDetail from "../myTeams/TeamsMemberDetail";
import AddEditProperty from "../properties/AddEditProperty";
import ShowPropertyDetail from "../properties/ShowPropertyDetail";
import PropertyInspectionDetail from "../properties/PropertyInspectionDetail";
import PropertyRoomCompletedDetail from "../properties/PropertyRoomCompletedDetail";
import PaymentPlanScreen from "../auth/PaymentPlanScreen";
import AddNewCard from "../auth/AddNewCard";
import PaymentMethod from "../auth/PaymentMethod";
import NewTemplate from "../templates/NewTemplate";
import ShowRoomTemplate from "../templates/ShowRoomTemplate";
import CreateRoomTemplate from "../templates/CreateRoomTemplate";
import AddNewQuestionTemplate from "../templates/AddNewQuestionTemplate";
import CreateNewQuestionTemplate from "../templates/CreateNewQuestionTemplate";
import DeleteQuestionTemplate from "../templates/DeleteQuestionTemplate";
import DeleteTemplateRoom from "../templates/DeleteTemplateRoom";
import RearrangeRoomsTemplate from "../templates/RearrangeRoomsTemplate";
import DeleteElementTemplate from "../templates/DeleteElementTemplate";
import RearrangeElementsTemplate from "../templates/RearrangeElementsTemplate";
import Inspection from "../inspections/Inspection";
import Test from "../profileAndPersonalDetails/Test";
import SignatureAllRequest from "../dashboard/SignatureAllRequest";
import ActivityAllView from "../dashboard/ActivityAllView";
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { appIsReady } = useFont();
  const { isAuthenticated } = useAuth();
  const { loading } = useLoader();

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      {
        // Show the loader when the app is loading
        loading && <Loader />
      }
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName={"Login"}
          initialRouteName={isAuthenticated ? "BottomTab" : "Login"}
        >
          <Stack.Screen
            name="Test"
            component={Test}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentPlanScreen"
            component={PaymentPlanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddNewCard"
            component={AddNewCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentMethod"
            component={PaymentMethod}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomTab"
            component={BottomTab}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Profile" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="PersonalInfoSettings"
            component={PersonalInfoSettings}
            options={{
              headerShown: false,
              // header: () => (
              //   <CustomHeader title="Personal Info" goBack={true} />
              // ),
            }}
          />
          <Stack.Screen
            name="BusinessInfoSettings"
            component={BusinessInfoSettings}
            options={{
              headerShown: false,
              // header: () => (
              //   <CustomHeader title="Business Info" goBack={true} />
              // ),
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader
                  // title="Change Password"
                  goBack={true}
                />
              ),
            }}
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerification}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="OTP Verification" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="OtpVerificationForSignup"
            component={OtpVerificationForSignup}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="OTP Verification" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetails}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Personal Details" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="BusinessDetails"
            component={BusinessDetails}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Business Details" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader
                  //  title="Forgot Password"
                  goBack={true}
                />
              ),
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Reset Password" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="NewInspection"
            component={NewInspection}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="New Inspection" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="ShowRooms"
            component={ShowRooms}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CreateRoom"
            component={CreateRoom}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="New Room" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="ReArrangeRooms"
            component={ReArrangeRooms}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Rearrange Rooms" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="DeleteRooms"
            component={DeleteRooms}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Delete Rooms" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="CreateRoomInspection"
            component={CreateRoomInspection}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DeleteElements"
            component={DeleteElements}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Delete Elements" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="RearrangeElements"
            component={RearrangeElements}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Rearrange Elements" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="CreateElement"
            component={CreateElement}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="New Element" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="CreateElementInspection"
            component={CreateElementInspection}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CreateNewQuestion"
            component={CreateNewQuestion}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Create New Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="SelectIcon"
            component={SelectIcon}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Select Icon" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="AddNewQuestion"
            component={AddNewQuestion}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Add New Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="DeleteQuestion"
            component={DeleteQuestion}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Delete Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="FinalizingInspection"
            component={FinalizingInspection}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddingPeopleInspection"
            component={AddingPeopleInspection}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FinalizingInspectionSignature"
            component={FinalizingInspectionSignature}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Inspection"
            component={Inspection}
            options={{
              headerShown: false,
            }}
          />
          {/* <================== My Teams Screen Stack =============> */}
          <Stack.Screen
            name="TeamsMemberDetail"
            component={TeamsMemberDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NewTemplate"
            component={NewTemplate}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="New Template" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="ShowRoomTemplate"
            component={ShowRoomTemplate}
            options={{
              headerShown: false,
              // header: () => (
              //   <CustomHeader title="New Template" goBack={true} />
              // ),
            }}
          />
          <Stack.Screen
            name="CreateRoomTemplate"
            component={CreateRoomTemplate}
            options={{
              headerShown: false,
            }}
          />
          {/* <================== Properties Screen Stack =============> */}
          <Stack.Screen
            name="AddEditProperty"
            component={AddEditProperty}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ShowPropertyDetail"
            component={ShowPropertyDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PropertyInspectionDetail"
            component={PropertyInspectionDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PropertyRoomCompletedDetail"
            component={PropertyRoomCompletedDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddNewQuestionTemplate"
            component={AddNewQuestionTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Add New Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="CreateNewQuestionTemplate"
            component={CreateNewQuestionTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Create New Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="DeleteQuestionTemplate"
            component={DeleteQuestionTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Delete Question" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="DeleteTemplateRoom"
            component={DeleteTemplateRoom}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Delete Rooms" goBack={true} />,
            }}
          />
          <Stack.Screen
            name="RearrangeRoomsTemplate"
            component={RearrangeRoomsTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Rearrange Rooms" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="DeleteElementTemplate"
            component={DeleteElementTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Delete Elements" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="RearrangeElementsTemplate"
            component={RearrangeElementsTemplate}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Rearrange Elements" goBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="SignatureAllRequest"
            component={SignatureAllRequest}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ActivityAllView"
            component={ActivityAllView}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
