import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomHeader from '../../components/CustomHeader';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import QuestionTickIcon from '../../../assets/images/icons/QuestionTickIcon.svg'
import QuestionCrossIcon from '../../../assets/images/icons/QuestionCrossIcon.svg'
import { useLoader } from '../../lib/loaderContext';
import UpgradeModal from './InspectionComponents/UpgradeModal';
import { userContext } from '../../lib/userContext';

const ShowRooms = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { setLoading } = useLoader()

    const [roomsArray, setRoomsArray] = useState([])
    const [roomName, setRoomName] = useState('');
    const [showRoomInputBox, setShowRoomInputBox] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const handleUpgrade = () => {
        setLoading(true);
        setModalVisible(false);
        setTimeout(() => {
            navigation.navigate('PaymentPlanScreen', { goBack: true });
            setLoading(false);
        }, 1000);
        // Add your upgrade logic here
    };

    const gotoRoomInspection = useCallback(() => {
        navigation.navigate('DeleteRooms', { inspectionID: route?.params?.id ? route?.params?.id : null });
    }, []);

    const gotoRoomRearrangeInspection = useCallback(() => {
        navigation.navigate('ReArrangeRooms', { inspectionID: route?.params?.id ? route?.params?.id : null });
    }, []);

    useFocusEffect(useCallback(() => {
        getSpecificInspection();
    }, []))


    const getSpecificInspection = async () => {
        if (route?.params?.id) {
            setLoading(true)
            let id = route.params.id ? route.params.id : null
            try {
                const response = await axios.get(`${apiUrl}/api/inspection/getSpecificInspection/${id}`, { withCredentials: true, });
                if (response?.status === 200) {
                    setRoomsArray(response?.data?.rooms)
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

    const handleSave = async () => {
        if (route?.params?.id) {
            try {
                let id = route?.params?.id ? route.params.id : null
                setLoading(true)
                let data = {
                    inspectionId: id,
                    roomName: roomName?.trim(),
                }
                const response = await axios.post(`${apiUrl}/api/inspection/InspectionAddNewRoom`, data, { withCredentials: true })
                if (response?.status === 200 || response?.status === 201) {
                    setRoomName('');
                    setShowRoomInputBox(false)
                    getSpecificInspection()
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

    //check condition according role
    const checkRoleForTier = () => {
        if (currentRole == 'FREETIER') {
            if (roomsArray?.length < 5) {
                setShowRoomInputBox(true)
            }
            else {
                setModalVisible(true)
            }
        }

        else if (currentRole == 'STANDARDTIER') {
            if (roomsArray?.length < 10) {
                setShowRoomInputBox(true)
            }
            else {
                setModalVisible(true)
            }
        }

        else if (currentRole == 'TOPTIER' || currentRole == 'SUBUSER') {
            if (roomsArray?.length < 25) {
                setShowRoomInputBox(true)
            }
            else {
                setModalVisible(true)
            }
        }
    }

    const submitRoom = (id) => {
        const countIncomplete = roomsArray?.filter(room => !room.isCompleted)?.length;
        if (roomsArray?.length > 0) {
            if (countIncomplete == 0) {
                navigation.navigate('FinalizingInspection', {
                    inspectionId: id
                })
            }
            else {
                alert('Please complete all rooms in this inspection before proceeding.')

            }

        }
        else {
            alert('Please create at least one room to continue.')
        }


    }

    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity style={[styles.searchContainer, {
                backgroundColor: item?.isCompleted == true ? '#E8F3E4' : '#F3F8FF',

            }]} onPress={() => {
                let data = {
                    inspectionId: route?.params?.id,
                    roomId: item?._id,
                    roomName: item?.name
                }
                navigation.navigate('CreateRoomInspection', { data })
            }}>

                <View style={styles.roomNameContainer}>
                    <Text style={styles.showRoomNameInput}>{item?.name}</Text>
                </View>

                <View >
                    <Text style={styles.elementCountText}>{item?.elementCount} Elements</Text>
                </View>

                <Entypo
                    name={'chevron-right'}
                    size={21}
                    color="#6C727F"
                    style={styles.rightIconStyle}
                />
            </TouchableOpacity>
        )
    }
    const { userData } = userContext();
    const currentRole = userData?.role
    return (
        <SafeAreaView style={styles.mainContainer}>

            {roomsArray?.length > 0 ?
                <CustomHeader title="New Inspection" goBack={true} showMoreIcon={true} onPress={gotoRoomInspection} onGotoNext={gotoRoomRearrangeInspection} />
                :
                <CustomHeader title="New Inspection" goBack={true} showMoreIcon={false} />}

            {/* <ScrollView
             nestedScrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1 }}
              > */}
            <View style={{ flex: 1 }}>

                <View style={styles.innerContainer}>

                    {/* <================== 'To Show Babar Bhai =============> */}

                    {/* {roomsArray?.length > 0 && <Text style={styles.inputTextLabel}>Rooms Completed</Text>}

                {roomsArray?.length > 0 ? <FlatList
                    data={roomsArray}
                    scrollEnabled={false}
                        nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item?._id}
                    renderItem={renderItem}
                />
                    :
                    <Text style={styles.noDataText}>No Rooms to Show</Text>
                } */}


                    {roomsArray?.length > 0 && <Text style={[styles.inputTextLabel, { marginTop: '2%' }]}>Select Next Room</Text>}

                    {roomsArray?.length > 0 ?
                        <FlatList
                            data={roomsArray}
                            // scrollEnabled={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?._id}
                            renderItem={renderItem}
                        />
                        :
                        <Text style={styles.noDataText}>No Rooms to Show</Text>
                    }

                </View>

                <View style={{ flex: 0 }}>
                    {showRoomInputBox &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoFocus={true}
                                value={roomName}
                                onChangeText={(text) => setRoomName(text)}
                                style={styles.searchInput}
                                placeholder="Room Name  (min 3 characters)"
                                placeholderTextColor="#7A8094"
                            />
                            {roomName?.length >= 3 &&
                                <TouchableOpacity
                                    style={{ marginRight: '3%' }}
                                    onPress={handleSave}
                                >
                                    <QuestionTickIcon />
                                </TouchableOpacity>}

                            <TouchableOpacity onPress={() => {
                                setRoomName('');
                                setShowRoomInputBox(false)
                            }}>
                                <QuestionCrossIcon />
                            </TouchableOpacity>

                        </View>}

                    <TouchableOpacity style={[styles.transparentButton
                        // showData?.formValid && {backgroundColor: '#007BFF' }
                    ]}
                        // disabled={!showData?.formValid}

                        // onPress={() => navigation.navigate('CreateRoom', { inspectionID: route?.params?.id ? route?.params?.id : null })}

                        onPress={() => checkRoleForTier()
                        }
                    >
                        <Feather name="plus" size={22} color="#007BFF" style={styles.plusIcon} />
                        <Text style={styles.saveButtonText}>Add a Room</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.newInspectionButton,
                    // showData?.formValid && 
                    { backgroundColor: '#007BFF', marginVertical: '5%', }
                    ]}
                        // disabled={!showData?.formValid}
                        onPress={() => submitRoom(route?.params?.id)
                        }
                    >
                        {/* <Text style={styles.newInspectionButtonText}>Finish inspection</Text> */}
                        <Text style={styles.newInspectionButtonText}>Continue</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[styles.saveButton,
                        // showData?.formValid && {backgroundColor: '#007BFF' }
                    ]}
                        // disabled={!showData?.formValid}
                        // onPress={handleSave}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.saveButtonText}>Save as Draft</Text>
                    </TouchableOpacity> */}

                </View>
            </View>
            {/* </ScrollView> */}
            <UpgradeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onUpgrade={handleUpgrade}
                alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
            />
        </SafeAreaView >
    )
}

export default ShowRooms

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        flex: 1,
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
    noDataText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 17,
        textAlign: 'center',
        color: '#007BFF',
        marginTop: '3%',
        marginBottom: '16%',
    },
    searchContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#DAEAFF',
        marginHorizontal: '1%',
        padding: '3%',
        paddingRight: 0,
        borderRadius: 8,
        marginTop: '1%',
        marginBottom: '3%',
    },
    roomNameContainer: {
        flex: 1,
        marginLeft: '1%',
        marginTop: '0.5%'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#DAEAFF',
        marginHorizontal: '5%',
        paddingHorizontal: '3%',
        borderRadius: 8,
        marginTop: '1%',
        marginBottom: '3%',
    },
    showRoomNameInput: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingLeft: 0,
        paddingRight: 8,
        padding: 5,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    elementCountText: {
        marginRight: '3%',
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
    transparentButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        alignSelf: 'center',
        paddingBottom: '4%',
        width: '40%'
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
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
    rightIconStyle: {
        paddingHorizontal: '3%',
        paddingRight: '2%',
        marginTop: '0.3%'
    },
    plusIcon:{ 
        paddingRight: '2%',
         paddingTop: '0.5%'
         }
})