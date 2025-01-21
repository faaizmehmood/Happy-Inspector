import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import UpgradePackagesIcon from '../../../../assets/images/icons/upgradePackages.svg'
const UpgradeModal = ({ visible, onClose, onUpgrade, alertMessage }) => {
  const totalInspections = 30;
  const usedInspections = 27;
  const remainingInspections = totalInspections - usedInspections;

  // Calculate progress for the circle
  const radius = 125;
  const strokeWidth = 30;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (usedInspections / totalInspections) * 100;
  const progressOffset = circumference - (circumference * progressPercent) / 100;

  //   const totalInspections = 30;
  //   const usedInspections = 27;
  //   const remainingInspections = totalInspections - usedInspections;

  //   // Calculate progress for the circle
  //   const radius = 70;
  //   const strokeWidth = 12;
  //   const center = radius + strokeWidth;
  //   const circumference = 2 * Math.PI * radius;
  //   const progressPercent = (usedInspections / totalInspections) * 100;
  //   const progressOffset = circumference - (circumference * progressPercent) / 100;
  { }
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeIconText}>×</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>


            <Text style={styles.title}>Limit Reached</Text>
            <Text style={styles.description}>
              {alertMessage}
            </Text>
            <View style={{ marginBottom: 20 }}>
              <UpgradePackagesIcon />
            </View>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={onUpgrade}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    right: 3,
    top: -10,
    padding: 8,
  },
  closeIconText: {
    fontSize: 28,
    color: '#000929',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  progressContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  closeButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpgradeModal;

