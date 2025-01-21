import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useImgProvider } from '../../lib/RoomImageContext';
import { IconsArr } from '../../constants/questionIcons';

const SelectIcon = () => {
    const navigation = useNavigation();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [formValid, setFormValid] = useState(false);
    const { setIconData } = useImgProvider();


    const numColumns = IconsArr?.length < 6 ? IconsArr?.length : 6;
    const screenWidth = Dimensions.get('window').width;

    const handleCancel = () => {
        navigation.goBack();
    };

    useEffect(() => {
        setFormValid(selectedIcon !== null);
    }, [selectedIcon]);

    const renderItem = ({ item }) => {
        const isSelected = item?.id === selectedIcon?.id;
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedIcon(isSelected ? null : item)
                    setIconData(item)
                }}
                style={[
                    styles.iconContainer,
                    isSelected ? styles.selectedIconStyle : { paddingHorizontal: 5, paddingVertical: 3 },
                    { width: screenWidth / numColumns - 8 }
                ]}>
                {item?.icon && item?.icon}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.inputContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={IconsArr}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    numColumns={numColumns}
                />
            </View>

            <TouchableOpacity
                style={[styles.newInspectionButton, formValid && { backgroundColor: '#007BFF' }, { marginBottom: '5%' }]}
                disabled={!formValid}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.newInspectionButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
                <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SelectIcon;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    inputContainer: {
        marginTop: '3%',
        marginBottom: '5%',
        paddingHorizontal: '5%',
        paddingLeft: '6%',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    selectedIconStyle: {
        backgroundColor: '#daeaff',
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 5,
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBCBCB',
        borderRadius: 8,
        paddingTop: '3%',
        paddingBottom: '4%',
        marginHorizontal: '5.5%',
    },
    newInspectionButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#DAEAFF',
        paddingTop: '3%',
        paddingBottom: '4%',
        marginBottom: '4%',
        marginHorizontal: '5.5%',
    },
    saveButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
});
