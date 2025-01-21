// import React, { memo, useState } from 'react';
// import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
// import { MultiSelect } from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import { Platform } from 'react-native';
// import CheckBlueTickIcon from "../../assets/images/icons/CheckBlueTickIcon.svg";
// import { CrossIcon } from '../svg/MyTeamsSvg';

// const RNElementSingleSelectDropDownComp = ({ screenName, dropDownArray, selectedItemArr, handleDropDown }) => {
//     const renderItem = (item) => {
//         const isSelected = selectedItemArr?.includes(item?.iconId);

//         return (
//             <View style={styles.item}>
//                 <Text style={styles.selectedTextStyle}>{item?.value}</Text>
//                 {isSelected && <CheckBlueTickIcon />}
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <MultiSelect
//                 style={[styles.dropdown, screenName === 'Members Details' && { borderColor: 'transparent', backgroundColor: '#EEEEEE' }]}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 iconStyle={styles.iconStyle}
//                 activeColor={'#daeaff6a'}
//                 data={dropDownArray}
//                 labelField="value"
//                 valueField="iconId"
//                 placeholder="Select a Category"
//                 value={selectedItemArr}
//                 onChange={item => {
//                     handleDropDown(item)
//                 }}
//                 disable={screenName === 'Members Details' ? true : false}
//                 renderItem={renderItem}
//                 renderSelectedItem={(item, unSelect) => {
//                     return (
//                         (
//                             <TouchableOpacity disabled={screenName === 'Members Details'} onPress={() => unSelect && unSelect(item)}>
//                                 <View style={[styles.selectedStyle, screenName === 'Members Details' && { backgroundColor: '#EEEEEE' }]}>
//                                     <Text style={[styles.textSelectedStyle, , screenName === 'Members Details' && { color: '#777B8B' }]}>{item?.value}</Text>
//                                     {screenName !== 'Members Details' && <CrossIcon />}
//                                 </View>
//                             </TouchableOpacity>
//                         )
//                     )
//                 }}
//             />
//         </View>
//     );
// };

// export default memo(RNElementSingleSelectDropDownComp);

// const styles = StyleSheet.create({
//     container: {},
//     dropdown: {
//         flexDirection: "row",
//         backgroundColor: '#daeaff6a',
//         alignItems: "center",
//         justifyContent: 'space-between',
//         padding: '2.3%',
//         marginHorizontal: '1%',
//         borderWidth: 2,
//         borderColor: '#DAEAFF',
//         borderRadius: 10,
//     },
//     placeholderStyle: {
//         fontSize: 15,
//         fontFamily: "PlusJakartaSans_500Medium",
//         color: '#7A8094'
//     },
//     selectedTextStyle: {
//         fontFamily: "PlusJakartaSans_500Medium",
//         color: '#000929',
//         paddingBottom: '2%',
//         fontSize: 14.5,
//     },
//     iconStyle: {
//         width: 20,
//         height: 20,
//     },
//     icon: {
//         marginRight: 5,
//     },
//     item: {
//         padding: 17,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     selectedStyle: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 8,
//         backgroundColor: '#E1EEFF',
//         marginTop: 12,
//         marginRight: 12,
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//     },
//     textSelectedStyle: {
//         marginTop: -2,
//         marginRight: 5,
//         fontSize: 15,
//         fontFamily: "PlusJakartaSans_500Medium",
//         color: '#007BFF'
//     },
// });

import React, { memo, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from "react-native-vector-icons/Ionicons";

const RNElementSingleSelectDropDownComp = ({ screenName, dropDownArray, selectedItemArr, handleDropDown, placeholderText }) => {
    const [isOpened, setIsOpened] = useState(false);

    const renderItem = item => {
        return (
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Image
                    source={{
                        uri: `https://flagcdn.com/w20/${item.code.toLowerCase()}.png`,
                    }}
                    style={{
                        width: 20,
                        height: 16,
                        borderRadius: 4,
                    }}
                />
                <Text
                    style={{
                        color: "#00099",
                        fontFamily: "PlusJakartaSans_500Medium",
                        fontSize: 14,
                    }}
                >
                    {item.label}
                </Text>
            </View>
        );
    };

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.containerStyle}
            itemContainerStyle={{ paddingVertical: '3%' }}
            data={dropDownArray}
            activeColor='#E4F0FF'
            search
            maxHeight={300}
            labelField="label"
            valueField="label"
            showsVerticalScrollIndicator={false}
            iconColor='#9EA3AE'
            placeholder={`${placeholderText}`}
            searchPlaceholder="Search Country"
            value={selectedItemArr}
            onChange={item => {
                handleDropDown("country", item);
            }}
            onFocus={() => setIsOpened(true)}
            onBlur={() => setIsOpened(false)}
            renderRightIcon={() => (
                <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={18}
                    style={{ color: "#9EA3AE" }}
                />
            )}
            renderItem={renderItem}
        />
    );
};

export default memo(RNElementSingleSelectDropDownComp);

const styles = StyleSheet.create({
    containerStyle: {
        marginVertical: '2%',
        borderRadius: 8,
        elevation: 3
    },
    dropdown: {
        marginVertical: 9,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        backgroundColor: '#F3F8FF',
        borderColor: '#DAEAFF',
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 15,
        color: 'grey',
        fontFamily: "PlusJakartaSans_500Medium",
    },
    selectedTextStyle: {
        fontSize: 15,
        fontFamily: "PlusJakartaSans_500Medium",
    },
    inputSearchStyle: {
        height: 40,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        fontSize: 15,
        fontFamily: "PlusJakartaSans_500Medium",
    },
});