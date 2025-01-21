import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchIcon from '../../../assets/images/icons/searchBlueIcon.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectTemplateIcon from '../../../assets/images/icons/SelectTemplateIcon.svg';
import StartFromScratchIcon from '../../../assets/images/icons/StartfromScratchIcon.svg';
import CheckBlueTickIcon from '../../../assets/images/icons/CheckBlueTickIcon.svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import { apiUrl } from '../../constants/api_Url';
import ShowReportInspectionComp from '../../components/ShowReportInspectionComp';
import { useLoader } from '../../lib/loaderContext';
import SelectDropdown from 'react-native-select-dropdown';
import { CustomCalenderIcon } from '../../svg/InspectionIconSvg';

const now = new Date();
let currentDate = new Date().getDate();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const formatDate = (date, short = false) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: short ? 'short' : 'long' });
    return short ? `${day} ${month}` : `${day} ${month}, ${date.getFullYear()}`;
};

const firstDateFormatted = formatDate(new Date(currentYear, currentMonth, 1), true);
// You can used if you want to show current month last Date
// const lastDateFormatted = formatDate(new Date(currentYear, currentMonth + 1, 0), true);

// You can used if you want to show current month current Date
const lastDateFormatted = formatDate(new Date(currentYear, currentMonth, currentDate), true);
const defaultDateShow = `${firstDateFormatted} - ${lastDateFormatted}`;

const statusDetails = [
    { key: "all", value: "All Inspections" },
    { key: "completed", value: "Completed" },
    { key: "notcompleted", value: "In Progress" },
    { key: "draft", value: "Drafted" },
];

const buttonStatusDetails = [
    { name: 'Select a Template', icon: <SelectTemplateIcon /> },
    { name: 'Start From Scratch', icon: <StartFromScratchIcon /> },
];

