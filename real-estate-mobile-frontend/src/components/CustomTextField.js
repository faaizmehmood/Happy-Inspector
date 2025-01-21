import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const CustomTextField = ({width,value,onChangeValue,labelName}) => {
  return (
    <View style={[styles.mainContainer,{width:width}]}>
      <Text style={styles.labelText}>{labelName}</Text>
      <TextInput
      value={value}
      onChange={onChangeValue}
      style={styles.textFieldContainer}
      />
    </View>
  )
}

export default CustomTextField

const styles = StyleSheet.create({
    mainContainer:{
        marginTop:'5%'

    },
    labelText:{
        color:'#000',
        fontWeight:'400',
        fontSize:16
    },
    textFieldContainer:{
        borderWidth:1,
        borderColor:'rgba(204, 226, 255, 1)',
        height:50,
        borderRadius:8,
         marginTop:'2%',
         paddingHorizontal:12,
         color:'#000'
    }
})