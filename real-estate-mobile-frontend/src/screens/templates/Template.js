import React, { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    ToastAndroid,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import SearchIcon from "../../../assets/images/icons/searchBlueIcon.svg";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import { useLoader } from "../../lib/loaderContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SelectedDropDownComp from "../../components/SelectedDropDownComp";
import SelectTemplateIcon from "../../../assets/images/icons/SelectTemplateIcon.svg";
import StartFromScratchIcon from "../../../assets/images/icons/StartfromScratchIcon.svg";
import axios from "axios";
import InspectionCardComp from "../inspections/InspectionComponents/InspectionCard";

import { apiUrl } from "../../constants/api_Url";
import TemplateCard from "./components/TemplateCard";
import CustomHeaderWithProfile from "../../components/CustomHeaderWithProfile";
import { userContext } from "../../lib/userContext";
import UpgradeModal from "../inspections/InspectionComponents/UpgradeModal";

const now = new Date();
let currentDate = new Date().getDate();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const DateRangeModelComp = lazy(() =>
    import("../inspections/InspectionComponents/DateRangeModelComp")
);

const formatDate = (date, short = false) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", {
        month: short ? "short" : "long",
    });
    return short ? `${day} ${month}` : `${day} ${month}, ${date.getFullYear()}`;
};

let firstDateFormatted = formatDate(
    new Date(currentYear, currentMonth, 1),
    true
);
// You can used if you want to show current month last Date
// const lastDateFormatted = formatDate(new Date(currentYear, currentMonth + 1, 0), true);

// You can used if you want to show current month current Date
let lastDateFormatted = formatDate(
    new Date(currentYear, currentMonth, currentDate),
    true
);
let defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;

const statusDetails = [
    { key: "all", value: "All Templates" },
    { key: "completed", value: "Completed" },
    // { key: "notcompleted", value: "In Progress" },
    { key: "drafted", value: "Drafted" },
    { key: "default", value: "Default Template" },
];

const buttonStatusDetails = [
    { value: "Select a Template", icon: <SelectTemplateIcon /> },
    { value: "Start From Scratch", icon: <StartFromScratchIcon /> },
];

