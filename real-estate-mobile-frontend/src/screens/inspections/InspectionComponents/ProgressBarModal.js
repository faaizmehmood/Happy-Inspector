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

const ProgressBarModal = ({ visible, onClose, onUpgrade }) => {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.title}>You're Almost There!</Text>
            <Text style={styles.description}>
              You're nearing your inspection limit. You have{' '}
              <Text style={styles.bold}>{remainingInspections}</Text> inspections
              left before reaching your maximum of{' '}
              <Text style={styles.bold}>{totalInspections}</Text>. Consider
              upgrading your plan or managing your existing inspections to ensure
              you have enough room.
            </Text>

            <View style={styles.progressContainer}>
              <Svg height={center * 2} width={center * 2}>
                {/* Background Circle */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#EC8247"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress Circle - Orange Part */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#FF9466"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference * 0.25} ${circumference}`}
                  strokeDashoffset={0}
                  transform={`rotate(-90 ${center} ${center})`}
                />
                {/* Progress Circle - Blue Part */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#007AFF"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference * 0.75} ${circumference}`}
                  strokeDashoffset={circumference * 0.25}
                  transform={`rotate(-90 ${center} ${center})`}
                />
                {/* Center Text */}
                <View style={{alignItems:'center',marginTop:'40%'}}>
                    <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:36,color:'#000',fontWeight:'700'}}>{usedInspections}</Text>
                <Text style={{fontSize:36,color:'#000'}}>/{totalInspections}</Text>
                </View>
                <Text  style={{fontSize:16,color:'#000',}}> INSPECTIONS</Text>
                </View>
                {/* <SvgText
                  x={center}
                  y={center}
                  fontSize="24"
                  fontWeight="bold"
                  fill="#000"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {usedInspections}/{totalInspections}
                </SvgText> */}
                {/* <SvgText
                  x={center}
                  y={center + 20}
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  INSPECTIONS
                </SvgText> */}
              </Svg>
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
    right: -12,
    top: -12,
    padding: 8,
  },
  closeIconText: {
    fontSize: 24,
    color: '#666',
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

export default ProgressBarModal;

// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
// } from 'react-native';
// import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// const ProgressBarModal = ({ visible, onClose, onUpgrade }) => {
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

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <Pressable style={styles.overlay} onPress={onClose}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
//               <Text style={styles.closeIconText}>×</Text>
//             </TouchableOpacity>

//             <Text style={styles.title}>You're Almost There!</Text>
//             <Text style={styles.description}>
//               You're nearing your inspection limit. You have{' '}
//               <Text style={styles.bold}>{remainingInspections}</Text> inspections
//               left before reaching your maximum of{' '}
//               <Text style={styles.bold}>{totalInspections}</Text>. Consider
//               upgrading your plan or managing your existing inspections
//               to ensure you have enough room.
//             </Text>

//             <View style={styles.progressContainer}>
//               <Svg height={center * 2} width={center * 2}>
//                 {/* Background Circle */}
//                 <Circle
//                   cx={center}
//                   cy={center}
//                   r={radius}
//                   stroke="#E8E8E8"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                 />
//                 {/* Progress Circle - Blue Part (Almost complete) */}
//                 <Circle
//                   cx={center}
//                   cy={center}
//                   r={radius}
//                   stroke="#007AFF"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={progressOffset}
//                   transform={`rotate(-90 ${center} ${center})`}
//                 />
//                 {/* Progress Circle - Orange Part (Small remaining portion) */}
//                 <Circle
//                   cx={center}
//                   cy={center}
//                   r={radius}
//                   stroke="#FF9466"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeDasharray={`${progressOffset} ${circumference}`}
//                   strokeDashoffset={0}
//                   transform={`rotate(-90 ${center} ${center})`}
//                 />
//                 {/* Center Text */}
//                 <SvgText
//                   x={center}
//                   y={center}
//                   fontSize="24"
//                   fontWeight="bold"
//                   fill="#000"
//                   textAnchor="middle"
//                   alignmentBaseline="middle"
//                 >
//                   {usedInspections}/{totalInspections}
//                 </SvgText>
//                 <SvgText
//                   x={center}
//                   y={center + 20}
//                   fontSize="12"
//                   fill="#666"
//                   textAnchor="middle"
//                   alignmentBaseline="middle"
//                 >
//                   INSPECTIONS
//                 </SvgText>
//               </Svg>
//             </View>

//             <TouchableOpacity
//               style={styles.upgradeButton}
//               onPress={onUpgrade}
//             >
//               <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={onClose}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Pressable>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '90%',
//     maxWidth: 340,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 24,
//   },
//   modalContent: {
//     alignItems: 'center',
//   },
//   closeIcon: {
//     position: 'absolute',
//     right: -12,
//     top: -12,
//     padding: 8,
//   },
//   closeIconText: {
//     fontSize: 24,
//     color: '#666',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 24,
//   },
//   bold: {
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   progressContainer: {
//     marginVertical: 24,
//     alignItems: 'center',
//   },
//   upgradeButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     paddingVertical: 16,
//     width: '100%',
//     marginBottom: 12,
//   },
//   upgradeButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   closeButton: {
//     borderRadius: 8,
//     paddingVertical: 16,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#007AFF',
//   },
//   closeButtonText: {
//     color: '#007AFF',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default ProgressBarModal;

