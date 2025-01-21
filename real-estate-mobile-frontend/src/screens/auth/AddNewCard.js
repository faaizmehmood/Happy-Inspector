import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import CustomizeHeader from '../profileAndPersonalDetails/components/CustomizeHeader'
import CustomTextField from '../../components/CustomTextField'

const AddNewCard = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <CustomizeHeader
                title={'Add new Card'}
                goBack={true} />

                <CustomTextField
                labelName={'Full Name'}
                width={'100%'}
                />
                <CustomTextField
                labelName={'Card Number'}
                width={'100%'}
                />
                <View style={styles.textFieldContainer}>
                <CustomTextField
                labelName={'Expiry Date'}
                width={'48%'}
                />
                 <CustomTextField
                labelName={'CVV'}
                width={'48%'}
                />

                </View>

        </SafeAreaView>
    )
}

export default AddNewCard

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FDFDFD",
        paddingHorizontal: '5%',
    },
    textFieldContainer:{
        flexDirection:'row',
        justifyContent:'space-between'
    }
})