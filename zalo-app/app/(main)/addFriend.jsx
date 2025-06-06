import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import { router } from "expo-router";
import { searchFriends } from "../../api/friendshipAPI";
import { useAuth } from "../../contexts/AuthContext";
import QRCode from "react-native-qrcode-svg";

const AddFriend = () => {
    const { user } = useAuth();
    const [phone, setPhone] = useState("");

    const qrValue = user?.phone ? `tel:${user.phone}` : "No phone number available";

    //Tìm kiếm bạn bè
    const handleSearch = async (phone) => {
        try {
            const response = await searchFriends(phone);
            if (response.success) {
                router.push({ pathname: "bioUserAddFriend", params: { user: JSON.stringify(response.data[0]), type: "phone" } });
            } else {
                alert("Số điện thoại này chưa đăng ký tài khoản hoặc không cho phép tìm kiếm!");
            }
        } catch (error) {
            console.log("Lỗi tìm kiếm bạn bè:", error);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBack} onPress={() => router.back()}>
                        <Icon name="arrowLeft" size={28} strokeWidth={1.6} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textTitleHeader}>Thêm bạn</Text>
                </View>
                <View style={styles.myQR}>
                    <View style={styles.boxInfoQR}>
                        <Text style={styles.textName}>{user?.name}</Text>
                        {user?.phone ? (
                            <QRCode
                                value={qrValue} // QR code will encode the phone number
                                size={wp(35)} // Adjust size as needed
                                color="black"
                                backgroundColor="white"
                            />
                        ) : (
                            <Text style={styles.textQR}>Không có số điện thoại để tạo mã QR</Text>
                        )}
                        <Text style={styles.textQR}>Quét mã để thêm bạn Yalo với tôi</Text>
                    </View>
                </View>
                <View style={styles.phone}>
                    <View style={styles.boxPhone}>
                        <TouchableOpacity style={styles.areaCode}>
                            <Text style={styles.textAreaCode}>+84</Text>
                            <Icon name="arrowDown" size={28} strokeWidth={1.6} color="black" />
                        </TouchableOpacity>
                        <TextInput style={{ fontSize: 16, marginLeft: 5, width: "70%" }} placeholder="Nhập số điện thoại" value={phone} onChangeText={(text) => setPhone(text)} />
                    </View>
                    <TouchableOpacity style={styles.buttonNextSearch} onPress={() => handleSearch(phone)}>
                        <Icon name="arrowRight" size={28} strokeWidth={1.6} color={theme.colors.darkLight} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.qrCode}>
                    <Icon name="qrCode" size={32} color={theme.colors.primary} />
                    <Text style={styles.textQRcode}>Quét mã QR</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: theme.colors.gray, height: hp(1.5) }} />
                <TouchableOpacity style={styles.qrCode}>
                    <Icon name="contact" size={32} color={theme.colors.primary} />
                    <Text style={styles.textQRcode}>Danh bạ máy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qrCode}>
                    <Icon name="userMultiple" size={32} color={theme.colors.primary} />
                    <Text style={styles.textQRcode}>Bạn bè có thể quen</Text>
                </TouchableOpacity>
                <Text style={styles.textFooter}>Xem lời mời kết bạn đã gửi tại trang Danh bạ Yalo</Text>
            </View>
        </ScreenWrapper>
    );
};

export default AddFriend;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: hp(6),
        borderBottomWidth: 0.5,
        borderBottomColor: "gray",
    },
    iconBack: {
        marginHorizontal: 15
    },
    textTitleHeader: {
        fontSize: 18,
        fontWeight: theme.fonts.medium,
        color: "black",
    },
    myQR: {
        height: hp(35),
        justifyContent: "center",
        alignItems: "center",
    },
    boxInfoQR: {
        width: wp(60),
        height: wp(60),
        backgroundColor: "#3F5C7E",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 20
    },
    textName: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: theme.fonts.medium
    },
    imgQR: {
        width: "50%",
        height: "50%",
        borderRadius: 10
    },
    textQR: {
        fontSize: 14,
        color: theme.colors.grayLight,
    },
    phone: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: hp(9),
        borderBottomWidth: 0.5,
        borderBottomColor: "gray",
        paddingHorizontal: 20,
        backgroundColor: "#FFF"
    },
    boxPhone: {
        flexDirection: "row",
        alignItems: "center",
        width: "85%",
        height: "70%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    areaCode: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "25%",
        height: "100%",
        borderTopStartRadius: 8,
        borderBottomStartRadius: 8,
        backgroundColor: theme.colors.darkLight,
        borderRightWidth: 1,
        borderColor: "gray",
    },
    textAreaCode: {
        fontSize: 16,
        color: "black",
    },
    buttonNextSearch: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.primaryLight,
        borderRadius: 25
    },
    textQRcode: {
        fontSize: 16,
        marginLeft: 20,
    },
    qrCode: {
        flexDirection: "row",
        alignItems: "center",
        height: hp(8),
        paddingHorizontal: 20,
        backgroundColor: "#FFF"
    },
    textFooter: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        paddingVertical: 20
    }
});
