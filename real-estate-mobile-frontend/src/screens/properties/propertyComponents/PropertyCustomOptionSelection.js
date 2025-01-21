import { StyleSheet, Text, View, Image } from 'react-native'
import React, { memo, useState } from 'react'
import { getIconById } from './questionsGetPath';
import { getWhiteIconById } from './questionsWhiteIconPath';

const PropertyCustomOptionSelection = ({ parentItem, index }) => {
    const [selectedIconIndex, setSelectedIconIndex] = useState('');

    return (
        <View >
            <Text style={styles.searchInput}>{index + 1}. {parentItem?.text}{parentItem?.answerRequired ? ' *' : ''}</Text>

            <View style={[styles.parentContainer,
            { marginTop: '1%', width: parentItem?.options?.length == 4 ? '100%' : parentItem?.options?.length == 2 ? '55%' : '80%' }]}>

                {parentItem?.options?.length > 0 && parentItem?.options?.map?.((item, index) => {

                    const isSelected = parentItem?.answer ? parentItem?.answer == item?.option : selectedIconIndex === item?.option;
                    const Icon = !isSelected ? getIconById(item?.iconId) : getWhiteIconById(item?.iconId)

                    return (
                        <View key={index}>
                            {Icon ?
                                <View
                                    style={[isSelected && styles.iconTextContainer, { alignItems: 'center', paddingVertical: '8%', paddingHorizontal: '10%' }]}
                                >
                                    {Icon}

                                    <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
                                        {item?.option}
                                    </Text>
                                </View> :
                                <View
                                    style={[isSelected && styles.iconTextContainer, { alignItems: 'center', paddingVertical: '15%', paddingHorizontal: '12%' }]}
                                    onPress={() => handlePresentQuestionIconPress(item?.option)}
                                >
                                    <View style={[styles.textIcon, { borderColor: isSelected ? '#fff' : '#7F8AA1' }]}>
                                        <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
                                            {item?.option?.charAt(0)}
                                        </Text>
                                    </View>

                                    <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1', }, styles.iconText]}>
                                        {item?.option}
                                    </Text>
                                </View>}
                        </View>
                    )
                })
                }
            </View>
        </View>
    )
}

export default memo(PropertyCustomOptionSelection)

const styles = StyleSheet.create({
    iconTextContainer: {
        backgroundColor: '#2A85FF',
        width: '100%',
        borderRadius: 8,
    },
    textIcon: {
        borderWidth: 1,
        width: 20,
        height: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    iconText: {
        fontSize: 12,
        textAlign: 'center'
    },
    searchInput: {
        flexDirection: 'row',
        paddingVertical: 6,
        padding: 5,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
    },
    parentContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-around',
        backgroundColor: 'rgba(42, 133, 255, 0.14)',
        borderRadius: 10,
        paddingVertical: '1.5%',
        paddingHorizontal: '2%'
    },
})