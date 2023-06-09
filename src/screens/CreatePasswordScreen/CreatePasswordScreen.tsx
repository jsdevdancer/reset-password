import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./CreatePasswordScreen.style";
import Background from "../../components/Background";
import Header from "../../components/Header";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

type RootStackParamList = {
  LoginScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export type Props = {
  navigation: NavigationProp;
};

const CreatePasswordScreen = ({ navigation }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const handleResetPassword = async () => {
    // We can add some functions to reset password later.
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    navigation.navigate("LoginScreen");
  };

  const isPasswordStrong = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  useEffect(() => {
    if (isPasswordStrong(password)) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  return (
    <Background>
      <Header navigation={navigation} />
      <View style={styles.Container}>
        <Text testID="title" style={styles.Title}>
          Create Password
        </Text>
        <Text testID="passwordLabel" style={styles.PasswordLabel}>
          Password
        </Text>
        <View style={styles.PasswordInputContainer}>
          <TextInput
            testID="passwordInput"
            secureTextEntry={!isPasswordVisible}
            style={styles.PasswordInput}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Enter your password"
          />
          <TouchableOpacity
            testID="togglePasswordVisibility"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <Image
                testID="eyeImageHide"
                style={styles.EyeImage}
                source={require("../../assets/images/eye-hide.png")}
              />
            ) : (
              <Image
                testID="eyeImage"
                style={styles.EyeImage}
                source={require("../../assets/images/eye.png")}
              />
            )}
          </TouchableOpacity>
        </View>
        {!validPassword && (
          <View
            testID="passwordFormatLabelContainer"
            style={styles.PasswordFormatLabelContainer}
          >
            <Text style={styles.PasswordFormatLabel}>
              {"\u00B7"} Minimum 8 charaters
            </Text>
            <Text style={styles.PasswordFormatLabel}>
              {"\u00B7"} 1 upper case letter
            </Text>
            <Text style={styles.PasswordFormatLabel}>{"\u00B7"} 1 number</Text>
          </View>
        )}
        <TouchableOpacity
          testID="resetPasswordButton"
          onPress={handleResetPassword}
          style={styles.ResetButton}
          disabled={!validPassword}
        >
          {loading ? (
            <CustomLoading />
          ) : (
            <Text
              testID="resetPasswordButtonText"
              style={[
                styles.ResetButtonText,
                (!validPassword || loading) && styles.disabledButton,
              ]}
            >
              Reset Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default CreatePasswordScreen;
