import React, { memo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Platform } from 'react-native';
import CheckBlueTickIcon from "../../assets/images/icons/CheckBlueTickIcon.svg";
import { CrossIcon } from '../svg/MyTeamsSvg';

const RNElementDropDownComp = ({ screenName, dropDownArray, selectedItemArr, handleDropDown }) => {

    const renderItem = (item) => {
        const isSelected = selectedItemArr?.includes(item?.iconId);

        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item?.value}</Text>
                {isSelected && <CheckBlueTickIcon />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <MultiSelect
                style={[styles.dropdown, screenName === 'Members Details' && { borderColor: 'transparent', backgroundColor: '#EEEEEE' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                activeColor={'#daeaff6a'}
                data={dropDownArray}
                labelField="value"
                valueField="iconId"
                placeholder="Select a Category"
                value={selectedItemArr}
                onChange={item => {
                    handleDropDown(item)
                }}
                disable={screenName === 'Members Details' ? true : false}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => {
                    return (
                        (
                            <TouchableOpacity disabled={screenName === 'Members Details'} onPress={() => unSelect && unSelect(item)}>
                                <View style={[styles.selectedStyle, screenName === 'Members Details' && { backgroundColor: '#EEEEEE' }]}>
                                    <Text style={[styles.textSelectedStyle, , screenName === 'Members Details' && { color: '#777B8B' }]}>{item?.value}</Text>
                                    {screenName !== 'Members Details' && <CrossIcon />}
                                </View>
                            </TouchableOpacity>
                        )
                    )
                }}
            />
        </View>
    );
};

export default memo(RNElementDropDownComp);

const styles = StyleSheet.create({
    container: {},
    dropdown: {
        flexDirection: "row",
        backgroundColor: '#daeaff6a',
        alignItems: "center",
        justifyContent: 'space-between',
        padding: '2.3%',
        marginHorizontal: '1%',
        borderWidth: 2,
        borderColor: '#DAEAFF',
        borderRadius: 10,
    },
    placeholderStyle: {
        fontSize: 15,
        fontFamily: "PlusJakartaSans_500Medium",
        color: '#7A8094'
    },
    selectedTextStyle: {
        fontFamily: "PlusJakartaSans_500Medium",
        color: '#000929',
        paddingBottom: '2%',
        fontSize: 14.5,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#E1EEFF',
        marginTop: 12,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    textSelectedStyle: {
        marginTop: -2,
        marginRight: 5,
        fontSize: 15,
        fontFamily: "PlusJakartaSans_500Medium",
        color: '#007BFF'
    },
});