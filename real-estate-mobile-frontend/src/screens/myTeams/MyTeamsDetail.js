import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import SearchIcon from "../../../assets/images/icons/searchBlueIcon.svg";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import { useLoader } from "../../lib/loaderContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SelectedDropDownComp from "../../components/SelectedDropDownComp";
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import MemberCardComp from "./MyTeamsComponents/MemberCardComp";
import { style } from "../properties/PropertyStyle";
import CustomHeaderWithProfile from "../../components/CustomHeaderWithProfile";

const now = new Date();
let currentDate = new Date().getDate();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const DateRangeModelComp = lazy(() => import("../inspections/InspectionComponents/DateRangeModelComp"));

{/* // Todo Will be used if need date picker model */ }
// const formatDate = (date, short = false) => {
//     const day = date.getDate();
//     const month = date.toLocaleString("en-US", {
//         month: short ? "short" : "long",
//     });
//     return short ? `${day} ${month}` : `${day} ${month}, ${date.getFullYear()}`;
// };

// let firstDateFormatted = formatDate(
//     new Date(currentYear, currentMonth, 1),
//     true
// );
// // You can used if you want to show current month last Date
// // const lastDateFormatted = formatDate(new Date(currentYear, currentMonth + 1, 0), true);

// // You can used if you want to show current month current Date
// let lastDateFormatted = formatDate(
//     new Date(currentYear, currentMonth, currentDate),
//     true
// );
// let defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;

const statusDetails = [
    { key: "All Members", value: "All Members" },
    { key: "Assigned to All Categories", value: "Assigned to All Categories" },
    { key: "Unassigned", value: "Unassigned" },
];

let userPropertyCategory = []

