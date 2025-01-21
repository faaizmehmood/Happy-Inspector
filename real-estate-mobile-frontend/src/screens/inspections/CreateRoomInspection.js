import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert, FlatList, ScrollView, ToastAndroid } from 'react-native'
import React, { lazy, Suspense, useCallback } from 'react'
import CustomHeader from '../../components/CustomHeader';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import ImageIcon from '../../../assets/images/icons/ImageIcon.svg'
import * as ImagePicker from 'expo-image-picker';
import { useLoader } from '../../lib/loaderContext';
import { apiUrl } from '../../constants/api_Url';
import axios from 'axios';
import { useState } from 'react';
import CrossIcon from '../../../assets/images/icons/CrossIcon.svg'
import ImagePlusIcon from '../../../assets/images/icons/ImagePlusButton.svg'
import ElementSelectedDropDown from '../../components/ElementSelectedDropDown';
import QuestionTickIcon from '../../../assets/images/icons/QuestionTickIcon.svg'
import QuestionCrossIcon from '../../../assets/images/icons/QuestionCrossIcon.svg'
import CreateElementInspection from './roomElements/CreateElementInspection';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import UpgradeModal from './InspectionComponents/UpgradeModal';
import { userContext } from '../../lib/userContext';

let checkImageFormate = '';
let inspectionID = null;
let roomID = null;
let navigationData = {}

const ImagePreviewComp = lazy(() => import('./InspectionComponents/ImagePreviewComp'))
// const CreateElementInspection = lazy(() => import('./roomElements/CreateElementInspection'))

