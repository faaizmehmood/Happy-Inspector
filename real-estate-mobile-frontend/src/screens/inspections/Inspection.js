import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
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
import CustomHeaderWithProfile from "../../components/CustomHeaderWithProfile";
import SelectDropdown from "react-native-select-dropdown";
import ProgressBarModal from "./InspectionComponents/ProgressBarModal";
import UpgradeModal from "./InspectionComponents/UpgradeModal";
import { userContext } from "../../lib/userContext";

const now = new Date();
let currentDate = new Date().getDate();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

//  const currentRole ='STANDARDTIER'
//   const currentRole ='TOPTIER'
//  const currentRole ='SUBUSER'

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
  { key: "all", value: "All Inspections" },
  { key: "completed", value: "Completed" },
  { key: "notcompleted", value: "In Progress" },
  { key: "draft", value: "Drafted" },
];

const buttonStatusDetails = [
  { value: "Select a Template", icon: <SelectTemplateIcon /> },
  { value: "Start From Scratch", icon: <StartFromScratchIcon /> },
];
const buttonStatusDetailsWithOutScratch = [
  { value: "Select a Template", icon: <SelectTemplateIcon /> },
];

const dateRangeArr = [
  { key: "30days", value: "In the Last 30 Days" },
  { key: "3Months", value: "In the Last 03 Months " },
  { key: "5Months", value: "In the Last 05 Months" },
  { key: "SelectDate", value: "Select Date Range" },
];
const Inspection = () => {
  const navigation = useNavigation();
  const { setLoading } = useLoader();
  const [currentPage, setCurrentPage] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectDate, setSelectDate] = useState([]);
  const [inspectionStatus, setInspectionStatus] = useState({
    key: null,
    value: null,
  });
  const [searchInspection, setSearchInspection] = useState("");
  const [inspectionDetails, setInspectionDetails] = useState([]);
  const [totalInspection, setTotalInspection] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate("PaymentPlanScreen", { goBack: true });
      setLoading(false);
    }, 1000);
    // Add your upgrade logic here
  };

  const { userData } = userContext();
  const currentRole = userData?.role;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   handleFilter(1, setLoading);
  // }, [inspectionStatus]);

  useFocusEffect(
    useCallback(() => {
      // API call when the screen is focused
      handleFilter(1, setLoading);

      // return () => {
      //     // Cleanup if needed
      //     console.log('Screen unfocused');
      // };
    }, [])
  );

  const handleFilter = async (p, set) => {
    try {
      set(true);
      let startDate = new Date()?.toISOString();
      let date = updatedStartDate?.split(T) || startDate?.split("T");
      let updatedStartDate = `${date[0]}T23:59:59Z`;

      let endDate = new Date(currentYear, currentMonth, 1)?.toISOString();
      let date1 = updatedEndDate?.split(T) || endDate?.split("T");
      let updatedEndDate = `${date1[0]}T00:00:00Z`;

      const response = await axios.post(
        `${apiUrl}/api/inspection/getInspections`,
        {
          status: inspectionStatus?.key ? inspectionStatus?.key : null,
          page: p,
          search: searchInspection ? searchInspection : "",
          startdate: updatedEndDate,
          enddate: updatedStartDate,
        },
        {
          withCredentials: true,
        }
      );

      setCurrentPage(response?.data?.currentPage);
      setTotalPage(response?.data?.totalPages);
      setTotalInspection(response?.data?.totalInspections);
      // if (response?.data?.inspections?.length === 0) {
      //   setSearchInspection("");
      //   // gettingInspectionDetails();
      // }
      if (response?.data?.inspections?.length > 0) {
        if (response?.data?.currentPage == 1) {
          setInspectionDetails(response?.data?.inspections);
        } else {
          setInspectionDetails((prevData) => [
            ...prevData,
            ...response?.data?.inspections,
          ]);
        }

        // setInspectionDetails((prevData) => [...prevData, ...response?.data?.inspections]);
      } else {
        setInspectionDetails([]);
      }
      // setInspectionDetails(response?.data?.inspections);
    } catch (error) {
      console.log("Error in handleFilterApiCalling", error);
    } finally {
      set(false);
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
          `${apiUrl}/api/inspection/getInspections`,
          {
            status: "all",
            page: 1,
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

        setInspectionDetails(response?.data?.inspections);
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

  const handleDropDownButton = (selectedItem) => {
    if (selectedItem?.key !== null && selectedItem?.key !== undefined) {
      setInspectionStatus(selectedItem);
      return;
    }

    if (selectedItem?.value === "Start From Scratch") {
      // checkRoleForTier()
      navigation.navigate("NewInspection", {
        totalInspection: totalInspection,
      });
      return;
    }
    navigation.navigate("NewInspection", {
      totalInspection: totalInspection,
      showTemplate: true,
    });
  };

  // const handleDropDownButton = useCallback(
  //   (selectedItem) => {
  //     if (selectedItem?.key !== null && selectedItem?.key !== undefined) {
  //       setInspectionStatus(selectedItem);
  //       return;
  //     }

  //     if (selectedItem?.value === "Start From Scratch") {
  //       // checkRoleForTier()
  //       navigation.navigate("NewInspection", { totalInspection:totalInspection });
  //       return;
  //     }
  //     navigation.navigate("NewInspection", { totalInspection:totalInspection, showTemplate: true });
  //   },
  //   [navigation, setInspectionStatus]
  // );
  // const ListEmptyComponent =()=>(
  //   <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
  //   <Text>No result found </Text>
  //       </View>
  // )

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

      // console.log("defaultDateShow", defaultDateShow);
      // Set your defaultDateShow variable or state here if necessary
    },
    [currentDate, currentYear, currentMonth]
  );
  const getInitialName = (name) => {
    return name
      .split(" ") // Split the name into an array of words
      .map((word) => word.charAt(0)) // Get the first character of each word
      .join(""); // Join the characters together
  };

  const handleLoadMore = () => {
    // if (page < lastPage) {
    if (currentPage < totalPage && !isLoading) {
      const a = currentPage + 1;
      handleFilter(a, setIsLoading);
      //   }
    }
  };

  const dropdownRef = useRef(); // Create a reference to control the dropdown
  // const options = ["Settings", "Logout"];

  // const handleSelect = (selectedItem, index) => {
  //   console.log("Selected Item:", selectedItem, "Index:", index);
  // };

  // const onPressProfile = () => {
  //   dropdownRef.current.openDropdown()
  // }

  
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <CustomHeaderWithProfile
      hederTitle ={'Inspection'}
      // onPressProfile={onPressProfile}
      /> */}
      <CustomHeaderWithProfile title={"Inspections"} />
      <View style={styles.firstBoxContainer}>
        <View style={styles.boxContainer}>
          <View style={styles.calenderDropDownContainer}>
            <View style={{ flex: 1 }}>
              <SelectedDropDownComp
                handleDropDownButton={handleDropDownButton}
                dropDownArray={statusDetails}
              />
            </View>

            <TouchableOpacity
              style={styles.dateButtonStyle}
              // onPress={() => setModalVisible(true)}
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

        <View style={{ marginHorizontal: "1%" }}>
          <View
            style={[styles.propertyCountContainer, { marginVertical: "2%" }]}
          >
            <Text style={[styles.subHeaderText, { fontSize: 15 }]}>
              Properties Inspected
            </Text>

            <View style={[styles.propertyCountContainer, { width: "52%" }]}>
              <View style={{ marginRight: "2%" }}>
                <Text style={[styles.subHeaderGreyText]}>Total</Text>
              </View>

              <View style={{ marginRight: "2%" }}>
                <Text style={styles.subHeaderGreyText}>Completed</Text>
              </View>

              <Text style={styles.subHeaderGreyText}>Available</Text>
            </View>
          </View>

          <View style={[styles.propertyCountContainer, { marginBottom: "4%" }]}>
            <View style={styles.dateRangeContainer}>
              <SelectedDropDownComp
                screenType={"dateRangeDropDown"}
                handleDropDownButton={handleDateRangeDownButton}
                dropDownArray={dateRangeArr}
              />
            </View>

            {/* <View style={[styles.propertyCountContainer, { width: '52%', borderWidth: 2, borderColor: 'red', }]}> */}
            <View style={[styles.propertyCountContainer, { flex: 1 }]}>
              <View style={{ flex: 0.5 }}>
                <Text style={[styles.subHeaderText, { marginLeft: "10%" }]}>
                  {totalInspection}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.subHeaderText, { marginLeft: "3%" }]}>
                  {
                    inspectionDetails.filter(
                      (item) => item.isInspectionCompleted === true
                    ).length
                  }
                </Text>
              </View>
              <View style={{ flex: 0.68 }}>
                <Text style={[styles.subHeaderText, { marginLeft: "3%" }]}>
                  {totalInspection}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Suspense>
          {isModalVisible && (
            <DateRangeModelComp
              isVisible={isModalVisible}
              handleModalVisibility={handleModalVisibility}
              handleSave={handleSaveInspection}
            />
          )}
        </Suspense>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: "42%" }}>
            <SelectedDropDownComp
              screenType={"templateButton"}
              dropDownArray={
                currentRole == "SUBUSER"
                  ? buttonStatusDetailsWithOutScratch
                  : buttonStatusDetails
              }
              handleDropDownButton={handleDropDownButton}
            />
          </View>

          <View style={styles.searchContainer}>
            <SearchIcon />
            <TextInput
              value={searchInspection}
              onChangeText={(text) => onChangeSearchText(text)}
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="gray"
              onSubmitEditing={() => {
                // if (searchInspection.trim().length > 0) {
                handleFilter(1, setLoading);
                // } else {
                //   setSearchInspection("");
                //   // gettingInspectionDetails()
                // }
              }}
            />
          </View>
        </View>
      </View>

      {inspectionDetails?.length > 0 ? (
        <>
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: "3%" }}
            data={inspectionDetails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <InspectionCardComp
                data={item}
                index={index}
                navigation={navigation}
              />
            )}
            onEndReached={handleLoadMore} // Trigger when close to end
            onEndReachedThreshold={0.5} // Load more when 50% from the end
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#007BFF"
                  style={{ margin: 16 }}
                />
              ) : null
            }
            // ListEmptyComponent={ListEmptyComponent}
          />
        </>
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>No result found </Text>
        </View>
      )}
      {/* <SelectDropdown
        ref={dropdownRef} // Attach the dropdown to the reference
        data={options}
        onSelect={handleSelect}
        defaultButtonText="Select an option"
        buttonStyle={styles.hiddenButton} // Hide the default dropdown button
        dropdownStyle={styles.dropdownStyle} // Style the dropdown
      /> */}
      {/* <ProgressBarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpgrade={handleUpgrade}
      /> */}
      <UpgradeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpgrade={handleUpgrade}
        alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
      />
    </SafeAreaView>
  );
};

export default Inspection;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: "#FAFAFB",
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
    borderRadius: "1.5%",
    flexDirection: "row",
  },
  iconText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 15, // Adjust the font size as needed
    color: "#ffff",
    padding: "2%",
    // paddingHorizontal: "2.2%",
    borderRadius: "1.7%",
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
    // padding: 5,
    paddingLeft: 13,
    marginLeft: "5%",
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
    marginLeft: "3%",
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    height: 40,
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
});
