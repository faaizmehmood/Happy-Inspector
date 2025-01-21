import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { lazy, Suspense, useCallback, useState } from 'react'
import { style } from './PropertyStyle'
import CustomHeader from '../../components/CustomHeader'
import EditIcon from "../../../assets/images/propertyModuleIcons/editIcon.svg";
import DeleteIcon from "../../../assets/images/propertyModuleIcons/deleteIcon.svg";
import InspectionCardComp from "../inspections/InspectionComponents/InspectionCard";
import axios from 'axios'
import { apiUrl } from '../../constants/api_Url'
import { useFocusEffect } from '@react-navigation/native'
import { useLoader } from '../../lib/loaderContext'
import { userContext } from '../../lib/userContext'

const { height } = Dimensions.get('window')
let formattedDate = null
let memberDetail = {
    _id: null,
    name: 'property',
    lastName: 'inspections',
}

function formatDate(date) {
    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}

const DeleteModalComp = lazy(() => import("../../components/DeleteModalComp"))

const ShowPropertyDetail = ({ navigation, route }) => {
    const { setLoading } = useLoader();
    const { userData } = userContext();

    const [propertyDetail, setPropertyDetail] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [propertyInspectionDetail, setPropertyInspectionDetail] = useState([]);
    const [pages, setPages] = useState({
        currentPage: '',
        totalPage: '',
    });

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
    }, [isModalVisible])

    const handleModalConfirm = useCallback(async (modelData) => {
        try {
            handleModalClose()
            setLoading(true);
            const response = await axios.delete(`${apiUrl}/api/property/deleteProperty/${modelData}`, { withCredentials: true });

            if (response?.status === 200 || response?.status === 201) {
                // console.log('response?.data', response?.data)
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                navigation.goBack()
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in deleteProperty:", errorMessage)
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log("Error in handleModalConfirm:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [isModalVisible])

    useFocusEffect(useCallback(() => {
        if (route?.params?.id) {
            memberDetail._id = route?.params?.id
            getExistingPropertyData()
            getExistingPropertyInspectionData(1, setLoading);
        }
    }, [route?.params?.id]))

    const getExistingPropertyData = async () => {
        try {
            setLoading(true)

            const response = await axios.get(`${apiUrl}/api/property/getPropertyById/${route?.params?.id}`, { withCredentials: true })

            if (response?.status === 200 || response?.status === 201) {

                let updatedFormatedDate = new Date(response?.data?.property?.createdAt);
                formattedDate = formatDate(updatedFormatedDate)

                setPropertyDetail(response?.data)
                // console.log('response?.data', response?.data)
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in getProperties:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);

            } else {
                console.log('error in fetching gettingPropertyCategories:', error)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLoadMore = async () => {
        if (pages?.currentPage < pages?.totalPage) {
            await getExistingPropertyInspectionData(pages?.currentPage + 1, setPageLoading);
        }
    }

    const getExistingPropertyInspectionData = async (p, set) => {
        try {
            set(true)
            const response = await axios.get(`${apiUrl}/api/inspection/getInspectionsByPropertyId?propertyId=${route?.params?.id}&page=${p}`, { withCredentials: true })

            if (response?.status === 200 || response?.status === 201) {
                // console.log('response?.data', response?.data?.inspections?.length)
                setPages(() => ({
                    currentPage: response?.data?.currentPage,
                    totalPage: response?.data?.totalPages
                }))
                if (response?.data?.inspections) {
                    setPropertyInspectionDetail(response?.data?.currentPage === 1 ? response?.data?.inspections || [] : [...propertyInspectionDetail, ...response?.data?.inspections] || [])

                } else if (response?.data?.inspections?.length === 0) {
                    setPropertyInspectionDetail([])
                }
            }

        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in getProperties:", errorMessage);
                set(false)
                Alert.alert('Error', errorMessage?.message);

            } else {
                console.log('error in fetching getExistingPropertyInspectionData:', error)
            }
        } finally {
            set(false)
        }
    }

    return (
        <SafeAreaView style={[style.mainContainer, { backgroundColor: '#ffff' }]}>

            <CustomHeader title="Property Details" goBack={true} />

            <FlatList
                contentContainerStyle={{ flexGrow: 1, paddingBottom: propertyInspectionDetail?.length ? '5%' : 0, backgroundColor: '#ffff' }}
                data={[1]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={() => {
                    return (
                        <>

                            {/* Property Image */}
                            <View style={[style.iconImageContainer, { marginVertical: '3%', marginHorizontal: '4%', height: height * 0.25 }]}>

                                <Image
                                    source={{ uri: propertyDetail?.property?.image?.url }}
                                    resizeMethod='resize'
                                    resizeMode='cover'
                                    height={'100%'}
                                    width={'100%'}
                                />

                            </View>

                            {/* Property Title */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.propertyTitle}>{propertyDetail?.property?.name}</Text>
                                <Text style={styles.propertyLocation}>{propertyDetail?.property?.address?.city}, {propertyDetail?.property?.address?.state}</Text>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtons}>

                                <TouchableOpacity
                                    style={[style.borderButtonContainer, styles.iconButtonContainer]}
                                    onPress={() => { navigation.navigate('AddEditProperty', { id: route?.params?.id }) }}
                                >
                                    <EditIcon height={20} width={20} />
                                    <Text style={[style.borderButtonText, { color: '#000', fontFamily: 'PlusJakartaSans_600SemiBold' }]}>Edit Details</Text>
                                </TouchableOpacity>

                                {userData?.role !== 'SUBUSER' && <TouchableOpacity
                                    style={[style.borderButtonContainer, styles.iconButtonContainer, { borderColor: "#FF613E" }]}
                                    onPress={() => setIsModalVisible(true)}
                                >
                                    <DeleteIcon height={20} width={20} />
                                    <Text style={[style.borderButtonText, { color: '#000', fontFamily: 'PlusJakartaSans_600SemiBold', }]}>Delete Property</Text>
                                </TouchableOpacity>}

                            </View>

                            {/* Property Details Card */}
                            <View style={styles.detailsCard}>
                                <View style={styles.detailRow}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Category</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.category?.value}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Country</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.address?.country}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>State/Province</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.address?.state}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>City/Town</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.address?.city}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Added on</Text>
                                        <Text style={styles.detailValue}>{formattedDate}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Zip / Postal Code</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.address?.zip}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Reference ID</Text>
                                        <Text style={styles.detailValue}>{propertyDetail?.property?.isIDGenerated ? 'No Reference ID' : propertyDetail?.property?.referenceId}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Border Line */}
                            <View style={style.borderLine} />

                            {/* Inspection Stats */}
                            <View style={styles.statsSection}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Total Inspections</Text>
                                    <Text style={styles.statValue}>{propertyDetail?.totalInspections}</Text>
                                </View>
                                <View style={[styles.statItem, { flex: 1.2 }]}>
                                    <Text style={styles.statLabel}>Days Since Last Inspection</Text>

                                    <Text style={[styles.statValue, { fontSize: propertyDetail?.daysSinceLastInspection === "No Inspections Yet" ? 17 : 24 }]}>{propertyDetail?.daysSinceLastInspection === "No Inspections Yet" ? propertyDetail?.daysSinceLastInspection : `${propertyDetail?.daysSinceLastInspection} Days`}</Text>

                                </View>
                            </View>

                            <View style={styles.completedSection}>
                                <Text style={styles.statLabel}>Days Since Last Completed Inspection</Text>

                                <Text style={[styles.statValue, { fontSize: propertyDetail?.daysSinceLastCompletedInspection === "No Completed Inspections Yet" ? 17 : 24 }]}>{propertyDetail?.daysSinceLastCompletedInspection === "No Completed Inspections Yet" ? propertyDetail?.daysSinceLastCompletedInspection : `${propertyDetail?.daysSinceLastCompletedInspection} Days`}</Text>

                            </View>

                            {/* Border Line */}
                            <View style={[style.borderLine, { marginVertical: '5%' }]} />

                            {/* Inspections List */}
                            {propertyInspectionDetail?.length > 0 && propertyInspectionDetail !== null &&
                                <>
                                    <View style={styles.inspectionsSection}>
                                        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Inspections</Text>
                                    </View>

                                    <FlatList
                                        // scrollEnabled={false}
                                        // nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ flexGrow: 1, paddingBottom: "5%" }}
                                        data={propertyInspectionDetail}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => (
                                            <InspectionCardComp data={item} index={index} screenType={'propertyDetail'} cardStyle={styles.inspectionItem} />
                                        )}
                                        onEndReached={handleLoadMore}
                                        ListFooterComponent={pageLoading ? (
                                            <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
                                        ) : null}
                                    />
                                </>
                            }

                            {/* <================== Delete Modal Comp =============> */}
                            <Suspense>
                                {isModalVisible && <DeleteModalComp screenType={'propertyDetail'} visible={isModalVisible} onClose={handleModalClose} onConfirm={handleModalConfirm} memberDetail={memberDetail} title={'Confirmation'} />}
                            </Suspense>

                        </>

                    )
                }}
            />

        </SafeAreaView>
    )
}

export default ShowPropertyDetail

const styles = StyleSheet.create({
    iconButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '3%',
        borderColor: '#CCE2FF',
        justifyContent: 'center',
        gap: '5%'
    },
    titleContainer: {
        paddingTop: 3,
        padding: 16,
    },
    propertyTitle: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: 4,
    },
    propertyLocation: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        paddingVertical: 0,
        gap: 12,
    },
    detailsCard: {
        margin: 16,
        marginBottom: 0,
        marginTop: 18,
        padding: 12,
        paddingBottom: 0,
        borderWidth: 2,
        borderColor: '#CCE2FF',
        borderRadius: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    detailColumn: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 15,
        color: '#666',
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16.5,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 0,
        gap: 15,
    },
    statItem: {
        flex: 1,
        borderRadius: 12,
    },
    completedSection: {
        margin: 16,
        marginBottom: 0,
        marginTop: '3.5%',
        borderRadius: 12,
    },
    statLabel: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#333333',
    },
    statValue: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    inspectionsSection: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 16,
    },
    inspectionItem: {
        paddingTop: "1%",
        paddingBottom: "2.5%"
    },
})