const CreateRoomInspection = () => {
   
    const [modalVisibleUpgrade, setModalVisibleUpgrade] = useState(false);
    // const [answerTextField, setAnswerTextField] = useState('');

    const handleUpgrade = () => {
        setLoading(true);
        setModalVisibleUpgrade(false);
        setTimeout(() => {
            navigation.navigate('PaymentPlanScreen', { goBack: true });
            setLoading(false);
        }, 1000);
        // Add your upgrade logic here
    };
    //   const currentRole ='standard'
    //   const currentRole ='topTier'
    const navigation = useNavigation();
    const route = useRoute();
    inspectionID = route?.params?.data?.inspectionId
    roomID = route?.params?.data?.roomId
    roomName = route?.params?.data?.roomName

    const isFocus = useIsFocused();

    const { setLoading } = useLoader()

    const [elementsArr, setElementsArr] = useState('');
    const [questionsArr, setQuestionsArr] = useState('');
    const [saveQuestionArray, setSaveQuestionArray] = useState('');

    const [roomData, setRoomData] = useState({
        name: '',
        note: '',
        images: [],
        elementImg: null,
        imageRequired: false
    });
// const requiredAnswerCount = elementsArr?.filter(
//     (item) => item.imageRequired  == true &&  item?.image?.url ==''
// ).length;
// console.log('elementsArr----->>>>>>',elementsArr);



    // const elementsId =elementsArr

    const [initialLoad, setInitialLoad] = React.useState(true);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [showElementInputBox, setShowElementInputBox] = useState(false);
    const [elementName, setElementName] = useState('');
    const [elementIndex, setElementIndex] = useState(null);
    const [selectElementId, setSelectElementId] = useState('');

    const buttonStatusDetails = [
        { name: 'Rearrange Elements', icon: require('../../../assets/images/icons/rearrangeRoom.webp') },
        { name: 'Delete Elements', icon: require('../../../assets/images/icons/deleteRoom.webp') },
    ];

    const editRoomName = [
        { name: 'Edit Room Name', icon: require('../../../assets/images/icons/rearrangeRoom.webp') },
    ];

    const onPressShowInputBox = (data) => {
        setRoomData((prev) => ({
            ...prev,
            name: data,
        }));
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         if (initialLoad) {
    //             setRoomData({
    //                 name: '',
    //                 note: '',
    //                 images: [],
    //             });
    //             setInitialLoad(false);
    //         }
    //         setElementsArr([]);
    //     }, [initialLoad])
    // );

    useFocusEffect(
        useCallback(() => {
            if (isFocus) {
                getInspectionRoomData();
            }
        }, [isFocus])
    );



    const getInspectionRoomData = async () => {
        if ((inspectionID && roomID)) {
            setLoading(true);
            const data = {
                inspectionId: inspectionID ? inspectionID : null,
                roomId: roomID ? roomID : null
            };
            try {
                const response = await axios.post(`${apiUrl}/api/inspection/getInspectionRoomData`, data, { withCredentials: true });
                if (response?.status === 200 || response?.status === 201) {
                    // console.log('response?.data?.elements-->>',response?.data?.room?.elements);
                    // console.log('response?.data?.room',response?.data?.room);
                    
                    setSaveQuestionArray(response?.data?.questions)
                    setQuestionsArr(response?.data?.room?.elements)
                    setElementsArr(response?.data?.room?.elements || []);
                    setRoomData((prev) => ({
                        ...prev,
                        name: response?.data?.room?.name || '',
                        note: response?.data?.room?.note || '',
                        images: response?.data?.room?.image ? response?.data?.room?.image : [],
                        imageRequired: response?.data?.room?.imageRequired
                    }));
                }
            } catch (error) {
                console.log('Error in getInspectionRoomData:', error);
            } finally {
                setLoading(false);
            }
        }
        else {
            setLoading(false);
            alert("Sorry, failed to fetch details.");
            navigation.goBack();
        }
    };

    const checkRoleForTier = () => {
        if (currentRole == 'FREETIER') {
            if (elementsArr?.length < 5) {
                setElementIndex(null)
                setShowElementInputBox(true)
            }
            else {
                setModalVisibleUpgrade(true)
            }
        }

        else if (currentRole == 'STANDARDTIER') {
            if (elementsArr?.length < 10) {
                setElementIndex(null)
                setShowElementInputBox(true)
            }
            else {
                setModalVisibleUpgrade(true)
            }
        }

        else if (currentRole == 'TOPTIER' || currentRole == 'SUBUSER') {
            setElementIndex(null)
            setShowElementInputBox(true)
        }
    }

    {/* <================== will be used if axios is used for uploading images =============> */ }
    // const uploadingImages = async (imageUrl, count = 2) => {
    //     try {
    //         let data = new FormData();

    //         let imageType = `image/${imageUrl?.uri?.split('.').pop()}`
    //         let imageName = imageUrl?.uri?.split('/').pop()

    //         if (imageUrl?.mimeType === 'image/jpeg') {
    //             checkImageFormate = SaveFormat.JPEG
    //         } else if (imageUrl.mimeType === 'image/png') {
    //             checkImageFormate = SaveFormat.PNG
    //         } else {
    //             checkImageFormate = SaveFormat.WEBP
    //         }

    //         const resizedImage = await manipulateAsync(
    //             imageUrl.uri,
    //             [{
    //                 resize: { height: imageUrl?.height, width: imageUrl?.width }
    //             }],
    //             { compress: 0.2, format: checkImageFormate }
    //         );

    //         // console.log('imageType', imageType)
    //         // console.log('resizedImage', resizedImage?.uri)
    //         // console.log('imageName', imageName)

    //         data.append('image', {
    //             uri: resizedImage?.uri,
    //             type: imageType,
    //             name: imageName
    //         });

    //         data.append('inspectionId', inspectionID);
    //         data.append('roomId', roomID);

    //         const response = await axios.post(`${apiUrl}/api/inspection/InspectionAddRoomImage`, data, {
    //             headers: {
    //                 Accept: 'application/json',
    //                 "Content-Type": "multipart/form-data",
    //             },
    //             withCredentials: true
    //         });

    //         if (response.status === 200 || response.status === 201) {
    //             await getInspectionRoomData();
    //         }
    //     } catch (error) {
    //         console.log('Error uploading image:', error);
    //         if (error.message === 'Network Error' && count > 0) {
    //             await uploadingImages(imageUrl, count - 1)
    //             count++;
    //         } else {
    //             console.log('Failed to upload after retries.');
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    {/* <================== will be used for Fetch API ==================> */ }
    const uploadingImages = async (imageUrl, count = 2) => {
        try {
            let data = new FormData();

            let imageType = `image/${imageUrl?.uri?.split('.').pop()}`;
            let imageName = imageUrl?.uri?.split('/').pop();

            let checkImageFormate;
            if (imageUrl?.mimeType === 'image/jpeg') {
                checkImageFormate = SaveFormat.JPEG;
            } else if (imageUrl.mimeType === 'image/png') {
                checkImageFormate = SaveFormat.PNG;
            } else {
                checkImageFormate = SaveFormat.WEBP;
            }

            const resizedImage = await manipulateAsync(
                imageUrl.uri,
                [{ resize: { height: imageUrl?.height, width: imageUrl?.width } }],
                { compress: 0.2, format: checkImageFormate }
            );

            data.append('image', {
                uri: resizedImage?.uri,
                type: imageType,
                name: imageName
            });
            data.append('inspectionId', inspectionID);
            data.append('roomId', roomID);

            const response = await fetch(`${apiUrl}/api/inspection/InspectionAddRoomImage`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: data,
                credentials: 'include'
            });

            if (response.status === 200 || response.status === 201) {
                const result = await response.json();
                console.log('Image uploaded successfully:', result);
                await getInspectionRoomData();
                ToastAndroid.show(result?.message, ToastAndroid.SHORT);
            } else {
                console.log('Failed to upload image:', await response.text());
            }

        } catch (error) {
            console.log('Error uploading image:', error);
            if (error.message === 'Network request failed' && count > 0) {
                await uploadingImages(imageUrl, count - 1);
            } else {
                console.log('Failed to upload after retries.');
            }
        } finally {
            setLoading(false);
        }
    };


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false,
        });

        try {
            if (!result.canceled) {
                await uploadingImages(result?.assets[0])
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    };


    const captureImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        try {
            if (!result.canceled) {
                await uploadingImages(result?.assets[0])
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const showImagePickerOptions = () => {
        setLoading(true)
        Alert.alert(
            "Select Image",
            "Choose an option",
            [
                {
                    onPress: () => setLoading(false),
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Select from Gallery",
                    style: 'destructive',
                    onPress: pickImage
                },
                {
                    text: "Capture Image",
                    style: 'destructive',
                    onPress: captureImage
                },
            ],
            { cancelable: false }
        );
    };

    const handleChangeText = (field, value) => {
        setRoomData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validation = () => {
        const { name, note } = roomData;
        if (name?.trim()?.length === '' || name?.trim()?.length < 4 || note.trim()?.length === '' || note?.trim?.length < 4) {
            alert('Please enter a name to save.')
            return false;
        }
        return true;
    }

    const deleteImage = async (deletedImgData) => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    onPress: () => setLoading(false),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        setLoading(true);
                        const data = {
                            inspectionId: inspectionID ? inspectionID : null,
                            roomId: roomID ? roomID : null,
                            imageId: deletedImgData?._id
                        };
                        try {
                            const response = await axios.patch(`${apiUrl}/api/inspection/InspectionDeleteRoomImage`, data, { withCredentials: true });
                            if (response?.status === 200 || response?.status === 201) {
                                // const result = await response.json();
                                // console.log(response?.data?.message);
                                ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
                                
                                await getInspectionRoomData();
                                if (roomData?.images?.length === 1) {
                                    handleModalVisibility();
                                }
                            }
                        } catch (error) {
                            console.log('Error in deleting Image:', error);
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleSaveCaption = useCallback(async (item, captionText) => {
        const data = {
            inspectionId: inspectionID ? inspectionID : null,
            roomId: roomID ? roomID : null,
            imageId: item?._id,
            caption: captionText?.trim()
        };
        try {
            const response = await axios.patch(`${apiUrl}/api/inspection/InspectionUpdateRoomImageCaption`, data, { withCredentials: true });
            if (response?.status === 200 || response?.status === 201) {
                await getInspectionRoomData();
            }
        } catch (error) {
            console.log('Error in adding Caption:', error);
        } finally {
            setLoading(false);
        }
    }, [modalVisible])

    const handleSave = async () => {
        const requiredAnswerCount = elementsArr[0]?.checklist?.filter(
            (item) => item.answerRequired && item.answer === ""
        ).length;
        const requiredElementImageCount = elementsArr?.filter(
            (item) => item.imageRequired == true && (item?.image?.url == '' || !item?.image)
        ).length;
        // console.log('Count of required unanswered fields:', requiredAnswerCount)

        // if (!validation) return;
        if (requiredAnswerCount > 0 
            //  || roomData?.note == ''
            ) {
            alert('Please fill in all the required fields to continue.')
        }
        else if (roomData?.imageRequired === true && roomData?.images?.length === 0) {
            alert('Please upload  atleast one room image to continue.')
        }
        else if (requiredElementImageCount > 0) {
            alert('Please upload required element image to continue.')
        }
        else {
            const data = {
                inspectionId: inspectionID || null,
                roomData: {
                    _id: roomID || null,
                    name: roomData?.name?.trim(),
                    note: roomData?.note?.trim(),
                    elements: elementsArr?.length > 0 ? elementsArr : [],
                    // images: roomData?.images,
                    // image: updatedImages,
                }
            };

            try {
                setLoading(true)
                const response = await axios.post(`${apiUrl}/api/inspection/InspectionUpdateRoom`, data, { withCredentials: true });

                if (response.status === 200 || response.status === 201) {
                    ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);

                    setLoading(false)
                    navigation.goBack()
                }
            } catch (error) {
                console.log('Error in /InspectionUpdateRoom:', error);
                setLoading(false)
            }

        }




    };

    const handleModalVisibility = useCallback((data) => {
        setModalVisible(false)
    }, [modalVisible])

    navigationData = { inspectionID, roomID, elementsArr }

    const handleElementIndex = (index, elementID) => {


        setElementIndex(elementIndex === index ? null : index)
        setSelectElementId(elementID)
    }


    // const handleElementData = useCallback((data) => {
    //     setRoomData((prev) => ({
    //         ...prev,
    //         elementImg: data
    //     }))
    // }, [roomData])

    const handleElementData = async (imageUrl, elementId) => {
        let data = new FormData();

            let imageType = `image/${imageUrl?.uri?.split('.').pop()}`;
            let imageName = imageUrl?.uri?.split('/').pop();
            let checkImageFormate;
            if (imageUrl?.mimeType === 'image/jpeg') {
                checkImageFormate = SaveFormat.JPEG;
            } else if (imageUrl.mimeType === 'image/png') {
                checkImageFormate = SaveFormat.PNG;
            } else {
                checkImageFormate = SaveFormat.WEBP;
            }

            const resizedImage = await manipulateAsync(
                imageUrl.uri,
                [{ resize: { height: imageUrl?.height, width: imageUrl?.width } }],
                { compress: 0.2, format: checkImageFormate }
            );
        try {
            setLoading(true);
            data.append('image', {
                uri: resizedImage?.uri,
                type: imageType,
                name: imageName
            });
            data.append('inspectionId', inspectionID);
            data.append('roomId', roomID);
            data.append('elementId', elementId);

            const response = await fetch(`${apiUrl}/api/inspection/InspectionSaveElementImage`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: data,
                credentials: 'include'
            });


            if (response.status === 200 || response.status === 201) {
               
                const result = await response.json();
                // console.log('Image uploaded successfully:', await response.json());
                // console.log(`Image uploaded successfully`);
                // console.log('Image uploaded successfully:', result);
                
                ToastAndroid.show(result?.message, ToastAndroid.SHORT);
                await getInspectionRoomData();
            } else {
                console.log('Failed to upload image:', await response.text());
            }

        } catch (error) {
            console.log('Error uploading image:', error);
            if (error.message === 'Network request failed') {
                await handleElementData(imageUrl, elementId);
            } else {
                console.log('Failed to upload after retries.');
            }
        } finally {
            setLoading(false);
        }
    };

    const InspectionDeleteElement = async (elementID) => {
        const data = {
            inspectionId: inspectionID,
            roomId: roomID,
            elementId: elementID
        }
        try {
            setLoading(true);

            const response = await axios.patch(
                `${apiUrl}/api/inspection/InspectionDeleteElementImage`,
                data,
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200 || response.status === 201) {
                ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
                // console.log('Image uploaded successfully:', await response.json());
                await getInspectionRoomData();
            } else {
                console.log('Failed to upload image:', await response.text());
            }

            // setInspectionDetails(response?.data?.inspections);
        } catch (error) {
            console.log("Error in handleFilterApiCalling", error);
        } finally {
            setLoading(false);
        }
    };

    //   const onPressSelectAnswer = ( id, answerValue) => {
    //     console.log('id',id ,'answerValue',answerValue);

    //     // setElementsArr((prevData) =>
    //     //     prevData.map((item) =>
    //     //         item._id === selectElementId
    //     //             ? {
    //     //                   ...item,
    //     //                   checklist: item?.checklist?.map((item) =>
    //     //                       item._id == id
    //     //                           ? { ...item, answer: answerValue }
    //     //                           : item
    //     //                   )
    //     //               }
    //     //             : item
    //     //     )
    //     // );

    //     // console.log('element',elementsArr[0]?.checklist);

    // };

    const onPressSelectAnswer = (checklistId, newAnswer) => {

        setElementsArr(prevElements =>
            prevElements.map(element => {
                if (element._id === selectElementId) {
                    return {
                        ...element,
                        checklist: element?.checklist?.map(item => {
                            if (item._id === checklistId) {
                                // setAnswerTextField(newAnswer)
                                return { ...item, answer: newAnswer }; // Update the answer
                            }
                            return item; // Return the unchanged item
                        })
                    };
                }
                return element; // Return the unchanged element
            })
        );
    };
    const noteAnswer = (newAnswer) => {

        setElementsArr(prevElements =>
            prevElements.map(element => {
                if (element._id === selectElementId) {
                    return {
                        ...element,
                        note: newAnswer
                        // checklist: element?.checklist?.map(item => {
                        //     if (item._id === checklistId) {
                        //         // setAnswerTextField(newAnswer)
                        //         return { ...item, answer: newAnswer }; // Update the answer
                        //     }
                        //     return item; // Return the unchanged item
                        // })
                    };
                }
                return element; // Return the unchanged element
            })
        );
    };

    //   const onPressSelectAnswer = (id,answerValue) => {
    //     setElementsArr((prevChecklist) =>

    //         prevChecklist?.map((item) =>
    //             item._id === id ? { ...item, answer: answerValue } : item
    //         )
    //     );
    // };
    // elementId

    //   const onPressSelectAnswer =(answerValue)=>{
    //     console.log('answerValue---->>>>>>>>',answerValue);


    //   }

    const renderItem = ({ item, index }) => {

        const isSelected = elementIndex === index
        // const specificElementData = elementIndex === index ? elementsArr[elementIndex] : null

        return (
            <View style={styles.elementDetailContainer}>
                <TouchableOpacity style={styles.roomElementParentContainer}
                    // onPress={() => {
                    //     let data = {
                    //         inspectionID,
                    //         roomID,
                    //         elementsArr,
                    //         item
                    //     }

                    //     navigation.navigate('CreateElementInspection', { data })
                    // }}
                    onPress={() => handleElementIndex(index, item?._id)}
                >

                    <View style={styles.roomsElementTextContainer}>
                        <Text style={styles.roomsElementText}>{item?.name}</Text>
                    </View>

                    <View >
                        <Text style={styles.elementCountText}>{item?.checklist?.length} Question</Text>
                    </View>

                    <Entypo
                        name={isSelected ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#6C727F"
                        style={{ paddingHorizontal: '3%' }}
                    />
                </TouchableOpacity>

                {isSelected && <>
                    <CreateElementInspection
                        questionArray={questionsArr}
                        saveQuestionArray={saveQuestionArray}
                        inspectionID={inspectionID} roomID={roomID}
                        handleElementData={handleElementData}
                        onPressDeleteElementImage={InspectionDeleteElement}
                        onPressSelectAnswer={onPressSelectAnswer}
                        // answerTextField={answerTextField}
                        // Faaiz 
                        elementData={elementsArr[elementIndex]}
                        elementImg={roomData?.elementImg}
                        noteAnswer={noteAnswer}
                        elementIndex={elementIndex}



                    />
                </>}
            </View>
        )
    }

    const handleCreateElement = async () => {
        try {
            setLoading(true)
            let data = {
                inspectionId: inspectionID ? inspectionID : null,
                roomId: roomID ? roomID : null,
                elementName: elementName?.trim()
            }
            const response = await axios.post(`${apiUrl}/api/inspection/InspectionAddNewElement`, data, { withCredentials: true })
            if (response?.status === 200 || response?.status === 201) {
                setElementName('')
                setShowElementInputBox(false)
                getInspectionRoomData()

            }
        } catch (error) {
            console.log('error in handleCreateElement', error)
        } finally {
            setLoading(false)
        }
    };
    // console.log('roomData?.name', roomData?.name);
    const { userData } = userContext();
     const currentRole =userData?.role
    return (
        <SafeAreaView style={styles.mainContainer}>

            <CustomHeader title={roomName ? roomName : "New Room"} goBack={true} onPress={onPressShowInputBox} editRoomName={editRoomName} />


            {/* <View style={styles.subHeaderContainer}>
                    <Text style={styles.roomInspectionText}>Room Inspection</Text>
                </View> */}

            {/* <================== discuss With babar bhai  =============> */}

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled={true}>

                <View style={styles.roomDetailsText}>
                    <Text style={styles.subHeaderText}>Room Details</Text>
                </View>

                <View style={styles.inputContainer}>
                <Text style={styles.subHeaderTextRoom}>Room Images {roomData?.imageRequired ? '*' :''}</Text>
                    <View style={[roomData?.images?.length !== 0 ? styles.imageContainer : null,]}>
                        {roomData?.images?.length > 0 ?
                            <>
                                {roomData?.images?.slice(0, 2)?.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.iconImageContainer}>

                                            <TouchableOpacity style={styles.crossIcon} onPress={() => deleteImage(item)}>
                                                <CrossIcon />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => setModalVisible(true)}>

                                                <Image
                                                    source={{ uri: item?.url }}
                                                    resizeMethod='resize'
                                                    resizeMode='cover'
                                                    style={{ width: '100%', height: '100%' }}
                                                />

                                            </TouchableOpacity>

                                            {index === 1 && <TouchableOpacity style={styles.countContainer} onPress={() => setModalVisible(true)}>
                                                <Text style={styles.countTextStyle}>{roomData?.images?.length > 2 ? `+${roomData?.images?.length - 2}` : ''}</Text>
                                            </TouchableOpacity>}
                                        </View>
                                    );
                                })}
                                <TouchableOpacity onPress={showImagePickerOptions}>
                                    <ImagePlusIcon />
                                </TouchableOpacity>
                            </>
                            :
                            <TouchableOpacity style={styles.imageUploadButton} onPress={showImagePickerOptions}>
                                <ImageIcon />
                                <Text style={styles.imageUploadButtonText}>Upload or capture an image</Text>
                            </TouchableOpacity>}

                        {modalVisible && <Suspense>
                            <ImagePreviewComp
                                isVisible={modalVisible}
                                handleDeleteImg={deleteImage}
                                roomImArr={roomData?.images}
                                handleSaveCaption={handleSaveCaption}
                                handleModalVisibility={handleModalVisibility}
                            />
                        </Suspense>}

                    </View>
                    {/* <Text style={styles.inputLabelText}>Room Name</Text>
                    <View style={[styles.inputInnerContainer, { backgroundColor: "#fff" }]}>
                        <TextInput
                            value={roomData?.name}
                            onChangeText={(text) => handleChangeText('name', text)}
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="#7A8094"
                        />
                    </View> */}

                    {/* <Text style={styles.inputLabelText}>Add a notes to Room</Text> */}
                    <View style={styles.inputInnerContainer}>
                        <TextInput
                            value={roomData?.note}
                            onChangeText={(text) => handleChangeText('note', text)}
                            style={styles.input}
                            placeholder="Write a note  (optional)"
                            placeholderTextColor="#7A8094"
                        />
                    </View>

                    {/* <Text style={styles.inputLabelText}>Room Images</Text> */}
                    {/* <Text style={styles.requiredStar}>*</Text> */}




                    <View style={styles.roomElementsContainer}>

                        {elementsArr?.length > 0 ? <View style={styles.subHeaderWithDropDownStyle}>

                            <Text style={styles.subHeaderText}>Room Elements</Text>

                            <ElementSelectedDropDown buttonStatusDetails={buttonStatusDetails} navigationData={navigationData} />

                        </View> : ''}

                        {elementsArr?.length > 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                scrollEnabled={false}
                                data={elementsArr}
                                keyExtractor={(item, index) => index?.toString()}
                                renderItem={renderItem}
                            />
                            :
                            <Text style={styles.noDataText}>No elements available. Add an element!</Text>
                        }

                    </View>
                </View>

                <View style={{ flex: 0, paddingTop: '2%' }}>
                    {showElementInputBox && 
                    <View style={styles.elementTextContainer}>
                        <TextInput
                        autoFocus={true}
                            value={elementName}
                            onChangeText={(text) => setElementName(text)}
                            style={styles.searchInput}
                            placeholder="Element Name  (min 3 characters)"
                            placeholderTextColor="#7A8094"
                        />
                        {elementName?.length >= 3 &&
                            <TouchableOpacity
                                style={{ marginRight: '3%' }}
                                onPress={handleCreateElement}
                            >
                                <QuestionTickIcon />
                            </TouchableOpacity>}

                        <TouchableOpacity onPress={() => {
                            setElementName('')
                            setShowElementInputBox(false)
                        }}>
                            <QuestionCrossIcon />
                        </TouchableOpacity>

                    </View>}


                </View>
                {/* Please fill in all the required fields to continue. */}

            </ScrollView>
            <View>
                <TouchableOpacity style={[styles.transparentButton
                    // showData?.formValid && {backgroundColor: '#007BFF' }
                ]}
                    // disabled={!showData?.formValid}
                    // onPress={() => {
                    //     navigation.navigate('CreateElement', { inspectionID, roomID })
                    // }}
                    onPress={() => {
                        checkRoleForTier()

                    }}
                >
                    <Feather name="plus" size={22} color="#007BFF" style={{ paddingRight: '2%', paddingTop: '0.5%' }} />
                    <Text style={[styles.newInspectionButtonText, { color: '#007BFF' }]}>Add new Element</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.newInspectionButton,
                    , { marginBottom: '5%' }
                    // showData?.formValid && { backgroundColor: '#007BFF' }
                ]}
                    // disabled={!showData?.formValid}
                    onPress={handleSave}
                >
                    <Text style={styles.newInspectionButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
            <UpgradeModal
                visible={modalVisibleUpgrade}
                onClose={() => setModalVisibleUpgrade(false)}
                onUpgrade={handleUpgrade}
                alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
            />

        </SafeAreaView >
    )
}

