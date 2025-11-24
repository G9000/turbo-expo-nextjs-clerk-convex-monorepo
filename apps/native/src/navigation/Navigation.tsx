import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TripsDashboardScreen from "../screens/TripsDashboardScreen";
import CreateTripScreen from "../screens/CreateTripScreen";
import TripDetailScreen from "../screens/TripDetailScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="TripsDashboardScreen"
          component={TripsDashboardScreen}
        />
        <Stack.Screen name="CreateTripScreen" component={CreateTripScreen} />
        <Stack.Screen name="TripDetailScreen" component={TripDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
