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
import { getIconById } from "../../../constants/questionsGetPath";
import DeleteIcon from "../../../../assets/images/icons/DeleteIcon.svg";
const TemplateCard = ({
  index,
  data,
  navigation,
  deleteTemplate,
  cloneTemplate,
}) => {
  let updatedFormatedDate = new Date(data?.updatedAt);

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
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return months[date.getMonth()] + " " + date.getDate() + ", " + strTime;
  }

  let formattedDate = formatDate(updatedFormatedDate);

  let formatedAddress = data?.property?.address;
  // const deleteIcon =getIconById('14')
  let showAddress = `${formatedAddress?.street}, ${formatedAddress?.city}`;

  const getBackgroundColor = (data) => {
    console.log(data);

    if (data?.isDefault) {
      return "#5aa63f24";
    } else if (data?.isDraft) {
      return "rgba(236, 130, 71, 0.14)";
    } else {
      return "#E1EEFF";
    }
  };
  const getTextColor = (data) => {
    if (data?.isDefault) {
      return "#5AA63F";
    } else if (data?.isDraft) {
      return "rgba(236, 130, 71, 1))";
    } else {
      return "rgba(42, 133, 255, 1)";
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("ShowRoomTemplate", {
          id: data?._id,
          isDefault: data?.isDefault,
        })
      }
      style={[styles.cardContainer, { marginTop: index == 0 ? 0 : "5%" }]}
    >
      {/* <View style={styles.imageStyle}>
                <Image
                    source={{ uri: data?.property?.image?.url }}
                    resizeMethod="auto"
                    resizeMode="cover"
                    style={{ height: "100%", width: "100%" }}
                />
            </View> */}

      <View style={styles.detailContainer}>
        <View style={styles.detailTitleRow}>
          <View style={{ width: "60%" }}>
            <Text style={styles.cardHeaderText} numberOfLines={2}>
              {/* {showAddress}  */}
              {data?.name}
            </Text>
          </View>
          {/* <View style={styles.titleIconStack}>
                        <TouchableOpacity 
                         onPress={()=> navigation.navigate('ShowRooms', { id: data?._id })}
                        style={styles.iconBorder}>
                            <ContactIcon width={20} height={20} />
                        </TouchableOpacity>
                        <View style={styles.iconBorder}>
                            <SaveIcon width={20} height={20} />
                        </View>
                    </View> */}
          <View style={styles.cardButtonContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ShowRoomTemplate", {
                  id: data?._id,
                  isDefault: data?.isDefault,
                })
              }
              style={styles.cardButtonView}
            >
              <Text style={styles.cardButtonStyle}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cloneTemplate(data?._id)}
              style={styles.cardButtonClone}
            >
              <Text style={styles.cardButtonStyle}>Clone</Text>
            </TouchableOpacity>
            {!data?.isDefault && (
              <TouchableOpacity
                onPress={() => deleteTemplate(data?._id)}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {/* {deleteIcon} */}
                <DeleteIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.buttonDateContainer}>
          <View
            style={[
              styles.completedButton,
              { backgroundColor: getBackgroundColor(data) },
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
              {/* {data?.isInspectionCompleted
                                ? "Completed"
                                : data?.isDraft
                                    ? "Drafted"
                                    : "In Progress"} */}
              {data?.isDefault
                ? "Default Template"
                : data?.isDraft
                ? "Drafted"
                : "Published"}
            </Text>
          </View>

          <View>
            <Text style={styles.dateText}>Update on</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(TemplateCard);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    // overflow: "hidden",
    marginTop: "5%",
    marginHorizontal: "3.5%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),

    borderRadius: 8,
    flexDirection: "row",
  },
  imageStyle: {
    height: 96,
    width: 98,
  },
  cardHeaderText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#000",
    // color: "#000929",
  },
  detailContainer: {
    flex: 1,
    marginTop: "2%",
    marginLeft: "5%",
    marginRight: "4%",
  },
  completedButton: {
    backgroundColor: "#E1EEFF",
    // width: "38%",
    paddingVertical: "1%",
    paddingHorizontal: "5%",
    borderRadius: 8,
    alignItems: "center",
  },
  completedButtonText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#007BFF",
  },
  buttonDateContainer: {
    marginTop: "4%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "2%",
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
    width: "40%",
    justifyContent: "space-around",
  },
  iconBorder: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardButtonContainer: {
    flexDirection: "row",
    width: "42%",
    justifyContent: "space-around",
  },
  cardButtonView: {
    width: "38%",
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardButtonClone: {
    width: "38%",
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCE2FF",
  },
  cardButtonStyle: {
    color: "#000",
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
