import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import SaveQIcon from '../../../../assets/images/icons/saveQIcon.svg'
const CustomQuestionCheckBox = ({ screenName, options, value = null, onChange ,disabled,commonIds}) => {
    const handleOptionChange = (optionValue,option) => {
        let newValue;

        if (value === optionValue) {
            newValue = null;
        } else {
            newValue = optionValue;
        }
        onChange && onChange(newValue,option);
    };
   
    return (
        <View style={styles.container}>
            {options?.map((option,index) => {
               const isDisabled = commonIds.some((text) => text === option.text);
                return(
                <TouchableOpacity
                disabled={isDisabled}
                    key={index}
                    onPress={() => handleOptionChange(option.text,option)}
                    style={[styles.optionTouchable, screenName === 'FinalizingInspectionSignature' && { marginTop: 0 },{opacity:isDisabled?0.5:1}]}
                >
                    <View style={{flexDirection:'row',alignItems:'center',}}>

                    <View
                        style={[screenName === 'FinalizingInspection' ? styles.checkbox2 : styles.checkbox,
                        {
                            backgroundColor: value?.includes(option.text) || isDisabled ? '#2F80ED' : 'transparent',
                            borderColor: value?.includes(option.text) ||isDisabled ? '#2F80ED' : '#DEDEDE',
                        }
                        ]}
                    >
                        {value?.includes(option.text) ||isDisabled  ? (
                            <Entypo name="check" size={screenName === 'FinalizingInspection' ? 13 : 12} color="#fff" />
                        ):''}
                    </View>
                    <Text style={styles.optionLabel}>
                        {` ${index+1 +'. ' + option.text}`}
                    </Text>
                    </View>
      <SaveQIcon/>

                </TouchableOpacity>
            )})}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start'
    },
    optionTouchable: {
        marginTop: '3%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        width:'100%'
    },
    checkbox: {
        width: 17,
        height: 17,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 3,
    },
    checkbox2: {
        width: 19,
        height: 19,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        borderRadius: 3,
    },
    optionLabel: {
        fontSize: 13,
        color: '#000',
        fontFamily: 'PlusJakartaSans_500Medium',
    },

});

export default memo(CustomQuestionCheckBox);
