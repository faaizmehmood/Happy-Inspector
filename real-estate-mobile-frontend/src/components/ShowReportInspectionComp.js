import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { memo } from 'react'
import ViewDetailsIcon from '../../assets/images/icons/view-details-icon.svg';


const ShowReportInspectionComp = ({ data }) => {
    let updatedFormatedDate = new Date(data?.updatedAt);

    function formatDate(date) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + strTime;
    }

    let formattedDate = formatDate(updatedFormatedDate);

    let formatedAddress = data?.property?.address;

    let showAddress = `${formatedAddress?.street}, ${formatedAddress?.city}, ${formatedAddress?.state}`

    return (
        <View style={styles.reportBoxContainer}>
            <View style={styles.reportContainer}>
                <Text style={[styles.overViewText, { width: '45%' }]}>{data?.name}</Text>
                <Text style={[styles.inspectionsText, { paddingLeft: '5%', width: '58%' }]}>Inspections  after  tenant</Text>
            </View>

            <View style={styles.updateContainer}>
                <Text style={[styles.overViewText, { fontFamily: 'PlusJakartaSans_600SemiBold' }]}>Update on</Text>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {data?.property?.image &&
                <Image source={{ uri: data?.property?.image }} style={styles.imagePlaceholder} />
            }
            <Text style={styles.overViewText}>{data?.property?.name}</Text>

            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{showAddress}</Text>
            </View>

            <View style={styles.completedButton}>
                <Text style={styles.completedButtonText}>{data?.isInspectionCompleted ? 'Completed' : data?.isDraft ? 'Drafted' : 'In Progress'}</Text>
            </View>

            <TouchableOpacity style={styles.viewDetailsButton}>
                <ViewDetailsIcon />
                <Text style={[styles.newInspectionButtonText, { paddingLeft: '3%', marginTop: '-2%', color: '#000929', fontFamily: 'PlusJakartaSans_600SemiBold' }]}>View Details</Text>
            </TouchableOpacity>

        </View>
    )
}

export default memo(ShowReportInspectionComp)

const styles = StyleSheet.create({
    reportBoxContainer: {
        borderWidth: 2,
        marginHorizontal: '3%',
        marginTop: '7%',
        borderColor: '#CCE2FF',
        paddingTop: 10,
        borderRadius: 10,
        paddingHorizontal: 16,
    },
    reportContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    overViewText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#000929',
    },
    inspectionsText: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6C727F',
    },
    updateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6C727F',
    },
    imagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        marginBottom: '5%',
    },
    addressContainer: {
        marginVertical: '2%',
        marginBottom: '4%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6C727F',
        flex: 1,
    },
    completedButton: {
        backgroundColor: '#E1EEFF',
        width: '38%',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: '5%',
        alignItems: 'center',
    },
    completedButtonText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#9ea3ae9d',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: '5%',
    },
    newInspectionButtonText: {
        // fontSize: 16,
        // fontFamily: 'PlusJakartaSans_700Bold',
        // color: 'white',
        marginRight: 8,
    },
})