const MyTeamsDetail = () => {
    const navigation = useNavigation();
    const { setLoading } = useLoader();

    const [propertyCategoryArr, setPropertyCategoryArr] = useState([]);
    const [formData, setFormData] = useState({
        searchInspection: '',
        inspectionDetails: [],
        inspectionStatus: "All Members",
    });


    useFocusEffect(useCallback(() => {
        gettingPropertyCategories();
    }, []))

    useFocusEffect(useCallback(() => {
        handleFilter();
    }, [formData?.inspectionStatus]))

    const mapCategoryKeyword = (categoryKeyword) => {
        switch (categoryKeyword) {
            case "All Members":
                return "All Members";
            case "Unassigned":
                return "Unassigned";
            case "Assign to All Categories":
                return "All Categories";
            case "Assign to Home":
                return "Home";
            case "Assign to Condominium":
                return "Condominium";
            case "Assign to Apartment":
                return "Apartment";
            case "Assign to Townhouse":
                return "Townhouse";
            case "Assign to Dormitory":
                return "Dormitory";
            case "Assign to Residential":
                return "Residential";
            case "Assign to Commercial":
                return "Commercial";
            default:
                return categoryKeyword?.replace(/^Assign to\s*/, "").trim();
        }
    };

    const gettingPropertyCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/property/getUserPropertyCategories`)
            if (response?.status === 200 || response?.status === 201) {

                let filterCategories = response?.data?.categories?.map((item) => ({ iconId: item?.iconId, value: item?.value }))

                userPropertyCategory = [...filterCategories]

                let updatedCategories = filterCategories?.map((category) => {
                    return { key: `Assign to ${category?.value}`, value: `Assign to ${category?.value}` }
                })
                setPropertyCategoryArr(() => [...statusDetails, ...updatedCategories])
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingPropertyCategories:", errorMessage);
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching gettingPropertyCategories:', error)
            }
        }
    }

    const handleFilter = async () => {
        try {
            setLoading(true);

            const response = await axios.post(`${apiUrl}/api/subUser/getAllSubUsers`,
                {
                    keyword: formData?.inspectionStatus ? mapCategoryKeyword(formData?.inspectionStatus) : null,
                    page: 1,
                    search: formData?.searchInspection ? formData?.searchInspection?.trim() : "",
                },
                {
                    withCredentials: true,
                }
            );

            if (response?.status === 200 || response?.status === 201) {
                setFormData((prev) => ({
                    ...prev,
                    inspectionDetails: response?.data?.subUsers || []
                }));
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in handleFilterApiCalling:", errorMessage)
                Alert.alert('Error', errorMessage?.message);
                setFormData((prev) => ({
                    ...prev,
                    inspectionDetails: []
                }));
            } else {
                console.log("Error in handleFilterApiCalling:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const onChangeSearchText = (text) => {
        setFormData((prev) => ({
            ...prev,
            searchInspection: text
        }));
    };

    const deleteSubUserByID = useCallback(async (data) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${apiUrl}/api/subUser/deleteSubUser/${data}`, { withCredentials: true });

            if (response?.status === 200 || response?.status === 201) {
                // console.log('response?.data', response?.data)
                handleFilter();
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in deleteSubUserByID:", errorMessage)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log("Error in deleteSubUserByID:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [])


    {/* // Todo Will be used if need date picker model */ }
    // const handleSaveInspection = useCallback(async (startDate, endDate) => {
    //     try {
    //         // Start Date
    //         setSelectDate([]);
    //         if (!startDate || !endDate) {
    //             alert("Please select a date before saving.");
    //             return;
    //         }
    //         // Start Date
    //         const formatedStartDate = new Date(startDate);
    //         const startOptions = {
    //             year: "numeric",
    //             month: "2-digit",
    //             day: "2-digit",
    //         };
    //         const localStartDateString = formatedStartDate.toLocaleString(
    //             "en-US",
    //             startOptions
    //         );
    //         const [startPart] = localStartDateString.split(", ");
    //         const [startMonth, startDay, startYear] = startPart.split("/");
    //         const changedStartFormate = `${startYear}-${startMonth}-${startDay}T00:00:00Z`;

    //         // End Date
    //         const formatedEndDate = new Date(endDate);
    //         const endOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    //         const localEndDateString = formatedEndDate.toLocaleString(
    //             "en-US",
    //             endOptions
    //         );
    //         const [endPart] = localEndDateString.split(", ");
    //         const [endOfMonth, endOFday, endOfYear] = endPart.split("/");
    //         const changedEndFormate = `${endOfYear}-${endOfMonth}-${endOFday}T23:59:59Z`;

    //         let checkStartDate = changedStartFormate.split("T");
    //         let checkEndDate = changedEndFormate.split("T");

    //         if (formatedEndDate < formatedStartDate) {
    //             alert("End Date should be after Start Date");
    //             return;
    //         } else if (checkStartDate[0] === checkEndDate[0]) {
    //             alert("End Date should not be same as Start Date");
    //             return;
    //         } else {
    //             const endOptions = { day: "numeric", month: "short" };
    //             const localStartDate = formatedStartDate.toLocaleString(
    //                 "en-US",
    //                 endOptions
    //             );
    //             const [startMonth, startDay] = localStartDate.split(" ");

    //             const localEndDate = formatedEndDate.toLocaleString(
    //                 "en-US",
    //                 endOptions
    //             );
    //             const [endMonth, endDay] = localEndDate.split(" ");

    //             let dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;

    //             setSelectDate(dateRange);
    //             setFormData((prev) => ({
    //                 ...prev,
    //                 searchInspection: "",
    //                 startDate: changedStartFormate
    //                     ? changedStartFormate
    //                     : "2024-08-01T00:00:00Z",
    //                 endDate: changedEndFormate
    //                     ? changedEndFormate
    //                     : "2024-08-31T23:59:59Z",
    //             }));
    //             setIsModalVisible(false);
    //             return

    //             setLoading(true);

    //             const response = await axios.post(
    //                 `${apiUrl}/api/inspection/getInspections`,
    //                 {
    //                     status: "all",
    //                     page: 1,
    //                     search: "",
    //                     startdate: changedStartFormate
    //                         ? changedStartFormate
    //                         : "2024-08-01T00:00:00Z",
    //                     enddate: changedEndFormate
    //                         ? changedEndFormate
    //                         : "2024-08-31T23:59:59Z",
    //                 },
    //                 {
    //                     withCredentials: true,
    //                 }
    //             );

    //             // console.log('response?.data?.inspections?.length', response?.data?.inspections);

    //             setFormData((prev) => ({
    //                 ...prev,
    //                 inspectionDetails: response?.data ?? []
    //             }));
    //             setIsModalVisible(false);
    //         }
    //     } catch (error) {
    //         console.log("Error in handleSaveInspection", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    // const handleModalVisibility = useCallback(() => {
    //     setIsModalVisible(false);
    // }, [isModalVisible]);

    const handleDropDownButton = useCallback(
        (selectedItem) => {
            if (selectedItem?.key !== null && selectedItem?.key !== undefined) {
                setFormData((prev) => ({
                    ...prev,
                    searchInspection: "",
                    inspectionStatus: selectedItem?.key
                }));
                return;
            }
        },
        [navigation, formData?.inspectionStatus]
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <CustomHeaderWithProfile title={"My Team"}
            />

            <View style={styles.firstBoxContainer}>

                <View style={styles.boxContainer}>
                    <View style={styles.calenderDropDownContainer}>
                        <View style={{ flex: 0.97 }}>
                            <SelectedDropDownComp
                                handleDropDownButton={handleDropDownButton}
                                dropDownArray={propertyCategoryArr}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.buttonDoneContainer}
                            onPress={() => {
                                navigation.navigate("TeamsMemberDetail", { titleName: 'Add New Member', userPropertyCategory });
                            }}
                        // disabled={loading}
                        >
                            <Text style={styles.modalButtonText}>Add new Member</Text>
                        </TouchableOpacity>

                        {/* // Todo Will be used if need date picker model */}
                        {/* <TouchableOpacity
                            style={styles.dateButtonStyle}
                            onPress={() => {
                                setIsModalVisible(true);
                            }}
                        >
                            <View style={styles.calenderView}>
                                <CustomCalenderIcon color={'#9EA3AE'} />
                            </View>
                            <Text style={[styles.dateText, { paddingLeft: "2%" }]}>
                                {!selectDate || selectDate?.length <= 0
                                    ? defaultDateShow
                                    : selectDate}
                            </Text>
                        </TouchableOpacity> */}


                    </View>
                </View>

                {/* // Todo Will be used if need date picker model */}
                {/* <Suspense>
                    {isModalVisible && (
                        <DateRangeModelComp
                            isVisible={isModalVisible}
                            handleModalVisibility={handleModalVisibility}
                            handleSave={handleSaveInspection}
                        />
                    )}
                </Suspense> */}

                <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>

                    <View style={styles.searchContainer}>
                        <SearchIcon />
                        <TextInput
                            value={formData?.searchInspection}
                            onChangeText={(text) => onChangeSearchText(text)}
                            style={styles.searchInput}
                            placeholder="Search by name"
                            placeholderTextColor="gray"

                            onSubmitEditing={handleFilter}
                        />
                    </View>
                </View>
            </View>

            {formData?.inspectionDetails?.length > 0 ? (
                <>
                    <FlatList
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: "3%" }}
                        data={formData?.inspectionDetails}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <MemberCardComp data={item} index={index} deleteSubUserByID={deleteSubUserByID} userPropertyAllCategory={userPropertyCategory} />
                        )}
                    />

                </>
            )
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[style.noDataText, { width: '90%' }]}>No members found. Add new members to <Text
                        onPress={() => {
                            navigation.navigate("TeamsMemberDetail", { titleName: 'Add New Member', userPropertyCategory });
                        }}
                        style={{ color: '#2A85FF' }}>get started!</Text></Text>
                </View>
            }
        </SafeAreaView>
    );
};

