import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getImagePathById } from '../../../constants/questionsGetPath';
import { getIconById } from '../../../constants/questionsGetPath';
import { getWhiteIconById } from '../../../constants/questionsWhiteIconPath';
const CustomOptionSelection = ({ parentItem, index,onPressSelectAnswer }) => {
    const [selectedIconIndex, setSelectedIconIndex] = useState('');

    const handlePresentQuestionIconPress = (value) => {
        setSelectedIconIndex(value);
        onPressSelectAnswer(parentItem?._id,value)
    };

    return (
        <View>
            <Text style={styles.searchInput}>{index + 1}. {parentItem?.text}{parentItem?.answerRequired ? ' *':''}</Text>

            <View style={[styles.parentContainer,
            { marginTop: '1%', width: parentItem?.options?.length == 4 ? '100%' : parentItem?.options?.length == 2 ? '55%' : '80%' }]}>

                {parentItem?.options?.length > 0 && parentItem?.options?.map?.((item, index) => {
                    
                    const isSelected = parentItem?.answer? parentItem?.answer ==item?.option: selectedIconIndex === item?.option;
                    const Icon = !isSelected ? getIconById(item?.iconId): getWhiteIconById(item?.iconId)

                    return (

                        // <TouchableOpacity
                        //     key={index}
                        //     style={[isSelected && styles.iconTextContainer ]}
                        //     onPress={() => handlePresentQuestionIconPress(item?.option)}
                        // >
                        //     <View style={{ alignSelf: 'center' }}>
                        //         {item?.iconId ?
                        //             <>
                        //                 {Icon}
                        //                 {/* <Icon/> */}
                        //                 {/* {SvgIcon && <SvgIcon width={50} height={50} />} */}
                        //                 {/* <Image style={ { height: 23, width: 19 }} source={icon}/> */}
                        //                 {/* {item?.iconId && React.cloneElement(item?.iconId, { height: 23, width: 19 })} */}
                        //             </> :
                        //             <View style={[styles.textIcon, { borderColor: isSelected ? '#fff' : '#7F8AA1' }]}>
                        //                 <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
                        //                     {item?.option?.charAt(0)}
                        //                 </Text>
                        //             </View>
                        //         }
                        //     </View>

                        //     <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
                        //         {item?.option}
                        //     </Text>
                        // </TouchableOpacity>
                        <View
                            key={index}

                        >
                            {Icon ?
                                <TouchableOpacity
                                    style={[isSelected && styles.iconTextContainer, {
                                         alignItems: 'center' ,
                                         justifyContent:'center',
                                         width:80,
                                         height:60
                                        //  paddingVertical: '8%', paddingHorizontal: '10%'
                                        }]}
                                    onPress={() => handlePresentQuestionIconPress(item?.option)}
                                >
                                    {Icon}

                                    <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1' }, styles.iconText]}>
                                        {item?.option}
                                    </Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={[isSelected && styles.iconTextContainer, { 
                                        alignItems: 'center' ,
                                        justifyContent:'center',
                                        width:80,
                                        height:60,
                                        //  paddingVertical: '15%', paddingHorizontal: '12%' 
                                        }]}
                                    onPress={() => handlePresentQuestionIconPress(item?.option)}
                                >
                                    <View style={[styles.textIcon, { borderColor: isSelected ? '#fff' : '#7F8AA1' }]}>
                                        <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1', }, styles.iconText]}>
                                            {item?.option?.charAt(0)}
                                        </Text>
                                    </View>

                                    <Text style={[{ color: isSelected ? '#fff' : '#7F8AA1',marginTop: '5%', }, styles.iconText]}>
                                        {item?.option}
                                    </Text>
                                </TouchableOpacity>}
                        </View>
                    )
                })
                }
            </View>
        </View>
    )
}

export default CustomOptionSelection

const styles = StyleSheet.create({
    iconTextContainer: {
        backgroundColor: '#2A85FF',
        width: '100%',
        // paddingVertical: '8%',
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
        // paddingTop: '2%',
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
        // backgroundColor: '#e1eeff84',
        backgroundColor: 'rgba(42, 133, 255, 0.14)',
        borderRadius: 10,
        // width: '65%',
        paddingVertical: '1.5%',
        paddingHorizontal:'2%'
    },
})