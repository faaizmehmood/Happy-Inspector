
import React, { memo, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from "react-native-vector-icons/Ionicons";

const RNCountryCodeDropDown = ({ screenName, dropDownArray, selectedItemArr, handleDropDown, placeholderText }) => {
    const [isOpened, setIsOpened] = useState(false);

    const renderItem = item => {
        return (
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    // display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Image
                    source={{
                        uri: `https://flagcdn.com/w20/${item?.code.toLowerCase()}.png`,
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
                    {item?.label}
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
                <View style={{flexDirection:'row',
                alignItems:'center'}}>
                       <Image
                    source={{
                        uri: `https://flagcdn.com/w20/${'pk'}.png`,
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
                        marginLeft:5
                    }}
                >
                    +92
                </Text>
                <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={18}
                    style={{ color: "#9EA3AE",marginLeft:5 }}
                />
                </View>
            )}
            renderItem={renderItem}
        />
    );
};

export default memo(RNCountryCodeDropDown);

const styles = StyleSheet.create({
    containerStyle: {
        marginVertical: '2%',
        borderRadius: 8,
        elevation: 3,
        width:'90%'
    },
    dropdown: {
        marginVertical: 9,
        height: 50,
        backgroundColor: 'white',
        // borderRadius: 12,
        borderTopLeftRadius:8,
        borderBottomLeftRadius:8,
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