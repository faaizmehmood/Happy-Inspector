import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getImagePathById } from "../../../constants/questionsGetPath";
import { getIconById } from "../../../constants/questionsGetPath";
const CustomOptionSelectionTemplate = ({ item, index }) => {
  const [selectedIconIndex, setSelectedIconIndex] = useState("");

  const handlePresentQuestionIconPress = (value) => {
    setSelectedIconIndex(value);
  };

  return (
    <View>
      <Text style={styles.searchInput}>
        {index + 1}. {item?.text}
        {item?.answerRequired ? " *" : ""}
      </Text>

      <View
        style={[
          styles.parentContainer,
          {
            marginTop: "2%",
            width:
              item?.options?.length == 4
                ? "100%"
                : item?.options?.length == 2
                ? "55%"
                : "75%",
          },
        ]}
      >
        {item?.options?.length > 0 &&
          item?.options?.map?.((item, index) => {
            const Icon = getIconById(item?.iconId);
            const isSelected = selectedIconIndex === item?.option;
            return (
              // <TouchableOpacity
              //     key={index}
              //     style={[isSelected && styles.iconTextContainer ]}
              //     onPress={() => handlePresentQuestionIconPress(item?.option)}
              // >
              //     <View style={{ alignSelf: 'center' }}>
              //         {item?.iconId ?
              //             <>
              //                 {Icon}
              //                 {/* <Icon/> */}
              //                 {/* {SvgIcon && <SvgIcon width={50} height={50} />} */}
              //                 {/* <Image style={ { height: 23, width: 19 }} source={icon}/> */}
              //                 {/* {item?.iconId && React.cloneElement(item?.iconId, { height: 23, width: 19 })} */}
              //             </> :
              //             <View style={[styles.textIcon, { borderColor: isSelected ? '#fff' : '#7F8AA1' }]}>
              //                 <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
              //                     {item?.option?.charAt(0)}
              //                 </Text>
              //             </View>
              //         }
              //     </View>

              //     <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
              //         {item?.option}
              //     </Text>
              // </TouchableOpacity>
              <View key={index}>
                {Icon ? (
                  <TouchableOpacity
                    disabled={true}
                    style={[
                      isSelected && styles.iconTextContainer,
                      { alignItems: "center" },
                    ]}
                    onPress={() => handlePresentQuestionIconPress(item?.option)}
                  >
                    {Icon}

                    <Text
                      style={[
                        { color: isSelected ? "#fff" : "#7F8AA1" },
                        styles.iconText,
                      ]}
                    >
                      {item?.option}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={true}
                    style={[
                      isSelected && styles.iconTextContainer,
                      {
                        alignItems: "center",
                        paddingVertical: "20%",
                      },
                    ]}
                    onPress={() => handlePresentQuestionIconPress(item?.option)}
                  >
                    <View
                      style={[
                        styles.textIcon,
                        { borderColor: isSelected ? "#fff" : "#7F8AA1" },
                      ]}
                    >
                      <Text
                        style={[
                          { color: isSelected ? "#fff" : "#7F8AA1" },
                          styles.iconText,
                        ]}
                      >
                        {item?.option?.charAt(0)}
                      </Text>
                    </View>

                    <Text
                      style={[
                        { color: isSelected ? "#fff" : "#7F8AA1" },
                        styles.iconText,
                      ]}
                    >
                      {item?.option}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default CustomOptionSelectionTemplate;

const styles = StyleSheet.create({
  iconTextContainer: {
    backgroundColor: "#2A85FF",
    width: "100%",
    // paddingVertical: '8%',
    borderRadius: 8,
    paddingHorizontal: "8%",
  },
  textIcon: {
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    // paddingTop: '2%',
    fontSize: 12,
    textAlign: "center",
  },
  searchInput: {
    flexDirection: "row",
    // paddingVertical: '2%',
    padding: 5,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13.7,
  },
  parentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#e1eeff84",
    borderRadius: 10,
    // width: '65%',
    paddingVertical: "1.5%",
  },
});
