import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { startOAuthFlow: startGoogleAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const onPress = async (authType: string) => {
    try {
      if (authType === "google") {
        const { createdSessionId, setActive } = await startGoogleAuthFlow();
        if (createdSessionId) {
          setActive({ session: createdSessionId });
          navigation.navigate("TripsDashboardScreen");
        }
      } else if (authType === "apple") {
        const { createdSessionId, setActive } = await startAppleAuthFlow();
        if (createdSessionId) {
          setActive({ session: createdSessionId });
          navigation.navigate("TripsDashboardScreen");
        }
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-white p-2.5 items-center w-[98%]">
        <Image
          source={require("../assets/icons/logo.png")}
          className="w-[74px] h-[74px] mt-5"
        />
        <Text className="mt-12 text-2xl font-semibold">
          Log in to your account
        </Text>
        <Text className="mt-2 text-base text-black mb-8 text-center">
          Welcome! Please login below.
        </Text>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-white rounded-xl border border-gray-300 w-full mb-3 h-11"
          onPress={() => onPress("google")}
        >
          <Image
            className="w-6 h-6 mr-3"
            source={require("../assets/icons/google.png")}
          />
          <Text className="text-center text-gray-700 font-semibold text-sm">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-center items-center bg-white p-4 rounded-xl border border-gray-300 w-full mb-8"
          onPress={() => onPress("apple")}
        >
          <AntDesign name="apple1" size={24} color="black" />
          <Text className="text-center text-gray-700 font-semibold text-sm ml-3">
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <View className="flex-row">
          <Text>Don't have an account? </Text>
          <Text>Sign up above.</Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
