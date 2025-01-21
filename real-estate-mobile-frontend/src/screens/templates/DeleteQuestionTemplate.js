import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import { useLoader } from "../../lib/loaderContext";
import { useToast } from "react-native-toast-notifications";
const DeleteQuestionTemplate = () => {
  const toast = useToast();

  const showToast = () => {
    toast.show("This is a toast notification!", {
      type: "success", // 'success', 'error', 'warning', 'normal'
      duration: 3000, // Duration in milliseconds (default: 2500)
      placement: "top", // 'top', 'bottom', or 'center'
      animationType: "slide-in", // 'slide-in' or 'zoom-in'
    });
  };
  const navigation = useNavigation();
  const route = useRoute();
  const { templateId, roomID, elementId, questionArray, elementIndex } =
    route?.params;

  const { setLoading } = useLoader();
  const [questionsArr, setQuestionsArr] = useState(
    questionArray?.[elementIndex]?.checklist
  );
  const [questionsDelete, setQuestionsDelete] = useState(false);

  useEffect(() => {
    if (questionsArr?.length < 1) {
      navigation.goBack();
    }
  }, [questionsArr]);
  // const [selectedItems, setSelectedItems] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // useEffect(()=>{
  //     getTemplateRoomData()
  // },[questionsDelete])

  const getTemplateRoomData = async () => {
    if (templateId && roomID) {
      setLoading(true);
      const data = {
        templateId: templateId ? templateId : null,
        roomId: roomID ? roomID : null,
      };
      try {
        const response = await axios.post(
          `${apiUrl}/api/template/getTemplateRoomData`,
          data,
          { withCredentials: true }
        );
        if (response?.status === 200 || response?.status === 201) {
          setQuestionsArr(
            response?.data?.room?.elements?.[elementIndex]?.checklist
          );
          //  setLoading(false);
        }
      } catch (error) {
        console.log("Error in getTemplateRoomData:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      alert("Sorry, failed to fetch details.");
      // navigation.goBack();
    }
  };

  //  const deleteInspectionQuestion = async (id) => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${apiUrl}/api/inspection/deleteSavedQuestion/${selectedItems}`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //       });

  //       const result = await response.json();
  //   console.log(result);

  //     //   if (result?.status === 200 || response?.status === 201) {
  //     //     console.log(result);
  //     // setLoading(false);

  //     //     // setQuestionsDelete(!questionsDelete)

  //     // }
  //     } catch (e) {
  //       throw e;
  //     }
  //   };

  const deleteInspectionQuestion = async () => {
    if (selectedItems) {
      setLoading(true);
      const data = {
        templateId: templateId ? templateId : null,
        roomId: roomID ? roomID : null,
        elementId: elementId,
        checklistItemIdArray: selectedItems,
      };

      try {
        const response = await axios.patch(
          `${apiUrl}/api/template/templateDeleteChecklistItem`,
          data,
          { withCredentials: true }
        );
        if (response?.status === 200 || response?.status === 201) {
          getTemplateRoomData();
          if (Platform.OS == "android") {
            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          } else {
            toast.show(response.data.message, {
              type: "normal", // 'success', 'error', 'warning', 'normal'
              duration: 2000, // Duration in milliseconds (default: 2500)
              //   placement: "bottom", // 'top', 'bottom', or 'center'
              //   animationType: "slide-in", // 'slide-in' or 'zoom-in'
            });
          }

          // setQuestionsDelete(!questionsDelete)
        }
      } catch (error) {
        console.log("Error in getTemplateRoomData:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      alert("Sorry, failed to fetch details.");
      navigation.goBack();
    }
  };

  // const deleteInspectionQuestion = async () => {
  //     if (selectedItems) {
  //         setLoading(true);

  //         const data = {
  //             templateId: templateId ? templateId : null,
  //             roomId: roomID ? roomID : null,
  //             elementId: elementId,
  //             checklistItemIdArray: selectedItems
  //         };
  // console.log('--=--=======>>>>',data);

  //         try {
  //             const response = await fetch(`${apiUrl}/api/template/templateDeleteChecklistItem`, {
  //                 method: 'PATCH',
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                 },
  //                 credentials: 'include', // Similar to `withCredentials: true` in Axios
  //                 body: JSON.stringify(data),
  //             });
  //             console.log('---=-==-=->', response);

  //             if (response.ok) { // Checks if the status is in the range 200–299
  //                 const responseData = await response.json();
  //                 console.log('---=-==-=->', responseData);

  //                 // Uncomment or modify this line as per your logic
  //                 // setQuestionsDelete(!questionsDelete);
  //             } else {
  //                 console.error(`Error: ${response.status} ${response.statusText}`);
  //             }
  //         } catch (error) {
  //             console.error('Error in deleteInspectionQuestion:', error);
  //         } finally {
  //             setLoading(false);
  //         }
  //     } else {
  //         setLoading(false);
  //         alert("Sorry, failed to fetch details.");
  //         navigation.goBack();
  //     }
  // };

  const handleItemSelection = (item) => {
    //  if (selectedItems== id) {
    //     setSelectedItems('');
    // } else {
    //     setSelectedItems(id);
    // }

    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    // showingRooms();
  }, []);

  // const showingRooms = async () => {
  //     if (route?.params?.templateId) {
  //         setLoading(true)
  //         let id = route.params.templateId ? route.params.templateId : null
  //         try {
  //             const response = await axios.get(`${apiUrl}/api/inspection/getSpecificInspection/${id}`, { withCredentials: true, });
  //             if (response?.status === 200) {
  //                 setElementsArray(response?.data?.rooms)
  //             }
  //         } catch (error) {
  //             console.log('error in getSpecificInspection', error)
  //         } finally {
  //             setLoading(false)
  //         }
  //     } else {
  //         setLoading(false)
  //         alert("Sorry, failed to fetch detail's.")
  //         navigation.goBack();
  //     }
  // }

  // const handleDelete = async () => {
  //     if (route?.params?.templateId) {
  //         try {
  //             let id = route?.params?.templateId ? route?.params?.templateId : null
  //             setLoading(true)
  //             let data = {
  //                 templateId: id,
  //                 roomIdArray: selectedItems,
  //             }
  //             const response = await axios.post(`${apiUrl}/api/inspection/InspectionDeleteRoom`, data, { withCredentials: true })
  //             if (response?.status === 200) {
  //                 setSelectedItems([])
  //                 showingRooms();
  //                 navigation.goBack();
  //             }
  //         } catch (error) {
  //             console.log('error in handleSave', error)
  //         } finally {
  //             setLoading(false)
  //         }
  //     } else {
  //         setLoading(false)
  //         alert("Sorry, failed to fetch detail's.")
  //         navigation.goBack();
  //     }
  // };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.inputTextLabel}>Elements</Text>

          {questionsArr?.length > 0 &&
            questionsArr?.map((item, index) => {
              const isSelected = selectedItems.includes(item?._id);
              return (
                <View key={index} style={styles.checkBoxParentContainer}>
                  <TouchableOpacity
                    onPress={() => handleItemSelection(item?._id)}
                  >
                    <View
                      style={[
                        styles.checkboxIndicator,
                        isSelected && styles.checked,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.searchContainer}>
                    <View style={styles.searchInput}>
                      <Text style={[styles.searchInput, { padding: 0 }]}>
                        {index + 1}.
                      </Text>
                      <Text style={styles.searchInput}>{item?.text}?</Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>

        <TouchableOpacity
          style={[
            styles.newInspectionButton,
            selectedItems?.length > 0 && { backgroundColor: "#FF613E" },
          ]}
          disabled={selectedItems?.length === 0}
          onPress={deleteInspectionQuestion}
        >
          <Text style={styles.newInspectionButtonText}>
            Delete Selected Questions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
          <Text style={styles.saveButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteQuestionTemplate;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    paddingBottom: 0,
    padding: 16,
    paddingLeft: "5.5%",
    marginVertical: "2%",
  },
  inputTextLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: "#000929",
    marginBottom: "3%",
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: "1%",
    marginBottom: "0.5%",
  },
  searchInput: {
    flexDirection: "row",
    paddingVertical: 6,
    padding: 5,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
  },
  newInspectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
    borderRadius: 8,
    paddingTop: "3%",
    paddingBottom: "4%",
    marginHorizontal: "5.5%",
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
    marginVertical: "5%",
    marginHorizontal: "5.5%",
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#007BFF",
  },
  newInspectionButtonText: {
    fontSize: 14.5,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
  },
  checkBoxParentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIndicator: {
    width: 22,
    height: 22,
    borderColor: "#DAEAFF",
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007BFF",
  },
});
