import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: (selectedItem, item) => ({
        height: 150,
        width: "100%",
        padding: 24,
        marginTop: 16,
        backgroundColor: selectedItem === item.id ? "#F3F4F8" : "#FFF",
        borderRadius: 16,
        justifyContent: "space-between"
    }),
    rowContainer: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center', // Center items vertically
    },
    logoContainer: (selectedItem, item) => ({
        width: 100,
        height: 100,
        backgroundColor: selectedItem === item.id ? "#FFF" : "#F3F4F8",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    }),
    logoImage: {
        width: "70%",
        height: "70%",
    },
    itemName: {
        fontSize: 16,
        color: "#000000",
        marginTop: 10 / 1.5,
    },
    expiration: (selectedJob, item) => ({
        fontSize: 16 - 2,
        color: selectedJob === item.id ? "#162be0" : "#1a36f2",
    }),
    infoContainer: {
        // marginTop: 15,
    },
    infoWrapper: {
        flexDirection: "row",
        marginTop: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    }
});

export default styles;