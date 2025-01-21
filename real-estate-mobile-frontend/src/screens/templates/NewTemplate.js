import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomCalenderIcon } from '../../svg/InspectionIconSvg';
import CheckBlueTickIcon from '../../../assets/images/icons/CheckBlueTickIcon.svg';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import { apiUrl } from '../../constants/api_Url';
import { useLoader } from '../../lib/loaderContext';
import UpgradeModal from '../inspections/InspectionComponents/UpgradeModal';
import { userContext } from '../../lib/userContext';

const NewTemplate = () => {
  const { userData } = userContext();
  const currentRole = userData?.role
  const { setLoading } = useLoader()
  const navigation = useNavigation();
  const route = useRoute();
  const totalTemplate = route?.params?.totalTemplate
  const [isformValid, setIsformValid] = useState(false);
  const [createNewTemplateName, setCreateNewTemplateName] = useState('');

  useEffect(() => {
    if (createNewTemplateName?.length > 3) {
      setIsformValid(true)
    }
    else {
      setIsformValid(false)
    }
  }, [createNewTemplateName])

  const [modalVisible, setModalVisible] = useState(false);
  const handleUpgrade = () => {
    setLoading(true);
    setModalVisible(false);
    setTimeout(() => {
        navigation.navigate('PaymentPlanScreen', { goBack: true });
        setLoading(false);
    }, 1000);
    // Add your upgrade logic here
  };


  const handleSave = async (draft

  ) => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/template/createInspectionTemplateDraft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        withCredentials: true, // Include cookies/credentials

        body: JSON.stringify({
          templateName: createNewTemplateName

        }),
      });
      const result = await response.json();
      if (result?.message === 'Basic inspection template draft created successfully!') {
        setLoading(false)
        if (draft) {
          navigation.goBack()
        }
        else {
          navigation.navigate('ShowRoomTemplate', { id: result?.templateId })
        }
      }
      else {
        setLoading(false)
        alert(result?.message)
      }

    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const checkRoleForTier = (draft) => {
    if (currentRole == 'FREETIER') {
      if (totalTemplate  == 1 || totalTemplate == '' ||totalTemplate == 0) {
        handleSave(draft)
      }
      else {
        setModalVisible(true)
      }
    }

    else if (currentRole == 'STANDARDTIER') {
      if (totalTemplate < 4) {
        handleSave(draft)
      }
      else {
        setModalVisible(true)
      }
    }

    else if (currentRole == 'TOPTIER') {
      handleSave(draft)
    }
  }



  // const handleSaveAsDraft = async () => {
  //     try {
  //         setLoading(true)
  //         let data = {
  //             propertyId: formData?.propertyID,
  //             name: propertyAddress.unit + ", " + propertyAddress.street + " - Inspection",
  //             creationDate: formData?.inspectionDate,
  //             templateId: (route?.params?.showTemplate && formData?.templateID) ? formData?.templateID : null,
  //         }
  //         const response = await axios.post(`${apiUrl}/api/inspection/createBasicInspectionDraft`, data, { withCredentials: true })
  //         if (response?.status === 201) {
  //             navigation.goBack();
  //         }
  //     } catch (error) {
  //         console.log('error in handleSaveAsDraft', error)
  //     } finally {
  //         setLoading(false)
  //     }
  // };

  return (
    <SafeAreaView style={styles.mainContainer}>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.roomDetailsText}>
          <Text style={styles.subHeaderText}>Template Name</Text>
        </View>
        <View style={styles.inputInnerContainer}>
          <TextInput
            value={createNewTemplateName}
            onChangeText={(text) => setCreateNewTemplateName(text)}
            style={styles.input}
            placeholder="Write template name"
            placeholderTextColor="#7A8094"
          />
        </View>

        <TouchableOpacity
          style={[styles.newInspectionButton, isformValid && { backgroundColor: '#007BFF' }]}
          disabled={!isformValid}
          onPress={() => checkRoleForTier(false)}
        >
          <Text style={styles.newInspectionButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.newInspectionButton, { marginBottom: '5%' }, isformValid && { backgroundColor: '#007BFF' }]}
          disabled={!isformValid}
          onPress={() => checkRoleForTier(true)}
        >
          <Text style={styles.newInspectionButtonText}>Save as Draft</Text>
        </TouchableOpacity>

      </ScrollView>
      <UpgradeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpgrade={handleUpgrade}
        alertMessage={`You’ve reached the limits of your current plan. Upgrade now to unlock more features!`}
        
      />
    </SafeAreaView>
  );
};

export default NewTemplate;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },


  newInspectionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    paddingTop: '3%',
    paddingBottom: '4%',
    marginTop: '6%',
    marginHorizontal: '5.5%',
  },
  newInspectionButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: 'white',
  },


  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    // marginHorizontal: '1%',
    backgroundColor: '#daeaff6a',
    borderColor: '#DAEAFF',
    borderRadius: 10,
    paddingHorizontal: '6%',
    marginHorizontal: '6%',
    paddingVertical: '2%',
    marginTop: '1%'
  },
  roomDetailsText: {
    paddingTop: '5%',
    paddingHorizontal: '6%'
  },
  subHeaderText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#000929',
    marginTop: '1%',
    marginBottom: '1.5%',
  },
});
