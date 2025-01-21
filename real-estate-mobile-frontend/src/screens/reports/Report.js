import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { lazy, useCallback, useState } from "react";
import CustomHeaderWithProfile from "../../components/CustomHeaderWithProfile";
import SelectedDropDownComp from "../../components/SelectedDropDownComp";
import { useNavigation } from "@react-navigation/native";
import { CustomCalenderIcon } from "../../svg/InspectionIconSvg";
import SearchIcon from "../../../assets/images/icons/searchBlueIcon.svg";
import ReportCard from "./components/ReportCard";
import { Suspense } from "react";

const Report = () => {
  const navigation = useNavigation();
  const [selectDate, setSelectDate] = useState([]);
  const [searchInspection, setSearchInspection] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [templateStatus, setTemplateStatus] = useState({
    key: null,
    value: null,
  });
  const statusDetails = [
    { id: 1, value: "All Reports", key: "all-reports" },
    { id: 2, value: "Template Reports", key: "template-reports" },
    { id: 3, value: "No Template Reports", key: "no-template-reports" },

    // { key: "all", value: "All Reports" },
    // { key: "completed", value: "Completed" },
    // // { key: "notcompleted", value: "In Progress" },
    // { key: "drafted", value: "Drafted" },
  ];
  const REPORTS_DATA = [
    {
      _id: "1",
      reportDate: "Dec 9, 11.00 AM",
      name: "C-123 Main Street",
      templateUsage: "House Template",
    },
    {
      _id: "2",
      reportDate: "Dec 9, 11.00 AM",
      name: "D-12 Main Street",
      templateUsage: "Home Template",
    },
  ];

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

  const onChangeSearchText = (text) => {
    setSearchInspection(text);
  };

  const handleModalVisibility = useCallback(() => {
    setIsModalVisible(false);
  }, [isModalVisible]);

  const handleSaveInspection = () => {
    console.log("press");
    setIsModalVisible(false);
  };
  return (
    <View style={styles.mainContainer}>
      <CustomHeaderWithProfile title={"Reports"} />
      <View style={styles.boxContainer}>
        <View style={styles.calenderDropDownContainer}>
          <View style={{ flex: 1 }}>
            <SelectedDropDownComp
              handleDropDownButton={handleDropDownButton}
              dropDownArray={statusDetails}
              screenType={"report"}
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
      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          value={searchInspection}
          onChangeText={(text) => onChangeSearchText(text)}
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="gray"
          // onSubmitEditing={() => {
          //     if (searchInspection.trim().length > 0) {
          //         handleFilter(setLoading, 1);
          //     } else {
          //         setSearchInspection("");
          //         // gettingInspectionDetails()
          //     }
          // }}
        />
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
      <View style={{ top: 20 }}>
        {REPORTS_DATA?.length > 0 ? (
          <>
            <FlatList
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: "3%",
                marginTop: "2%",
              }}
              data={REPORTS_DATA}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ReportCard
                  data={item}
                  index={index}
                  navigation={navigation}
                  // deleteTemplate={deleteTemplate}
                  // cloneTemplate={cloneTemplate}
                />
              )}
              // onEndReached={handleLoadMore} // Trigger when close to end
              // onEndReachedThreshold={0.5} // Load more when 50% from the end
              // ListFooterComponent={
              //     isLoading ? (
              //         <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
              //     ) : null
              // }
            />
          </>
        ) : (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text>No result found </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  boxContainer: {
    marginVertical: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
  },
  calenderDropDownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  dateButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#CCE2FF",
  },
  calenderView: {
    paddingHorizontal: "1%",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#000929",
  },
  searchContainer: {
    marginHorizontal: "3%",
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#F3F8FF",
    borderColor: "#DAEAFF",
    borderRadius: 10,
    padding: 5,
    paddingLeft: 13,
    // marginLeft: '4%'
  },
  searchInput: {
    flex: 1,
    marginLeft: "3%",
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    height: 30,
  },
});
