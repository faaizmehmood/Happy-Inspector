import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import DefaultProfile from  '../../../../assets/images/dashboardIcon/default-profile.svg'
import { Ionicons } from '@expo/vector-icons';

const SignatureRequestItem = ({ item,index,userSignatureData,width }) =>{
    const date = new Date(item.inspectionDate);
    
    // Format options
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    
    return(
      <TouchableOpacity style={[styles.itemContainer, 
      {borderBottomWidth:userSignatureData?.length -1 ==index ? 0:2,width:width}]}>
        <View style={styles.leftContent}>
        { item.profileURL ? 
         <Image
            source={{ uri: item.profileURL }}
            style={styles.avatarBySignature}
          />:
          <View style={{ marginRight: 8}}>
          <DefaultProfile/>
        </View>}
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.collaboratorName}</Text>
            {/* <Text style={styles.propertyId}>Property ID: {propertyId}</Text> */}
            <View style={styles.dateSignatureContainer}>
            <Text style={styles.dateSignature}>{formattedDate}</Text>
            <Ionicons style={{marginTop:3}}
               name="chevron-forward" size={15} color="#000" /> 
          </View>
          </View>
         
          
        </View>
      
        {/* <Ionicons style={{marginTop:3}}
               name="chevron-forward" size={15} color="#000" /> */}
        {/* <ChevronRight color="#666" size={20} /> */}
      </TouchableOpacity>
    )
  
  } ;

export default SignatureRequestItem

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 24,
        // borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        // backgroundColor:'red',
        
        
      },
      leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      avatarBySignature: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
      },
      textContainer: {
        justifyContent: 'center',
        marginLeft: 8,
      },
      name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
      },
      propertyId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
      },
      dateSignature: {
        fontSize: 14,
        color: '#666',
      },
      dateSignatureContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:'88.5%',
        justifyContent:'space-between',
      },
})