import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import CustomizeHeader from '../profileAndPersonalDetails/components/CustomizeHeader'
import { useState } from 'react'
import { apiUrl } from '../../constants/api_Url'
import { useFocusEffect } from '@react-navigation/native'
import { useLoader } from '../../lib/loaderContext'
import ActivityItem from './components/ActivityItem'

const ActivityAllView = () => {
    const { setLoading } = useLoader();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('');
    const [totalPage, setTotalPage] = useState('');

    const [getUserActivityDataFilter, setGetUserActivityDataFilter] = useState('')
    const [selectedFilter, setSelectedFilter] = useState('recent');
    // const filters = ['Recent', 'Yesterday', 'Last Week', 'Last Month',];
    const filters = [
        {key:'Recent',value:'recent'},
        {key:'Yesterday',value:'yesterday'},
        {key:'Last Week',value:'lastweek'},
        {key:'Last Month',value:'lastmonth'}];

    useFocusEffect(
        useCallback(() => {
            getUserActivityFeed(setLoading, 1)
        }, [selectedFilter])
    );

    const selectActivityFilter = (filter) => {
        setSelectedFilter(filter)

        // if (filter === 'Recent') {
        //   setGetUserActivityDataFilter(getUserActivityData?.recentActivities)
        // }
        // else if (filter === 'Yesterday') {
        //   setGetUserActivityDataFilter(getUserActivityData?.yesterdayActivities)
        // }
        // else if (filter === 'Last Week') {
        //   setGetUserActivityDataFilter(getUserActivityData?.lastWeekActivities)
        // }
        // else if (filter === 'Last Month') {
        //   setGetUserActivityDataFilter(getUserActivityData?.lastMonthActivities)
        // }
    }


const limit =10;
    const getUserActivityFeed = async (set, page) => {
        try {
            set(true)
            const response = await fetch(`${apiUrl}/api/user/getActivityFeed?limit=${limit}&page=${page}&filter=${selectedFilter}`, {
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
            set(false)

            if (response.status === 200) {
                if (data?.page == 1) {
                    setGetUserActivityDataFilter(data?.activityFeed)
                    set(false)
                }
                else {
                    setGetUserActivityDataFilter((prevData) => [...prevData, ...data?.activityFeed])
                    set(false)
                }
            }
            // if (response.status === 200) {
            //   setGetUserActivityData(data)
            // set(false)

            // }
        } catch (error) {
            set(false)

            console.log('error in getUserActivityFeed', error);
        }
    };

    const renderItem = ({ item, index }) => {

        return (
            <View
                key={index}>
                <ActivityItem
                    getUserActivityDataFilter={getUserActivityDataFilter}
                    activity={item}
                    index={index}
                />
            </View>
        )
    }

    const handleLoadMore = () => {
        if (currentPage < totalPage && !isLoading) {
            const a = currentPage + 1;
            getUserActivityFeed(setIsLoading, a);
            //   }
        }
    };


    return (
        <View style={styles.mainContainer}>
            <CustomizeHeader
                goBack
                title={'Activity'}

            />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                {filters?.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => selectActivityFilter(filter?.value)}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter?.value && styles.filterButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter?.value && styles.filterTextActive,
                            ]}
                        >
                            {filter?.key}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.activityList}>
               {getUserActivityDataFilter?.length > 0 ? <FlatList
                    style={{ marginBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    data={getUserActivityDataFilter}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore} // Trigger when close to end
                    onEndReachedThreshold={0.5} // Load more when 50% from the end
                    ListFooterComponent={
                        isLoading ? (
                            <ActivityIndicator size="large" color="#007BFF" style={{ margin: 16 }} />
                        ) : null
                    }
                    windowSize={1000}

                />:
                 <View style={styles.noResultFound}>
                                <Text style={styles.noResultText}>No Activity Found</Text>
                              </View>}
            </View>
        </View>
    )
}

export default ActivityAllView

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        gap: 6,
    },
    filterContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 10,
        flex: 0.2,
    },
    filterButton: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    filterButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#0066FF',
    },
    filterText: {
        color: '#666',
    },
    filterTextActive: {
        color: '#0066FF',
        fontWeight: '500',
    },
    activityList: {
        flex: 15,
        marginTop: 15,
    },
    noResultFound: {
        alignItems: 'center', justifyContent: 'center',  flex:1
      },
      noResultText: {
        color: '#666',
        fontSize: 14
      }
})