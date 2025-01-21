// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Platform, Modal } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// // import { useLoader } from '../../../lib/loaderContext';
// const now = new Date();
// let currentDate = new Date().getDate();
// const currentYear = now.getFullYear();
// const currentMonth = now.getMonth();

// const DateRangeModelComp = ({ isVisible, handleModalVisibility, handleSave }) => {
//     const [pickModalDates, setPickModalDates] = useState({ StartDate: null, EndDate: null });
//     const [showDateTime, setShowDateTime] = useState(false);
//     const [startReportDate, setStartReportDate] = useState(null);

//     const [showEndDateTime, setShowEndDateTime] = useState(false);
//     const [endReportDate, setEndReportDate] = useState(null);

//     const onDobChange = (event, selectedDate) => {

//         if (event.type === 'dismissed') {
//             setShowDateTime(false);
//             setStartReportDate(null);
//             return;
//         }

//         if (selectedDate !== undefined) {
//             const currentDate = selectedDate || startReportDate || new Date();
//             const options = { year: 'numeric', month: 'long', day: 'numeric' }

//             let formatedDate = currentDate.toLocaleDateString('eng-US', options)
//             let changeFormate = formatedDate.split(',')
//             let changeSequence = changeFormate[0]
//             let selectedYear = changeFormate[1]
//             const [month, day] = changeSequence.split(' ')

//             let selectDate = `${day} ${month},${selectedYear}`

//             setShowDateTime(false);
//             if (Platform.OS === 'android') {
//                 setStartReportDate(selectDate);

//                 setPickModalDates((prev) => ({
//                     ...prev,
//                     StartDate: currentDate,
//                 }));

//             } else {
//                 let changeFormate = formatedDate.split(' ')
//                 const [day, month, year] = changeFormate;
//                 let finalDate = `${day} ${month}, ${year}`

//                 setStartReportDate(finalDate);

//                 setPickModalDates((prev) => ({
//                     ...prev,
//                     StartDate: currentDate,
//                 }));
//             }
//         } else {
//             setShowDateTime(false);
//         }
//     };

//     const onSelectEndDobChange = (event, selectedDate) => {

//         if (event.type === 'dismissed') {
//             setShowEndDateTime(false)
//             setEndReportDate(null);
//             return;
//         }

//         if (selectedDate !== undefined) {
//             const currentDate = selectedDate || endReportDate || new Date();
//             const options = { year: 'numeric', month: 'long', day: 'numeric' }

//             let formatedDate = currentDate.toLocaleDateString('eng-US', options)
//             let changeFormate = formatedDate.split(',')
//             let changeSequence = changeFormate[0]
//             let selectedYear = changeFormate[1]
//             const [month, day] = changeSequence.split(' ')

//             let selectDate = `${day} ${month}, ${selectedYear}`

//             setShowEndDateTime(false);
//             if (Platform.OS === 'android') {
//                 setEndReportDate(selectDate);

//                 setPickModalDates((prev) => ({
//                     ...prev,
//                     EndDate: currentDate,
//                 }));

//             } else {
//                 let changeFormate = formatedDate.split(' ')
//                 const [day, month, year] = changeFormate;
//                 let finalDate = `${day} ${month}, ${year}`
//                 setEndReportDate(finalDate);

//                 setPickModalDates((prev) => ({
//                     ...prev,
//                     EndDate: currentDate,
//                 }));
//             }
//         } else {
//             setShowEndDateTime(false);
//         }
//     };

//     return (
//         <Modal
//         statusBarTranslucent
//         visible={isVisible} transparent={true} onRequestClose={handleModalVisibility}>

//             <View style={styles.modalParentContainer}>

//                 <View style={[styles.modalInnerContainer]}>

//                     <View style={styles.saveListContainer}>
//                         <View style={styles.saveListButton}>
//                             <View style={{ padding: 5, }}>
//                                 <Text style={styles.modalDateText}>Start Date</Text>
//                             </View>

//                             <TouchableOpacity onPress={() => {
//                                 setShowDateTime(true)
//                             }}
//                             // disabled={loading}
//                             >
//                                 {showDateTime && (
//                                     <DateTimePicker
//                                         mode='date'
//                                         display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
//                                         value={new Date()}
//                                         onChange={onDobChange}
//                                         maximumDate={new Date(currentYear, currentMonth, currentDate)}
//                                     />
//                                 )}

