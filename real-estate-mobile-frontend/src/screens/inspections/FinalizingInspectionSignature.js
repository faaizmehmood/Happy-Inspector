import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomCheckBox from "../../components/CustomCheckBox";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";
import { useStoreFinalizedData } from "../../store/InspectionFinializedData";
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import { useLoader } from "../../lib/loaderContext";
import Signature from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";

const FinalizingInspectionSignature = ({ navigation, route }) => {
  const { width } = Dimensions.get("screen");
  const [sign, setSign] = useState(null);
  const signatureRef = useRef(null);
  console.log("signatureRef");

  const handleEmpty = () => {
    // setSign('')
    signatureRef.current.clearSignature();
    console.log("Empty");
  };

  const style = `  .m-signature-pad {
      box-shadow: none;
      border: none;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none; /* Hides default buttons */
    }`;
  // const inspectionDataFinalized = useStoreFinalizedData((state) => state.inspectionData);
  const inspectionDataFinalized = route?.params?.data;
  // const { navigation } = useNavigation();
  const [inspectorSignature, setInspectorSignature] = useState("");
  const [SignatureCollaborator, setSignatureCollaborator] = useState("");
  const [isInspector, setIsInspector] = useState(true);
  const [inspectionStrokes, setInspectionStrokes] = useState([]);
  const signatureInspectionRef = useRef(null);

  const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState(null);
  const [enableSign, setEnableSign] = useState(true);

  const [formData, setFormData] = useState({
    signature: null,
    sendCopyOfReport: "",
  });
  const [signature, setSignature] = useState("");

  const { setLoading } = useLoader();

  useFocusEffect(
    useCallback(() => {
      getSpecificInspection();
    }, [])
  );

  const handleOK = (signature) => {
    const path = FileSystem.cacheDirectory + "sign.png";
    FileSystem.writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 }
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then(console.log)
      .catch(console.error);
    // console.log(signature);
    // setSign(path);
    console.log("path", path);
    submitSignature(path, SignatureCollaborator);
  };

  // useEffect(()=>{
  //     clearStroke('inspection_singed')
  // },[SignatureCollaborator])

  // useEffect(()=>{
  // if (SignatureCollaborator?.length == 0 && !isInspector) {
  //     finalizeInspections()
  // }
  // },[SignatureCollaborator])

  //  const getSpecificInspection = async () => {
  //     try {
  //       const response = await fetch(
  //        `${apiUrl}/api/inspection/getSpecificInspection/${inspectionDataFinalized?.inspectionId}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Accept: 'application/json',
  //           },
  //           withCredentials: true,
  //         },

  //       );

  //     //   const result = await response.json();
  //       console.log(response);

  //     //   console.log(result);

  //     //   return result;
  //     } catch (e) {
  //         console.log(e);

  //       throw e;
  //     }
  //   };

  const inspector = [{ inspector: "yes" }];
  const getSpecificInspection = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/inspection/getSpecificInspection/${inspectionDataFinalized?.inspectionId}`,
        { withCredentials: true }
      );
      // console.log(response?.data?.collaborators);
      const filteredCollaborators = response?.data?.collaborators?.filter(
        (item) => !item.shouldSendSignatureMail && !item.signatureNotRequired
      );
      // const filteredCollaborators = response?.data?.collaborators?.filter(
      //     collaborator => !collaborator.shouldSendSignatureMail
      // );

      setSignatureCollaborator([...inspector, ...filteredCollaborators]);

      // if (response?.status === 200) {

      //     // console.log(response?.data);
      // }
    } catch (error) {
      console.log("error in getSpecificInspection", error);
    }
  };

  const submitSignature = async (uri, SignatureCollaborators) => {
    // clearStroke('inspection_singed')

    setLoading(true);
    // for (const collaborator of SignatureCollaborator){
    if (SignatureCollaborators?.length > 0) {
      try {
        console.log(
          inspectionDataFinalized?.inspectionId,
          isInspector ? "" : SignatureCollaborators?.[0]?._id,
          isInspector
        );

        const data = new FormData();

        data.append("inspectionId", inspectionDataFinalized?.inspectionId);
        data.append(
          "collaboratorId",
          isInspector ? "" : SignatureCollaborators?.[0]?._id
        );
        data.append("isInspector", isInspector);
        // data.append('collaboratorPdfRequested', '');
        console.log("uri", uri);

        if (uri) {
          // Extract the name from the URI
          const name = uri?.substring(uri?.lastIndexOf("/") + 1);

          // Extract the type from the file extension
          const fileExtension = name.substring(name.lastIndexOf(".") + 1);
          let type = "";

          switch (fileExtension.toLowerCase()) {
            case "png":
              type = "image/png";
              break;
            case "jpg":
            case "jpeg":
              type = "image/jpeg";
              break;
            case "gif":
              type = "image/gif";
              break;
            default:
              type = "application/octet-stream"; // Default type for unknown extensions
          }

          data.append("image", {
            uri,
            type,
            name,
          });
          // console.log('--------------->>>>>>>>>>',data);
        } else {
          console.log("No URI provided for the image.");
        }

        const response = await fetch(
          `${apiUrl}/api/inspection/saveSignatureDirectly`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: data,
            credentials: "include",
          }
        );
        const result = await response.json();
        // clearStroke('inspection_singed')

        console.log("==-=-----------=-=response", response);
        console.log("==-=-----------=-=result", result);

        if (
          result?.message == "Inspector signature saved successfully!" ||
          result?.message == "Collaborator signature saved successfully!"
        ) {
          ToastAndroid.show(result?.message, ToastAndroid.SHORT);
          SignatureCollaborator?.shift();
          handleEmpty();
          //  clearStroke('inspection_singed')
          // if (!isInspector ) {
          //     SignatureCollaborator?.shift()
          // }
          if (SignatureCollaborators?.length == 0) {
            finalizeInspections();
          }

          setIsInspector(false);

          // signatureInspectionRef.current.clear()
          // clearStroke('inspection_singed')
        }
        // if (response.ok) {
        //     const result = await response.json();
        //     ToastAndroid.show(result?.message, ToastAndroid.SHORT);
        //     console.log('Image uploaded successfully:', result);
        //     if (!isInspector ) {
        //         SignatureCollaborator?.shift()
        //         finalizeInspections()
        //     }
        //    else if (SignatureCollaborator?.length > 0 ) {
        //         finalizeInspections()
        //     }
        //     setIsInspector(false)
        //     clearStroke('inspection_singed')
        //     //
        //     // getSpecificInspection()

        //     // setEnableSign(false)
        //     // await getInspectionRoomData(); // Uncomment if necessary
        // }
        else {
          // console.log('Failed to upload image:', await response.text());
          console.log("Failed to upload image:", result?.message);
        }
      } catch (error) {
        console.log("Error uploading image:", error);

        if (error.message === "Network request failed") {
          await submitSignature(uri, SignatureCollaborators);
          // alert('Network request failed')
          console.log("Retrying submission due to network failure...");
          // await submitSignature(uri); // Recursive retry
        } else {
          console.log("Failed to upload after retries.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const gotoRoomInspection = () => {
    navigation.navigate("DeleteRooms");
  };

  const handleSave = () => {
    signatureRef.current.readSignature();
    // saveCanvas('inspection_singed');
    // handleOK()
  };

  const finalizeInspections = async () => {
    // const data=inspectionDataFinalized
    const { inspectionId, inspectorData, reportData } = inspectionDataFinalized;

    // console.log('---->>>>>>>>>>>data',data);

    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/inspection/finalizeInspection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Accept: 'application/json',
          },

          withCredentials: true, // Include cookies/credentials

          body: JSON.stringify({
            inspectionId: inspectionId,
            inspectorData: inspectorData,
            reportData: reportData,
          }),
        }
      );
      const result = await response.json();

      // navigation.navigate('FinalizingInspectionSignature',{inspectorName:inspectorName,data:data})

      if (result?.message == "Inspection finalized successfully!") {
        setLoading(false);
        navigation.navigate("BottomTab", { screen: "Inspection" });
        //   navigation.navigate('Inspection')
        // navigation.goBack()
      } else {
        setLoading(false);

        alert(result?.message);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
      throw e;
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomHeader
        title={"Signature"}
        goBack={true}
        showMoreIcon={true}
        onPress={gotoRoomInspection}
      />

      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabelText}>
            {isInspector
              ? inspectionDataFinalized?.inspectorData?.inspectorName
              : SignatureCollaborator?.[0]?.collaboratorName}
            , please sign below
          </Text>
          <View
            style={styles.signatureArea}
            //    style={{ width:'100%' ,height:250,
            //     borderColor:'rgba(204, 226, 255, 1)',
            //     borderWidth:2,borderRadius:8}}
          >
            <Signature
              bgWidth={"100%"}
              bgHeight={200}
              backgroundColor="rgba(243, 248, 255, 1)"
              ref={signatureRef}
              onOK={handleOK}
              onEmpty={handleEmpty}
              // descriptionText="Sign"
              // clearText="Clear"
              // confirmText="Save"
              webStyle={style}
            />
          </View>

          <View style={styles.checkBoxContainer}>
            {/* <CustomCheckBox
                            options={checkBoxOptions}
                            onChange={handleSelectedCheckBox}
                            value={selectedCheckBoxValue}
                            screenName={'FinalizingInspectionSignature'}
                        /> */}

            <TouchableOpacity
              style={{ marginLeft: width - 90 }}
              // onPress={() => clearStroke('inspection_singed')}
              onPress={handleEmpty}
            >
              <Text
                style={[styles.newInspectionButtonText, { color: "#007BFF" }]}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.newInspectionButton,
              { marginBottom: "5%", marginVertical: "8%" },
              { backgroundColor: "#007BFF" },
              // sign ==false && { backgroundColor: '#007BFF' }
            ]}
            // disabled={sign === '' ? true : false}
            // onPress={finalizeInspections}
            onPress={handleSave}
          >
            <Text style={styles.newInspectionButtonText}>
              {SignatureCollaborator && SignatureCollaborator?.length > 1
                ? "Next"
                : "Finish Report"}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
                        <Text style={styles.saveButtonText}>Skip Signature</Text>
                    </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinalizingInspectionSignature;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: {
    paddingHorizontal: "5%",
    paddingTop: "2%",
    paddingBottom: "8%",
  },
  inputLabelText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15.7,
    paddingLeft: "0.5%",
    color: "#000929",
    marginVertical: "3%",
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
  },
  checkBoxContainer: {
    marginVertical: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  newInspectionButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#DAEAFF",
    paddingTop: "3%",
    paddingBottom: "4%",
    marginBottom: "5%",
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#007BFF",
  },
  signature: {
    width: "100%",
    marginTop: "3%",
    height: 170,
    backgroundColor: "#daeaff45",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#DAEAFF",
    marginBottom: 10,
  },

  // singatureContainer
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
  signatureArea: {
    width: "100%",
    height: 200, // Define the specific height for the signature area
    borderWidth: 2,
    borderColor: "rgba(204, 226, 255, 1)",
    borderRadius: 10,
    overflow: "hidden", // Ensure the signature stays within the defined area
  },
});
