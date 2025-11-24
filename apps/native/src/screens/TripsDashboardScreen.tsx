import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex";
import { AntDesign } from "@expo/vector-icons";

const TripsDashboardScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const trips = useQuery(api.trips.getUserTrips);

  if (trips === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D87E1" />
      </View>
    );
  }

  const renderTrip = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
      onPress={() =>
        navigation.navigate("TripDetailScreen", { tripId: item._id })
      }
      activeOpacity={0.7}
    >
      <Text className="text-lg font-semibold text-gray-900 mb-1">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 mb-2">
        Budget: {item.baseCurrency} {item.allocatedBudget}
      </Text>
      {item.startDate && item.endDate && (
        <Text className="text-xs text-gray-500">
          {new Date(item.startDate).toLocaleDateString()} -{" "}
          {new Date(item.endDate).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">My Trips</Text>
          <TouchableOpacity
            onPress={() => signOut()}
            className="bg-white/20 rounded-full p-2"
          >
            <AntDesign name="logout" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trips List */}
      <View className="flex-1 px-4 pt-4">
        {trips.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <AntDesign name="inbox" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-700 mt-4">
              No trips yet
            </Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              Create your first trip to start tracking expenses
            </Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            renderItem={renderTrip}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {/* Create Trip Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-4 bg-blue-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("CreateTripScreen")}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TripsDashboardScreen;
