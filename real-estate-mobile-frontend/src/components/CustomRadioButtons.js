import React, { memo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomRadioButtons = ({ screenName, options, value, onChange, }) => {
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        setSelectedOption(value);
    }, [value]);

    const handleOptionChange = (optionValue) => {
        const newValue = selectedOption === optionValue ? null : optionValue;
        setSelectedOption(newValue);
        onChange && onChange(newValue);
    };

    return (
        <View style={[screenName === 'CreateElementInspection' ? styles.container2 : styles.container]} >
            {options?.map((option, index) => (
                <TouchableOpacity
                    onPress={() => handleOptionChange(option.value)}
                    key={option.value}
                    style={[screenName === 'CreateElementInspection' ? styles.optionTouchable2 : styles.optionTouchable]}
                >
                    <View
                        style={[
                            styles.radioCircle, { borderColor: selectedOption === option.value ? '#2F80ED' : '#DEDEDE', }
                        ]}
                    >
                        {selectedOption === option.value && (
                            <View style={styles.selectedCircle} />
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
        alignItems: 'flex-start',
    },
    container2: {
        flexDirection: 'row',
    },
    optionTouchable: {
        paddingVertical: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    optionTouchable2: {
        marginRight: '7%',
        paddingVertical: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    selectedCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2F80ED',
    },
    optionLabel: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
});

export default memo(CustomRadioButtons);
