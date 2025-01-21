import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import { style } from './PropertyStyle'
import Entypo from '@expo/vector-icons/Entypo';
import PropertyElementsDetail from './propertyComponents/PropertyElementsDetail';

const PropertyRoomCompletedDetail = ({ route }) => {
    let data = route?.params?.data

    const [roomData, setRoomData] = useState({
        image: data?.roomImages,
        notes: data?.roomNote
    });

    const [roomElementsArr, setRoomElementsArr] = useState(data?.roomElements);
    const [elementIndex, setElementIndex] = useState(null);

    const renderImageItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item?.url }}
                resizeMethod='resize'
                resizeMode='cover'
                style={styles.image}
            />
            <Text style={styles.imageCaption}>{item?.caption}</Text>
        </View>
    )

    const handleElementIndex = (itemIndex) => {
        setElementIndex((prev) => prev === itemIndex ? null : itemIndex)
    }

    const renderElementsItem = ({ item, index }) => {
        let isSelected = elementIndex === index;
        return (
            <View style={[styles.collapsibleSection, { borderWidth: isSelected ? 2.5 : 1.2 }]} >
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => handleElementIndex(index)}
                    disabled={item?.checklist?.length === 0 && !item?.image?.url ? true : false}
                >
                    <Text style={styles.sectionHeaderText}>{item?.name}</Text>

                    <View style={styles.questionIconContainer}>
                        <Text style={styles.elementCountText}>{item?.checklist?.length} Question</Text>

                        <Entypo
                            name={isSelected ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#6C727F"
                            style={{ paddingHorizontal: '3%' }}
                        />
                    </View>

                </TouchableOpacity>

                {isSelected && <PropertyElementsDetail elementData={item} />}
            </View>
        )
    }

    return (
        <SafeAreaView style={[style.mainContainer, { backgroundColor: '#ffff' }]}>
            <CustomHeader title="Bedroom" goBack={true} />

            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                style={style.scrollViewContainer}
            >
                <Text style={style.heavyBoldText}>Room Details</Text>

                {roomData?.image?.length > 0 && <View style={styles.roomContainer}>

                    <FlatList
                        data={roomData?.image}
                        renderItem={renderImageItem}
                        keyExtractor={item => item?._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 12, backgroundColor: '#F3F8FF', padding: 11 }}
                    />

                </View>}

                {roomData?.notes &&
                    <>
                        <Text style={styles.notesTitle}>Notes</Text>
                        <Text style={styles.notesText}>
                            {roomData?.notes}
                        </Text>
                    </>
                }

                {/* Collapsible Sections */}
                <FlatList
                    data={roomElementsArr}
                    scrollEnabled={false}
                    style={{ paddingBottom: '9%' }}
                    keyExtractor={item => item?._id}
                    renderItem={renderElementsItem}
                />

            </ScrollView >
        </SafeAreaView>
    )
}

export default PropertyRoomCompletedDetail

const { width } = Dimensions.get('window')
const imageWidth = width * 0.5

const styles = StyleSheet.create({
    roomContainer: {
        marginVertical: 16,
    },
    imageContainer: {
        marginRight: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: imageWidth,
        height: imageWidth,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    imageCaption: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        color: '#fff',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    collapsibleSection: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: '#B7D5FF',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#000',
    },
    questionIconContainer: {
        flexDirection: 'row'
    },
    elementCountText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12.5,
        color: '#8D939F'
    },
    notesTitle: {
        fontSize: 17,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#000',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#666',
        marginBottom: 16,
    },
})