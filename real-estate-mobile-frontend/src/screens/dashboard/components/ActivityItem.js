import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import NotificationIcon from  '../../../../assets/images/dashboardIcon/notificationIcon'

const ActivityItem = ({getUserActivityDataFilter,activity,index}) => {
    const formatActivityDate =(activityDate) => {
        const day = Intl.DateTimeFormat("en-US", {
          weekday: "long", // Full name of the day (e.g., Thursday)
        }).format(new Date(activityDate));
        
        const time = Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(activityDate));
        
        // Add a comma after the day
        return `${day}, ${time}`;
      }
       const renderIcon = (type, avatar) => {
          // if (type === 'user' && avatar) {
          //   return (
          //     <Image
          //       source={{ uri: avatar }}
          //       style={styles.avatar}
          //     />
          //   );
          // }
          return (
            <View style={{ marginRight: 8}}>
               <NotificationIcon/>
           {/* <DefaultProfile/> */}
            </View>
          );
        };
    
  return (
    <TouchableOpacity
    style={[styles.activityItem,
    {borderBottomWidth:getUserActivityDataFilter?.length -1 ==index ? 0:2,}]}>
      {/* {renderIcon(activity.type, activity.avatar)} */}
      {renderIcon()}
      <View style={styles.activityContent}>
        {/* <Text style={styles.activityText}> */}
          {activity.activity && (
            <Text style={styles.userName}>{activity.activity} </Text>
          )}
          {/* {activity.message}
          <Text style={styles.highlightText}>{activity.highlight}</Text>
        </Text> */}
        <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between'}}>
        <Text style={styles.timeText}>{formatActivityDate(activity.date)}</Text>
        <Ionicons style={{marginTop:2}}
     name="chevron-forward" size={15} color="#000" />
        </View>
      </View>
      

      {/* <Text style={styles.chevron}>›</Text> */}
    </TouchableOpacity>
  )
}

export default ActivityItem

const styles = StyleSheet.create({
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: '#F0F0F0',
      },
      activityContent: {
        flex: 1,
        marginLeft: 12,
      },
      userName: {
        fontWeight: '500',
        lineHeight: 22,
        width:'90%',
      },
      timeText: {
        color: '#666',
        marginTop: 4,
        fontSize: 14,
      },
})