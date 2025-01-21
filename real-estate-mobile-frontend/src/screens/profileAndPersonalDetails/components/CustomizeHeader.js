import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, TextInput } from "react-native";
import ChevronBack from "../../../../assets/images/icons/chevron-back.svg";
import { useNavigation } from "@react-navigation/native";
import EditIcon from '../../../../assets/images/icons/editIcon.svg'

function CustomizeHeader({ title, goBack, style,editIcon,onPressEditButton  }) {
    const navigation = useNavigation();
    const [loading,setLoading]=useState(false)
    const onPress =()=>{
         navigation.goBack()
    }
    return (
        <SafeAreaView>
            <View style={[styles.headerContainer, style,]}>
                {goBack && (
                    <TouchableOpacity
                     onPress={onPress}>
                        <ChevronBack width={24} height={24} />
                    </TouchableOpacity>
                )}

                { title && <View style={[styles.textContainer]}>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View> }
                   
{editIcon &&
<TouchableOpacity onPress={onPressEditButton}>
    <EditIcon/>
    </TouchableOpacity>
}

                

            </View>
        </SafeAreaView>
    );
}

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: '4%',
        paddingBottom: '1.5%',
        flexDirection: "row",
        alignItems: "center",
        // marginLeft: '5%',
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },
    textContainer: {
        flex: 1,
        paddingRight: '6%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 18,
        color: "#000929",
        textAlign: "center",
    },
});

export default memo(CustomizeHeader);
