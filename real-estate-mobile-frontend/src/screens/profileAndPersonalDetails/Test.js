import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

export default function Test() {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('+380');

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                    width: '80%',
                    height: 60,
                    backgroundColor: 'red',
                    padding: 10,
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: 20
                }}>
                    {countryCode}
                </Text>
            </TouchableOpacity>

            <CountryPicker
                enableModalAvoiding={true}
                onBackdropPress={() => setShow(false)}
                show={show}
                inputPlaceholder="Search Country"
                style={{
                    // Styles for whole modal [View]
                    modal: {
                        flex: 0.5,
                    },
                    // Styles for modal backdrop [View]
                    // backdrop: {

                    // },
                    // // Styles for bottom input line [View]
                    // line: {

                    // },
                    // // Styles for list of countries [FlatList]
                    // itemsList: {

                    // },
                    // // Styles for input [TextInput]
                    // textInput: {
                    //     height: 80,
                    //     borderRadius: 0,
                    // },
                    // // Styles for country button [TouchableOpacity]
                    // countryButtonStyles: {
                    //     height: 80
                    // },
                    // // Styles for search message [Text]
                    // searchMessageText: {

                    // },
                    // // Styles for search message container [View]
                    // countryMessageContainer: {

                    // },
                    // // Flag styles [Text]
                    // flag: {

                    // },
                    // // Dial code styles [Text]
                    // dialCode: {

                    // },
                    // // Country name styles [Text]
                    // countryName: {

                    // }
                }}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={(item) => {
                    setShow(false);
                    setCountryCode(item.dial_code);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});