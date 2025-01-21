import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import React, { memo } from 'react'
import CheckListIcon from '../../../../assets/images/propertyModuleIcons/checkListIcon.svg'
import SelectDropdown from 'react-native-select-dropdown';
import { Ionicons } from '@expo/vector-icons';
import PropertyCustomOptionSelection from './PropertyCustomOptionSelection';

const PropertyElementsDetail = ({ elementData }) => {
    return (
        <View style={styles.sectionContent}>

            {elementData?.image?.url &&
                <>
                    <Text style={styles.subheader}>Element Image</Text>

                    <Image
                        source={{ uri: elementData?.image?.url }}
                        style={styles.elementImage}
                    />
                </>
            }

            {elementData?.note &&
                <>
                    <Text style={styles.subheader}>Notes</Text>
                    <Text style={styles.noteText}>{elementData?.note}</Text>
                </>
            }

         {elementData?.checklist?.length >0 ?   <View style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'center' }}>

                <View style={{ flex: 0.32 }}>
                    <Text style={[styles.subheader, { marginBottom: 0 }]}>Checklist</Text>
                </View>

                <View style={{ flex: 1, marginTop: 4 }}>
                    <CheckListIcon />
                </View>

            </View>
:''}
            {elementData?.checklist?.map((item, index) => {
                if (item?.type == 'dropDown') {
                    return (
                        <View key={index}>

                            <Text style={styles.inputLabelText}>{index + 1}. {item?.text}{item?.answerRequired ? ' *' : ''}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>

                                <SelectDropdown
                                    data={item?.options}
                                    disabled={true}
                                    renderButton={(selectedItem, isOpened) => {

                                        return (
                                            <View style={styles.searchContainer}>

                                                <Text style={[styles.dropDownButtonContainer, !item?.answer && { color: '#7A8094' }]}>{item?.answer ? item?.answer : 'Select Answer'}</Text>

                                                <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} size={18} color="#9EA3AE" style={{ paddingHorizontal: '3%' }} />

                                            </View>
                                        )
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View style={[styles.dropdownItem, { justifyContent: 'space-between' }]}>
                                                <Text style={[styles.dropdownItemText, { paddingLeft: 0 }]}>{item?.option}</Text>
                                            </View>
                                        )
                                    }}
                                    dropdownOverlayColor='transparent'
                                    dropdownStyle={styles.dropdownContainer}
                                />
                            </View>
                        </View>
                    )

                }
                if (item?.type == 'textArea') {
                    return (
                        <View key={index} style={{ marginTop: '2%' }}>
                            <Text style={styles.inputLabelText}>{index + 1}. {item?.text}{item?.answerRequired ? ' *' : ''}</Text>
                            <View style={styles.inputInnerContainer}>
                                <TextInput
                                    value={item?.answer}
                                    onChangeText={(text) => textFieldAnswer(item?._id, text)}
                                    style={styles.input}
                                    placeholder="Answer"
                                    editable={false}
                                    placeholderTextColor="#7A8094"
                                />
                            </View>
                        </View>
                    )


                }
                else if (item?.type == 'radio') {
                    return (
                        <View key={index}>
                            <PropertyCustomOptionSelection
                                index={index}
                                parentItem={item}
                            />
                        </View>
                    )

                }
            })
            }
        </View>
    )
}

export default memo(PropertyElementsDetail)

const styles = StyleSheet.create({
    sectionContent: {
        padding: 16,
        borderTopWidth: 1.5,
        borderTopColor: '#CCE2FF',
    },
    subheader: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#000',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 10,
        lineHeight: 20,
    },
    elementImage: {
        height: 120,
        width: 120,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
    },
    inputLabelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13.7,
        paddingLeft: '0.5%',
        color: '#000929',
        marginBottom: '3%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        marginHorizontal: '1%',
        backgroundColor: '#F3F8FF',
        borderColor: '#DAEAFF',
        borderRadius: 10,
        marginBottom: '3%',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: '#daeaff6a',
        borderColor: '#DAEAFF',
        borderRadius: 8,
    },
    input: {
        flex: 1,
        padding: 8,
        paddingLeft: 11,
        color: '#000929',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    dropDownButtonContainer: {
        flex: 1,
        padding: 8,
        paddingVertical: 11,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
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
    dropdownContainer: {
        backgroundColor: '#fff',
        elevation: 10,
        borderRadius: 5,
        marginTop: '-5%',
        marginLeft: '1%',
        padding: 5,
        paddingTop: '2%',
        borderRadius: 10,
        paddingHorizontal: '4%',
        paddingBottom: '4%'
    },
})