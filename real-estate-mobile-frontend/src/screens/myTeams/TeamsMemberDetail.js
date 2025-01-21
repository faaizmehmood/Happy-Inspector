import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Keyboard, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import CustomHeader from '../../components/CustomHeader'
import { useCallback } from 'react'
import RNElementDropDownComp from '../../components/RNElementDropDownComp'
import { useLoader } from '../../lib/loaderContext'
import axios from 'axios'
import { apiUrl } from '../../constants/api_Url'

const myTeamButtonArr = [
    { name: 'Edit Details' }
];

const TeamsMemberDetail = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { setLoading } = useLoader()

    let userPropertyCategory = route?.params?.userPropertyCategory?.map(item => ({ iconId: parseInt(item?.iconId), value: item?.value }))

    let id = route?.params?.id

    let newMemberCategory = []
    if (userPropertyCategory?.length > 0) {
        newMemberCategory = userPropertyCategory || []
    }

    const nameInput = useRef(null);
    const emailInput = useRef(null);
    const addressInput = useRef(null);
    const phoneInput = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        startInspectionFromScratch: false,
        createQuestionForInspection: false,
        dropDownSelectedArr: [],
    });
    const [titleName, setTitleName] = useState(route?.params?.titleName ?? "");

    const thumbStartInspectionSwitchPosition = useRef(new Animated.Value(0)).current;
    const thumbCreateQuestionSwitchPosition = useRef(new Animated.Value(0)).current;

    const toggleStartInspectionSwitch = () => {
        const newValue = !formData.startInspectionFromScratch;
        setFormData(prevState => ({
            ...prevState,
            startInspectionFromScratch: newValue,
        }));

        // Animate thumb position based on toggle state
        Animated.timing(thumbStartInspectionSwitchPosition, {
            toValue: newValue ? 1 : 0, // Move thumb right (1) if enabled, left (0) if disabled
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const toggleCreateQuestionSwitch = () => {
        const newValue = !formData.createQuestionForInspection;
        setFormData(prevState => ({
            ...prevState,
            createQuestionForInspection: newValue,
        }));

        // Animate thumb position based on toggle state
        Animated.timing(thumbCreateQuestionSwitchPosition, {
            toValue: newValue ? 1 : 0, // Move thumb right (1) if enabled, left (0) if disabled
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Interpolating thumb position from 0 to 1
    const thumbLeftCreateQuestionSwitchPosition = thumbCreateQuestionSwitchPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 16],
    });

    const thumbLeftStartInspectionSwitchPosition = thumbStartInspectionSwitchPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 16],
    });

    useFocusEffect(useCallback(() => {
        if (route?.params?.id?.length > 0) {
            gettingMemberDetails()
        }
    }, [route?.params?.id]))

    const gettingMemberDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/subUser/getSubUserById/${id}`, { withCredentials: true });

            if (response?.status === 200 || response?.status === 201) {
                // console.log('response?.data', response?.data?.subUser?.assignedCategories?.map(item => parseInt(item?.iconId)))
                setFormData(() => ({
                    name: response?.data?.subUser?.fullname,
                    email: response?.data?.subUser?.email,
                    address: response?.data?.subUser?.address,
                    phone: response?.data?.subUser?.phoneNumber,
                    startInspectionFromScratch: response?.data?.subUser?.canInspectFromScratch,
                    createQuestionForInspection: response?.data?.subUser?.canCreateInspectionQuestions,
                    dropDownSelectedArr: response?.data?.subUser?.assignedCategories?.map(item => parseInt(item?.iconId))
                }))
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingMemberDetails:", errorMessage)
                Alert.alert('Error', errorMessage?.message);
                setFormData((prev) => ({
                    ...prev,
                    inspectionDetails: []
                }));
            } else {
                console.log("Error in gettingMemberDetails:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangeText = (field, value) => {

        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    const handleDropDown = useCallback((selectedItem) => {
        setFormData((prev) => ({
            ...prev,
            dropDownSelectedArr: selectedItem

        }))
    }, [formData?.dropDownSelectedArr]);

    const handleChangeScreenTitle = () => {
        setTitleName('Edit Details')
    }

    const validation = () => {
        if (formData?.email || formData?.address || formData?.phone) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm
            // const addressRegex = /\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?/;

            if (!emailRegex.test(formData?.email)) {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
                return false;
            }

            if (formData?.address?.trim()?.length < 2) {
                Alert.alert('Invalid Address', 'Please enter a valid address.');
                return false;
            }

            // if (!addressRegex.test(formData?.address)) {
            //     Alert.alert('Invalid Address', 'Please enter a valid address.');
            //     return false;
            // }


            if (formData?.phone?.trim()?.length < 10) {
                Alert.alert('Invalid Phone Number', 'Please enter a valid phone number in the format: 8472234455');
                return false;
            }
        }
        else {
            Alert.alert('Please enter required fields', 'Please enter name, email, address and phone number.');
            return false;
        }

        return true;
    }

    const handleAddingMember = async () => {
        if (!validation()) return

        let updatedDropDownSelectedArr = [];

        if (formData?.dropDownSelectedArr?.length > 0) {
            updatedDropDownSelectedArr = newMemberCategory?.filter(item => formData?.dropDownSelectedArr?.includes(item?.iconId))?.map((data) => {
                let { _index, ...remainingItem } = data
                return { ...remainingItem }
            });
        }

        let data = {
            name: formData?.name?.trim(),
            email: formData?.email?.trim(),
            address: formData?.address?.trim(),
            phoneNumber: formData?.phone?.trim(),
            canInspectFromScratch: formData?.startInspectionFromScratch,
            canCreateInspectionQuestions: formData?.createQuestionForInspection,
            assignedCategories: updatedDropDownSelectedArr
        }

        setLoading(true);

        if (id?.length > 0) {
            try {
                data = { ...data, subUserId: id }
                // console.log('data while updating new member', data)
                const response = await axios.patch(`${apiUrl}/api/subUser/updateSubUser`, data, { withCredentials: true });

                if (response?.status === 200 || response?.status === 201) {
                    // console.log('response?.data', response?.data)
                    navigation.goBack()
                }

            } catch (error) {
                if (error?.response) {
                    const errorMessage = error?.response.data
                    console.log("Backend Error Message in handleUpdatingMember:", errorMessage)
                    Alert.alert('Error', errorMessage?.message);
                } else {
                    console.log("Error in handleAddingMember:", error);
                }
            } finally {
                setLoading(false);
            }
            return;
        } else {
            try {
                // console.log('data while adding new member', data)
                const response = await axios.post(`${apiUrl}/api/subUser/createSubUser`, data, { withCredentials: true });
                if (response?.status === 200 || response?.status === 201) {
                    // console.log('response?.data', response?.data)
                    navigation.goBack()
                }

            } catch (error) {
                if (error?.response) {
                    const errorMessage = error?.response.data
                    console.log("Backend Error Message in handleAddingMember:", errorMessage)
                    Alert.alert('Error', errorMessage?.message);
                } else {
                    console.log("Error in handleAddingMember:", error);
                }
            } finally {
                setLoading(false);
            }
            return
        }
    }


    return (
        <SafeAreaView style={styles.mainContainer}>

            <CustomHeader title={titleName} goBack={true} showMoreIcon={titleName !== 'Members Details' ? false : true} showMoreIconArray={myTeamButtonArr} onGotoNext={handleChangeScreenTitle} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} >

                <View style={styles.inputContainer}>

                    <Text style={styles.inputLabelText}>Name</Text>
                    <View style={[styles.inputInnerContainer, titleName === 'Members Details' && { borderColor: '#EEEEEE', backgroundColor: '#EEEEEE' }]}>
                        <TextInput
                            ref={nameInput}
                            value={formData?.name}
                            onChangeText={(text) => handleChangeText('name', text)}
                            style={styles.input}
                            placeholder="Enter User Name"
                            placeholderTextColor="#7A8094"
                            editable={titleName !== 'Members Details'}
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                emailInput.current && emailInput.current.focus()
                            }}
                        />
                    </View>

                    <Text style={styles.inputLabelText}>Email</Text>
                    <View style={[styles.inputInnerContainer, titleName === 'Members Details' && { borderColor: '#EEEEEE', backgroundColor: '#EEEEEE' }]}>
                        <TextInput
                            ref={emailInput}
                            value={formData?.email}
                            onChangeText={(text) => handleChangeText('email', text)}
                            style={styles.input}
                            placeholder="Enter Email Address"
                            placeholderTextColor="#7A8094"
                            editable={titleName !== 'Members Details'}
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                addressInput.current && addressInput.current.focus()
                            }}
                        />
                    </View>

                    <Text style={styles.inputLabelText}>Address</Text>
                    <View style={[styles.inputInnerContainer, titleName === 'Members Details' && { borderColor: '#EEEEEE', backgroundColor: '#EEEEEE' }]}>
                        <TextInput
                            ref={addressInput}
                            value={formData?.address}
                            onChangeText={(text) => handleChangeText('address', text)}
                            style={styles.input}
                            placeholder="Enter User Address"
                            placeholderTextColor="#7A8094"
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                phoneInput.current && phoneInput.current.focus()
                            }}
                            editable={titleName !== 'Members Details'}
                        />
                    </View>

                    <Text style={styles.inputLabelText}>Phone Number</Text>
                    <View style={[styles.inputInnerContainer, titleName === 'Members Details' && { borderColor: '#EEEEEE', backgroundColor: '#EEEEEE' }]}>
                        <TextInput
                            ref={phoneInput}
                            value={formData?.phone}
                            onChangeText={(text) => handleChangeText('phone', text.replace(/[ #*;,.<>\{\}\[\]\\\/]/gi, ''))}
                            style={styles.input}
                            maxLength={10}
                            keyboardType='number-pad'
                            placeholder="XXX-XXX-XXXX"
                            placeholderTextColor="#7A8094"
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            editable={titleName !== 'Members Details'}
                        />
                    </View>

                    <Text style={styles.inputLabelText}>Assigned Category</Text>
                    <RNElementDropDownComp screenName={titleName} dropDownArray={newMemberCategory} handleDropDown={handleDropDown} selectedItemArr={formData?.dropDownSelectedArr} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '2%', gap: 5 }}>

                        <TouchableOpacity disabled={titleName === 'Members Details'} onPress={toggleStartInspectionSwitch} >
                            <View style={[styles.track, { backgroundColor: formData?.startInspectionFromScratch ? '#007BFF' : '#CBCBCB' }]}  >
                                <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbLeftStartInspectionSwitchPosition }] },]} />
                            </View>
                        </TouchableOpacity>

                        <Text style={[styles.inputLabelText, { fontSize: 13, textAlignVertical: 'top' }]}>Allow user to start inspection from scratch</Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TouchableOpacity onPress={toggleCreateQuestionSwitch} disabled={titleName === 'Members Details'} >
                            <View
                                style={[
                                    styles.track,
                                    { backgroundColor: formData?.createQuestionForInspection ? '#007BFF' : '#CBCBCB' },
                                ]}
                            >
                                <Animated.View
                                    style={[
                                        styles.thumb,
                                        { transform: [{ translateX: thumbLeftCreateQuestionSwitchPosition }] },
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>

                        <Text style={[styles.inputLabelText, { fontSize: 13, textAlignVertical: 'top' }]}>Allow user to create question for inspection</Text>

                    </View>

                    <TouchableOpacity style={[styles.newInspectionButton, { marginVertical: '5%', backgroundColor: titleName === 'Members Details' ? '#CBCBCB' : '#007BFF' }
                    ]}
                        disabled={titleName === 'Members Details'}
                        onPress={handleAddingMember}
                    >
                        <Text style={styles.newInspectionButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default TeamsMemberDetail

const styles = StyleSheet.create({
    track: {
        width: 40,
        height: 23,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 3,
    },
    thumb: {
        width: 16,
        height: 16,
        borderRadius: 13,
        backgroundColor: '#fff',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingBottom: '4%',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#DAEAFF',
        marginHorizontal: '1%',
        backgroundColor: '#daeaff6a',
        borderRadius: 10,
    },
    input: {
        flex: 1,
        padding: 8,
        height: 40,
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
        paddingLeft: '0.5%',
        color: '#000929',
        marginVertical: '3%',
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingTop: '3%',
        paddingBottom: '4%',
    },
    newInspectionButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
})