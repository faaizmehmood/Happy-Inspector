import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import CustomCheckBox from '../../components/CustomCheckBox';
import { useStoreUser } from '../../store';
import { apiUrl } from '../../constants/api_Url';
import axios from 'axios';
import { useLoader } from '../../lib/loaderContext';

const AddingPeopleInspection = ({ route }) => {
    const { setLoading } = useLoader()

    const { item, inspectionId, updateCollaboratorEnable } = route?.params
    const collaboratorId = item?._id

    // const [selectedCheckBoxSendSignatureMail, setSelectedCheckBoxSendSignatureMail] = useState(item?.shouldSendSignatureMail ? item?.shouldSendSignatureMail == true ? :false);
    // const [selectedCheckBoxValueSendReport, setSelectedCheckBoxValueSendReport] = useState(item?.signatureNotRequired ?? fal);
    // const { dataArray, addData, updateData } = useStoreUser();
    const selectRole = ["Property Manager",
        "Inspector",
        "Tenant",
        "Landlord",
        "Contractor",
        "Other",]
    const checkBoxOptions = [{ label: 'Not present, send signature request by email', value: 'yes' }];
    const checkBoxOptions1 = [{ label: 'Send report only, without requesting signature', value: 'yes' }];
    const navigation = useNavigation();
    const [userName, setUserName] = useState(item?.collaboratorName ?? '')
    const [userRole, setUserRole] = useState(item?.collaboratorRole ?? '')
    const [userOtherRole, setUserOtherRole] = useState(item?.collaboratorRole ?? '')
    const [userEmail, setUserEmail] = useState(item?.collaboratorEmail ?? '')

    const [selectedCheckBoxSendSignatureMail, setSelectedCheckBoxSendSignatureMail] = useState(item?.shouldSendSignatureMail ? item?.shouldSendSignatureMail == true ? 'yes' : null : null);
    const [selectedCheckBoxValueSendReport, setSelectedCheckBoxValueSendReport] = useState(item?.signatureNotRequired ? item?.signatureNotRequired == true ? 'yes' : null : null);
    // const [formData, setFormData] = useState({
    //     notAvailableOption: '',
    //     sendaCopyOption:''
    // });

    const handleSelectedCheckBoxSendMailSignature = useCallback((value) => {

        setSelectedCheckBoxSendSignatureMail(value || null);
        // setFormData((prev) => ({
        //     ...prev,
        //     notAvailableOption: value,
        // }));
    }, []);
    const handleSelectedCheckBoxSendReport = useCallback((value) => {
        setSelectedCheckBoxValueSendReport(value || null);
        // setFormData((prev) => ({
        //     ...prev,
        //     sendaCopyOption: value,
        // }));
    }, []);
    const gotoRoomInspection = () => {
        navigation.navigate('DeleteRooms');
    };

    const handleCancel = () => {
        navigation.goBack();
    }

    useEffect(() => {
        showingInspectionData();
    })
    // useFocusEffect(useCallback(() => {
    //     showingInspectionData();
    // }, []))

    const handleAddData = () => {
        const newObject = {
            email: userEmail,
            name: userName,
            role: userRole,
        };
        // addData(newObject);
        navigation.goBack()
    };

    const addCollaborator = async () => {
        const data = {
            inspectionId: inspectionId,
            email: userEmail,
            name: userName,
            role: userRole,
            shouldSendSignatureMail: selectedCheckBoxSendSignatureMail == 'yes' ? true : false,
            signatureNotRequired: selectedCheckBoxValueSendReport == 'yes' ? true : false
        };
        try {

            setLoading(true)
            const response = await axios.post(`${apiUrl}/api/inspection/inspectionAddCollaborator`,
                data, { withCredentials: true });

            if (response.status === 200 || response.status === 201) {
                setLoading(false)
                // addData(data);
                navigation.goBack()
            }
        } catch (error) {
            console.log('Error in /InspectionUpdateRoom:', error);
            setLoading(false)
        }
    };

    const updateCollaborator = async () => {
        const data = {
            inspectionId: inspectionId,
            collaboratorId: collaboratorId,
            email: userEmail,
            name: userName,
            role: userRole,
            shouldSendSignatureMail: selectedCheckBoxSendSignatureMail == 'yes' ? true : false,
            signatureNotRequired: selectedCheckBoxValueSendReport == 'yes' ? true : false
        };

        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/api/inspection/inspectionUpdateCollaborator`,
                data, { withCredentials: true });

            if (response.status === 200 || response.status === 201) {
                setLoading(false)
                // addData(data);
                navigation.goBack()
            }
        } catch (error) {
            console.log('Error in /InspectionUpdateRoom:', error);
            setLoading(false)
        }
    };

    const showingInspectionData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/inspection/getSpecificInspection/${inspectionId}`, { withCredentials: true })

            if (response?.status === 200) {
            }
        } catch (error) {
            console.log('error in showingPropertyData', error)
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>

            <CustomHeader title={"Add Users"} goBack={true}
                //  showMoreIcon={true}
                onPress={gotoRoomInspection} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                <View style={styles.subHeaderContainer}>
                    <Text style={styles.roomInspectionText}>Add More People to Inspection</Text>
                </View>

                <View style={styles.inputContainer}>

                    <Text style={styles.inputLabelText}>User Name</Text>
                    <View style={[styles.inputInnerContainer, { backgroundColor: "#fff" }]}>
                        <TextInput
                            value={userName}
                            onChangeText={(text) => setUserName(text)}
                            style={styles.input}
                            placeholder="Enter Name"
                            placeholderTextColor="#7A8094"
                        />
                    </View>

                    <Text style={styles.inputLabelText}>User Role</Text>
                    <SelectDropdown
                        data={selectRole}
                        onSelect={(selectedItem) => {
                            setUserRole(selectedItem); // Update the state here
                        }}
                        // disabled={item?.options?.length === 0}
                        // defaultButtonText={item?.text}
                        // onSelect={(selectedItem, index) => {
                        //     setFormData((prev) => ({
                        //         ...prev,
                        //         templateID: selectedItem?._id ? selectedItem?._id : null,
                        //     }));
                        // }}
                        renderButton={(selectedItem, isOpened) => {
                            // setUserRole(selectedItem)

                            return (
                                <View style={styles.searchContainer}>

                                    <Text style={[styles.dropDownButtonContainer, !userRole && { color: '#7A8094' }]}>{userRole ? userRole : 'Select Role'}</Text>

                                    <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} size={18} color="#9EA3AE" style={{ paddingHorizontal: '3%' }} />

                                </View>
                            )
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={[styles.dropdownItem, { justifyContent: 'space-between' }]}>
                                    <Text style={[styles.dropdownItemText, { paddingLeft: 0 }]}>{item}</Text>
                                    {/* {isSelected && (
                            <CheckBlueTickIcon />
                        )} */}
                                </View>
                            )
                        }}
                        dropdownOverlayColor='transparent'
                        dropdownStyle={styles.dropdownContainer}
                    />
                    {userRole == 'Other' ?
                        <View style={[styles.inputInnerContainer, { backgroundColor: "#fff" }]}>
                            <TextInput
                                value={userOtherRole}
                                onChangeText={(text) => setUserOtherRole(text)}
                                style={styles.input}
                                placeholder="Enter Role"
                                placeholderTextColor="#7A8094"
                            />
                        </View>
                        : ''
                    }
                    {/* <View style={[styles.inputInnerContainer, { backgroundColor: '#fff' }]}>
                        <TextInput
                            // value={formData?.conditionAnswerSelection}
                            // onChangeText={(text) => handleChangeText('conditionAnswerSelection', text)}
                            style={styles.input}
                            placeholder="Home Owner"
                            placeholderTextColor="#7A8094"
                        />
                        <Ionicons name={"chevron-down"} size={16} color="#6C727F" style={{ marginTop: '2%', paddingHorizontal: '3%' }} />
                    </View> */}

                    <Text style={styles.inputLabelText}>User Email</Text>
                    <View style={[styles.inputInnerContainer, { backgroundColor: "#fff" }]}>
                        <TextInput
                            value={userEmail}
                            onChangeText={(text) => setUserEmail(text)}
                            style={styles.input}
                            placeholder="Enter Email"
                            placeholderTextColor="#7A8094"
                        />
                    </View>

                    <View style={{ marginVertical: '1%' }}>
                        <CustomCheckBox
                            options={checkBoxOptions}
                            onChange={handleSelectedCheckBoxSendMailSignature}
                            value={selectedCheckBoxSendSignatureMail}
                            screenName={'FinalizingInspection'}
                            disabled={selectedCheckBoxValueSendReport == 'yes' ? true : false}

                        />
                    </View>
                    <View style={{ marginVertical: '1%' }}>
                        <CustomCheckBox
                            options={checkBoxOptions1}
                            onChange={handleSelectedCheckBoxSendReport}
                            value={selectedCheckBoxValueSendReport}
                            screenName={'FinalizingInspection'}
                            disabled={selectedCheckBoxSendSignatureMail == 'yes' ? true : false}


                        />
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.newInspectionButton,
                    //  selectedItems?.length > 0 && 
                    { backgroundColor: '#007BFF' }
                    ]}
                    // disabled={selectedItems?.length === 0}
                    onPress={updateCollaboratorEnable ? updateCollaborator : addCollaborator}
                >
                    <Text style={styles.newInspectionButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

export default AddingPeopleInspection

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    subHeaderContainer: {
        paddingVertical: '3%',
        paddingHorizontal: '6%',
    },
    roomInspectionText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15.5,
        color: '#000929',
    },
    inputContainer: {
        paddingHorizontal: '5%',
        paddingBottom: '8%'
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        marginHorizontal: '1%',
        backgroundColor: '#daeaff6a',
        borderColor: '#DAEAFF',
        borderRadius: 10,
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
        paddingLeft: '0.5%',
        color: '#000929',
        marginVertical: '3%',
    },
    input: {
        flex: 1,
        padding: 8,
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_500Medium',
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        marginHorizontal: '1%',
        backgroundColor: '#F3F8FF',
        borderColor: '#DAEAFF',
        borderRadius: 10,
        marginBottom: '3%',
    },
    dropDownButtonContainer: {
        flex: 1,
        padding: 8,
        paddingVertical: 11,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    dropdownItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCE2FF',
    },
    dropdownItemText: {
        textAlignVertical: "center",
        fontSize: 16,
        paddingLeft: '5%',
        paddingVertical: '1%',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#4D5369',
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        elevation: 10,
        borderRadius: 5,
        marginTop: '-5%',
        marginLeft: '1%',
        padding: 5,
        paddingTop: '2%',
        borderRadius: 10,
        paddingHorizontal: '4%',
        paddingBottom: '4%'
    },
})