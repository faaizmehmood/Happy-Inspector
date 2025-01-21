import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { image } from "../../../constants/images";
import SaveIcon from "../../../../assets/images/icons/save.svg";
import ContactIcon from "../../../../assets/images/icons/contact.svg";
import { useNavigation } from "@react-navigation/native";

const InspectionCardComp = ({
  screenType,
  index,
  data,
  navigation,
  cardStyle,
}) => {
  const navigateTo = useNavigation();

  let updatedFormatedDate = new Date(
    screenType === "propertyDetail" ? data?.lastUpdated : data?.updatedAt
  );

  function formatDate(date) {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let strTime = hours + ":" + minutes + " " + ampm;

    return (
      months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + strTime
    );
  }

  let formattedDate = formatDate(updatedFormatedDate);

  let formatedAddress = data?.property?.address;

  let showAddress = `${formatedAddress?.street}, ${formatedAddress?.city}`;

  const getBackgroundColor = (data) => {
    if (data?.isInspectionCompleted || data?.inspectionStatus === "Completed") {
      return "#E1EEFF";
    } else if (data?.isDraft || data?.inspectionStatus === "Drafted") {
      return "rgba(236, 130, 71, 0.14)";
    } else {
      return "rgba(90, 166, 63, 0.14)";
    }
  };
  const getTextColor = (data) => {
    if (data?.isInspectionCompleted || data?.inspectionStatus === "Completed") {
      return "rgba(42, 133, 255, 1)";
    } else if (data?.isDraft || data?.inspectionStatus === "Drafted") {
      return "rgba(236, 130, 71, 1))";
    } else {
      return "rgba(90, 166, 63, 1)";
    }
  };

  const getStatusText = (data) => {
    if (data?.isInspectionCompleted) {
      return "Completed";
    } else if (data?.isDraft) {
      return "Drafted";
    } else {
      return "In Progress";
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (screenType === "propertyDetail") {
          navigateTo.navigate("PropertyInspectionDetail", {
            inspectionID: data?._id,
          });
        } else {
          navigation.navigate("ShowRooms", { id: data?._id });
        }
      }}
      // style={[styles.cardContainer, { marginTop: index == 0 ? 0 : "5%" }]}
      style={[
        styles.cardContainer,
        { marginTop: index == 0 && screenType === "propertyDetail" ? 0 : "5%" },
        cardStyle,
      ]}
    >
      {screenType !== "propertyDetail" && (
        <View style={styles.imageStyle}>
          <Image
            source={{ uri: data?.property?.image?.url }}
            resizeMethod="auto"
            resizeMode="cover"
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      )}

      <View style={styles.detailContainer}>
        <View style={styles.detailTitleRow}>
          <View style={{ width: "72%" }}>
            <Text style={styles.cardHeaderText} numberOfLines={2}>
              {screenType === "propertyDetail"
                ? data?.reportName
                : `${showAddress} ${data?.name}`}
            </Text>
          </View>

          {screenType !== "propertyDetail" && (
            <View
              style={[
                styles.titleIconStack,
                screenType === "propertyDetail" && { width: "30%" },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ShowRooms", { id: data?._id })
                }
                style={[styles.iconBorder, { borderColor: "#ccc" }]}
              >
                <ContactIcon width={18} height={18} />
              </TouchableOpacity>
              <View
                style={[
                  styles.iconBorder,
                  { borderColor: "rgba(204, 226, 255, 1)" },
                ]}
              >
                <SaveIcon width={18} height={18} />
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonDateContainer}>
          <View
            style={[
              styles.completedButton,
              {
                backgroundColor: getBackgroundColor(data),
              },
              screenType === "propertyDetail" && { width: "35%" },
            ]}
          >
            <Text
              style={[
                styles.completedButtonText,
                {
                  color: getTextColor(data),
                },
              ]}
            >
              {screenType === "propertyDetail"
                ? data?.inspectionStatus
                : getStatusText(data)}
            </Text>
          </View>

          <View style={screenType === "propertyDetail" && { width: "30%" }}>
            <Text style={styles.dateText}>
              {screenType === "propertyDetail" ? "Updated" : "Update"} on
            </Text>
            <Text
              style={[
                styles.dateText,
                screenType === "propertyDetail" && { fontSize: 11 },
              ]}
            >
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(InspectionCardComp);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    // overflow: "hidden",
    marginTop: "5%",
    marginHorizontal: "3.5%",
    // elevation: 5,/
    borderRadius: 8,
    flexDirection: "row",
    ...Platform?.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: "rgba(14, 8, 84, 1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
    }),
  },
  imageStyle: {
    height: 110,
    width: 98,
  },
  cardHeaderText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#000929",
  },
  detailContainer: {
    flex: 1,
    marginTop: "3%",
    marginLeft: "5%",
    marginRight: "4%",
  },
  completedButton: {
    // width: "38%",
    paddingVertical: "2%",
    paddingHorizontal: "5%",
    borderRadius: 8,
    alignItems: "center",
  },
  completedButtonText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  buttonDateContainer: {
    marginTop: "6%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#6C727F",
  },
  detailTitleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "space-between",
  },
  titleIconStack: {
    flexDirection: "row",
    width: "32%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconBorder: {
    width: 31,
    height: 31,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