//                                 {Platform.OS === 'android' ?
//                                     <Text style={[styles.DobText, startReportDate && { color: '#007BFF' }]}>{
//                                         startReportDate ? startReportDate : 'Select your Date'}
//                                     </Text>
//                                     :
//                                     showDateTime ? null : <Text style={[styles.DobText, startReportDate && {
//                                         color: '#007BFF'
//                                     }]}>{
//                                             startReportDate ? startReportDate : 'Select your Date'}
//                                     </Text>
//                                 }

//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <View style={styles.saveListContainer}>
//                         <View style={[styles.saveListButton, {
//                             color: '#000929'
//                         }]}>
//                             <View style={{ padding: 5, }}>
//                                 <Text style={styles.modalDateText}>End Date</Text>
//                             </View>

//                             <TouchableOpacity onPress={() => {
//                                 setShowEndDateTime(true)
//                             }}
//                             //  disabled={loading}
//                             >
//                                 {showEndDateTime && (
//                                     <DateTimePicker
//                                         mode='date'
//                                         display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
//                                         value={new Date()}
//                                         onChange={onSelectEndDobChange}
//                                         maximumDate={new Date(currentYear, currentMonth, currentDate)}
//                                     />
//                                 )}

//                                 {Platform.OS === 'android' ?
//                                     <Text style={[styles.DobText, endReportDate && {
//                                         color: '#007BFF'
//                                     }]}>{endReportDate ? endReportDate : 'Select your Date'}</Text>
//                                     :
//                                     showEndDateTime ? null : <Text style={[styles.DobText, endReportDate && {
//                                         color: '#007BFF'
//                                     }]}>{endReportDate ? endReportDate : 'Select your Date'}</Text>
//                                 }
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <View style={[styles.buttonParentContainer, { marginTop: '5%' }]}>

//                         <TouchableOpacity
//                             style={styles.buttonCancelContainer}
//                             onPress={() => {
//                                 setStartReportDate(null)
//                                 setEndReportDate(null)
//                                 setPickModalDates({})
//                                 handleModalVisibility()
//                             }}
//                         // disabled={loading}
//                         >
//                             <Text style={[styles.modalButtonText, { color: '#007BFF' }]}>Cancel</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.buttonDoneContainer}
//                             onPress={() => {
//                                 handleSave(pickModalDates?.StartDate, pickModalDates?.EndDate)
//                             }}
//                         // disabled={loading}
//                         >
//                             <Text style={styles.modalButtonText}>Done</Text>
//                         </TouchableOpacity>
//                     </View>

//                 </View>
//             </View>
//         </Modal>
//     )
// }

// export default DateRangeModelComp

// const styles = StyleSheet.create({
//     modalParentContainer: {
//         backgroundColor: 'rgba(0, 0, 0, 0.4)',
//         flex: 1,
//         justifyContent: "center",
//         alignItems: 'center',
//     },
//     modalInnerContainer: {
//         backgroundColor: '#fff',
//         paddingBottom: '5%',
//         width: '90%',
//         height: 280,
//         borderRadius: 8
//     },
//     saveListContainer: {
//         paddingLeft: 0,
//         marginBottom: 0,
//         marginHorizontal: 15,
//         marginTop: 3,
//     },
//     saveListButton: {
//         padding: 6,
//     },
//     modalDateText: {
//         fontSize: 18,
//         fontFamily: 'PlusJakartaSans_600SemiBold',
//         color: '#000929',
//     },
//     DobText: {
//         borderWidth: 1.5,
//         backgroundColor: '#F3F3F3',
//         borderColor: '#E5E1E1',
//         marginHorizontal: 0,
//         padding: 12,
//         borderRadius: 10,
//         fontSize: 15,
//         fontFamily: 'PlusJakartaSans_500Medium',
//         color: '#8D8B8B',
//     },
//     buttonParentContainer: {
//         alignItems: 'center',
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginTop: '8%'
//     },
//     buttonDoneContainer: {
//         paddingVertical: 8,
//         width: "38%",
//         borderRadius: 5,
//         backgroundColor: '#007BFF',
//     },
//     buttonCancelContainer: {
//         paddingVertical: 8,
//         width: "38%",
//         borderRadius: 5,
//         borderWidth: 2,
//         borderColor: '#DFECFF',
//         backgroundColor: '#ffff',
//     },
//     modalButtonText: {
//         textAlign: "center",
//         marginTop: '-3%',
//         textAlignVertical: "center",
//         fontSize: 16,
//         fontFamily: 'PlusJakartaSans_700Bold',
//         color: '#ffff',
//     },
// })

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDate = now.getDate();

