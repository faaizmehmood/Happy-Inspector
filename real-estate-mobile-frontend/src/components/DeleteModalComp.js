import React, { memo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { CrossIcon } from '../svg/MyTeamsSvg';
import { style } from '../screens/properties/PropertyStyle';

const DeleteModalComp = ({ screenType, visible, onClose, onConfirm, title, memberDetail }) => {
    const [showDeleteInput, setShowDeleteInput] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
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

                    {screenType !== "propertyDetail" ? <Text style={styles.message}>
                        Are you sure you want to delete this user <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>{memberDetail?.name}</Text> ? This action cannot be undone.
                    </Text>
                        :
                        showDeleteInput ?
                            <>
                                <Text style={styles.message}>
                                    You are about to permanently delete this property and all inspections associated with it. This action cannot be undone.
                                </Text>

                                <Text style={[styles.message, { fontSize: 13.5 }]}>
                                    To proceed with the deletion, please type <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>Delete </Text> in the field below and click <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>Confirm</Text>.
                                </Text>

                                <View style={[style.inputContainer, { flexDirection: 'column', marginRight: 20, borderRadius: 8, marginBottom: '6%', borderWidth: 2, borderColor: '#FDA591', backgroundColor: '#FEECE8' }]}>
                                    <TextInput
                                        value={deleteInput}
                                        onChangeText={(text) => setDeleteInput(text)}
                                        style={[style.textInput, { fontSize: 14, paddingLeft: '3%', flex: 0 }]}
                                        placeholder="Delete"
                                        placeholderTextColor="gray"
                                    />
                                </View>

                            </>
                            :
                            <>
                                <Text style={styles.message}>
                                    Are you sure you want to delete this <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>{memberDetail?.name}</Text> and all <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>{memberDetail?.lastName}</Text> associated with it ? This action cannot be undone.
                                </Text>
                            </>
                    }

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.confirmButton, screenType === "propertyDetail" && { backgroundColor: deleteInput === "Delete" ? '#FF613E' : !showDeleteInput ? '#FF613E' : '#CBCBCB' }]} onPress={async () => {
                            if (screenType === "propertyDetail") {
                                setShowDeleteInput(true);
                                if (deleteInput === "Delete") {
                                    await onConfirm(memberDetail?._id)
                                }
                            } else {
                                await onConfirm(memberDetail?._id)
                            }
                        }}
                            disabled={screenType === "propertyDetail" && deleteInput !== "Delete" && showDeleteInput}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '93%',
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
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000929',
    },
    message: {
        paddingRight: 20,
        fontSize: 14.5,
        color: '#000',
        fontFamily: 'PlusJakartaSans_500Medium',
        textAlign: 'left',
        marginBottom: 17,
        lineHeight: 20,
    },
    buttonContainer: {
        paddingRight: 20,
        width: '100%',
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#FF613E',
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

export default memo(DeleteModalComp);
