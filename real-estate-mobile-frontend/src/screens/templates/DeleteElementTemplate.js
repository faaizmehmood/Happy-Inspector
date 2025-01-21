import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useLoader } from '../../lib/loaderContext';
import { apiUrl } from '../../constants/api_Url';

const DeleteElementTemplate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { setLoading } = useLoader()

    const [elementsArray, setElementsArray] = useState(route?.params?.elementsArr || [])

    const [selectedItems, setSelectedItems] = useState([]);

    const handleItemSelection = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems((prev) => [...prev, item]);
        }
    };


    const handleDelete = async () => {
        if (route?.params?.templateId) {
            try {
                const id = route?.params?.templateId || null;
                const roomId = route?.params?.roomID || null;
                setLoading(true);

                const data = {
                    templateId: id,
                    roomId,
                    elementIdArray: selectedItems
                };

                const response = await axios.patch(`${apiUrl}/api/template/templateDeleteElement`, data, { withCredentials: true });

                if (response?.status === 200 || response?.status === 201) {
                    setElementsArray((prev) => {
                        const updatedElements = prev.filter((item) => !selectedItems?.includes(item?._id));

                        if (updatedElements?.length === 0) {
                            navigation.goBack();
                        }

                        return updatedElements;
                    });

                    setSelectedItems([]);
                }
            } catch (error) {
                console.log('Error in handleDelete:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            alert("Sorry, failed to fetch details.");
            navigation.goBack();
        }
    };


    const handleCancel = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <Text style={styles.inputTextLabel}>Rooms</Text>

                    {elementsArray?.length > 0 && elementsArray?.map((item, index) => {
                        const isSelected = selectedItems.includes(item?._id);
                        return (
                            <TouchableOpacity
                                key={index}
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

                                    <View >
                                        <Text style={styles.elementCountText}>{item?.checklist?.length} Question</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

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
            </ScrollView>
        </SafeAreaView>
    );
};

export default DeleteElementTemplate;

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
        marginBottom: '3%',
    },
    elementCountText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13,
        marginRight: '9%',
        color: '#8D939F'
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
