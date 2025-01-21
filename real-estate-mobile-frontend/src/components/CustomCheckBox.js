import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const CustomCheckBox = ({ screenName, options, value = null, onChange, disabled }) => {
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
        <View style={[styles.container, { opacity: disabled ? 0.2 : 1 }]}>
            {options?.map((option) => (
                <TouchableOpacity
                    disabled={disabled}
                    key={option.value}
                    onPress={() => handleOptionChange(option.value)}
                    style={[styles.optionTouchable, screenName === 'FinalizingInspectionSignature' && { marginTop: 0, }]}
                >
                    <View
                        style={[screenName === 'FinalizingInspection' ? styles.checkbox2 : styles.checkbox,
                        {
                            backgroundColor: value?.includes(option.value) ? '#2F80ED' : 'transparent',
                            borderColor: value?.includes(option.value) ? '#2F80ED' : '#DEDEDE',
                        }
                        ]}
                    >
                        {value?.includes(option.value) && (
                            <Entypo name="check" size={screenName === 'FinalizingInspection' ? 13 : 12} color="#fff" />
                        )}
                    </View>
                    <Text style={styles.optionLabel}>
                        {option.label}
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

export default memo(CustomCheckBox);
