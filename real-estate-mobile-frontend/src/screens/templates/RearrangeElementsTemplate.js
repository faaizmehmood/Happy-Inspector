import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useLoader } from '../../lib/loaderContext';
import { apiUrl } from '../../constants/api_Url';
import GridIcon from '../../../assets/images/icons/Arrange-icons_grid-vertical.svg';
import DraggableFlatList from 'react-native-draggable-flatlist';
let roomElementsArray = [];

const RearrangeElementsTemplate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    roomElementsArray = route?.params?.elementsArr;
    const { setLoading } = useLoader();

    const [data, setData] = useState(roomElementsArray || []);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    useEffect(() => {
        setData(roomElementsArray || []);
    }, [roomElementsArray]);

    useEffect(() => {
        const isSameOrder = data?.every((item, index) => item?._id === roomElementsArray[index]?._id);
        setIsOrderChanged(!isSameOrder);
    }, [data, roomElementsArray]);


    const handleSaveChanges = async () => {
        const idsOnlyArray = data.map(item => item?._id);
        if (route?.params?.templateId) {
            try {
                let id = route?.params?.templateId ? route?.params?.templateId : null
                let roomId = route?.params?.roomID ? route?.params?.roomID : null
                setLoading(true)
                let data = {
                    templateId: id,
                    roomId,
                    elementIds: idsOnlyArray,
                }
                const response = await axios.patch(`${apiUrl}/api/template/reArrangeElements`, data, { withCredentials: true })
                if (response?.status === 200 || response?.status === 201) {
                    navigation.goBack();
                }

            } catch (error) {
                console.log('error in handleSave', error)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
            alert("Sorry, failed to fetch detail's.")
            navigation.goBack();
        }

    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const renderItem = ({ item, drag, isActive }) => (
        <View style={styles.checkBoxParentContainer}>
            <TouchableOpacity
                style={styles.checkbox}
                activeOpacity={0.5}
                onLongPress={drag}  // Will be used for long press events
                // onPressIn={drag}    // Will be used for immediate press events
                disabled={isActive}
            >
                <GridIcon />
            </TouchableOpacity>
            <View style={[styles.searchContainer, { backgroundColor: data?.length > 1 && isActive ? '#DAEAFF' : '#FFFFFF' }]}>
                <Text style={styles.searchInput}>{item?.name}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.inputTextLabel}>Elements</Text>
                <DraggableFlatList
                    data={data}

                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={item => item?._id?.toString()}
                    onDragEnd={({ data }) => {
                        setData(data);
                    }}
                />
            </View>
            <View style={{ paddingVertical: '4%', paddingTop: '2%' }}>
                <TouchableOpacity
                    style={[
                        styles.newInspectionButton,
                        isOrderChanged && { backgroundColor: '#007BFF' }
                    ]}
                    onPress={handleSaveChanges}
                    disabled={!isOrderChanged}
                >
                    <Text style={styles.newInspectionButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default RearrangeElementsTemplate;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        padding: 16,
        paddingLeft: '5.5%',
        flex: 1,
    },
    inputTextLabel: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#000929',
        marginBottom: '5%',
    },
    searchContainer: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#DAEAFF',
        marginHorizontal: '1%',
        borderRadius: 10,
        paddingVertical: '2%',
        marginTop: '1%',
        marginBottom: '3%',
    },
    searchInput: {
        flex: 1,
        padding: 5,
        paddingLeft: '3.5%',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBCBCB',
        borderRadius: 8,
        paddingVertical: '4%',
        marginTop: '5.5%',
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
        marginTop: '5%',
        marginBottom: '4%',
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
        marginBottom: 10,
    },
    checkbox: {
        alignSelf: 'center',
        marginRight: 10,
    },
});
