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
import SearchIcon from "../../../assets/images/icons/searchBlueIcon.svg";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import AddCategoryIcon from "../../../assets/images/propertyModuleIcons/addCategory-Plus-Icon.svg";
import AllProperties from '../../../assets/images/questionIcons/SelectIcon1.svg';
import { useLoader } from "../../lib/loaderContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SelectedDropDownComp from "../../components/SelectedDropDownComp";
import axios from "axios";
import { apiUrl } from "../../constants/api_Url";
import { IconsArr } from "../../constants/questionIcons";
import { style } from "./PropertyStyle";
import PropertyCardComp from "./propertyComponents/PropertyCardComp";
import { userContext } from "../../lib/userContext";
import CustomHeaderWithProfile from "../../components/CustomHeaderWithProfile";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const AddNewModalComp = lazy(() => import("../../components/AddNewModalComp"))
const DateRangeModelComp = lazy(() => import("../inspections/InspectionComponents/DateRangeModelComp"));
const UpgradeModal = lazy(() => import('../inspections/InspectionComponents/UpgradeModal'));

const now = new Date();
let currentDate = new Date().getDate();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

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

let defaultStartDate = `${new Date(currentYear, currentMonth, 2).toISOString().split("T")[0]}T00:00:00Z`;
let defaultEndDate = `${new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0]}T23:59:59Z`;