export default CreateRoomInspection


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    subHeaderContainer: {
        paddingTop: '3%',
        paddingHorizontal: '6%'
    },
    roomDetailsText: {
        paddingTop: '3%',
        paddingHorizontal: '6%'
    },
    subHeaderTextRoom: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#000929',
        marginTop: '3%',
        marginBottom: '1.5%',
    },
    roomInspectionText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 17.5,
        color: '#000929',
    },
    roomElementsContainer: {
        flex: 1,
        paddingBottom: 0,
        paddingTop: 10,
    },
    subHeaderWithDropDownStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: "2%"
    },
    subHeaderText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000929',
        marginTop: '1%',
        marginBottom: '1.5%',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingBottom: '4%',
        marginTop: '2%'
    },
    elementTextContainer: {
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
    iconImageContainer: {
        position: 'relative',
        height: 115,
        width: 125,
        marginRight: '2%',
        borderRadius: 10,
        overflow: 'hidden'
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
    countContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 5,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    countTextStyle: {
        fontSize: 17,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#fff',
    },
    crossIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
        zIndex: 1
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '1%',
        backgroundColor: '#daeaff6a',
        height: 150,
        borderRadius: 10,
        paddingHorizontal: '4%'
    },
    imageUploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCFCFC',
        padding: '3%',
        borderWidth: 1.5,
        borderColor: '#DAEAFF',
        borderRadius: 8,
    },
    imageUploadButtonText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13,
        paddingHorizontal: '3%',
        color: '#000929',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        // marginHorizontal: '1%',
        backgroundColor: '#daeaff6a',
        borderColor: '#DAEAFF',
        borderRadius: 10,
        marginTop: '5%'
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
        paddingLeft: '0.5%',
        color: '#000929',
        marginVertical: '3%',
    },
    requiredStar: {
        fontSize: 13.7,
        paddingLeft: '0.5%',
        color: 'red',
        marginVertical: '3%',
    },
    input: {
        flex: 1,
        padding: '2.5%',
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    elementDetailContainer: {
        borderWidth: 2,
        borderColor: '#DAEAFF',
        backgroundColor: '#ffff',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: '1%',
        marginBottom: '3%',
    },
    roomElementParentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomsElementTextContainer: {
        flex: 1,
        paddingVertical: 6,
        padding: 5,
    },
    elementCountText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12.5,
        color: '#8D939F'
    },
    roomsElementText: {
        paddingVertical: 6,
        padding: 5,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    noDataText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 17,
        textAlign: 'center',
        color: '#00000030',
        marginTop: '50%',
        marginBottom: '16%',
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',
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
        paddingTop: '1.5%',
        paddingBottom: '8%',
        width: '40%'
    },
    newInspectionButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
})