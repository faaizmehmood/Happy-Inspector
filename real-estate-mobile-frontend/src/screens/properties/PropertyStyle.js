import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');


export const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    borderButtonContainer: {
        flex: 1,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#DAEAFF',
        backgroundColor: '#ffff',
    },
    borderButtonText: {
        textAlignVertical: "center",
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#007BFF',
    },
    buttonContainer: {
        flex: 1,
        borderRadius: 9,
        backgroundColor: '#007BFF',
    },
    buttonText: {
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#ffff',
    },
    inputContainer: {
        flexDirection: "row",
        borderWidth: 2,
        paddingRight: 5,
        backgroundColor: "#F3F8FF",
        borderColor: "#DAEAFF",
        borderRadius: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 13,
    },
    lightBoldText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000929',
    },
    iconImageContainer: {
        position: 'relative',
        height: height * 0.25,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    borderLine: {
        marginVertical: '6%',
        marginHorizontal: 16,
        backgroundColor: '#CCE2FF',
        height: 1.5,
    },
    noDataText: {
        // fontFamily: 'PlusJakartaSans_500Medium',
        // fontSize: 16,
        textAlign: 'center',
        // color: '#007BFF',
    },
    heavyBoldText: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000',
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateLabel: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#666',
    },
    scrollViewContainer: {
        flex: 1,
        padding: 16,
    },
});