const PrevInspectionCode = () => {
    const navigation = useNavigation();

    const { setLoading } = useLoader()

    const [isModalVisible, setIsModalVisible] = useState(false)

    const [showDateTime, setShowDateTime] = useState(false);
    const [startReportDate, setStartReportDate] = useState(null);

    const [selectDate, setSelectDate] = useState([]);

    const [showEndDateTime, setShowEndDateTime] = useState(false);
    const [endReportDate, setEndReportDate] = useState(null);

    const [openDropDown, setOpenDropDown] = useState(false)
    const [inspectionStatus, setInspectionStatus] = useState({ key: null, value: null });

    const [openButtonDropDown, setOpenButtonDropDown] = useState(false)
    const [buttonInspectionStatus, setButtonInspectionStatus] = useState(null);

    const [searchInspection, setSearchInspection] = useState('')

    const [inspectionDetails, setInspectionDetails] = useState({});
    const [pickModalDates, setPickModalDates] = useState({ StartDate: null, EndDate: null });


    useFocusEffect(useCallback(() => {
        setPickModalDates({})
        setSearchInspection('')
        setOpenDropDown(false)
        setSelectDate([])
        setInspectionStatus({})
        setIsModalVisible(false)
        setStartReportDate(null)
        setEndReportDate(null)
        setShowDateTime(false)
        setShowEndDateTime(false)
    }, []))

    // useFocusEffect(useCallback(() => {
    //     gettingInspectionDetails()
    // }, []))

    // const gettingInspectionDetails = async () => {
    //     try {
    //         setLoading(true)

    //         let startDate = new Date()?.toISOString()
    //         let date = startDate?.split('T')
    //         let updatedStartDate = `${date[0]}T23:59:59Z`

    //         let endDate = new Date(currentYear, currentMonth, 1)?.toISOString()
    //         let date1 = endDate?.split('T')
    //         let updatedEndDate = `${date1[0]}T00:00:00Z`

    //         console.log('firstDateFormatted', updatedStartDate, updatedEndDate)
    //         const response = await axios.post(`${apiUrl}/api/inspection/getInspections`,
    //             {
    //                 status: "all",
    //                 page: 1,
    //                 search: "",
    //                 startdate: updatedEndDate,
    //                 enddate: updatedStartDate
    //             },
    //             {
    //                 withCredentials: true,
    //             }
    //         );
    //         if (response?.status === 200 || response?.status === 201) {
    //             console.log('response?.data?.length', response?.data);
    //             setInspectionDetails(response?.data)
    //         }
    //     } catch (error) {
    //         console.log('error in gettingInspectionDetails', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }


    const onChangeSearchText = (text) => {
        setSearchInspection(text)
    }

    const onDobChange = (event, selectedDate) => {

        if (event.type === 'dismissed') {
            setShowDateTime(false);
            setStartReportDate(null);
            return;
        }

        if (selectedDate !== undefined) {
            const currentDate = selectedDate || startReportDate || new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' }

            let formatedDate = currentDate.toLocaleDateString('eng-US', options)
            let changeFormate = formatedDate.split(',')
            let changeSequence = changeFormate[0]
            let selectedYear = changeFormate[1]
            const [month, day] = changeSequence.split(' ')

            let selectDate = `${day} ${month},${selectedYear}`

            setShowDateTime(false);
            if (Platform.OS === 'android') {
                setStartReportDate(selectDate);

                setPickModalDates((prev) => ({
                    ...prev,
                    StartDate: currentDate,
                }));

            } else {
                let changeFormate = formatedDate.split(' ')
                const [day, month, year] = changeFormate;
                let finalDate = `${day} ${month}, ${year}`

                setStartReportDate(finalDate);

                setPickModalDates((prev) => ({
                    ...prev,
                    StartDate: currentDate,
                }));
            }
        } else {
            setShowDateTime(false);
        }
    };

    const onSelectEndDobChange = (event, selectedDate) => {

        if (event.type === 'dismissed') {
            setShowEndDateTime(false)
            setEndReportDate(null);
            return;
        }

        if (selectedDate !== undefined) {
            const currentDate = selectedDate || endReportDate || new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' }

            let formatedDate = currentDate.toLocaleDateString('eng-US', options)
            let changeFormate = formatedDate.split(',')
            let changeSequence = changeFormate[0]
            let selectedYear = changeFormate[1]
            const [month, day] = changeSequence.split(' ')

            let selectDate = `${day} ${month}, ${selectedYear}`

            setShowEndDateTime(false);
            if (Platform.OS === 'android') {
                setEndReportDate(selectDate);

                setPickModalDates((prev) => ({
                    ...prev,
                    EndDate: currentDate,
                }));

            } else {
                let changeFormate = formatedDate.split(' ')
                const [day, month, year] = changeFormate;
                let finalDate = `${day} ${month}, ${year}`
                setEndReportDate(finalDate);

                setPickModalDates((prev) => ({
                    ...prev,
                    EndDate: currentDate,
                }));
            }
        } else {
            setShowEndDateTime(false);
        }
    };

    useEffect(() => {
        handleFilter();
    }, [inspectionStatus])

    const handleFilter = async () => {
        try {
            setLoading(true)
            let startDate = new Date()?.toISOString()
            let date = startDate?.split('T')
            let updatedStartDate = `${date[0]}T23:59:59Z`

            let endDate = new Date(currentYear, currentMonth, 1)?.toISOString()
            let date1 = endDate?.split('T')
            let updatedEndDate = `${date1[0]}T00:00:00Z`

            const response = await axios.post(`${apiUrl}/api/inspection/getInspections`,
                {
                    status: inspectionStatus?.key ? inspectionStatus?.key : null,
                    page: 1,
                    search: searchInspection ? searchInspection : '',
                    startdate: updatedEndDate,
                    enddate: updatedStartDate
                },
                {
                    withCredentials: true,
                }
            );

            if (response?.data?.inspections?.length === 0) {
                setSearchInspection('')
                gettingInspectionDetails();
            }
            setInspectionDetails(response?.data)
        } catch (error) {
            console.log('Error in handleFilterApiCalling', error);

        } finally {
            setLoading(false)
        }
    }

    const handleSaveInspection = async () => {
        try {
            // Start Date
            setSelectDate([]);
            if (!pickModalDates?.StartDate || !pickModalDates?.EndDate) {
                alert('Please select a date before saving.');
                return;
            }
            // Start Date
            const formatedStartDate = new Date(pickModalDates?.StartDate);
            const startOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const localStartDateString = formatedStartDate.toLocaleString('en-US', startOptions);
            const [startPart] = localStartDateString.split(', ');
            const [startMonth, startDay, startYear] = startPart.split('/');
            const changedStartFormate = `${startYear}-${startMonth}-${startDay}T00:00:00Z`;

            // End Date
            const formatedEndDate = new Date(pickModalDates?.EndDate);
            const endOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const localEndDateString = formatedEndDate.toLocaleString('en-US', endOptions);
            const [endPart] = localEndDateString.split(', ');
            const [endOfMonth, endOFday, endOfYear] = endPart.split('/');
            const changedEndFormate = `${endOfYear}-${endOfMonth}-${endOFday}T23:59:59Z`;

            // console.log(changedStartFormate, changedEndFormate);

            if (formatedEndDate < formatedStartDate) {
                alert("End Date should be after Start Date");
                return;
            } else {
                const endOptions = { day: 'numeric', month: 'short' };
                const localStartDate = formatedStartDate.toLocaleString('en-US', endOptions);
                const [startMonth, startDay] = localStartDate.split(' ');

                const localEndDate = formatedEndDate.toLocaleString('en-US', endOptions);
                const [endMonth, endDay] = localEndDate.split(' ');

                let dateRange = `${startDay} ${endMonth} - ${endDay} ${startMonth}`

                setSelectDate(dateRange);

                setLoading(true)

                const response = await axios.post(`${apiUrl}/api/inspection/getInspections`,
                    {
                        status: "all",
                        page: 1,
                        search: searchInspection ? searchInspection : '',
                        startdate: changedStartFormate ? changedStartFormate : "2024-08-01T00:00:00Z",
                        enddate: changedEndFormate ? changedEndFormate : "2024-08-31T23:59:59Z",
                    },
                    {
                        withCredentials: true,
                    }
                );
                // console.log('response?.data?.inspections?.length', response?.data?.inspections?.length);

                setInspectionDetails(response?.data)
                setIsModalVisible(false)
            }

        } catch (error) {
            console.log("Error in handleSaveInspection", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>

            <View style={styles.headerContainer}>

                <Text style={styles.headerTitle}>Inspection</Text>

                <TouchableOpacity style={styles.textIconContainer}>
                    <Text style={styles.iconText}>FR</Text>
                    <Ionicons name={"chevron-down"} size={18} color="#000929" style={{ marginTop: '5%', paddingLeft: '2%' }} />
                </TouchableOpacity>
            </View>

            {/* First Box */}
            <View style={styles.firstBoxContainer}>

                <View style={styles.boxContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                        <SelectDropdown
                            data={statusDetails}
                            defaultButtonText={statusDetails[0].value}
                            onSelect={(selectedItem, index) => {
                                setInspectionStatus(selectedItem);
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>{selectedItem?.value ? selectedItem?.value : 'All Inspection'}</Text>
                                        <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} size={16} color="#6C727F" style={{ marginTop: '5%' }} />
                                    </TouchableOpacity>
                                )
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View style={[styles.dropdownItem, { justifyContent: 'space-between' }]}>
                                        <Text style={[styles.dropdownItemText, { paddingLeft: 0 }]}>{item?.value}</Text>
                                        {isSelected && (
                                            <CheckBlueTickIcon />
                                        )}
                                    </View>
                                )
                            }}
                            dropdownOverlayColor='transparent'
                            dropdownStyle={styles.dropdownContainer}
                        />

                        <TouchableOpacity style={styles.dateButtonStyle} onPress={() => {
                            setIsModalVisible(true)
                            // setStartReportDate(null)
                            // setEndReportDate(null)
                        }}>
                            <View style={styles.calenderView}>
                                <CustomCalenderIcon />
                            </View>
                            <Text style={[styles.dateText, { paddingLeft: '2%' }]}>{(!selectDate || selectDate.length <= 0) ? defaultDateShow : selectDate}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <Modal visible={isModalVisible} transparent={true} onRequestClose={() => { setIsModalVisible(false) }}>

                    <View style={styles.modalParentContainer}>

                        <View style={[styles.modalInnerContainer]}>

                            <View style={styles.saveListContainer}>
                                <View style={styles.saveListButton}>
                                    <View style={{ padding: 5, }}>
                                        <Text style={styles.modalDateText}>Start Date</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        setShowDateTime(true)
                                    }}
                                    // disabled={loading}
                                    >
                                        {showDateTime && (
                                            <DateTimePicker
                                                mode='date'
                                                display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
                                                value={new Date()}
                                                onChange={onDobChange}
                                                maximumDate={new Date(currentYear, currentMonth, currentDate)}
                                            />
                                        )}

                                        {Platform.OS === 'android' ?
                                            <Text style={[styles.DobText, startReportDate && { color: '#007BFF' }]}>{
                                                startReportDate ? startReportDate : 'Select your Date'}
                                            </Text>
                                            :
                                            showDateTime ? null : <Text style={[styles.DobText, startReportDate && {
                                                color: '#007BFF'
                                            }]}>{
                                                    startReportDate ? startReportDate : 'Select your Date'}
                                            </Text>
                                        }

                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.saveListContainer}>
                                <View style={[styles.saveListButton, {
                                    color: '#000929'
                                }]}>
                                    <View style={{ padding: 5, }}>
                                        <Text style={styles.modalDateText}>End Date</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        setShowEndDateTime(true)
                                    }}
                                    //  disabled={loading}
                                    >
                                        {showEndDateTime && (
                                            <DateTimePicker
                                                mode='date'
                                                display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
                                                value={new Date()}
                                                onChange={onSelectEndDobChange}
                                                maximumDate={new Date(currentYear, currentMonth, currentDate)}
                                            />
                                        )}

                                        {Platform.OS === 'android' ?
                                            <Text style={[styles.DobText, endReportDate && {
                                                color: '#007BFF'
                                            }]}>{
                                                    endReportDate ? endReportDate : 'Select your Date'}
                                            </Text>
                                            :
                                            showEndDateTime ? null : <Text style={[styles.DobText, endReportDate && {
                                                color: '#007BFF'
                                            }]}>{
                                                    endReportDate ? endReportDate : 'Select your Date'}
                                            </Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.buttonParentContainer, { marginTop: '5%' }]}>

                                <TouchableOpacity
                                    style={styles.buttonCancelContainer}
                                    onPress={() => {
                                        setStartReportDate(null)
                                        setEndReportDate(null)
                                        setPickModalDates({})
                                        setIsModalVisible(false)
                                    }}
                                // disabled={loading}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#007BFF' }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.buttonDoneContainer}
                                    onPress={handleSaveInspection}
                                // disabled={loading}
                                >
                                    <Text style={styles.modalButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <View style={styles.searchContainer}>
                    <SearchIcon />
                    <TextInput
                        value={searchInspection}
                        onChangeText={(text) => onChangeSearchText(text)}
                        style={styles.searchInput}
                        placeholder="Search Inspections"
                        placeholderTextColor="gray"
                        onSubmitEditing={() => {
                            if (searchInspection.trim().length > 0) {
                                handleFilter()
                            } else {
                                setSearchInspection('')
                                gettingInspectionDetails()
                            }
                        }}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

                {/* Second Box */}
                <View style={styles.secondBoxContainer}>

                    <View style={styles.innerContainer}>
                        {/* First Column */}
                        <View style={styles.columnContainer}>

                            <Text style={styles.overViewText}>Overview</Text>

                            <View style={[styles.borderBottom, { marginTop: '1.5%' }]}>
                                <Text style={[styles.sectionSubtitle, { marginBottom: '3%' }]}>Last 30 days</Text>
                            </View>

                            <Text style={[styles.sectionText, { marginTop: '2%' }]}>Total Inspections</Text>
                            <Text style={styles.sectionNumber}>{inspectionDetails?.totalInspections}</Text>
                        </View>

                        {/* Second Column */}
                        <View style={styles.columnContainer}>
                            <Text style={styles.sectionText}>Signature by me</Text>
                            <View style={styles.borderBottom}>
                                <Text style={[styles.sectionNumber, { marginBottom: '3%' }]}>4</Text>
                            </View>
                            <Text style={[styles.sectionText, { marginTop: '2%' }]}>Available Inspections</Text>
                            <Text style={styles.sectionNumber}>3</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, marginTop: '5%' }}>

                        <SelectDropdown
                            data={buttonStatusDetails}
                            defaultButtonText={buttonStatusDetails[0].name}
                            onSelect={(selectedItem, index) => {
                                setButtonInspectionStatus(selectedItem?.name);
                                if (selectedItem?.name === 'Start From Scratch') {
                                    navigation.navigate('NewInspection');
                                } else {
                                    navigation.navigate('NewInspection', { showTemplate: true });
                                }
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View style={styles.newInspectionButton}>
                                        <Text style={styles.newInspectionButtonText}>
                                            {selectedItem?.name ? selectedItem?.name : 'New Inspection'}
                                        </Text>
                                        <Ionicons
                                            name={isOpened ? "chevron-up" : "chevron-down"}
                                            size={18}
                                            color="white"
                                            style={{ marginTop: '2%' }}
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View style={styles.dropdownItem}>
                                        {item.icon}
                                        <Text style={styles.dropdownItemText}>
                                            {item.name}
                                        </Text>
                                    </View>
                                );
                            }}
                            dropdownOverlayColor='transparent'
                            dropdownStyle={styles.buttonDropDownContainer}
                        />
                    </View>


                    <View style={styles.borderLineStyle} />

                    {inspectionDetails?.inspections?.length > 0 && inspectionDetails?.inspections.map((item, index) => <ShowReportInspectionComp data={item} key={index} />)}

                </View>

            </ScrollView>
        </SafeAreaView >
    );
}

