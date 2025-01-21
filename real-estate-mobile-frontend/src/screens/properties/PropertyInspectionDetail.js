import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity, TextInput, Alert, ToastAndroid } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import Entypo from '@expo/vector-icons/Entypo';
import { style } from './PropertyStyle'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';

function formatDate(date) {
    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}

const PropertyInspectionDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const inspectionID = route?.params?.inspectionID ? route?.params?.inspectionID : null
    const { setLoading } = useLoader();

    const [inspectionData, setInspectionData] = useState({
        inspectionDetail: {},
        roomsCompleteArr: [],
        roomsInCompleteArr: [],
        signatureData: [],
    });

    useFocusEffect(useCallback(() => {
        gettingInspectionDetail()
    }, []))

    const gettingInspectionDetail = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/api/inspection/getCompleteInspection/${inspectionID}`, { withCredentials: true })
            if (response?.status === 200 || response?.status === 201) {
                // console.log('response?.data', response?.data?.signaturesData)
                setInspectionData(() => ({
                    inspectionDetail: {
                        name: response?.data?.reportName || '',
                        createdDate: formatDate(new Date(response?.data?.creationDate || new Date())),
                        updatedDate: formatDate(new Date(response?.data?.updateDate || new Date())),
                    },
                    roomsCompleteArr: response?.data?.roomsData?.filter((roomData) => roomData?.isCompleted),
                    roomsInCompleteArr: response?.data?.roomsData?.filter((roomData) => !roomData?.isCompleted) || [],
                    signatureData: response?.data?.signaturesData || [],
                }))
                setLoading(false)
            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingPropertyCategories:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching gettingInspectionDetail:', error)
                setLoading(false)
            }
        }
    }

    const renderItem = (item, isComplete) => {
        return (
            <TouchableOpacity style={[styles.searchContainer, isComplete && { backgroundColor: '#E8F3E4' }]} onPress={() => {
                let data = {
                    roomImages: item?.image,
                    roomNote: item?.note,
                    roomElements: item?.elements
                }

                navigation.navigate('PropertyRoomCompletedDetail', { data })
            }}
                disabled={!isComplete}
            >

                <View style={styles.roomNameContainer}>
                    <Text style={styles.showRoomNameInput}>{item?.name}</Text>
                </View>

                <View >
                    <Text style={styles.elementCountText}>{item?.elements?.length} Elements</Text>
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

    const renderSignatureItem = ({ item }) => {
        return (
            < >
                <Text style={styles.signatureTittle}>{item?.signatoryName}</Text>
                <Text style={styles.signatureText}>{item?.signatoryRole}</Text>

                <View style={[styles.signatureImage, { height: item?.signatureURL ? null : 150 }]} >
                    {item?.signatureURL &&
                        <Image
                            style={{ height: 150, width: 300 }}
                            resizeMode='contain'
                            source={{ uri: item?.signatureURL }}
                        />
                    }
                </View>
            </>
        )
    }

    return (
        <SafeAreaView style={[style.mainContainer, { backgroundColor: '#ffff' }]}>
            <CustomHeader title="Inspection Details" goBack={true} />

            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                style={style.scrollViewContainer}
            >
                <Text style={style.heavyBoldText}>{inspectionData?.inspectionDetail?.name}</Text>

                <View style={style.dateContainer}>
                    <Text style={style.dateLabel}>Created on:</Text>
                    <Text style={style.dateLabel}> {inspectionData?.inspectionDetail?.createdDate}</Text>
                </View>

                <View style={style.dateContainer}>
                    <Text style={style.dateLabel}>Update on:</Text>
                    <Text style={style.dateLabel}> {inspectionData?.inspectionDetail?.updatedDate}</Text>
                </View>

                {inspectionData?.roomsCompleteArr?.length > 0 ?
                    <View style={{ marginTop: '7%' }}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Rooms Completed</Text>
                        </View>

                        <FlatList
                            data={inspectionData?.roomsCompleteArr}
                            scrollEnabled={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?._id}
                            // keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {renderItem(item, true)}
                                    </>
                                )
                            }}
                        />
                    </View>
                    :
                    null
                    // <Text style={style.noDataText}>No Rooms to Show</Text> */}
                }

                {inspectionData?.roomsInCompleteArr?.length > 0 &&
                    <View style={{ marginTop: inspectionData?.roomsCompleteArr?.length ? 14 : '7%' }}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Rooms Incomplete</Text>
                        </View>

                        <FlatList
                            data={inspectionData?.roomsInCompleteArr}
                            scrollEnabled={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?._id}
                            // keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {renderItem(item, false)}
                                    </>
                                )
                            }}
                        />
                    </View>
                }

                {inspectionData?.signatureData?.length > 0 && inspectionData?.roomsInCompleteArr?.length === 0 &&
                    <View>

                        <View style={[styles.sectionContainer, { marginTop: '5%', marginBottom: '4%' }]}>
                            <Text style={styles.sectionTitle}>Signatures</Text>
                        </View>

                        <FlatList
                            data={inspectionData?.signatureData?.reverse()}
                            scrollEnabled={false}
                            style={{ marginBottom: '9%' }}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?._id}
                            // keyExtractor={(item, index) => index.toString()}
                            renderItem={renderSignatureItem}
                        />
                    </View>
                }

            </ScrollView >
        </SafeAreaView>
    )
}

export default PropertyInspectionDetail

const { width } = Dimensions.get('window')
const imageWidth = width * 0.5

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: '5%',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000',
    },
    signatureImage: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        backgroundColor: '#F3F8FF',
        borderWidth: 1,
        borderColor: '#B7D5FF',
    },
    signatureTittle: {
        color: '#000929',
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_600SemiBold'
    },
    signatureText: {
        marginBottom: '5%',
        color: '#4D5369',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold'
    },
    // Flatlist Container Styles
    searchContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#DAEAFF',
        marginHorizontal: '1%',
        padding: '3%',
        paddingRight: 0,
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        marginTop: '1%',
        marginBottom: '3%',
    },
    roomNameContainer: {
        flex: 1,
        marginLeft: '1%',
        marginTop: '0.5%'
    },
    showRoomNameInput: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    elementCountText: {
        marginRight: '3%',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12.5,
        color: '#8D939F'
    },
    rightIconStyle: {
        paddingHorizontal: '3%',
        paddingRight: '2%',
        marginTop: '0.3%'
    },
})