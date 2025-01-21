import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, TextInput } from "react-native";
import ChevronBack from "../../assets/images/icons/chevron-back.svg";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';
import QuestionTickIcon from '../../assets/images/icons/QuestionTickIcon.svg'
import QuestionCrossIcon from '../../assets/images/icons/QuestionCrossIcon.svg'
import SettingIcon from '../../assets/images/icons/settingIcon.svg'
import LogoutIcon from '../../assets/images/icons/logoutIcon.svg'
import { userContext } from "../lib/userContext";
function CustomHeaderWithProfile({ title, goBack, rightDropDown, style, showMoreIconArray, showMoreIcon, onPress, onGotoNext }) {
   const { userData } = userContext();
 
    const editRoomName = [
    { name: 'Settings',
         icon: require('../../assets/images/icons/rearrangeRoom.webp') },
    { name: 'Logout',
         icon: require('../../assets/images/icons/rearrangeRoom.webp') },
];
    const navigation = useNavigation();

  

    const buttonStatusDetails = [
        { name: 'Rearrange Rooms', icon: require('../../assets/images/icons/rearrangeRoom.webp') },
        { name: 'Delete Rooms', icon: require('../../assets/images/icons/deleteRoom.webp') },
    ];
    const onPressShowInputBox = (data) => {
      // setRoomData((prev) => ({
      //     ...prev,
      //     name: data,
      // }));
  }

      const getInitialName = (name) => {
        return name
          .split(" ") // Split the name into an array of words
          .map(word => word.charAt(0)) // Get the first character of each word
          .join(""); // Join the characters together
      };

    return (
        <SafeAreaView>
            <View style={[styles.headerContainer, style]}>
                {/* {goBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronBack width={24} height={24} />
                    </TouchableOpacity>
                )} */}

                <View style={[styles.textContainer,]}>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>

                   {userData?.profilePicture?.url ? 
                    <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}} activeOpacity={0.5}>
                          <Image
                            source={{ uri: userData?.profilePicture?.url }}
                            resizeMethod="resize"
                            aspect="auto"
                            aspectRatio={1}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 50,
                            }}
                          />
                          </TouchableOpacity>
                        :
                  <TouchableOpacity onPress={()=>navigation.navigate('Profile')}
                   style={styles.headerNameContainer}>
                  <Text style={styles.iconText}>{getInitialName(userData?.fullname)}</Text>
                  </TouchableOpacity>
                  }


                {/* {editRoomName?.length && (
                    <View style={{width:'22%'}}>

                        <SelectDropdown
                            data={editRoomName}
                            defaultButtonText={editRoomName[0].name}
                            onSelect={(selectedItem, index) => {
                                
                                if (selectedItem?.name === 'Settings') {

                                   navigation.navigate('Profile')
                                }
                                else{
                                    // navigation.navigate('')
                                }
                            }}
                            renderButton={(selectedItem, index) => {
                                return (
                <View style={styles.textIconContainer}>
                    <View style={styles.headerNameContainer}>
                  <Text style={styles.iconText}>{getInitialName(userData?.fullname)}</Text>
                  </View>
                  <Ionicons
                      name={"chevron-down"}
                      size={20}
                      color="#000929"
                    //  style={{ marginTop: "5%", paddingLeft: "2%" }}
      />
                                    </View>
                                );
                            }}
                            renderItem={(item, index) => {
                                return (
                                    <View style={[styles.dropdownRow,{
                                        borderBottomWidth:editRoomName?.length >1 ?
                                        index ==0 ? 1:0:0,
                                        borderBottomColor:'#CCE2FF'
                                     }]}>
                                        {item?.icon && 
                                        // <Image source={item?.icon} resizeMode="center" style={{ height: 20, width: 23 }} />
                                        item?.name == 'Settings'?
                                          <SettingIcon/> :
                                          <LogoutIcon/>
                                    }
                                        <View style={styles.dropdownItem}>
                                            <Text style={styles.dropdownItemText}>{item.name}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                            dropdownOverlayColor='transparent'
                            dropdownStyle={styles.dropdownStyle}
                        />
                    </View>
                )} */}


            </View>
        </SafeAreaView>
    );
}