const dateRangeArr = [
    { key: "30days", value: "In the Last 30 Days" },
    { key: "3Months", value: "In the Last 03 Months " },
    { key: "5Months", value: "In the Last 05 Months" },
    { key: "SelectDate", value: "Select Date Range" },
];
const Template = () => {
     const { userData } = userContext();
      const currentRole = userData?.role
    const navigation = useNavigation();
    const { loading, setLoading } = useLoader();
    const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState('');
    const [totalPage, setTotalPage] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectDate, setSelectDate] = useState([]);
    const [templateStatus, setTemplateStatus] = useState({
        key: 'all',
        value: null,
    });
    const [searchInspection, setSearchInspection] = useState("");
    const [templateDetails, setTemplateDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalTemplate, setTotalTemplate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        handleFilter(setLoading, 1);
    }, [templateStatus?.key]);

  const handleUpgrade = () => {
    setLoading(true);
    setModalVisible(false);
    setTimeout(() => {
        navigation.navigate('PaymentPlanScreen', { goBack: true });
        setLoading(false);
    }, 1000);
    // Add your upgrade logic here
  };
    // useEffect(() => {
    //     handleFilterOnChangePage(page);
    //   }, []);


    useFocusEffect(
        useCallback(() => {
            // API call when the screen is focused
            handleFilter(setLoading, 1);

            // return () => {
            //     // Cleanup if needed
            //     console.log('Screen unfocused');
            // };
        }, [])
    );


    const removeObjectTemplate = (idToRemove) => {
        const template = templateDetails.filter(template => template._id !== idToRemove);
        setTemplateDetails(template)
    };


    const handleFilter = async (set, p) => {
        // console.log('templateStatus----->>>>>>>>>>', templateStatus?.key);


        try {
            set(true);
            let startDate = new Date()?.toISOString();
            let date = updatedStartDate?.split(T) || startDate?.split("T");
            let updatedStartDate = `${date[0]}T23:59:59Z`;


            let endDate = new Date(currentYear, currentMonth, 1)?.toISOString();
            let date1 = updatedEndDate?.split(T) || endDate?.split("T");
            let updatedEndDate = `${date1[0]}T00:00:00Z`;

            const response = await axios.post(
                `${apiUrl}/api/template/getAllTemplates`,
                {
                    status: templateStatus?.key ? templateStatus?.key : null,
                    page: p,
                    search: searchInspection ? searchInspection : "",
                    startdate: updatedEndDate,
                    enddate: updatedStartDate,
                },
                {
                    withCredentials: true,
                }
            );
            console.log(response?.data);
            
            setTotalTemplate(response?.data?.totalTemplates)
            setCurrentPage(response?.data?.currentPage)
            setTotalPage(response?.data?.totalPages)
            if (response?.data?.templates?.length > 0) {
                if (response?.data?.currentPage == 1) {
                    setTemplateDetails(response?.data?.templates);
                }
                else {
                    setTemplateDetails((prevData) => [...prevData, ...response?.data?.templates]);
                }

            }
            else {
                setTemplateDetails([])
            }

        } catch (error) {
            console.log("Error in handleFilterApiCalling", error);
        } finally {
            set(false);
        }
    };


    // const deleteTemplate = async (templateId) => {
    //     setLoading(true)
    //     try {
    //         const response = await axios.delete(`${apiUrl}/api/template/deleteTemplate/${templateId}`, { withCredentials: true, });
    //         const result = response?.data;
    //         console.log(result);
            
    //         if (response?.status === 200 || response?.status === 201) {
    //             ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
    //             // handleFilter(setLoading,1)
    //             removeObjectTemplate(templateId)
    //         }
    //     } catch (error) {
    //         console.log('error in getSpecificInspection', error)
    //     } finally {
    //         setLoading(false)
    //     }

    // }
    const deleteTemplate = async (templateId) => {
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/api/template/deleteTemplate/${templateId}`, {
            method: 'DELETE',
            credentials: 'include', // This is equivalent to withCredentials: true
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const result = await response.json();
          if (result?.message =='Template deleted successfully!') {
            handleFilter(setLoading, 1);
            
          }
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
        //   const result = await response.json();
      
          if (response.status === 200 || response.status === 201) {
            ToastAndroid.show(result.message, ToastAndroid.SHORT);
            // handleFilter(setLoading,1)
            removeObjectTemplate(templateId);
          }
        } catch (error) {
          console.log('error in getSpecificInspection', error);
        } finally {
          setLoading(false);
        }
      };
    // const cloneTemplate = async (templateId) => {
    //     const data = {
    //         templateId: templateId
    //     }

    //     setLoading(true)
    //     try {
    //         const response = await axios.post(`${apiUrl}/api/template/cloneInspectionTemplate`, data, { withCredentials: true, });
    //         if (response?.status === 200 || response?.status === 201) {
    //             ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
    //             handleFilter(setLoading, 1)
    //         }
    //     } catch (error) {
    //         console.log('error in cloneInspectionTemplate', error)
    //     } finally {
    //         setLoading(false)
    //     }

    // }

    const checkRoleForTier = (templateId) => {
        if (currentRole == 'FREETIER') {
          if (totalTemplate  == 1 || totalTemplate == '' ||totalTemplate == 0) {
            cloneTemplate(templateId)
          }
          else {
            setModalVisible(true)
          }
        }
    
        else if (currentRole == 'STANDARDTIER') {
          if (totalTemplate < 4) {
            cloneTemplate(templateId)
          }
          else {
            setModalVisible(true)
          }
        }
    
        else if (currentRole == 'TOPTIER') {
          cloneTemplate(templateId)
        }
      }

    const cloneTemplate = async (templateId) => {
        const data = {
            templateId: templateId
        };
    
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/template/cloneInspectionTemplate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // equivalent to `withCredentials: true` in axios
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            console.log('responseData',responseData);
            
            if (responseData?.message =='Template cloned successfully!') { // Checks for status 200-299
                ToastAndroid.show(responseData?.message, ToastAndroid.SHORT);
                handleFilter(setLoading, 1);
            }
             else {
                alert(responseData?.message);
                // console.log('Error:', responseData.message);
            }
        } catch (error) {
            console.log('error in cloneInspectionTemplate', error);
        } finally {
            setLoading(false);
        }
    };
    




    const onChangeSearchText = (text) => {
        setSearchInspection(text);
    };

    const handleSaveInspection = useCallback(async (startDate, endDate) => {
        try {
            // Start Date
            setSelectDate([]);
            if (!startDate || !endDate) {
                alert("Please select a date before saving.");
                return;
            }
            // Start Date
            const formatedStartDate = new Date(startDate);
            const startOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            };
            const localStartDateString = formatedStartDate.toLocaleString(
                "en-US",
                startOptions
            );
            const [startPart] = localStartDateString.split(", ");
            const [startMonth, startDay, startYear] = startPart.split("/");
            const changedStartFormate = `${startYear}-${startMonth}-${startDay}T00:00:00Z`;

            // End Date
            const formatedEndDate = new Date(endDate);
            const endOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
            const localEndDateString = formatedEndDate.toLocaleString(
                "en-US",
                endOptions
            );
            const [endPart] = localEndDateString.split(", ");
            const [endOfMonth, endOFday, endOfYear] = endPart.split("/");
            const changedEndFormate = `${endOfYear}-${endOfMonth}-${endOFday}T23:59:59Z`;

            let checkStartDate = changedStartFormate.split("T");
            let checkEndDate = changedEndFormate.split("T");

            if (formatedEndDate < formatedStartDate) {
                alert("End Date should be after Start Date");
                return;
            } else if (checkStartDate[0] === checkEndDate[0]) {
                alert("End Date should not be same as Start Date");
                return;
            } else {
                const endOptions = { day: "numeric", month: "short" };
                const localStartDate = formatedStartDate.toLocaleString(
                    "en-US",
                    endOptions
                );
                const [startMonth, startDay] = localStartDate.split(" ");

                const localEndDate = formatedEndDate.toLocaleString(
                    "en-US",
                    endOptions
                );
                const [endMonth, endDay] = localEndDate.split(" ");

                let dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;

                setSelectDate(dateRange);

                setLoading(true);

                const response = await axios.post(
                    `${apiUrl}/api/template/getAllTemplates`,
                    {
                        status: "all",
                        page: page,
                        search: searchInspection ? searchInspection : "",
                        startdate: changedStartFormate
                            ? changedStartFormate
                            : "2024-08-01T00:00:00Z",
                        enddate: changedEndFormate
                            ? changedEndFormate
                            : "2024-08-31T23:59:59Z",
                    },
                    {
                        withCredentials: true,
                    }
                );

                // console.log('response?.data?.inspections?.length', response?.data?.inspections);

                setTemplateDetails(response?.data);
                setIsModalVisible(false);
            }
        } catch (error) {
            console.log("Error in handleSaveInspection", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleModalVisibility = useCallback(() => {
        setIsModalVisible(false);
    }, [isModalVisible]);

    const handleDropDownButton = useCallback(
        (selectedItem) => {
            if (selectedItem?.key !== null && selectedItem?.key !== undefined) {
                setTemplateStatus(selectedItem);
                return;
            }

            if (selectedItem?.value === "Start From Scratch") {
                navigation.navigate("NewTemplate");
                return;
            }
            navigation.navigate("NewInspection", { showTemplate: true });
        },
        [navigation, setTemplateStatus]
    );

    const handleDateRangeDownButton = useCallback(
        (selectedItem) => {

            let firstDateFormatted = "";
            let lastDateFormatted = "";
            let defaultDateShow = "";

            if (selectedItem?.key === "30Days") {
                // First day of the current month
                const firstDate = new Date(currentYear, currentMonth, 1);
                const lastDate = new Date(currentYear, currentMonth, currentDate); // Today's date
                firstDateFormatted = formatDate(firstDate, true);
                lastDateFormatted = formatDate(lastDate, true);
                defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;
            } else if (selectedItem?.key === "5Months") {
                // First day of 5 months ago and today's date
                const startMonth = currentMonth - 5;
                // Calculate the starting date, adjusting the year if necessary
                const firstDate = new Date(
                    currentYear,
                    startMonth < 0 ? 11 + startMonth : currentMonth - 5,
                    1
                );
                const firstDateYearAdjusted =
                    startMonth < 0 ? currentYear - 1 : currentYear; // Adjust year if month < 0

                firstDate.setFullYear(firstDateYearAdjusted); // Set adjusted year
                const lastDate = new Date(currentYear, currentMonth, currentDate); // Today's date
                firstDateFormatted = formatDate(firstDate, true);
                lastDateFormatted = formatDate(lastDate, true);
                defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;
            } else if (selectedItem?.key === "3Months") {
                // First day of 3 months ago and today's date
                const startMonth = currentMonth - 3;
                const firstDate = new Date(
                    currentYear,
                    startMonth < 0 ? 11 + startMonth : startMonth,
                    1
                );
                const firstDateYearAdjusted =
                    startMonth < 0 ? currentYear - 1 : currentYear; // Adjust year if month < 0

                firstDate.setFullYear(firstDateYearAdjusted); // Set adjusted year
                const lastDate = new Date(currentYear, currentMonth, currentDate); // Today's date
                firstDateFormatted = formatDate(firstDate, true);
                lastDateFormatted = formatDate(lastDate, true);
                defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;
            } else if (selectedItem?.key === "SelectDate") {
                setIsModalVisible(true);
                return;
            }

            // Set your defaultDateShow variable or state here if necessary
        },
        [currentDate, currentYear, currentMonth]
    );

   

    const handleLoadMore = () => {

        // if (page < lastPage) {
        if (currentPage < totalPage && !isLoading) {

            const a = currentPage + 1;
            handleFilter(setIsLoading, a);
            //   }
        }
    };
    
    return (
        <SafeAreaView style={styles.mainContainer}>
            <CustomHeaderWithProfile title={"Templates"}
            />
            {/* <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Templates</Text>

                <TouchableOpacity style={styles.textIconContainer}>
                    <Text style={styles.iconText}>FR</Text>
                    <Ionicons
                        name={"chevron-down"}
                        size={20}
                        color="#000929"
                        style={{ marginTop: "5%", paddingLeft: "2%" }}
                    />
                </TouchableOpacity>
            </View> */}

            <View style={styles.firstBoxContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.calenderDropDownContainer}>
                        <View style={styles.templateDropDownContainer}>
                            <SelectedDropDownComp
                                handleDropDownButton={handleDropDownButton}
                                dropDownArray={statusDetails}
                                screenType={'template'}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.dateButtonStyle}
                            onPress={() => {
                                setIsModalVisible(true);
                            }}
                        >
                            <View style={styles.calenderView}>
                                <CustomCalenderIcon />
                            </View>
                            <Text style={[styles.dateText, { paddingLeft: "2%" }]}>
                                {!selectDate || selectDate.length <= 0
                                    ? defaultDateShow
                                    : selectDate}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View style={{ marginHorizontal: "1%" }}> */}
                {/* <View
                        style={[styles.propertyCountContainer, { marginVertical: "2%" }]}
                    >
                        <Text style={styles.subHeaderText}>Properties Template</Text>

                        <View style={[styles.propertyCountContainer, { width: "52%" }]}>
                            <View style={{ marginRight: "2%" }}>
                                <Text style={[styles.subHeaderGreyText]}>Total</Text>
                            </View>

                            <View style={{ marginRight: "2%" }}>
                                <Text style={styles.subHeaderGreyText}>Completed</Text>
                            </View>

                            <Text style={styles.subHeaderGreyText}>Available</Text>
                        </View>
                    </View> */}

                {/* <View style={[styles.propertyCountContainer, { marginBottom: "4%" }]}> */}
                <View style={styles.dateRangeContainer}>
                    <SelectedDropDownComp
                        screenType={"dateRangeDropDown"}
                        handleDropDownButton={handleDateRangeDownButton}
                        dropDownArray={dateRangeArr}
                    />
                </View>

                {/* <View style={[styles.propertyCountContainer, { width: '52%', borderWidth: 2, borderColor: 'red', }]}> */}
                {/* <View style={[styles.propertyCountContainer, { flex: 1 }]}>
                    <View style={{ flex: 0.5 }}>
                        <Text style={[styles.subHeaderText, { marginLeft: "10%" }]}>
                            {templateDetails?.totalInspections}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHeaderText, { marginLeft: "3%" }]}>
                            40
                        </Text>
                    </View>
                    <View style={{ flex: 0.68 }}>
                        <Text style={styles.subHeaderText}>30</Text>
                    </View>
                </View> */}
                {/* </View> */}
                {/* </View> */}

                <Suspense>
                    {isModalVisible && (
                        <DateRangeModelComp
                            isVisible={isModalVisible}
                            handleModalVisibility={handleModalVisibility}
                            handleSave={handleSaveInspection}
                        />
                    )}
                </Suspense>

                <View style={styles.createTemplateContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("NewTemplate", { totalTemplate: totalTemplate })}
                        style={styles.templateContain}>
                        <Text style={{ color: '#fff' }}>New Template</Text>
                        {/* <SelectedDropDownComp
              screenType={"templateButton"}
              dropDownArray={buttonStatusDetails}
              handleDropDownButton={handleDropDownButton}
            /> */}
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <SearchIcon />
                        <TextInput
                            value={searchInspection}
                            onChangeText={(text) => onChangeSearchText(text)}
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor="gray"
                            onSubmitEditing={() => {
                                handleFilter(setLoading, 1);
                                // if (searchInspection.trim().length > 0) {
                                //     handleFilter(setLoading, 1);
                                // } else {
                                //     setSearchInspection("");
                                //     // gettingInspectionDetails()
                                // }
                            }}
                        />
                    </View>
                </View>
            </View>

            {templateDetails?.length > 0 ? (
                <>
                    <FlatList

                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContainer}
                        data={templateDetails}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TemplateCard
                                data={item} index={index} navigation={navigation}
                                deleteTemplate={deleteTemplate}
                                cloneTemplate={checkRoleForTier}
                            />

                        )}
                        onEndReached={handleLoadMore} // Trigger when close to end
                        onEndReachedThreshold={0.5} // Load more when 50% from the end
                        ListFooterComponent={
                            isLoading ? (
                                <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
                            ) : null
                        }
                    />

                    {/* <View style={styles.paginationParentContainer}>
                        <TouchableOpacity>
                            <Entypo name="chevron-small-left" size={28} color="#8784AA" />
                        </TouchableOpacity>

                        <View style={styles.innerPaginationContainer}>
                            <TouchableOpacity style={styles.activeTextContainer}>
                                <Text style={styles.activeText}>1</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.inActiveText}>2</Text>
                            </TouchableOpacity>

                            <Text style={styles.inActiveText}>...</Text>

                            <TouchableOpacity>
                                <Text style={styles.inActiveText}>10</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity>
                            <Entypo name="chevron-small-right" size={28} color="#8784AA" />
                        </TouchableOpacity>
                    </View> */}
                </>
            ) :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>No result found </Text>
                </View>}
                <UpgradeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpgrade={handleUpgrade}
        alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
        
      />
        </SafeAreaView>
    );
};

export default Template;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        // backgroundColor: "#FAFAFB",
    },
    templateDropDownContainer:{
         flex: 1 
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
        marginVertical: "4%",
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
    buttonText: {
        marginHorizontal: 4,
        fontSize: 16,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#000929",
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        backgroundColor: "#F3F8FF",
        borderColor: "#DAEAFF",
        borderRadius: 10,
        padding: 5,
        paddingLeft: 13,
        marginLeft: '4%',
        height:50
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
        marginLeft: "5%",
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 13,
    },
    subHeaderText: {
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#000929",
    },
    subHeaderGreyText: {
        fontSize: 14,
        fontFamily: "PlusJakartaSans_600SemiBold",
        color: "#6C727F",
    },
    calenderDropDownContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
    },
    paginationParentContainer: {
        backgroundColor: "#fff",
        paddingTop: "3%",
        marginVertical: "3%",
        paddingBottom: "5%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    innerPaginationContainer: {
        flexDirection: "row",
        gap: 25,
        marginHorizontal: "8%",
    },
    inActiveText: {
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#8784AA",
    },
    activeTextContainer: {
        backgroundColor: "#000929",
        borderRadius: 25,
        justifyContent: "center",
    },
    activeText: {
        fontSize: 13,
        paddingVertical: "0.7%",
        paddingHorizontal: "3%",
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#fff",
    },
    templateContain: {
        backgroundColor: '#007BFF',
        width: '44%',
        height: 41,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    createTemplateContainer:{
         flexDirection: "row", alignItems: "center"
         },
         flatListContainer:{ 
            flexGrow: 1,
             paddingBottom: "3%", 
             marginTop: '2%' }
});

