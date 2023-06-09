import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./ForgotPasswordCodeScreen.style";
import OTPTextInput from "react-native-otp-textinput";
import Background from "../../components/Background";
import OTPSender from "../../api/OTPSender";
import Header from "../../components/Header";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

type RootStackParamList = {
  CreatePasswordScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePasswordScreen"
>;

export type Props = {
  navigation: NavigationProp;
  route: {
    params: {
      countryCode: string;
      wholePhonenumber: string;
    };
  };
};

const ForgotPasswordCodeScreen = ({ route, navigation }: Props) => {
  const { countryCode, wholePhonenumber } = route.params;
  const [loading, setLoading] = useState(false);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const [validCodeStatus, setValidCodeStatus] = useState(false);
  const [code, setCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOtpCode("");
    setLoading(false);
    setValidCodeStatus(false);
    navigation.navigate("CreatePasswordScreen");
  };

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(60);
  };

  const handleResendOTP = () => {
    startCountdown();
    sendFirstOTPCode();
  };

  const sendFirstOTPCode = () => {
    var randomNumber = Math.floor(1000 + Math.random() * 9000);
    setCode(randomNumber.toString());

    OTPSender.sendSMS(wholePhonenumber, randomNumber.toString());
    setOtpCode("");
  };

  useEffect(() => {
    startCountdown();
    sendFirstOTPCode();
    setValidCodeStatus(false);
    console.log("validCodeStatus ", validCodeStatus);
  }, []);

  useEffect(() => {
    const formatedNumber =
      countryCode + " " + wholePhonenumber.split(countryCode).join("");
    setFormattedPhoneNumber(formatedNumber);
  });

  useEffect(() => {
    if (otpCode) {
      code === otpCode ? setValidCodeStatus(true) : setValidCodeStatus(false);
    }
  }, [otpCode]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (countdown === 0) {
      setIsCountingDown(false);
    }
  }, [countdown, isCountingDown]);

  return (
    <Background>
      <Header navigation={navigation} />
      <View style={styles.Container}>
        <Text testID="title" style={styles.Title}>
          Forgot Password
        </Text>
        <Text testID="passwordLabel" style={styles.PasswordLabel}>
          Enter the 4-digit code sent to you at
        </Text>
        <Text testID="phoneLabel" style={styles.PhoneLabel}>
          {formattedPhoneNumber}
        </Text>
        <View style={styles.inputView}>
          <OTPTextInput
            inputCount={4}
            keyboardType="numeric"
            // textInputStyle={(index) =>
            //   index < otpArray.length
            //     ? styles.otpInputActive
            //     : styles.otpInputInactive
            // }
            textInputStyle={styles.otpInputActive}
            handleTextChange={(code) => setOtpCode(code)}
          />
        </View>
        <Text testID="resendCodeLabel" style={styles.ResendCodeLabel}>
          Didn't get the code? We can{" "}
          {isCountingDown ? (
            <Text style={styles.ResendCodeRemainSeconds}>
              resend it in {countdown}s.
            </Text>
          ) : (
            <Text onPress={handleResendOTP} style={styles.ResendCodeButton}>
              resend it
            </Text>
          )}
        </Text>
        <TouchableOpacity
          testID="resetPasswordButton"
          onPress={handleResetPassword}
          style={styles.ResetButton}
          disabled={!validCodeStatus}
        >
          {loading ? (
            <CustomLoading />
          ) : (
            <Text
              testID="resetPasswordButtonText"
              style={[
                styles.ResetButtonText,
                (!validCodeStatus || loading) && styles.disabledButton,
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

export default ForgotPasswordCodeScreen;