const Properties = () => {
    const navigation = useNavigation();
    const { setLoading } = useLoader();
    const { userData } = userContext();

    const [isModalVisible, setIsModalVisible] = useState({
        dateRangeModel: false,
        addNewModal: false
    });
    const [selectDate, setSelectDate] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('');
    const [totalPage, setTotalPage] = useState('');
    const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        searchProperty: '',
        propertyDetails: [],
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        propertyStatus: '',
        statusDetails: [],
        totalProperties: 0
    });

    useFocusEffect(useCallback(() => {
        handleFilter(1, setLoading);
    }, [formData?.propertyStatus, formData?.startDate, formData?.endDate]));

    useFocusEffect(useCallback(() => {
        gettingPropertyCategories()
    }, [isModalVisible?.addNewModal,userData?.role]));


    const gettingPropertyCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/property/getUserPropertyCategories`)
            if (response?.status === 200 || response?.status === 201) {

                let updatedCategories = response?.data?.categories?.map((category) => {
                    let { _id, iconId, ...remainingCategory } = category
                    let selectedMatchedItem = IconsArr?.find(item => item?.iconId === iconId)
                    let SelectedIcon = selectedMatchedItem?.icon
                    return { iconId, value: remainingCategory?.value, icon: <SelectedIcon height={18} width={18} /> }
                })

                let defaultPropertyCategory = [{ iconId: "23", value: 'All Properties', icon: <AllProperties height={18} width={18} /> }]

                let defaultAddCategory = [{ iconId: "24", value: 'Add a Category', icon: <AddCategoryIcon height={18} width={18} /> }]

                let finalPropertyCategories = userData?.role !== 'SUBUSER' ? [...defaultPropertyCategory, ...updatedCategories, ...defaultAddCategory] : [...defaultPropertyCategory, ...updatedCategories]

                setFormData((prev) => ({
                    ...prev,
                    statusDetails: finalPropertyCategories || [],
                    page: 1
                }));

            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingPropertyCategories:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching gettingPropertyCategories:', error)
            }
        }
    }

    const handleLoadMore = () => {
        if (currentPage < totalPage && !isLoading) {
            handleFilter(currentPage + 1, setIsLoading);
        }
    };

    const handleFilter = async (p, set) => {
        try {
            set(true);

            let data = {
                category: formData?.propertyStatus ? formData?.propertyStatus : '',
                page: p,
                search: formData?.searchProperty ? formData?.searchProperty?.trim() : "",
                startDate: formData?.startDate,
                endDate: formData?.endDate,
            }

            const response = await axios.post(`${apiUrl}/api/property/getCompleteProperties`, data, { withCredentials: true });
            // console.log('response?.data', response?.data)
            setCurrentPage(response?.data?.currentPage)
            setTotalPage(response?.data?.totalPages)

            if (response?.status === 200 || response?.status === 201) {
                if (response?.data?.properties) {
                    setFormData((prev) => ({
                        ...prev,
                        propertyDetails: response?.data?.currentPage === 1 ? response?.data?.properties || [] : [...prev?.propertyDetails, ...response?.data?.properties] || [],
                        totalProperties: response?.data?.totalProperties || 0
                    }));
                } else if (response?.data?.properties?.length === 0) {
                    setFormData((prev) => ({
                        ...prev,
                        propertyDetails: []
                    }));
                }
            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in getCompleteProperties:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching handleFilter:', error)
            }
        } finally {
            set(false);
        }
    };

    const onChangeSearchText = (text) => {
        setFormData((prev) => ({
            ...prev,
            searchProperty: text,
            page: 1
        }));
    };

    const handleSavePropertyDate = useCallback(async (startDate, endDate) => {
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
            }
            //  else if (checkStartDate[0] === checkEndDate[0]) {
            //     alert("End Date should not be same as Start Date");
            //     return;
            // }
            else {
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

                setIsModalVisible((prev) => ({
                    ...prev,
                    dateRangeModel: false
                }));

                setFormData((prev) => ({
                    ...prev,
                    page: 1,
                    startDate: changedStartFormate,
                    endDate: changedEndFormate
                }))
            }
        } catch (error) {
            console.log("Error in handleSavePropertyDate", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDateRangeModalVisibility = useCallback(() => {
        setIsModalVisible((prev) => ({
            ...prev,
            dateRangeModel: false
        }));
    }, [isModalVisible?.dateRangeModel]);

    const handleAddNewModalVisibility = useCallback(() => {
        setIsModalVisible((prev) => ({
            ...prev,
            addNewModal: false
        }));
    }, [isModalVisible?.addNewModal]);

    const handleDropDownButton = useCallback(async (selectedItem) => {
        if (selectedItem?.value !== null && selectedItem?.value !== undefined) {
            setFormData((prev) => ({
                ...prev,
                page: 1,
                propertyStatus: selectedItem?.value === "Add a Category" || selectedItem?.value === "All Properties" ? "" : selectedItem?.value
            }));
        }

        if (selectedItem?.value === "Add a Category") {
            if (userData?.role === "TOPTIER") {
                setIsModalVisible((prev) => ({
                    ...prev,
                    addNewModal: true
                }));
            } else {
                setUpgradeModalVisible(true);
                return
            }
        }
    }, [navigation, formData?.propertyStatus, userData?.role, isModalVisible?.addNewModal]);

    const handleAddNewModalConfirm = async (data) => {
        try {
            setLoading(true);

            const response = await axios.post(`${apiUrl}/api/property/addPropertyCategory`, { value: data?.category?.trim(), iconId: data?.iconId }, { withCredentials: true });
            if (response?.status === 200 || response?.status === 201) {
                setLoading(false);

                setIsModalVisible((prev) => ({
                    ...prev,
                    addNewModal: false
                }))
            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in addPropertyCategory:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching handleAddNewModalConfirm:', error)
            }
        }
    }

    const handleUpgrade = () => {
        setLoading(true);
        setUpgradeModalVisible(false);
        setTimeout(() => {
            navigation.navigate('PaymentPlanScreen', { goBack: true });
            setLoading(false);
        }, 1000);
        // Add your upgrade logic here
    };

    return (
        <SafeAreaView style={style.mainContainer}>

            <CustomHeaderWithProfile title={"Properties"}
            />

            <View style={styles.firstBoxContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.calenderDropDownContainer}>
                        <View style={{ flex: 1 }}>
                            <SelectedDropDownComp
                                handleDropDownButton={handleDropDownButton}
                                screenType={"propertiesDropDown"}
                                dropDownArray={formData?.statusDetails || []}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.dateButtonStyle}
                            onPress={() => {
                                setIsModalVisible((prev) => ({
                                    ...prev,
                                    dateRangeModel: true
                                }));
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

                <Suspense>
                    {isModalVisible?.dateRangeModel && (
                        <DateRangeModelComp
                            isVisible={isModalVisible?.dateRangeModel}
                            handleModalVisibility={handleDateRangeModalVisibility}
                            handleSave={handleSavePropertyDate}
                        />
                    )}
                </Suspense>

                <View style={{ flexDirection: "row", alignItems: "center", gap: '4%', paddingLeft: '1%' }}>

                    <TouchableOpacity
                        style={[style.buttonContainer, { paddingVertical: '3%' }]}
                        onPress={() => {
                            if (userData?.role === "FREETIER" && formData?.totalProperties >= 1) {
                                setUpgradeModalVisible(true);
                                return
                            } else {
                                navigation.navigate("AddEditProperty");
                            }
                        }}
                        disabled={isLoading}
                    >
                        <Text style={style.buttonText}>Add new Property</Text>
                    </TouchableOpacity>

                    <View style={[style.inputContainer, { paddingLeft: 9, flex: 1, alignItems: 'center' }]}>
                        <SearchIcon />
                        <TextInput
                            value={formData?.searchProperty}
                            onChangeText={(text) => onChangeSearchText(text)}
                            style={[style.textInput, { marginLeft: '1%' }]}
                            placeholder="Search"
                            placeholderTextColor="gray"
                            onSubmitEditing={() => handleFilter(1, setLoading)}
                        />
                    </View>
                </View>
            </View>

            <Suspense>
                {isModalVisible?.addNewModal && <AddNewModalComp visible={isModalVisible?.addNewModal} onClose={handleAddNewModalVisibility} onConfirm={handleAddNewModalConfirm} title={'Add New Category'} />}
            </Suspense>

            {formData?.propertyDetails?.length > 0 ?
                <>
                    <FlatList
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: "3%" }}
                        data={formData?.propertyDetails}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <PropertyCardComp data={item} index={index} />
                        )}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={isLoading ? (
                            <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
                        ) : null}
                    />
                </>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={style.noDataText}>No result found</Text>
                </View>
            }

            {/* <================== Upgrade Model =============> */}
            <Suspense>

                <UpgradeModal
                    visible={upgradeModalVisible}
                    onClose={() => setUpgradeModalVisible(false)}
                    onUpgrade={handleUpgrade}
                    alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
                />

            </Suspense>

        </SafeAreaView>
    );
};

export default Properties;

const styles = StyleSheet.create({
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
});

