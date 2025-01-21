import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomRadioButtons from '../../components/CustomRadioButtons';
import CustomCheckBox from '../../components/CustomCheckBox';
import { useCallback } from 'react';
import Feather from '@expo/vector-icons/Feather';
import QuestionTickIcon from '../../../assets/images/icons/QuestionTickIcon.svg'
import QuestionCrossIcon from '../../../assets/images/icons/QuestionCrossIcon.svg'
import QuestionDeleteIcon from '../../../assets/images/icons/QuestionDeleteIcon.svg'
import { useEffect } from 'react';
import { useImgProvider } from '../../lib/RoomImageContext';
import * as SecureStore from "expo-secure-store";
// import useStore from '../../../store';
import { useLoader } from '../../lib/loaderContext';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import CustomModalForIcon from '../inspections/CustomModalForIcon';
// import useStore from '../../../store'
const CreateNewQuestionTemplate = ({ route }) => {
    const { setLoading } = useLoader()

    const { templateId, roomID, elementId } = route?.params
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIconIndex, setSelectedIconIndex] = useState('');
    const navigation = useNavigation();
    const { iconData, setIconData } = useImgProvider();
    let data = {
        templateId: templateId,
        roomId: roomID,
        // roomName: item?.name
    }
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState({
        saveQuestionCheck: null,
        answerRequiredCheck: null,
    });
    const [showInputBox, setShowInputBox] = useState(false);
    const [optionValue, setOptionValue] = useState('');
    // console.log('templateId',templateId);

    const [formData, setFormData] = useState({
        // questionName: '',
        // answerType: null,
        // saveQuestion: null,
        // answerRequired: null,
        // options: [{ option: '', iconId: null, id: null }],
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const handleCancel = () => {
        navigation.goBack();
    };

    const options = [
        { label: 'Options', value: 'radio' },
        { label: 'Drop Down', value: 'dropDown' },
        { label: 'Text Field', value: 'textArea' },
    ];

    useFocusEffect(useCallback(() => {
        handlingIcon();
    }, []))

    const handlingIcon = () => {
        // setIconData({})
    }


    const handleSelectedRadioButton = useCallback((value) => {
        if (value =='textarea') {
        setShowInputBox(false)
            
        }
        else{
        setShowInputBox(true)
        }
        setSelectedValue(value || null)
        setFormData((prev) => ({
            ...prev,
            answerType: value,
        }));
    }, []);

    const handleSelectedCheckBox = useCallback((value) => {
        
        setSelectedCheckBoxValue((prev) => ({
            ...prev,
            saveQuestionCheck: value || null
        }));
        setFormData((prev) => ({
            ...prev,
            saveQuestion: value,
        }));
    }, []);

    const handleSelectedAnsReqCheckBox = useCallback((value) => {

        setSelectedCheckBoxValue((prev) => ({
            ...prev,
            answerRequiredCheck: value || null
        }));
        setFormData((prev) => ({
            ...prev,
            answerRequired: value,
        }));
    }, []);

    const checkBoxOptions = [{ label: 'Save this Question.', value: 'yes' }];
    const checkBoxAnswerOptions = [{ label: 'Answer is Required', value: 'yes' }];

    const handleChangeText = (value) => {
        setOptionValue(value);
    };

    const deleteOption = (index) => {
        setFormData((prev) => ({
            ...prev,
            options: prev?.options?.filter((_, i) => i !== index) || [],
        }));
        setIconData('')
    };



    // const handleSave = () => {
    const handleSave = async () => {

        const params = {
            templateId: templateId, // Replace with actual values
            roomId: roomID,
            elementId: elementId,
            questions: [
                {
                    text: formData.questionName || '',
                    options: formData.options || [{ option: '', iconId: null, id: null }],
                    type: formData.answerType || null, // Example type
                    answerRequired: formData.answerRequired || null,
                    shouldSave: formData.saveQuestion || null,
                },
            ],
            // questions: [
            //     {
            //         text: formData.questionName,
            //         options: formData.options,
            //         type: formData.answerType, // Example type
            //         answerRequired: formData.answerRequired,
            //         shouldSave: formData.saveQuestion,
            //     },
            // ],
        };
        console.log('questions',params?.questions);
        

        // setName(formData?.questionName)

        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/template/templateAddChecklistItem`, params, { withCredentials: true });

            if (response?.status === 200 || response?.status === 201) {
                navigation.navigate('CreateRoomTemplate',{data})
            }
        } catch (error) {
            console.log('Error in getInspectionRoomData:', error);
        } finally {
            setLoading(false);
        }
        // }
        // else {
        //     setLoading(false);
        //     alert("Sorry, failed to fetch details.");
        //     navigation.goBack();
        // }
    };
    // };

    useEffect(() => {
        const questionNotEmpty = formData?.questionName?.trim()?.length > 3;
        const isTextField = selectedValue === 'textArea';
        const hasMinOptions = formData?.options?.length >= 2;

        if (questionNotEmpty && (isTextField || hasMinOptions)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [formData?.questionName, selectedValue, formData?.options]);



    const updateIconId = (newIconId, id) => {
        setFormData((prev) => ({
            ...prev,
            options: prev?.options?.map((item, i) =>
                i === selectedIconIndex ? { ...item, id: newIconId, iconId: id } : item
            ),
        }));
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                {/* <View style={styles.subHeaderContainer}>
                    <Text style={styles.roomInspectionText}>Add new Question to the element</Text>
                </View> */}

                <View style={styles.inputContainer}>
                    {/* <Text style={styles.inputLabelText}>New Question</Text> */}
                    <View style={[styles.inputInnerContainer, { backgroundColor: "#cce2ff37", marginTop: '5%' }]}>
                        <TextInput
                            value={formData.questionName}
                            onChangeText={(text) => setFormData((prev) => ({ ...prev, questionName: text }))}
                            style={styles.input}
                            placeholder="Enter new question"
                            placeholderTextColor="#7A8094"
                        />
                    </View>

                    <View style={{ marginBottom: 0 }}>
                        <CustomCheckBox
                            options={checkBoxOptions}
                            onChange={handleSelectedCheckBox}
                            value={selectedCheckBoxValue?.saveQuestionCheck}
                        />
                    </View>

                    <Text style={[styles.inputLabelText, { marginBottom: '2%' }]}>Answer Type</Text>

                    <View style={{ flex: 1 }}>
                        <CustomRadioButtons
                            options={options}
                            onChange={handleSelectedRadioButton}
                            value={selectedValue}
                        />

                        {/* {showInputBox && */}
                        {selectedValue !='textArea'  && showInputBox&&
                            <View style={styles.inputIconInnerContainer}>
                                {/* <Text style={styles.inputCountText}>1.</Text> */}
                                <TextInput
                                    value={optionValue}
                                    onChangeText={handleChangeText}
                                    style={styles.inputIcon}
                                    placeholder="Enter Option"
                                    placeholderTextColor="#7A8094"
                                />
                                {optionValue?.trim()?.length >= 2 && (
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (formData?.options?.length == 4) {
                                                    alert('Add maximum 4 options')
                                                }
                                                else {
                                                    const afterTrim = optionValue?.trim();
                                                    let newOption = { option: afterTrim, iconId: null, id: null }
                                                    if (afterTrim.length >= 2) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            options: [...(prev?.options || []), newOption],
                                                        }));
                                                        setOptionValue('');
                                                        setShowInputBox(false);
                                                    }

                                                }

                                            }}
                                        >
                                            <QuestionTickIcon />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            setShowInputBox(false);
                                            setOptionValue('');
                                        }}>
                                            <QuestionCrossIcon />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        }

                        {/* {formData?.options?.length < 1 ? */}
                        {/* {formData?.options?.length > 0 && selectedValue !='textArea' ?
                            <TouchableOpacity
                                style={[styles.transparentButton]}
                                onPress={() => setShowInputBox(!showInputBox)}
                            >
                                <Feather name="plus" size={17} color="#007BFF" style={{ paddingRight: '1%', paddingTop: '0.5%' }} />
                                <Text style={[styles.newInspectionButtonText, { color: '#007BFF', fontSize: 13 }]}>
                                    Add Option
                                </Text>
                            </TouchableOpacity> : ''} */}

                        {(selectedValue && selectedValue !='textArea') && (
                            <>
                                <Text style={[styles.inputLabelText, { fontSize: 13, marginBottom: '2%' }]}>
                                    Options
                                    <Text style={{ color: '#7A8094' }}> ( Add minimum 2 options ) </Text>
                                </Text>

                                {(formData?.options?.length >= 1) &&
                                    formData?.options?.map((option, index) => {

                                        // const isChangeData = selectedIndex === index
                                        return (
                                            <View key={index} style={styles.centerItemStyle} >

                                                <View style={styles.inputIconInnerContainer}>

                                                    <View style={styles.centerItemStyle}>

                                                        <Text style={styles.inputCountText}>{index + 1}.</Text>
                                                        <Text style={styles.input}>{option?.option}</Text>

                                                        <TouchableOpacity style={[styles.centerItemStyle, { gap: 5 }]}
                                                            onPress={async () => {
                                                                setModalVisible(true)
                                                                setSelectedIconIndex(index)
                                                                // navigation.navigate('SelectIcon')
                                                                // setSelectedIconData({})
                                                            }}
                                                        >

                                                            {/* {isChangeData ?
                                                                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', }}>
                                                                    <Text style={styles.addIconText}>Icon</Text>

                                                                    {selectedIconData?.icon && React.cloneElement(selectedIconData?.icon, { height: 23, width: 19 })}
                                                                </View>
                                                                :
                                                                } */}
                                                            <Text style={styles.addIconText}>{!option?.id ? 'Add Icon' : 'Icon:'}</Text>
                                                            {option?.id && React.cloneElement(option?.id, { height: 23, width: 19 })}


                                                        </TouchableOpacity>

                                                    </View>

                                                </View>

                                                <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => deleteOption(index)}>
                                                    <QuestionDeleteIcon />
                                                </TouchableOpacity>

                                            </View>
                                        )
                                    })}

                                {formData?.options?.length > 0 && selectedValue !='textArea'  ?
                                    <TouchableOpacity
                                        style={[styles.transparentButton]}
                                        onPress={() => setShowInputBox(!showInputBox)}
                                    >
                                        <Feather name="plus" size={17} color="#007BFF" style={{ paddingRight: '1%', paddingTop: '0.5%' }} />
                                        <Text style={[styles.newInspectionButtonText, { color: '#007BFF', fontSize: 13 }]}>
                                            Add Option
                                        </Text>
                                    </TouchableOpacity> : ''}
                            </>
                        )}

                        <View style={{ marginBottom: 0 }}>
                            <CustomCheckBox
                                options={checkBoxAnswerOptions}
                                onChange={handleSelectedAnsReqCheckBox}
                                value={selectedCheckBoxValue?.answerRequiredCheck}
                            />
                        </View>

                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.newInspectionButton, { marginBottom: '5%' },
                    isFormValid &&
                    { backgroundColor: '#007BFF' }
                    ]}
                    disabled={!isFormValid}
                    onPress={handleSave}
                >
                    <Text style={styles.newInspectionButtonText}>Add New Question</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
            <CustomModalForIcon
                updateIconId={updateIconId}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}

            />
        </SafeAreaView >
    );
};

export default CreateNewQuestionTemplate

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    subHeaderContainer: {
        paddingTop: '3%',
        paddingHorizontal: '6%'
    },
    roomInspectionText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 17.5,
        color: '#000929',
    },
    inputContainer: {
        paddingHorizontal: '4%',
        paddingBottom: '4%',
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
    inputIconInnerContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        marginTop: '1%',
        marginBottom: '2%',
        paddingVertical: '1%',
        paddingHorizontal: '3%',
        borderColor: '#DAEAFF',
        borderRadius: 10,
    },
    centerItemStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputCountText: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#000',
    },
    inputIcon: {
        flex: 1,
        padding: 8,
        paddingLeft: 0,
        marginHorizontal: '2%',
        color: '#000929',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
    },
    input: {
        flex: 1,
        padding: 8,
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
    },
    addIconText: {
        paddingVertical: 6,
        color: '#6C727F',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14.7,
        paddingLeft: '0.5%',
        color: '#000929',
        marginVertical: '3%',
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
    transparentButton: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: '0.8%',
        paddingBottom: '2%',
    },
})