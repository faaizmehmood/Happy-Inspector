import { SafeAreaView, ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, FlatList, Dimensions, Animated, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import CustomHeader from '../../components/CustomHeader'
import { useLoader } from '../../lib/loaderContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiUrl } from '../../constants/api_Url';
import axios from 'axios';
import { userContext } from '../../lib/userContext';
import * as SecureStore from "expo-secure-store";
import { StoreUserRole } from '../../store';
import { useEffect } from 'react';
import CustomizeHeader from '../profileAndPersonalDetails/components/CustomizeHeader';
let goBack = false;

const PaymentPlanScreen = () => {
    const { setLoading } = useLoader();
    const navigation = useNavigation();
    const { userData, setUserData } = userContext();
    const { setRole } = StoreUserRole();

    useEffect(()=>{
        getUserSignatureData()
    },[])
    const route = useRoute();
    goBack = route?.params?.goBack;

    const [isYearly, setIsYearly] = useState(false);
    const yearMonthlySwitchRef = useRef(new Animated.Value(0)).current;

    const toggleStartInspectionSwitch = () => {
        const newValue = !isYearly;
        setIsYearly(newValue);

        // Animate thumb position based on toggle state
        Animated.timing(yearMonthlySwitchRef, {
            toValue: newValue ? 1 : 0, // Move thumb right (1) if enabled, left (0) if disabled
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const thumbLeftSwitchPosition = yearMonthlySwitchRef.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 16],
    });


      const getUserSignatureData = async () => {
        try {
          setLoading(true)
          const response = await fetch(`${apiUrl}/api/user/getPricingTiers`, {
            method: 'GET',
            credentials: 'include', // This is equivalent to withCredentials: true
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          // if (!response.ok) {
          //   throw new Error(`HTTP error! status: ${response.status}`);
          // }
    
          const data = await response.json();
          setLoading(false)
        //   console.log('data----------->',data);
          
    
        //   if (response.status === 200) {
        //     setLoading(false)
    
        //   }
        } catch (error) {
          setLoading(false)
    
          console.log('error in showingPropertyData', error);
        }
      };

    const plans = [
        {
            id: '1',
            name: 'Free Tier',
            label: 'FREETIER',
            price: 0,
            yearlyFeatures: [
                '10 Inspection Limit',
                '10 Property Limit',
                'Default Templates',
                '10 Custom Template',
            ],
            features: [
                '1 Inspection Limit',
                '1 Property Limit',
                'Default Templates',
                '1 Custom Template',
            ],
            buttonText: 'Get Started',
        },
        {
            id: '2',
            name: 'Business Plan',
            label: 'STANDARDTIER',
            price: 7,
            yearlyFeatures: [
                '19 Inspection + 10 PDF Export',
                'Unlimited Properties',
                '30 Custom Templates',
                'Default Templates',
            ],
            features: [
                '10 Inspection + 10 PDF Export',
                'Unlimited Properties',
                '3 Custom Templates',
                'Default Templates',
            ],
            buttonText: 'Upgrade Plan',
            isPrimary: true,
        },
        {
            id: '3',
            name: 'Enterprise Plan',
            label: 'TOPTIER',
            price: 12,
            yearlyFeatures: [
                'Unlimited Inspections',
                'Unlimited PDF Exports',
                'Unlimited Properties',
                'Unlimited Custom Templates',
                'Sub Users',
                'Support',
            ],
            features: [
                '12 Inspections',
                '22 PDF Exports',
                '32 Properties',
                '12 Custom Templates',
                'Sub Users',
                'Support',
            ],
            buttonText: 'Upgrade Plan',
            // isPrimary: true,
        },
    ];


    const updateDataInSecureStorage = async (role) => {
        const updatedUserData = {
            ...userData,
            role,
        };
        try {
            await SecureStore.setItemAsync(
                "userData",
                JSON.stringify(updatedUserData)
            );
            setUserData(updatedUserData);

            if (goBack) {
                navigation.goBack();
            } else {
                navigation.navigate("BottomTab");
            }

        } catch (e) {
            console.log("Error saving data", e);
        }
    };
    const selectRoleUpgrade =async(role)=>{
        if (role =='FREETIER') {
        await updateDataInSecureStorage(role)
        }
        else{
            navigation.navigate('PaymentMethod')

        }
        
    }

    const changUserPlan = async (plan) => {
        setLoading(true)
        try {
            const response = await axios.patch(`${apiUrl}/api/user/changeRole`, { role: plan, deviceType: "mobile" }, { withCredentials: true })
            if (response?.status === 200 || response?.status === 201) {
                // console.log('response', response?.data?.userDetails?.role)
                setRole(response?.data?.userDetails?.role);
                await updateDataInSecureStorage(response?.data?.userDetails?.role);
            }
        } catch (error) {
            if (error?.response) {
                const errorMessage = error?.response.data
                console.log("Backend Error Message in gettingPropertyCategories:", errorMessage);
                setLoading(false)
                Alert.alert('Error', errorMessage?.message);
            } else {
                console.log('error in fetching changUserPlan:', error)
            }
        } finally {
            setLoading(false)
        }
    }

    const renderPlanCard = ({ item }) => {
        return (
            <View style={[styles.card, item.isPrimary && styles.primaryCard, { width: width * 0.80, marginHorizontal: width * 0.02, }]}>
                <Text style={[styles.cardTitle, item.isPrimary && styles.primaryText]}>
                    {item.name}
                </Text>
                <Text style={[styles.price, item.isPrimary && styles.primaryText]}>
                    ${item.price}
                    <Text style={[styles.perMonth, item.isPrimary && styles.primaryText]}>
                        {' '}/ {isYearly ? 'year' : 'month'}
                    </Text>
                </Text>
                <View style={styles.featureContainer}>
                    {isYearly ?
                        item?.yearlyFeatures?.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <Entypo name="check" size={19} color={item.isPrimary ? '#ffff' : "#3b82f6"} style={{ marginRight: '5%' }} />
                                <Text style={[styles.feature, item.isPrimary && styles.primaryText]}>
                                    {feature}
                                </Text>
                            </View>
                        ))

                        :
                        item?.features?.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <Entypo name="check" size={19} color={item.isPrimary ? '#ffff' : "#3b82f6"} style={{ marginRight: '5%' }} />
                                <Text style={[styles.feature, item.isPrimary && styles.primaryText]}>
                                    {feature}
                                </Text>
                            </View>
                        ))
                    }
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={[styles.button, item.isPrimary ? styles.primaryButton : styles.secondaryButton]}
                        // onPress={() => changUserPlan(item?.label)}
                        onPress={() => selectRoleUpgrade(item?.label)
                             }
                    >
                        <Text style={[styles.buttonText, item.isPrimary ? styles.primaryButtonText : styles.secondaryButtonText]}>
                            {item.buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: '#ffff' }]}>
            {/* <CustomHeader goBack={true} /> */}
            <CustomizeHeader  title={'Subscription'}
            goBack={true} />

            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.scrollViewContainer}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Selected a plan to get Started</Text>
                    <Text style={styles.subtitle}>
                        30 days free trial. No contract or credit card required.
                    </Text>

                    <View style={styles.toggleContainer}>
                        <Text style={[styles.toggleText, !isYearly && styles.activeToggleText]}>
                            Monthly
                        </Text>

                        <TouchableOpacity onPress={toggleStartInspectionSwitch} >
                            <View style={styles.track}  >
                                <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbLeftSwitchPosition }] },]} />
                            </View>
                        </TouchableOpacity>

                        <Text style={[styles.toggleText, isYearly && styles.activeToggleText]}>
                            Yearly
                        </Text>
                    </View>

                    <FlatList
                        data={plans}
                        renderItem={renderPlanCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.flatListContent}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PaymentPlanScreen

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FDFDFD",
        paddingHorizontal:'5%'
    },
    scrollViewContainer: {
        flex: 1,
    },
    content: {
        padding: 16,
        flex: 1,
        paddingBottom: 0,
    },
    title: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6b7280',
        marginBottom: 5,
        textAlign: 'center',
    },
    toggleContainer: {
        marginVertical: '3%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginHorizontal: 10,
        color: '#1C1C1C',
    },
    activeToggleText: {
        color: '#3b82f6',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    flatListContent: {
        flexGrow: 1,
        paddingVertical: '4%',
        paddingHorizontal: '2%',
        paddingBottom: '10%',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    primaryCard: {
        backgroundColor: '#3b82f6',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 10,
        color: '#000',
    },
    primaryText: {
        color: '#ffffff',
    },
    price: {
        fontSize: 32,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 20,
        color: '#000',
    },
    perMonth: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#656565',
    },
    featureContainer: {
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    checkmark: {
        fontSize: 16,
        color: '#3b82f6',
        marginRight: 8,
    },
    feature: {
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#656565',
        flex: 1,
    },
    button: {
        borderRadius: 8,
        padding: 15,
        paddingVertical: 13,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#ffffff',
    },
    secondaryButton: {
        backgroundColor: '#3b82f6',
    },
    buttonText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    primaryButtonText: {
        color: '#3b82f6',
    },
    secondaryButtonText: {
        color: '#ffffff',
    },
    track: {
        width: 40,
        backgroundColor: '#007BFF',
        height: 23,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 3,
    },
    thumb: {
        width: 16,
        height: 16,
        borderRadius: 13,
        backgroundColor: '#fff',
    },
});