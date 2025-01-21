import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { lazy, memo, useCallback, Suspense, useState } from "react";
import { image } from "../../../constants/images";
import MyTeamsDeleteIcon from '../../../../assets/images/icons/MyTeamsDeleteIcon.svg'
import { useNavigation } from "@react-navigation/native";
import { useLoader } from "../../../lib/loaderContext";
import axios from "axios";
import { apiUrl } from "../../../constants/api_Url";

const DeleteModalComp = lazy(() => import("../../../components/DeleteModalComp"))

const MemberCardComp = ({ index, data, deleteSubUserByID, userPropertyAllCategory }) => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    let memberDetail = {
        _id: data?._id,
        name: data?.userName,
    }

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
    }, [isModalVisible])

    const handleModalConfirm = useCallback(async (modelData) => {
        await deleteSubUserByID(modelData)
        handleModalClose()
    }, [isModalVisible])

    return (
        <View style={[styles.cardContainer, { marginTop: index == 0 ? '1.5%' : "5%" }]}>

            <View style={styles.detailContainer}>
                <View style={styles.detailTitleRow}>
                    <View style={{ width: "65%" }}>
                        <Text style={styles.cardHeaderText} numberOfLines={2}>
                            {data?.userName || ""}
                        </Text>
                    </View>
                    <View style={styles.titleIconStack}>

                        <TouchableOpacity style={styles.viewDetailsButton} onPress={() => { navigation.navigate("TeamsMemberDetail", { titleName: 'Members Details', id: data?._id, userPropertyCategory: userPropertyAllCategory }) }}>
                            <Text style={styles.viewDetailsButtonText}>View Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                            <MyTeamsDeleteIcon />
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.parentCategoryTextContainer}>

                    <View style={styles.categoriesButtonContainer}>
                        <Text style={styles.categoriesButtonText}>{data?.categoriesAssigned?.length || 0} Categories</Text>
                    </View>

                    <View >
                        <Text style={styles.dateText}>Last Online on</Text>
                        <Text style={styles.dateText}>{data?.lastOnline}</Text>
                    </View>

                </View>

            </View>

            <Suspense>
                {isModalVisible && <DeleteModalComp visible={isModalVisible} onClose={handleModalClose} onConfirm={handleModalConfirm} memberDetail={memberDetail} title={'Confirmation'} />}
            </Suspense>

        </View >
    );
};

export default memo(MemberCardComp);

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        overflow: "hidden",
        marginTop: "5%",
        marginHorizontal: "3.5%",
        paddingTop: '1%',
        paddingBottom: "2%",
        elevation: 5,
        borderRadius: 8,
        flexDirection: "row",
    },
    cardHeaderText: {
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#000929",
    },
    detailContainer: {
        flex: 1,
        marginTop: "2%",
        marginLeft: "5%",
        marginRight: "4%",
    },
    completedButton: {
        backgroundColor: "#E1EEFF",
        width: "30%",
        paddingTop: 5,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    viewDetailsButtonText: {
        fontSize: 12,
        fontFamily: "PlusJakartaSans_600SemiBold",
        color: "#000929",
    },
    parentCategoryTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '4%',
        alignItems: 'center'
    },
    categoriesButtonContainer: {
        backgroundColor: '#E1EEFF',
        padding: '2%',
        paddingHorizontal: '3.5%',
        borderRadius: 8
    },
    categoriesButtonText: {
        fontFamily: "PlusJakartaSans_700Bold",
        color: '#007BFF',
        fontSize: 12
    },
    dateText: {
        fontSize: 12,
        fontFamily: "PlusJakartaSans_500Medium",
        color: "#6C727F",
    },
    detailTitleRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "space-between",
    },
    titleIconStack: {
        flexDirection: "row",
        width: "36%",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    viewDetailsButton: {
        borderRadius: 8,
        padding: 5,
        paddingVertical: 5,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    completedButtonText: {
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#007BFF",
    },
});

