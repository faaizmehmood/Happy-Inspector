import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { image } from '../../../constants/images';
import { useNavigation } from '@react-navigation/native';

const PropertyCardComp = ({ index, data }) => {
    const navigation = useNavigation();
    let updatedFormatedDate = new Date(data?.createdAt);

    function formatDate(date) {
        let months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        let strTime = hours + ":" + minutes + " " + ampm;

        return months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + strTime;
    }

    let formattedDate = formatDate(updatedFormatedDate);

    let formatedAddress = data?.address;

    let showAddress = `${formatedAddress?.street}, ${formatedAddress?.city}`;

    return (
        <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate('ShowPropertyDetail', { id: data?._id }) }}>

            <Image
                source={{ uri: data?.image?.url }}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.address} numberOfLines={2}>{data?.name}</Text>
                <Text style={styles.location} numberOfLines={1}>{showAddress}</Text>
                <View style={styles.footer}>
                    <Text style={styles.type} numberOfLines={1}>{data?.category?.value}</Text>
                    <Text style={styles.time}>{formattedDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingRight: 12,
        marginHorizontal: 14,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    image: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        width: 95,
        height: '100%',
    },
    content: {
        flex: 1,
        paddingVertical: '3%',
        marginLeft: 12,
        justifyContent: 'center',
    },
    address: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#666666',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    type: {
        width: '50%',
        marginRight: '0.5%',
        fontSize: 13.5,
        color: '#2196F3',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    time: {
        fontSize: 13,
        color: '#666666',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
});

export default memo(PropertyCardComp);