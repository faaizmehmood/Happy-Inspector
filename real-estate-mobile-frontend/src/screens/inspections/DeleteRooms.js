import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';

const DeleteRooms = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { setLoading } = useLoader()

    const [roomsArray, setRoomsArray] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);

    const handleItemSelection = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    useEffect(() => {
        showingRooms();
    }, [])

    const showingRooms = async () => {
        if (route?.params?.inspectionID) {
            setLoading(true)
            let id = route.params.inspectionID ? route.params.inspectionID : null
            try {
                const response = await axios.get(`${apiUrl}/api/inspection/getSpecificInspection/${id}`, { withCredentials: true, });
                if (response?.status === 200) {
                    setRoomsArray(response?.data?.rooms)
                    if (response?.data?.rooms?.length === 0) {
                        navigation.navigate('ShowRooms', { id: route?.params?.inspectionID });
                        setLoading(false)
                    }
                }
            } catch (error) {
                console.log('error in getSpecificInspection', error)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
            alert("Sorry, failed to fetch detail's.")
            navigation.goBack();
        }
    }

    const handleDelete = async () => {
        if (route?.params?.inspectionID) {
            try {
                let id = route?.params?.inspectionID ? route?.params?.inspectionID : null
                setLoading(true)
                let data = {
                    inspectionId: id,
                    roomIdArray: selectedItems,
                }
                const response = await axios.post(`${apiUrl}/api/inspection/InspectionDeleteRoom`, data, { withCredentials: true })
                if (response?.status === 200) {
                    setSelectedItems([])
                    showingRooms();
                }
            } catch (error) {
                console.log('error in handleSave', error)
                setLoading(false)
            }
        } else {
            setLoading(false)
            alert("Sorry, failed to fetch detail's.")
            navigation.goBack();
            setLoading(false)
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.mainContainer}>

            {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}> */}
            <View style={{ flex: 1 }}>
                <Text style={styles.inputTextLabel}>Rooms</Text>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={false}
                    style={styles.innerContainer}
                >


                    {roomsArray?.length > 0 && roomsArray?.map((item, index) => {
                        const isSelected = selectedItems.includes(item?._id);
                        return (
                            <View
                                // contentContainerStyle={{ flexGrow: 1 }} 
                                key={index}
                                showsVerticalScrollIndicator={false} >
                                <TouchableOpacity

                                    style={styles.checkBoxParentContainer}
                                    onPress={() => handleItemSelection(item?._id)}
                                >
                                    <View style={[styles.checkbox]}>
                                        <View style={[styles.checkboxIndicator, isSelected && styles.checked]}>
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={14} color="#fff" />
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.searchContainer}>

                                        <View style={styles.searchInput}>
                                            <Text style={styles.searchInput}>{item?.name}</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.elementCountText}>{item?.elementCount} Elements</Text>
                                        </View>

                                    </View>



                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.newInspectionButton, selectedItems?.length > 0 && { backgroundColor: '#007BFF' }]}
                    disabled={selectedItems?.length === 0}
                    onPress={handleDelete}
                >
                    <Text style={styles.newInspectionButtonText}>Delete Selected Rooms</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
                {/* </ScrollView> */}
            </View>
        </SafeAreaView>
    );
};

export default DeleteRooms;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        paddingBottom: 0,
        padding: 16,
        paddingLeft: '5.5%',
        marginVertical: '2%',
    },
    inputTextLabel: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#000929',
        // marginBottom: '3%',
        // padding: 16,
        paddingLeft: '5.5%',
        marginTop: '4%'
        // marginVertical: '2%',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#DAEAFF',
        marginHorizontal: '1%',
        backgroundColor: '#F3F8FF',
        borderRadius: 10,
        marginTop: '1%',
        marginBottom: '3%',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 6,
        padding: 5,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    elementCountText: {
        paddingRight: '8%',
        paddingVertical: '3.5%',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12.5,
        color: '#8D939F'
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
        marginVertical: '5%',
        marginHorizontal: '5.5%',
    },
    saveButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
    newInspectionButtonText: {
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
    checkBoxParentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        alignSelf: 'center',
        marginTop: '-3%',
        paddingRight: '1%',
    },
    checkboxIndicator: {
        width: 22,
        height: 22,
        borderColor: '#DAEAFF',
        borderWidth: 2,
        borderRadius: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#007BFF',
    },
});
