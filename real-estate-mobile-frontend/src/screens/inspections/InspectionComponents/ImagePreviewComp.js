import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, ScrollView, KeyboardAvoidingView, ActivityIndicator, Dimensions } from 'react-native';
import React, { memo, useState } from 'react';
import DeleteIcon from "../../../../assets/images/icons/ImgDeleteIcon.svg";
import EditTextIcon from "../../../../assets/images/icons/editText.svg";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import QuestionTickIcon from '../../../../assets/images/icons/QuestionTickIcon.svg'
import QuestionCrossIcon from '../../../../assets/images/icons/QuestionCrossIcon.svg'
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoader } from '../../../lib/loaderContext';

const ImagePreviewComp = ({ isVisible, roomImArr, handleModalVisibility, handleSaveCaption, handleDeleteImg }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showRoomInputBox, setShowRoomInputBox] = useState(false);

    const selectedImage = roomImArr[selectedImageIndex];
    const [captionText, setCaptionText] = useState(selectedImage?.caption);
    const { setLoading, loading } = useLoader()

    const handleImagePress = (caption, index) => {
        setSelectedImageIndex(index);
        setCaptionText(caption || '')
    };

    const handleSavCaption = async () => {
        setLoading(true)
        setShowRoomInputBox(false)
        await handleSaveCaption(selectedImage, captionText);
    }

    return (
        <Modal visible={isVisible} transparent={true} onRequestClose={handleModalVisibility}>
            {loading ? <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color="#2A85FF" />
            </View> :
                <View style={styles.modalParentContainer}>

                    <View style={[styles.headerContainer,{width:'100%'}]}>
                        <TouchableOpacity onPress={handleModalVisibility}>
                            <FontAwesome name="angle-left" size={28} color="white" style={{ paddingLeft: '2%' }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Image Preview</Text>

                        <TouchableOpacity onPress={() => {
                            if (!selectedImage) {
                                handleModalVisibility()
                            }
                            else {
                                // setLoading(true)
                                handleDeleteImg(selectedImage)
                            }
                        }}>
                            <DeleteIcon width={22} height={22} />
                        </TouchableOpacity>

                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>

                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: selectedImage?.url }}
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={{ flex: 0 }}>
                                {showRoomInputBox ? <View style={styles.inputContainer}>
                                    <TextInput
                                        value={captionText}
                                        onChangeText={(text) => setCaptionText(text)}
                                        style={styles.searchInput}
                                        placeholder="Room Image Caption  (min 3 characters)"
                                        placeholderTextColor="#9f9fa1"
                                    />
                                    {captionText?.length >= 3 &&
                                        <TouchableOpacity
                                            style={{ marginRight: '3%' }}
                                            onPress={handleSavCaption}
                                        >
                                            <QuestionTickIcon />
                                        </TouchableOpacity>}

                                    <TouchableOpacity onPress={() => {
                                        setCaptionText('');
                                        setShowRoomInputBox(false)
                                    }}>
                                        <QuestionCrossIcon />
                                    </TouchableOpacity>

                                </View>
                                    :
                                    <View style={styles.textEditContainer}>
                                        <TouchableOpacity onPress={() => { setShowRoomInputBox(true) }}>
                                            <EditTextIcon height={23} width={23} />
                                        </TouchableOpacity>

                                        <Text style={styles.caption}>{selectedImage?.caption}</Text>
                                    </View>
                                }

                            </View>

                        </View>

                        <View style={{ alignItems: 'center', marginBottom: '7%', marginHorizontal: '2%' }}>

                            <FlatList
                                data={roomImArr}
                                horizontal
                                nestedScrollEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => handleImagePress(item?.caption, index)}>
                                        <Image
                                            source={{ uri: item?.url }}
                                            style={[
                                                styles.thumbnail,
                                                index === selectedImageIndex && styles.selectedThumbnail
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.thumbnailContainer}
                            />

                        </View>

                    </ScrollView>

                </View>}
        </Modal>
    );
};

export default memo(ImagePreviewComp);
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    modalParentContainer: {
        backgroundColor: '#000',
        flex: 1,
        paddingLeft: 0,
    },
    headerContainer: {
        padding: '3%',
        marginTop: '1%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold'
    },
    imagePreviewContainer: {
        height: width * 0.75,
        width: width,
    },
    selectedImage: {
        height: '100%',
        width: '100%'
    },
    textEditContainer: {
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    caption: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    thumbnailContainer: {
        paddingBottom: 10,
    },
    thumbnail: {
        width: 90,
        height: 90,
        marginHorizontal: 3,
        borderRadius: 3,
    },
    selectedThumbnail: {
        borderColor: '#007BFF',
        borderWidth: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderWidth: 2,
        borderColor: '#fff',
        marginHorizontal: '2%',
        paddingHorizontal: '3%',
        borderRadius: 8,
        marginVertical: '5%',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingLeft: 0,
        paddingRight: 8,
        padding: 5,
        color: '#fff',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
});
