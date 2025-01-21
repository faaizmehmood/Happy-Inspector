import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';

const CreateRoom = () => {
    const { setLoading } = useLoader()
    const navigation = useNavigation();
    const route = useRoute();

    const [roomName, setRoomName] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (roomName?.trim()?.length >= 4) {
            setIsButtonDisabled(true)
        } else {
            setIsButtonDisabled(false)
        }
    }, [roomName]);

    const handleSave = async () => {
        if (route?.params?.inspectionID) {
            try {
                let id = route?.params?.inspectionID ? route?.params?.inspectionID : null
                setLoading(true)
                let data = {
                    inspectionId: id,
                    roomName: roomName?.trim(),
                }
                const response = await axios.post(`${apiUrl}/api/inspection/InspectionAddNewRoom`, data, { withCredentials: true })
                if (response?.status === 200 || response?.status === 201) {
                    setRoomName('');
                    navigation.goBack();
                }
            } catch (error) {
                console.log('error in handleSave', error)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
            alert("Sorry, failed to fetch detail's.")
            navigation.goBack();
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.mainContainer}>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <Text style={styles.inputTextLabel}>Write New Room Name</Text>
                    <View style={styles.searchContainer}>
                        <TextInput
                            value={roomName}
                            onChangeText={(text) => setRoomName(text)}
                            style={styles.searchInput}
                            placeholder="Room Name"
                            placeholderTextColor="#7A8094"
                        />
                    </View>

                </View>

                <TouchableOpacity
                    style={[
                        styles.newInspectionButton, isButtonDisabled && { backgroundColor: '#007BFF' }
                    ]}
                    onPress={handleSave}
                    disabled={!isButtonDisabled}
                >
                    <Text style={styles.newInspectionButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateRoom;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        paddingBottom: 0,
        padding: 16,
        marginVertical: '2%',
    },
    inputTextLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
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
    searchInput: {
        flex: 1,
        padding: 8,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
    },
    newInspectionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBCBCB',
        borderRadius: 8,
        paddingVertical: '4%',
        marginTop: '5.5%',
        marginHorizontal: '5.5%',
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#DAEAFF',
        paddingTop: '3%',
        paddingBottom: '4%',
        marginTop: '5%',
        marginBottom: '4%',
        marginHorizontal: '5.5%',
    },
    saveButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
    newInspectionButtonText: {
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
    },
});
