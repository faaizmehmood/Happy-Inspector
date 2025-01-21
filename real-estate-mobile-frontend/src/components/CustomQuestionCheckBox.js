import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const CustomQuestionCheckBox = ({ screenName, options, value = null, onChange ,disabled}) => {
    const handleOptionChange = (optionValue) => {
        let newValue;

        if (value === optionValue) {
            newValue = null;
        } else {
            newValue = optionValue;
        }
        onChange && onChange(newValue);
    };
   
    

    return (
        <View style={styles.container}>
            {options?.map((option,index) => (
                <TouchableOpacity
                disabled={disabled}
                    key={index}
                    onPress={() => handleOptionChange(option.text)}
                    style={[styles.optionTouchable, screenName === 'FinalizingInspectionSignature' && { marginTop: 0 }]}
                >
                    <View
                        style={[screenName === 'FinalizingInspection' ? styles.checkbox2 : styles.checkbox,
                        {
                            backgroundColor: value?.includes(option.text) ? '#2F80ED' : 'transparent',
                            borderColor: value?.includes(option.text) ? '#2F80ED' : '#DEDEDE',
                        }
                        ]}
                    >
                        {value?.includes(option.text) && (
                            <Entypo name="check" size={screenName === 'FinalizingInspection' ? 13 : 12} color="#fff" />
                        )}
                    </View>
                    <Text style={styles.optionLabel}>
                        {option.text}
                    </Text>
                </TouchableOpacity>
            ))}
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
        justifyContent: 'center',
        borderRadius: 12,
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
