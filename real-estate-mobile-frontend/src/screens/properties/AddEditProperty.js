import { Alert, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { style } from './PropertyStyle'
import * as ImagePicker from 'expo-image-picker';
import CustomHeader from '../../components/CustomHeader'
import CrossIcon from '../../../assets/images/icons/CrossIcon.svg'
import ImageIcon from '../../../assets/images/icons/ImageIcon.svg'
import { useLoader } from '../../lib/loaderContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import SelectedDropDownComp from '../../components/SelectedDropDownComp';
import { countriesData } from '../../constants/countriesData';
import RNElementSingleSelectDropDownComp from '../../components/RNElementSingleSelectDropDownComp';
import axios from 'axios';
import AddCategoryIcon from "../../../assets/images/propertyModuleIcons/addCategory-Plus-Icon.svg";
import CategoryIcon from '../../../assets/images/questionIcons/SelectIcon1.svg';
import { apiUrl } from '../../constants/api_Url';
import { IconsArr } from '../../constants/questionIcons';
import { userContext } from '../../lib/userContext';

let sameReferenceID = "";

const AddNewModalComp = lazy(() => import("../../components/AddNewModalComp"))
const UpgradeModal = lazy(() => import('../inspections/InspectionComponents/UpgradeModal'));

const AddEditProperty = () => {
    const { setLoading } = useLoader();
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = userContext();

    const [propertyData, setPropertyData] = useState({
        id: route?.params?.id ? route?.params?.id : null,
        propertyImage: "",
        propertyName: "",
        st_address: "",
        unitNumber: "",
        city: "",
        country: "",
        city: "",
        state_province: "",
        zip_Postal_code: "",
        category: {},
        referenceID: "",
        statusDetails: [],
        backendIDGenerated: '',
        isIDGenerated: false,
    });
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [existingImage, setExistingImage] = useState(null);
    const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

    useFocusEffect(useCallback(() => {
        gettingPropertyCategories()
    }, [propertyData?.category, isModalVisible]))

    useFocusEffect(useCallback(() => {
        if (propertyData?.id) {
            getExistingPropertyData()
        }
    }, [propertyData?.id]))

    const getExistingPropertyData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/api/property/getPropertyById/${propertyData?.id}`, { withCredentials: true })

            if (response?.status === 200 || response?.status === 201) {

                let updateCategories = response?.data?.property?.category
                let SelectedMatchedIcon = IconsArr?.find(item => item?.iconId === updateCategories?.iconId)?.icon || staticCategoriesArr?.find(item => item?.iconId === updateCategories?.iconId)?.icon

                setPropertyData((prev) => ({
                    ...prev,
                    id: response?.data?.property?._id,
                    propertyImage: response?.data?.property?.image?.url,
                    propertyName: response?.data?.property?.name,
                    st_address: response?.data?.property?.address?.street,
                    unitNumber: response?.data?.property?.address?.unit,
                    city: response?.data?.property?.address?.city,
                    country: response?.data?.property?.address?.country,
                    state_province: response?.data?.property?.address?.state,
                    zip_Postal_code: response?.data?.property?.address?.zip,
                    category: { iconId: response?.data?.property?.category?.iconId?.toString(), value: response?.data?.property?.category?.value, icon: <SelectedMatchedIcon height={18} width={18} /> },
                    referenceID: !response?.data?.property?.isIDGenerated ? response?.data?.property?.referenceId : null,
                    backendIDGenerated: response?.data?.property?.isIDGenerated ? response?.data?.property?.referenceId : null,
                    isIDGenerated: response?.data?.property?.isIDGenerated,
                }))

                // sameReferenceID = response?.data?.property?.referenceId
                sameReferenceID = !response?.data?.property?.isIDGenerated ? response?.data?.property?.referenceId : null

                setExistingImage(response?.data?.property?.image?.url)
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in getProperties:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
                // ToastAndroid.show(errorMessage?.message, ToastAndroid.SHORT);
            } else {
                console.log('error in fetching getExistingPropertyData:', error)
            }
        } finally {
            setLoading(false)
        }
    }

    const gettingPropertyCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/property/getUserPropertyCategories`)
            if (response?.status === 200 || response?.status === 201) {

                let updatedCategories = response?.data?.categories?.map((category) => {
                    let { _id, iconId, ...remainingCategory } = category
                    let selectedMatchedItem = IconsArr?.find(item => item?.iconId === iconId)
                    let SelectedIcon = selectedMatchedItem?.icon
                    return { iconId, value: remainingCategory?.value, icon: <SelectedIcon height={18} width={18} /> }
                })

                let defaultPropertyCategory = [{ iconId: "23", value: 'Category', icon: <CategoryIcon height={18} width={18} /> }]

                let defaultAddCategory = [{ iconId: "24", value: 'Add a Category', icon: <AddCategoryIcon height={18} width={18} /> }]

                let finalPropertyCategories = userData?.role !== 'SUBUSER' ? [...defaultPropertyCategory, ...updatedCategories, ...defaultAddCategory] : [...defaultPropertyCategory, ...updatedCategories]

                setPropertyData((prev) => ({
                    ...prev,
                    statusDetails: finalPropertyCategories || [],
                }));

            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingPropertyCategories:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching gettingPropertyCategories:', error)
            }
        }
    }

    const validation = () => {
        let { id, propertyImage, backendIDGenerated, category, country, statusDetails, referenceID, st_address, unitNumber, isIDGenerated, ...updatedPropertyData } = propertyData

        let checkingPropertyData = Object.values(updatedPropertyData)?.every(item => item?.length >= 3)

        if (!checkingPropertyData) {
            Alert.alert('Warning', 'Please fill in all required fields with values of at least 3 to proceed.');
            return false
        }

        if (!st_address || !unitNumber) {
            Alert.alert('Warning', 'Please enter street and unit number to continue',)
            return false
        }

        if (!propertyImage) {
            Alert.alert('Warning', 'Please select a property image to continue',)
            return false
        }

        if (/^[0-9]{5}(-[0-9]{4})?$/.test(propertyData?.zip_Postal_code) === false) {
            Alert.alert('Warning', 'Please enter a valid zip code')
            return false
        }

        if (!country) {
            Alert.alert('Warning', 'Please select a country to continue',)
            return false
        }

        if (!category?.value || category?.value === 'Category' || category?.value === 'Add a Category') {
            Alert.alert('Warning', 'Please select a category to continue',)
            return false
        }

        if (propertyData?.id && sameReferenceID && referenceID?.trim() === '') {
            Alert.alert('Warning', 'Please enter a reference ID to continue',)
            return false
        }

        return true
    }

    {/* <================== Add & Edit Api Calls =============> */ }
    const handleAddUpdateProperty = async (counter) => {
        if (!validation()) return

        setLoading(true);

        let data = new FormData();

        data.append('name', propertyData?.propertyName?.trim() || '');

        data.append('address', JSON.stringify({ unit: propertyData?.unitNumber?.trim() || '', street: propertyData?.st_address?.trim() || '', city: propertyData?.city?.trim() || '', zip: propertyData?.zip_Postal_code?.trim() || '', state: propertyData?.state_province?.trim() || '', country: propertyData?.country?.trim() || '' }));

        data.append('category', JSON.stringify({ value: propertyData?.category?.value?.trim() || '', iconId: propertyData?.category?.iconId || '' }));

        data.append(propertyData?.id ? 'referenceId' : 'referenceID', propertyData?.referenceID ? sameReferenceID === propertyData?.referenceID ? '' : propertyData?.referenceID?.trim() : propertyData?.isIDGenerated ? '' : '');

        if (propertyData?.id) {
            try {

                data.append('id', propertyData?.id);

                if (propertyData?.propertyImage !== existingImage) {
                    let imageType = `image/${propertyData?.propertyImage?.split('.').pop()}`
                    let imageName = propertyData?.propertyImage?.split('/').pop()
                    // console.log('imageType in if', imageType)
                    data.append('image', {
                        uri: propertyData?.propertyImage,
                        type: imageType,
                        name: imageName
                    });
                }

                // for (let [key, value] of data.entries()) {
                //     console.log(`${key}: ${value}`);
                // }

                const response = await axios.put(`${apiUrl}/api/property/editExistingProperty`, data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                });

                if (response?.status === 200 || response?.status === 201) {
                    // console.log('response?.data in updating', response?.data?.message)
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                    navigation.goBack()
                }

            } catch (error) {
                if (error?.response) {
                    const errorMessage = error?.response.data
                    console.log("Backend Error Message in editExistingProperty:", errorMessage)
                    setLoading(false)
                    Alert.alert('Error', errorMessage?.message);
                } else {
                    console.log("Error in handleAddUpdateProperty:", error);
                    if (!error?.response && counter > 0) {
                        return handleAddUpdateProperty(counter - 1)
                    }
                }
            }
            return;
        } else {
            let imageType = `image/${propertyData?.propertyImage?.split('.').pop()}`
            let imageName = propertyData?.propertyImage?.split('/').pop()

            data.append('image', {
                uri: propertyData?.propertyImage,
                type: imageType,
                name: imageName
            });

            // for (let [key, value] of data.entries()) {
            //     console.log(` while adding ${key}: ${value}`);
            // }


            try {
                const response = await axios.post(`${apiUrl}/api/property/createProperty`, data,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json',
                        }

                    });
                if (response?.status === 200 || response?.status === 201) {
                    // console.log('response?.data in adding', response?.data?.message)
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                    navigation.goBack()
                }

            } catch (error) {
                if (error?.response) {
                    const errorMessage = error?.response.data
                    console.log("Backend Error Message in createProperty:", errorMessage)
                    setLoading(false)
                    Alert.alert('Error', errorMessage?.message);
                } else {
                    console.log("Error in handleAddUpdateProperty:", error);
                    if (!error?.response && counter > 0) {
                        return handleAddUpdateProperty(counter - 1)
                    }
                }
            }
            return
        }
    }

    const handleAddNewModalVisibility = useCallback(() => {
        setIsModalVisible(false)
    }, [isModalVisible]);

    const handleAddNewModalConfirm = useCallback(async (data) => {
        try {
            setLoading(true);

            const response = await axios.post(`${apiUrl}/api/property/addPropertyCategory`, { value: data?.category?.trim(), iconId: data?.iconId }, { withCredentials: true });
            if (response?.status === 200 || response?.status === 201) {
                setLoading(false);
                setIsModalVisible(false)
            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in addPropertyCategory:", errorMessage);
                setLoading(false);
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching handleAddNewModalConfirm:', error)
            }
        } finally {
            setLoading(false);
        }
    }, [isModalVisible])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false,
        });

        try {
            if (!result.canceled) {
                setPropertyData((prev) => ({
                    ...prev,
                    propertyImage: result?.assets[0]?.uri
                }))
                // await uploadingImages(result?.assets[0])
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
            aspect: [1, 1],
            quality: 1,
        });

        try {
            if (!result.canceled) {
                setPropertyData((prev) => ({
                    ...prev,
                    propertyImage: result?.assets[0]?.uri
                }))
                // await uploadingImages(result?.assets[0])
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

    const deleteImage = () => {
        setPropertyData((prev) => ({
            ...prev,
            propertyImage: ""
        }))
    }

    const onChangeText = (field, text) => {
        setPropertyData((prev) => ({
            ...prev,
            [field]: text
        }));
    };

    const handleDropDownButton = useCallback((field, selectedItem) => {
        if (selectedItem?.label !== null && selectedItem?.label !== undefined) {
            setPropertyData((prev) => ({
                ...prev,
                [field]: selectedItem?.label
            }));
        } else if (selectedItem?.value !== null && selectedItem?.value !== undefined) {
            setPropertyData((prev) => ({
                ...prev,
                category: selectedItem?.value === "Add a Category" || selectedItem?.value === "Category" ? "" : selectedItem
            }));

            if (selectedItem?.value === "Add a Category") {
                if (userData?.role === "TOPTIER") {
                    setIsModalVisible(true);
                } else {
                    setUpgradeModalVisible(true);
                    return
                }
            }
        }
    }, [propertyData?.country, propertyData?.category]);

    const handleUpgrade = () => {
        setLoading(true);
        setUpgradeModalVisible(false);
        setTimeout(() => {
            navigation.navigate('PaymentPlanScreen', { goBack: true });
            setLoading(false);
        }, 1000);
        // Add your upgrade logic here
    };

    return (
        <SafeAreaView style={[style.mainContainer, { backgroundColor: '#ffff' }]}>
            <CustomHeader title="New Property" goBack={true} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.innerContainer}>
                    <Text style={style.lightBoldText}>Property Image</Text>

                    {propertyData?.propertyImage?.length > 0 ?
                        <>
                            <View style={[style.iconImageContainer, { marginVertical: '3.5%' }]}>

                                <TouchableOpacity style={styles.crossIcon} onPress={() => deleteImage()}>
                                    <CrossIcon />
                                </TouchableOpacity>

                                <Image
                                    source={{ uri: propertyData?.propertyImage }}
                                    resizeMethod='resize'
                                    resizeMode='cover'
                                    style={{ width: '100%', height: '100%' }}
                                />

                            </View>
                        </>
                        :
                        <TouchableOpacity style={styles.imageUploadButton} onPress={showImagePickerOptions}>
                            <ImageIcon />
                            <Text style={styles.imageUploadButtonText}>Upload or capture an image</Text>
                        </TouchableOpacity>
                    }

                    {/* <================== Property name =============> */}

                    <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '2%' }]}>Name</Text>
                    <View style={[style.inputContainer, { flexDirection: 'column', marginBottom: '3%' }]}>
                        <TextInput
                            value={propertyData?.propertyName}
                            onChangeText={(text) => onChangeText('propertyName', text)}
                            style={[style.textInput, { fontSize: 14, paddingLeft: '3.5%' }]}
                            placeholder="Property Name"
                            placeholderTextColor="gray"
                        />
                    </View>

                    {/* <================== Address and Unit Number =============> */}
                    <View style={{ flexDirection: 'row', gap: '4%', marginBottom: '2%', alignItems: 'center' }}>

                        <View style={{ flex: 1.5 }}>
                            <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '3.5%' }]}>Street No</Text>
                            <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                                <TextInput
                                    value={propertyData?.st_address}
                                    onChangeText={(text) => onChangeText('st_address', text)}
                                    style={[style.textInput, { fontSize: 14, paddingLeft: '5.5%' }]}
                                    placeholder="Street No"
                                    placeholderTextColor="gray"
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '6%' }]}>Unit Number</Text>
                            <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                                <TextInput
                                    value={propertyData?.unitNumber}
                                    onChangeText={(text) => onChangeText('unitNumber', text)}
                                    style={[style.textInput, { fontSize: 14, paddingLeft: '8%' }]}
                                    placeholder="Unit Number"
                                    placeholderTextColor="gray"
                                />
                            </View>
                        </View>

                    </View>

                    {/* <================== Country =============> */}
                    <View style={{ flex: 1 }}>
                        <Text style={[style.lightBoldText, { fontSize: 13.5, }]}>Country</Text>
                        <RNElementSingleSelectDropDownComp
                            dropDownArray={countriesData}
                            selectedItemArr={propertyData?.country}
                            handleDropDown={handleDropDownButton}
                            placeholderText={'Select a Country'}
                        />
                    </View>


                    {/* <================== City and Province / State =============> */}
                    <View style={{ flexDirection: 'row', gap: '4%', marginBottom: '2%', alignItems: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '6%' }]}>City</Text>
                            <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                                <TextInput
                                    value={propertyData?.city}
                                    onChangeText={(text) => onChangeText('city', text)}
                                    style={[style.textInput, { fontSize: 14, paddingLeft: '8%' }]}
                                    placeholder="City"
                                    placeholderTextColor="gray"
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '3.5%' }]}>State / Province</Text>
                            <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                                <TextInput
                                    value={propertyData?.state_province}
                                    onChangeText={(text) => onChangeText('state_province', text)}
                                    style={[style.textInput, { fontSize: 13, paddingLeft: '5%' }]}
                                    placeholder="State / Province"
                                    placeholderTextColor="gray"
                                />
                            </View>
                        </View>

                    </View>

                    {/* <================== ZIP / Postal Code =============> */}

                    <Text style={[style.lightBoldText, { fontSize: 13.5, marginBottom: '3.5%', marginVertical: '2%' }]}>ZIP / Postal Code</Text>
                    <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                        <TextInput
                            value={propertyData?.zip_Postal_code}
                            onChangeText={(text) => onChangeText('zip_Postal_code', text)}
                            style={[style.textInput, { fontSize: 14, paddingLeft: '5%' }]}
                            placeholder="ZIP / Postal Code"
                            placeholderTextColor="gray"
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={[style.lightBoldText, { fontSize: 13.5, marginVertical: '2%' }]}>Category</Text>
                        <SelectedDropDownComp
                            selectedDropDownItem={propertyData?.category || null}
                            handleDropDownButton={handleDropDownButton}
                            screenType={"newPropertyDropDown"}
                            dropDownArray={propertyData?.statusDetails || []}
                        />
                    </View>

                    {/* <================== Reference ID =============> */}

                    <Text style={[style.lightBoldText, { fontSize: 13.5, marginVertical: '3.5%' }]}>Reference ID</Text>
                    <View style={[style.inputContainer, { flexDirection: 'column', }]}>
                        <TextInput
                            value={propertyData?.referenceID ? propertyData?.referenceID : propertyData?.backendIDGenerated && ''}
                            onChangeText={(text) => onChangeText('referenceID', text)}
                            style={[style.textInput, { fontSize: 14, paddingLeft: '5%' }]}
                            placeholder="Reference ID (Optional)"
                            placeholderTextColor="gray"
                        />
                    </View>

                    {/* <================== Category add Model =============> */}

                    <Suspense>
                        {isModalVisible && <AddNewModalComp visible={isModalVisible} onClose={handleAddNewModalVisibility} onConfirm={handleAddNewModalConfirm} title={'Add New Category'} />}
                    </Suspense>

                    {/* <================== Button Container Save =============> */}

                    <TouchableOpacity
                        style={[style.buttonContainer, { paddingVertical: '4%', marginVertical: '6%' }]}
                        onPress={() => {
                            navigation.navigate("AddEditProperty");
                        }}
                        onPressIn={() => handleAddUpdateProperty(3)}
                    // disabled={loading}
                    >
                        <Text style={style.buttonText}>Save Changes</Text>
                    </TouchableOpacity>

                </View>

                {/* <================== Upgrade Model =============> */}
                <Suspense>

                    <UpgradeModal
                        visible={upgradeModalVisible}
                        onClose={() => setUpgradeModalVisible(false)}
                        onUpgrade={handleUpgrade}
                        alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
                    />

                </Suspense>



            </ScrollView>

        </SafeAreaView >
    )
}

export default AddEditProperty

const styles = StyleSheet.create({
    innerContainer: {
        marginVertical: '2%',
        marginHorizontal: '5%',
    },
    crossIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
        zIndex: 1
    },
    imageUploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCFCFC',
        padding: '3%',
        marginVertical: '4%',
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
})