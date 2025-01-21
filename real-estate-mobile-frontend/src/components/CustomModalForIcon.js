import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Image } from "react-native";
import React, { useEffect, useState } from 'react'
import { IconsArr } from "../constants/questionIcons";
import { CrossIcon } from "../svg/MyTeamsSvg";

const CustomModalForIcon = ({ visible, onClose, handleSave }) => {
  const numColumns = IconsArr?.length < 6 ? IconsArr?.length : 6;
  const screenWidth = Dimensions.get('window').width;
  const [selectedIcon, setSelectedIcon] = useState(null);


  const renderItem = ({ item }) => {
    const isSelected = item?.iconId === selectedIcon?.iconId;
    let Icon = item?.icon

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIcon(isSelected ? null : item)
        }}
        style={[
          styles.iconContainer,
          isSelected ? styles.selectedIconStyle : { paddingHorizontal: 5, paddingVertical: 3 },
          { width: screenWidth / numColumns - 8 }
        ]}>
        <Icon />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          <SafeAreaView style={styles.mainContainer}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%' }}>

              <TouchableOpacity onPress={onClose}>
                <CrossIcon number={20} color={'#000929'} />
              </TouchableOpacity>

              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold' }}>Select Icon</Text>
              </View>

            </View>

            <View style={styles.inputContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={IconsArr}
                // Todo : Need to change the keyExtractor and discuss with team bilal
                keyExtractor={item => item?.iconId?.toString()}
                renderItem={renderItem}
                numColumns={numColumns}
              />
            </View>

            <TouchableOpacity
              style={[styles.newInspectionButton, selectedIcon && { backgroundColor: '#007BFF' }, { marginBottom: '5%' }]}
              disabled={!selectedIcon}
              onPress={() => handleSave(selectedIcon)}
            >
              <Text style={styles.newInspectionButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>

        </View>
      </View>
    </Modal>
  );
};

export default CustomModalForIcon
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  openButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    height: '100%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 20,
    textAlign: "center",
  },
  mainContainer: {
    flex: 1,
  },
  inputContainer: {
    marginTop: '7%',
    height: '26%'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedIconStyle: {
    backgroundColor: '#daeaff',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 5,
  },
  newInspectionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    paddingTop: '3%',
    paddingBottom: '4%',
  },
  newInspectionButtonText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: 'white',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DAEAFF',
    paddingTop: '3%',
    paddingBottom: '4%',
    marginBottom: '4%',
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#007BFF',
  },
});