import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomizeHeader from '../profileAndPersonalDetails/components/CustomizeHeader'
import MasterCardIcon from '../../../assets/images/paymentMethod/Mastercard.svg'
import GooglePayIcon from '../../../assets/images/paymentMethod/GooglePay.svg'
import ApplePayIcon from '../../../assets/images/paymentMethod/ApplePay.svg'
import VisaIcon from '../../../assets/images/paymentMethod/visa.svg'
import Feather from '@expo/vector-icons/Feather';

import { style } from '../properties/PropertyStyle'
import { useNavigation } from '@react-navigation/native'

const PaymentMethod = () => {
        const navigation = useNavigation();
    
    const paymentMethodData=[
        {
            key:1,
            value:'master',
            icon:<MasterCardIcon/>

        },
        {
            key:2,
            value:'apple',
            icon:<ApplePayIcon/>

        },
        {
            key:3,
            value:'google',
            icon:<GooglePayIcon/>

        },
    ]
    const paymentSavaCardData=[
        {
            key:1,
            value:'visa',
            account:'31434312312312********',
            icon:<VisaIcon/>

        },
        {
            key:2,
            value:'master',
            account:'44554312312312********',
            icon:<MasterCardIcon/>

        },
       
      
    ]
    const [selectPaymentMethod, setSelectPaymentMethod] = useState('')
    const [saveSelectPaymentMethod, setSaveSelectPaymentMethod] = useState('')

    const onPressSelectPayment = (value) => {
        setSelectPaymentMethod(value)

    }
    const onPressSaveSelectPayment = (value) => {
        setSaveSelectPaymentMethod(value)

    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <CustomizeHeader
                title={'Payment Method'}
                goBack={true} />

            <View style={styles.cardMainContainer}>
                {paymentMethodData?.map((item,index)=>{
                    return(
                        <TouchableOpacity
                        key={item?.key}
                    onPress={() => onPressSelectPayment(item?.value)}
                    style={[styles.cardContainer, {
                        borderColor: selectPaymentMethod == item?.value? 'rgba(42, 133, 255, 1)' : 'rgba(204, 226, 255, 1)'
                    }]}>
                    {item?.icon}
                </TouchableOpacity>
                    )
                })
                }
            </View>

                <Text style={styles.titleText}>Credit / Debit Card</Text>

                <View style={styles.saveCardMainContainer}>
                {paymentSavaCardData?.map((item,index)=>{
                    return(
                        <TouchableOpacity
                        key={item?.key}
                    onPress={() => onPressSaveSelectPayment(item?.value)}
                    style={[styles.saveCardContainer, {
                        borderColor: saveSelectPaymentMethod == item?.value? 'rgba(42, 133, 255, 1)' : 'rgba(204, 226, 255, 1)'
                    }]}>
                    {item?.icon}
                    <Text style={styles.accountNumber}>{item?.account}</Text>
                </TouchableOpacity>
                    )
                })
                }


            </View>
            <TouchableOpacity style={[styles.transparentButton
                    ]}

                        onPress={() => navigation.navigate('AddNewCard')}
                    >
                        <Feather name="plus" size={22} color="#007BFF" style={styles.plusIcon} />
                        <Text style={styles.saveButtonText}>Add New Card</Text>
                    </TouchableOpacity>
        </SafeAreaView>
    )
}

export default PaymentMethod

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FDFDFD",
        paddingHorizontal: '5%',
    },
    cardMainContainer: {
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cardContainer: {
        borderWidth: 1,
        width: '30%',
        height: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    saveCardContainer: {
        borderWidth: 1,
        width: '100%',
        height: 70,
        borderRadius: 10,
        paddingHorizontal:25,
        marginBottom:'5%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row'

    },
    titleText:{
        paddingVertical:'8%',
        color:'#000',
        fontWeight:'500',
        fontSize:16

    },
    saveCardMainContainer:{

    },
    accountNumber:{
        color:'lightgrey'
    },
    transparentButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        alignSelf: 'center',
        paddingBottom: '4%',
        width: '40%'
    },
    saveButtonText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
})