import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
// import CustomCheckBox from '../../../components/CustomCheckBox';
import { useCallback } from 'react';
import CreateQuestionCheckBoxTemplate from './components/CreateQuestionCheckBoxTemplate';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';

const AddNewQuestionTemplate = ({route}) => {
    const { setLoading } = useLoader()

    const {templateId,roomID,elementId,saveQuestionArray,questionArray,elementIndex} =route?.params
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const questionArr = questionArray?.[elementIndex]?.checklist?.map(item => item.text);
    const saveQuestionArr = saveQuestionArray?.map(item => item.text);

    const commonIds = questionArr.filter(text => saveQuestionArr.includes(text));

    const [formData, setFormData] = useState({
        questionName: '',
        answerType: null,
        saveQuestion: null,
        answerRequired: null,
        options: [{ option: '', iconId: null, id: null }],
    });
    

    const handleCancel = () => {
        navigation.goBack();
    };

    // const handleSave = () => {
    //     if (isFormValid) {
    //         // TODO: Save the new question to the room inspection element
    //         console.log('Selected Checkbox Value:', selectedCheckBoxValue);
    //     }
    // };



    const handleSelectedRadioButton = useCallback((value) => {
        setSelectedValue(value || null);
    }, []);

    const handleSelectedCheckBox = useCallback((value,item) => {
        setSelectedCheckBoxValue(value || null);
        setFormData({
            questionName: item?.text,
            answerType: item?.type,
            saveQuestion: item?.answer,
            answerRequired: item?.answerRequired,
            options: [{ option: item?.options?.[0]?.option, iconId: item?.options?.[0]?.iconId, id:  item?.options?.[0]?._id }],

        })
    }, []);

    const checkBoxOptions = [
        { label: 'Present?', value: 'Present' },
        { label: 'Clean?', value: 'Clean' },
        { label: 'Damage?', value: 'Damage' },
    ];

    // useEffect to enable/disable the confirm button based on selection
    useEffect(() => {
        setIsFormValid(selectedCheckBoxValue !== null);
    }, [selectedCheckBoxValue]);

    const handleSave = async () => {
            
        const params = {
            templateId: templateId, // Replace with actual values
            roomId: roomID,
            elementId: elementId,
            questions: [
              {
                text:formData.questionName,
                options: formData.options,
                type: formData.answerType, // Example type
                answerRequired:formData.answerRequired ,
                shouldSave: formData.saveQuestion,
              },
            ],
          };
          
    // setName(formData?.questionName)

            setLoading(true);
        
            try {
                const response = await axios.post(`${apiUrl}/api/template/templateAddChecklistItem`, params,{ withCredentials: true });
                
                if (response?.status === 200 || response?.status === 201) {
                    navigation.goBack()
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

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.subHeaderContainer}>
                    <Text style={styles.roomInspectionText}>Add questions to checklist</Text>
                </View>

                <View style={styles.inputContainer}>
                    {saveQuestionArray?.length ===0 ?
                    <Text style={styles.inputLabelText}>
                    No checklist questions found. Please create a new checklist question.
                </Text>:
                     <Text style={styles.inputLabelText}>
                        Please Select Questions from the list that you want to add to checklist?
                    </Text>}

                    <View style={{ marginLeft: '2%', flex: 1 }}>
                        <CreateQuestionCheckBoxTemplate
                            options={saveQuestionArray}
                            onChange={handleSelectedCheckBox}
                            value={selectedCheckBoxValue}
                            commonIds={commonIds}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.transparentButton]}
                        onPress={() => {
                            navigation.navigate("CreateNewQuestionTemplate",{
                                templateId,
                                roomID,
                                elementId
                            });
                        }}
                    >
                        <Feather name="plus" size={17} color="#007BFF" style={{ paddingRight: '1%', paddingTop: '0.5%' }} />
                        <Text style={[styles.newInspectionButtonText, { color: '#007BFF', fontSize: 13 }]}>
                            Create new Question
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.newInspectionButton, { marginBottom: '5%' }, isFormValid && { backgroundColor: '#007BFF' }]}
                    disabled={!isFormValid}
                    onPress={handleSave}
                >
                    <Text style={styles.newInspectionButtonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveButton]} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};


export default AddNewQuestionTemplate

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
        paddingHorizontal: '5%',
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
    input: {
        flex: 1,
        padding: 8,
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13.7,
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
        paddingTop: '1.5%',
        marginTop: '2%',
        paddingBottom: '4%',
    },
    newInspectionButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
})