const width = Dimensions.get('screen').width

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: '2%',
        // paddingBottom: '1.5%',
        flexDirection: "row",
        alignItems: "center",
        // marginLeft: '5%',
        justifyContent: "space-between",
        marginHorizontal:'4%',
      
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2, borderColor: '#DAEAFF',
        paddingHorizontal: '3%',
        borderRadius: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingLeft: 0,
        paddingRight: 8,
        padding: 5,
        color: '#000',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
    },
    textContainer: {
        // flex: 1,
        // paddingRight: '6%',
        justifyContent: 'center',
        alignItems: 'center',
    },
         textIconContainer: {
        borderWidth: 2,
        padding: "1.5%",
        borderColor: "#CCE2FF",
        alignItems: "center",
        borderRadius:10,
        flexDirection: "row",
        height:48,
        width:'100%',
        justifyContent:'space-between',
        paddingHorizontal:8,
      },
         iconText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 15, // Adjust the font size as needed
        color: "#ffff",
        // padding: "2%",
        // paddingHorizontal: "2.2%",
        
        // backgroundColor: "#007BFF",
        // textAlign: "center",
      },
      headerNameContainer:{
        backgroundColor: "#007BFF",
        borderRadius:  40,
        width:40,
        height:40,
        alignItems:'center',
        justifyContent:'center'

      },
    dropdownButton: {
        paddingHorizontal: 12,
        marginRight: '2%'
    },
    dropdownRow: {
        flexDirection: "row",
        alignItems: 'center',
        marginHorizontal: 10,
        overflow: 'hidden',
        paddingVertical: 12,
        // borderWidth:1,
        // borderColor:'#CCE2FF',
    },
    dropdownItem: {
        paddingLeft: '8%',
    },
    dropdownItemText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#4D5369',
    },
    dropdownStyle: {
        width: width/2 ,
        marginTop: '-12%',
        marginLeft: width > 365 ? '-30%' : '-45%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingBottom: '2%'
    },
          headerTitle: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 26,
        color: "#000",
        textAlign: "center",
        textAlignVertical: "center",
      },
      profileContainer:{

      }
});

export default memo(CustomHeaderWithProfile);

















// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useRef } from 'react'
// import { Ionicons } from "@expo/vector-icons";
// import SelectDropdown from 'react-native-select-dropdown';

// const CustomHeaderWithProfile = ({hederTitle,onPressProfile}) => {
//     const getInitialName = (name) => {
//         return name
//           .split(" ") // Split the name into an array of words
//           .map(word => word.charAt(0)) // Get the first character of each word
//           .join(""); // Join the characters together
//       };
     
//   return (
//     <View style={styles.headerContainer}>
//     <Text style={styles.headerTitle}>{hederTitle}</Text>

//     <TouchableOpacity
//      onPress={onPressProfile}
//      style={styles.textIconContainer}>
//       <Text style={styles.iconText}>{getInitialName('Muhammad Bilal')}</Text>
//       <Ionicons
//         name={"chevron-down"}
//         size={20}
//         color="#000929"
//         style={{ marginTop: "5%", paddingLeft: "2%" }}
//       />
//     </TouchableOpacity>
    
//   </View>
//   )
// }

// export default CustomHeaderWithProfile

// const styles = StyleSheet.create({
//     headerContainer: {
//         paddingTop: "3%",
//         paddingHorizontal: "3%",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//       },
//       headerTitle: {
//         fontFamily: "PlusJakartaSans_600SemiBold",
//         fontSize: 24,
//         color: "#000929",
//         textAlign: "center",
//         textAlignVertical: "center",
//       },
//       textIconContainer: {
//         borderWidth: 2,
//         padding: "1.5%",
//         borderColor: "#CCE2FF",
//         alignItems: "center",
//         borderRadius:10,
//         flexDirection: "row",
//       },
//       iconText: {
//         fontFamily: "PlusJakartaSans_600SemiBold",
//         fontSize: 15, // Adjust the font size as needed
//         color: "#ffff",
//         padding: "2%",
//         // paddingHorizontal: "2.2%",
//         borderRadius:  30,
//         backgroundColor: "#007BFF",
//         textAlign: "center",
//       },
//       container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5',
//       },
//       hiddenButton: {
//         display: 'none', // Hide the default dropdown button
//       },
//       dropdownStyle: {
//         borderRadius: 8,
//       },
// })