const DateRangeModelComp = ({
  isVisible,
  handleModalVisibility,
  handleSave,
}) => {
  const [pickModalDates, setPickModalDates] = useState({
    StartDate: null,
    EndDate: null,
  });
  const [showPicker, setShowPicker] = useState({ type: null }); // Tracks which picker to show
  const [startReportDate, setStartReportDate] = useState(null);
  const [endReportDate, setEndReportDate] = useState(null);

  const formatSelectedDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (event.type === "dismissed") {
      setShowPicker({ type: null });
      return;
    }

    if (selectedDate) {
      const formattedDate = formatSelectedDate(selectedDate);
      if (type === "start") {
        setStartReportDate(formattedDate);
        setPickModalDates((prev) => ({ ...prev, StartDate: selectedDate }));
      } else if (type === "end") {
        setEndReportDate(formattedDate);
        setPickModalDates((prev) => ({ ...prev, EndDate: selectedDate }));
      }
    }
    setShowPicker({ type: null });
  };

  return (
    <Modal
      statusBarTranslucent
      visible={isVisible}
      transparent
      onRequestClose={handleModalVisibility}
    >
      <TouchableWithoutFeedback onPress={handleModalVisibility}>
        <View style={styles.modalParentContainer}>
          <View style={styles.modalInnerContainer}>
            {/* Start Date Picker */}
            <View style={styles.saveListContainer}>
              <Text style={styles.modalDateText}>Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowPicker({ type: "start" })}
              >
                <Text
                  style={[
                    styles.DobText,
                    startReportDate && { color: "#007BFF" },
                  ]}
                >
                  {startReportDate || "Select Start Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* End Date Picker */}
            <View style={styles.saveListContainer}>
              <Text style={styles.modalDateText}>End Date</Text>
              <TouchableOpacity onPress={() => setShowPicker({ type: "end" })}>
                <Text
                  style={[
                    styles.DobText,
                    endReportDate && { color: "#007BFF" },
                  ]}
                >
                  {endReportDate || "Select End Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonParentContainer}>
              <TouchableOpacity
                style={styles.buttonCancelContainer}
                onPress={() => {
                  setStartReportDate(null);
                  setEndReportDate(null);
                  setPickModalDates({});
                  handleModalVisibility();
                }}
              >
                <Text style={[styles.modalButtonText, { color: "#007BFF" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDoneContainer}
                onPress={() =>
                  handleSave(pickModalDates?.StartDate, pickModalDates?.EndDate)
                }
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DateTimePicker */}
          {showPicker.type && (
            <View
              style={{
                backgroundColor: "#fff",
                position: "absolute",
                width: "90%",
                borderRadius: 20,
                padding: 5,
              }}
            >
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "inline"}
                value={new Date(currentYear, currentMonth, currentDate)} // Set the initial date correctly
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, showPicker.type)
                }
                maximumDate={new Date(currentYear, currentMonth, currentDate)} // Correct maximum date
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DateRangeModelComp;

const styles = StyleSheet.create({
  modalParentContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalInnerContainer: {
    backgroundColor: "#fff",
    paddingBottom: "5%",
    width: "90%",
    borderRadius: 8,
  },
  saveListContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 5,
  },
  modalDateText: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#000929",
    paddingVertical: 8,
  },
  DobText: {
    borderWidth: 1.5,
    backgroundColor: "#F3F3F3",
    borderColor: "#E5E1E1",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#8D8B8B",
  },
  buttonParentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  buttonDoneContainer: {
    paddingVertical: 10,
    width: "40%",
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  buttonCancelContainer: {
    paddingVertical: 10,
    width: "40%",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DFECFF",
    backgroundColor: "#fff",
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#fff",
  },
});
