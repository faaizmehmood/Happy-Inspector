import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeaderWithProfile from '../../components/CustomHeaderWithProfile';
import DashboardIconHome from '../../../assets/images/dashboardIcon/dashboardIconHome'
import DashboardProperty from '../../../assets/images/dashboardIcon/dashboardProperty'
import HomeIcon from '../../../assets/images/dashboardIcon/homeIcon'
import DocumentReportIcon from '../../../assets/images/dashboardIcon/documentReportIcon.svg'
import NotificationIcon from '../../../assets/images/dashboardIcon/notificationIcon'
import DefaultProfile from '../../../assets/images/dashboardIcon/default-profile.svg'
import ReportIcon from '../../../assets/images/dashboardIcon/reportIcon.svg'
import { FlatList } from 'react-native';
import { apiUrl } from '../../constants/api_Url';
import { useFocusEffect } from '@react-navigation/native';
import { useLoader } from '../../lib/loaderContext';
import { userContext } from '../../lib/userContext';
import SignatureRequestItem from './components/SignatureRequestItem';
import ActivityItem from './components/ActivityItem';


export default function Dashboard({ navigation }) {
  const { setLoading } = useLoader();
  const { userData } = userContext();
  const currentRole = userData?.role


  const [userInspectionAndPropertyData, setUserInspectionAndPropertyData] = useState('')
  const [userSignatureData, setUserSignatureData] = useState('')
  const [getUserActivityData, setGetUserActivityData] = useState('')
  const [getUserActivityDataFilter, setGetUserActivityDataFilter] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Recent');

  const filters = ['Recent', 'Yesterday', 'Last Week', 'Last Month',];


  useFocusEffect(
    useCallback(() => {
      // API call when the screen is focused
      getUserInspectionAndPropertyData()
      // getUserActivityFeed()
      getUserSignatureData()
      getUserAllActivityFeed()

      // return () => {
      //     // Cleanup if needed
      //     console.log('Screen unfocused');
      // };
    }, [])
  );


  const getUserInspectionAndPropertyData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/user/getUserInspectionAndPropertyData`, {
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

      // console.log('data', data);

      if (response.status === 200) {
        setUserInspectionAndPropertyData(data)
        setLoading(false)

      }
    } catch (error) {
      setLoading(false)

      console.log('error in showingPropertyData', error);
    }
  };

  const getUserSignatureData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/user/getCollaboratorPendingSignatureData`, {
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

      if (response.status === 200) {
        setUserSignatureData(data)
        setLoading(false)

      }
    } catch (error) {
      setLoading(false)

      console.log('error in showingPropertyData', error);
    }
  };


  //   const getUserActivityFeed = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await fetch(`${apiUrl}/api/user/getActivityFeed`, {
  //       method: 'GET',
  //       credentials: 'include', // This is equivalent to withCredentials: true
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     // if (!response.ok) {
  //     //   throw new Error(`HTTP error! status: ${response.status}`);
  //     // }

  //     const data = await response.json();
  //     console.log('data------>', response);

  //     // if (response.status === 200) {
  //     //   setGetUserActivityData(data)
  //     // setLoading(false)

  //     // }
  //   } catch (error) {
  //     setLoading(false)

  //     console.log('error in getUserActivityFeed', error);
  //   }
  // };

  const getUserAllActivityFeed = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/user/getAllActivityFeed`, {
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
      console.log('data------------9999999------>', data);
      setGetUserActivityData(data)
      setGetUserActivityDataFilter(data?.recentActivities)
      setSelectedFilter('Recent')

      // if (response.status === 200) {
      //   setGetUserActivityData(data)
      // setLoading(false)

      // }
    } catch (error) {
      setLoading(false)

      console.log('error in getUserActivityFeed', error);
    }
  };



  const selectActivityFilter = (filter) => {
    setSelectedFilter(filter)
    if (filter === 'Recent') {
      setGetUserActivityDataFilter(getUserActivityData?.recentActivities)
    }
    else if (filter === 'Yesterday') {
      setGetUserActivityDataFilter(getUserActivityData?.yesterdayActivities)
    }
    else if (filter === 'Last Week') {
      setGetUserActivityDataFilter(getUserActivityData?.lastWeekActivities)
    }
    else if (filter === 'Last Month') {
      setGetUserActivityDataFilter(getUserActivityData?.lastMonthActivities)
    }
  }





  return (
    <View style={styles.container}>
      <CustomHeaderWithProfile title={"Dashboard"}
      />
      <ScrollView showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.dateRange}>Show overview from Nov 2023 - Dec 2024</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: 150, }}>
            <Text style={styles.link}>View Inspections</Text>
            <Ionicons style={{ marginTop: 3 }}
              name="chevron-forward" size={15} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <DashboardIconHome />
            {/* <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="home" size={24} color="#000" />
            </View> */}
            <Text style={[styles.statsLabel, { color: '#000', marginTop: 10 }]}>Inspections done</Text>

            <Text style={[styles.statsNumber, { marginTop: 10 }]}>{userInspectionAndPropertyData?.totalCompletedInspectionCount}</Text>
            <View style={styles.divider} />
            <View style={styles.availableTextContainer}>
              <HomeIcon />
              <Text style={[styles.availableText, {
                marginLeft: 8
              }]}>{currentRole == 'TOPTIER' || currentRole == 'SUBUSER' ? 'Unlimited' : userInspectionAndPropertyData?.remainingInspectionCount} Available</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <ReportIcon />

            <Text style={styles.statsTitle}>Reports Generated</Text>
            <Text style={[styles.statsNumber, { marginTop: 10 }]}>{userInspectionAndPropertyData?.pdfsGeneratedAlltime}</Text>
            <View style={styles.divider} />

            <View style={styles.availableTextContainer}>
              <DocumentReportIcon />
              <Text style={[styles.availableText, {
                marginLeft: 8
              }]}>{userInspectionAndPropertyData?.pdfsGeneratedThisMonth} This month</Text>
            </View>
            {/* <Text style={[styles.statsNumber,{marginTop:10}]}>{userInspectionAndPropertyData?.pdfsGeneratedThisMonth}</Text> */}
            {/* <Text style={styles.statsLabel}>This month</Text>
            <View style={styles.divider}/>
            <Text style={styles.previousMonth}>{userInspectionAndPropertyData?.pdfsGeneratedAlltime}</Text>
            <Text style={styles.statsLabel}>Total Reports</Text> */}
          </View>
        </View>

        {/* Properties Section */}
        <View style={styles.propertiesCard}>
          <View style={styles.propertiesHeader}>
            <DashboardProperty />
            {/* <View style={styles.propertyIcon}>
              <MaterialCommunityIcons name="home-city" size={24} color="#4080FF" />
            </View> */}
            <View style={styles.propertyCountContainer}>
              <Text style={styles.propertyCount}>{userInspectionAndPropertyData?.totalPropertyCount}</Text>
              <Text>Total Properties</Text>
            </View>
            {/* <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#000" />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Properties')}
            style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all properties</Text>
            <Ionicons style={{ marginTop: 2 }}
              name="chevron-forward" size={16} color="#007AFF" />

          </TouchableOpacity>
          <View style={styles.propertiesContainer}>
            <View style={styles.propertyStats}>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{userInspectionAndPropertyData?.propertiesAddedByYou}</Text>
                <Text style={styles.statLabel}>Added by you</Text>
              </View>
              <View style={styles.verticalLine} />
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{userInspectionAndPropertyData?.propertiesAssigned}</Text>
                <Text style={styles.statLabel}>Assigned to you</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.activityContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Activity</Text>
            <View style={styles.viewAllMainContainer}>
            <Text style={styles.date}> {new Date()?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('ActivityAllView')}
            style={styles.viewAllActivityContainer}>
              <Text style={styles.viewAllActivity}>View all Activity</Text>
            </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {filters?.map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectActivityFilter(filter)}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.activityList}>
            {getUserActivityDataFilter?.length > 0 ?
              getUserActivityDataFilter && getUserActivityDataFilter?.map((activity, index) => (
                <View key={index}>
                  <ActivityItem
                    getUserActivityDataFilter={getUserActivityDataFilter}
                    activity={activity}
                    index={index}
                  />
                </View>
                // <TouchableOpacity key={index} 
                // style={[styles.activityItem,
                // {borderBottomWidth:getUserActivityDataFilter?.length -1 ==index ? 0:2,}]}>
                //   {/* {renderIcon(activity.type, activity.avatar)} */}
                //   {renderIcon()}
                //   <View style={styles.activityContent}>
                //     {/* <Text style={styles.activityText}> */}
                //       {activity.activity && (
                //         <Text style={styles.userName}>{activity.activity} </Text>
                //       )}
                //       {/* {activity.message}
                //       <Text style={styles.highlightText}>{activity.highlight}</Text>
                //     </Text> */}
                //     <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between'}}>
                //     <Text style={styles.timeText}>{formatActivityDate(activity.date)}</Text>
                //     <Ionicons style={{marginTop:2}}
                //  name="chevron-forward" size={15} color="#000" />
                //     </View>
                //   </View>


                //   {/* <Text style={styles.chevron}>›</Text> */}
                // </TouchableOpacity>
              )) :
              <View style={styles.noResultFound}>
                <Text style={styles.noResultText}>No Activity Found</Text>
              </View>
            }
          </View>
        </View>


        {/* Signature Section */}

        <View style={styles.SignatureContainer}>
          <View style={styles.headerSignature}>
            <Text style={styles.title}>Signature Requested from</Text>
            {userSignatureData?.collaborators?.length > 0 ?
             <TouchableOpacity onPress={()=>navigation.navigate('SignatureAllRequest')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity> : ''}
          </View>
          {userSignatureData?.collaborators?.length > 0 ?
            userSignatureData?.collaborators?.slice(0, 4)?.map((item, index) => (
              <View key={index}>
                <SignatureRequestItem
                width={'100%'}
                item={item}
                  // name={item.collaboratorName}
                  // propertyId={item.propertyId}
                  // dates={item.inspectionDate}
                  // avatar={item.profileURL}
                  // inspectionName={item.inspectionName}
                  index={index}
                  userSignatureData={userSignatureData?.collaborators?.slice(0, 4)}
                />
              </View>
            )) :
            <View style={styles.noResultFound}>
              <Text style={styles.noResultText}>No Signature Requested</Text>
            </View>
          }
        </View>


      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  frButton: {
    backgroundColor: '#4080FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  frButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateRange: {
    color: '#666',
    marginBottom: 4,
  },
  link: {
    color: '#4080FF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    // elevation: 2,
    borderWidth: 1.2,
    borderColor: 'rgba(236, 236, 236, 1)'
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000'
  },
  statsLabel: {
    color: '#000',
    fontSize: 12,
  },
  availableText: {
    color: '#000',
    fontSize: 12,
    marginTop: 8,
  },
  previousMonth: {
    fontSize: 20,
    fontWeight: '600',
  },
  propertiesCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    // elevation: 2,
    borderWidth: 1.2,
    borderColor: 'rgba(236, 236, 236, 1)'
  },
  propertiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  propertyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  propertyCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  moreButton: {
    marginLeft: 'auto',
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#F3F8FF',
    padding: 16,
    // borderRadius: 12,
    // marginTop:10
  },
  statColumn: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },




  availableTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    borderWidth: 0.2,
    borderColor: '#00000010',
    marginTop: 15,
    marginBottom: 10
  },
  propertyCountContainer: {
    marginLeft: 10
  },
  seeAllButton: {
    // padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    width: '42%'

  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  verticalLine: {
    width: 2, // Thin width for the line
    height: '100%', // Adjust height as needed
    backgroundColor: 'rgba(204, 226, 255, 1)', // Color of the line
    marginHorizontal: 10, // Optional: space around the line
  },
  propertiesContainer: {
    backgroundColor: '#F3F8FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 10
  },

  header: {
    // padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // justifyContent: 'space-between',
    paddingVertical: 16,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    // marginTop: 4,
    marginLeft: 16,

  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 10,
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
    flex: 1,
    marginTop: 15,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },




  timeText: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    color: '#666',
    marginLeft: 8,
  },
  activityContainer: {
    padding: 16,
    borderRadius: 12,
    // elevation: 2,
    borderWidth: 1.2,
    borderColor: 'rgba(236, 236, 236, 1)',
    marginHorizontal: 15,


  },
  SignatureContainer: {
    padding: 16,
    borderRadius: 12,
    // elevation: 2,
    borderWidth: 1.2,
    borderColor: 'rgba(236, 236, 236, 1)',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20
    // flex: 1,
    // backgroundColor: '#fff',
    // paddingHorizontal: 16,
  },

  headerSignature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  viewAll: {
    fontSize: 14,
    color: '#007AFF',
  },

  viewAllActivityContainer: {
    borderWidth: 0.3,
    borderColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  viewAllActivity: {
    fontSize: 12,
    color: 'rgba(0, 9, 41, 1)',
  },

  statsTitle: {
    marginTop: 10
  },
  noResultFound: {
    alignItems: 'center', justifyContent: 'center', marginTop: 20, width: '100%', height: 100
  },
  noResultText: {
    color: '#666',
    fontSize: 14
  },
  viewAllMainContainer:{
    flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:1,
  }
});
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Dashboard = () => {
//   return (
//     <View>
//       <Text>Dashboard</Text>
//     </View>
//   )
// }

// export default Dashboard

// const styles = StyleSheet.create({})