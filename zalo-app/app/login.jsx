import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import Input from "../components/Input";
import Button from "../components/Button";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signIn } from "../api/user";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (passwordRef.current.length < 10) {
      Alert.alert("Error", "Mật khẩu phải có ít nhất 10 ký tự!");
      return;
    }

    if (passwordRef.current.length < 10) {
      Alert.alert("Error", "Mật khẩu phải có ít nhất 10 ký tự!");
      return;
    }

    if (passwordRef.current.length < 10) {
      Alert.alert("Error", "Mật khẩu phải có ít nhất 10 ký tự!");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        const { user, session } = result.data;

        // Thiết lập phiên làm việc với Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (sessionError) {
          console.error("Session error:", sessionError);
          Alert.alert(
            "Error",
            "Lỗi xác thực phiên làm việc: " + sessionError.message
          );
          setLoading(false);
          return;
        }

        // Lưu userId và sessionToken vào AsyncStorage
        await AsyncStorage.setItem("userId", user.id);
        await AsyncStorage.setItem("sessionToken", session.session_token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem(
          "supabase.auth.token",
          JSON.stringify(result.data)
        );

        // Chuyển hướng sẽ được xử lý bởi AuthContext
      } else {
        Alert.alert("Error", result.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton router={router} />
          <Text style={{ fontSize: hp(2), marginLeft: 16 }}>Đăng nhập</Text>
        </View>

        {/* welcome */}

        <View>
          <Text style={styles.welcomeText}>Hi,</Text>
          <Text style={styles.welcomeText}>Chào mừng bạn trở lại</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Vui lòng nhập email và mật khẩu để đăng nhập
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Nhập email của bạn"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Nhập mật khẩu của bạn"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Pressable onPress={() => router.push("forgotPassword")}>
            <Text style={styles.forgotPassword}>Lấy lại mật khẩu</Text>
          </Pressable>

          {/* button */}
          <Button
            title={"Đăng nhập"}
            loading={loading}
            onPress={onSubmit}
            disabled={loading}
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bạn chưa có tài khoản?</Text>
          <Pressable onPress={() => router.push("signUp")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              {" "}
              Đăng kí
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
  },
  form: {
    gap: 28,
  },
  forgotPassword: {
    textAlign: "right",
    color: theme.colors.primaryLight,
    fontWeight: theme.fonts.semibold,
    fontSize: hp(1.8),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