export default PrevInspectionCode;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        paddingBottom: 0,
    },
    headerContainer: {
        // marginTop: '-2%',
        marginBottom: '3%',
        paddingLeft: '1.3%',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 18,
        color: "#000929",
        textAlign: "center",
        textAlignVertical: 'center'
    },
    textIconContainer: {
        borderWidth: 2,
        padding: '1.5%',
        borderColor: '#CCE2FF',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
    },
    iconText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 15, // Adjust the font size as needed
        color: "#ffff",
        padding: '1.7%',
        paddingHorizontal: '2.2%',
        borderRadius: 25,
        backgroundColor: '#007BFF',
        textAlign: "center",
    },
    firstBoxContainer: {
        borderWidth: 2,
        borderColor: '#CCE2FF',
        padding: 5,
        borderRadius: 10,
        marginBottom: 16,
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingRight: 6,
        paddingBottom: 0,
        borderRadius: 4,
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    calenderView: {
        paddingHorizontal: '2%',
    },
    dateButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#CCE2FF',
    },
    dateText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#000929',
    },
    buttonText: {
        marginHorizontal: 4,
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000929',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        marginHorizontal: '2%',
        backgroundColor: '#F3F8FF',
        borderColor: '#DAEAFF',
        borderRadius: 10,
        padding: 8,
        paddingLeft: 13,
        marginBottom: '3%',
    },
    searchInput: {
        flex: 1,
        marginLeft: '5%',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
    },
    secondBoxContainer: {
        position: 'relative',
        zIndex: 0,
        borderWidth: 2,
        borderColor: '#CCE2FF',
        paddingTop: 10,
        paddingBottom: '7%',
        borderRadius: 10,
        marginBottom: '4%'
    },
    innerContainer: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    columnContainer: {
        flex: 1,
    },
    overViewText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#000929',
    },
    borderBottom: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#DAEAFF',
        paddingBottom: 4,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6C727F',
    },
    sectionText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6C727F',
    },
    sectionNumber: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000929',
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingTop: '3%',
        paddingBottom: '4%',
        marginHorizontal: '5%'
    },
    newInspectionButtonText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
        marginRight: 8,
    },
    borderLineStyle: {
        marginTop: '5%',
        borderWidth: 1,
        width: '100%',
        borderColor: '#DAEAFF',
    },
    loadingStyle: {
        backgroundColor: '#00000039',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalParentContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    modalInnerContainer: {
        backgroundColor: '#fff',
        paddingBottom: '5%',
        width: '90%',
        height: 280,
        borderRadius: 8
    },
    saveListContainer: {
        paddingLeft: 0,
        marginBottom: 0,
        marginHorizontal: 15,
        marginTop: 3,
    },
    saveListButton: {
        padding: 6,
    },
    modalDateText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#000929',
    },
    DobText: {
        borderWidth: 1.5,
        backgroundColor: '#F3F3F3',
        borderColor: '#E5E1E1',
        marginHorizontal: 0,
        padding: 12,
        borderRadius: 10,
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#8D8B8B',
    },
    textContainer: {
        margin: 10,
        marginTop: 2,
        padding: 5,
        marginBottom: 0,
        alignItems: 'center'
    },
    buttonParentContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '8%'
    },
    buttonDoneContainer: {
        paddingVertical: 8,
        width: "38%",
        borderRadius: 5,
        backgroundColor: '#007BFF',
    },
    buttonCancelContainer: {
        paddingVertical: 8,
        width: "38%",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#DFECFF',
        backgroundColor: '#ffff',
    },
    modalButtonText: {
        textAlign: "center",
        marginTop: '-3%',
        textAlignVertical: "center",
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#ffff',
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        // borderWidth: 1.5,
        width: '80%',
        elevation: 10,
        borderRadius: 5,
        marginTop: '-7%',
        marginLeft: '1%',
        padding: 5,
        paddingTop: '2%',
        borderRadius: 10,
        paddingHorizontal: '4%',
        paddingBottom: '4%'
    },
    buttonDropDownContainer: {
        backgroundColor: '#fff',
        elevation: 10,
        borderRadius: 5,
        marginTop: '-7%',
        padding: 5,
        paddingTop: '2%',
        borderRadius: 10,
        paddingHorizontal: '4%',
        paddingBottom: '4%'
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
});