export default MyTeamsDetail;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        paddingTop: "3%",
        paddingHorizontal: "3%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 24,
        color: "#000929",
        textAlign: "center",
        textAlignVertical: "center",
    },
    textIconContainer: {
        borderWidth: 2,
        padding: "1.5%",
        borderColor: "#CCE2FF",
        alignItems: "center",
        borderRadius: 8,
        flexDirection: "row",
    },
    iconText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 15, // Adjust the font size as needed
        color: "#ffff",
        padding: "1.7%",
        paddingHorizontal: "2.2%",
        borderRadius: 25,
        backgroundColor: "#007BFF",
        textAlign: "center",
    },
    firstBoxContainer: {
        paddingTop: 0,
        padding: 16,
        paddingHorizontal: "3%",
        paddingBottom: 0,
        borderRadius: 10,
        marginBottom: "3%",
    },
    boxContainer: {
        marginVertical: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 4,
    },
    calenderView: {
        paddingHorizontal: "1%",
    },
    dateButtonStyle: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#CCE2FF",
    },
    dateText: {
        fontSize: 12,
        fontFamily: "PlusJakartaSans_600SemiBold",
        color: "#000929",
    },
    buttonDoneContainer: {
        // flex: 1,
        paddingHorizontal: "3%",
        marginLeft: '1%',
        paddingVertical: 9,
        borderRadius: 6,
        backgroundColor: '#007BFF',
    },
    modalButtonText: {
        textAlign: "center",
        marginTop: '-3%',
        textAlignVertical: "center",
        fontSize: 13.5,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#ffff',
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        backgroundColor: "#F3F8FF",
        borderColor: "#DAEAFF",
        borderRadius: 10,
        paddingLeft: 13,
    },
    dateRangeContainer: {
        flex: 0.9,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "-0.8%",
    },
    propertyCountContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    searchInput: {
        flex: 1,
        height: 40,
        marginLeft: "1.5%",
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 13,
    },
    calenderDropDownContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
    },
});

