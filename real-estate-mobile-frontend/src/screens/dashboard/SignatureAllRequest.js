import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';
import { useFocusEffect } from '@react-navigation/native';
import CustomizeHeader from '../profileAndPersonalDetails/components/CustomizeHeader';
import SignatureRequestItem from './components/SignatureRequestItem';

const SignatureAllRequest = () => {
    const { loading, setLoading } = useLoader();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('');
    const [totalPage, setTotalPage] = useState('');
    const [userSignatureData, setUserSignatureData] = useState('')
    useFocusEffect(
        useCallback(() => {
            getUserSignatureData(setLoading, 1)

            // return () => {
            //     // Cleanup if needed
            //     console.log('Screen unfocused');
            // };
        }, [])
    );

    const getUserSignatureData = async (set, page) => {
        try {
            set(true)
            const response = await fetch(`${apiUrl}/api/user/getCollaboratorPendingSignatureData?page=${page}`, {
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
            
            setTotalPage(data?.totalPages)
            setCurrentPage(data?.page)
            if (response.status === 200) {
                if (data?.page == 1) {
                    setUserSignatureData(data?.collaborators)
                    set(false)
                }
                else {
                    setUserSignatureData((prevData) => [...prevData, ...data?.collaborators])
                    set(false)
                }


            }
        } catch (error) {
            set(false)

            console.log('error in showingPropertyData', error);
        }
    };
    const renderItem = ({ item, index }) => {

        return (
            <View key={index}>
                <SignatureRequestItem
                    item={item}
                    index={index}
                    userSignatureData={userSignatureData}
                    width={'98%'}
                />
            </View>
        )
    }

    const handleLoadMore = () => {
        if (currentPage < totalPage && !isLoading) {
            const a = currentPage + 1;
            getUserSignatureData(setIsLoading, a);
            //   }
        }
    };


    return (
        <View style={styles.mainContainer}>
            <CustomizeHeader
                goBack
                title={'All Requests'}

            />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={userSignatureData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={handleLoadMore} // Trigger when close to end
                onEndReachedThreshold={1} // Load more when 50% from the end
                ListFooterComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
                    ) : null
                }

            />
        </View>
    )
}

export default SignatureAllRequest

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        gap: 6,
    }
})