import React, { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { CrossIcon } from '../svg/MyTeamsSvg';
import { style } from '../screens/properties/PropertyStyle';

const CustomModalForIcon = lazy(() => import("./CustomModalForIcon"))
let SelectedIcon = null;


const AddNewModalComp = ({ visible, onClose, onConfirm, title, }) => {
    const [categoryData, setCategoryData] = useState({
        category: '',
        iconId: ''
    });

    const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        setFormValid(categoryData?.category !== '' && categoryData?.iconId !== '')
    }, [categoryData])


    const handleSave = (data) => {
        setCategoryData((prev) => ({
            ...prev,
            iconId: data?.iconId
        }))
        SelectedIcon = data?.icon || null;
        setIsQuestionModalVisible(false);
    }

    const handleChangeText = useCallback((name, value) => {
        setCategoryData((prev) => ({
            ...prev,
            [name]: value
        }))
    }, [categoryData])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.crossIconContainer}>
                        <TouchableOpacity onPress={onClose}>
                            <CrossIcon number={20} color={'#000929'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <View style={[style.inputContainer, styles.textInputContainer]}>
                        <TextInput
                            value={categoryData?.category}
                            onChangeText={(text) => handleChangeText('category', text)}
                            style={[style.textInput, { fontSize: 14, paddingLeft: '3%' }]}
                            placeholder="Enter New Category"
                            placeholderTextColor="gray"
                        />
                        <TouchableOpacity onPress={() => setIsQuestionModalVisible(true)}>
                            {!categoryData?.iconId ? <Text style={[style.lightBoldText, { color: 'gray', fontSize: 13.5, marginRight: '2%' }]}>Add Icon</Text>
                                :
                                (categoryData?.iconId && SelectedIcon) && <SelectedIcon width={28} height={28} />
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: formValid ? '#007BFF' : '#CBCBCB' }]}
                            onPress={() => onConfirm(categoryData)}
                            disabled={!formValid}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <================== Question Modal Start =============> */}
                    <Suspense>
                        {isQuestionModalVisible && <CustomModalForIcon
                            handleSave={handleSave}
                            visible={isQuestionModalVisible}
                            onClose={() => setIsQuestionModalVisible(false)}
                        />}
                    </Suspense>

                </View>
            </View>
        </Modal>
    );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '93%',
        maxHeight: height * 0.5,
        paddingLeft: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    crossIconContainer: {
        alignItems: 'flex-end',
        paddingRight: 12,
        paddingTop: 8
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        paddingRight: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '-2%',
    },
    title: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000929',
    },
    textInputContainer: {
        alignItems: 'center',
        marginRight: '6%',
        borderRadius: 8,
        marginVertical: '6%',
    },
    buttonContainer: {
        paddingRight: 20,
        width: '100%',
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    cancelButton: {
        width: '100%',
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: '#CCE2FF',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#007BFF',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default memo(AddNewModalComp);
