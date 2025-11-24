import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex";
import { AntDesign } from "@expo/vector-icons";

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const trip = useQuery(api.trips.getTrip, { tripId });
  const expenses = useQuery(api.trips.getTripExpenses, { tripId });

  if (trip === undefined || expenses === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D87E1" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Trip not found</Text>
      </View>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.total, 0);
  const remaining = trip.allocatedBudget - totalSpent;
  const percentageSpent = (totalSpent / trip.allocatedBudget) * 100;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text
            className="text-xl font-bold text-white flex-1"
            numberOfLines={1}
          >
            {trip.title}
          </Text>
        </View>

        {/* Budget Overview */}
        <View className="bg-white/20 rounded-xl p-4">
          <Text className="text-white text-sm mb-1">Budget</Text>
          <Text className="text-white text-2xl font-bold">
            {trip.baseCurrency} {trip.allocatedBudget.toFixed(2)}
          </Text>
          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-white/80 text-xs">Spent</Text>
              <Text className="text-white font-semibold">
                {trip.baseCurrency} {totalSpent.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text className="text-white/80 text-xs">Remaining</Text>
              <Text
                className={`font-semibold ${remaining >= 0 ? "text-white" : "text-red-300"}`}
              >
                {trip.baseCurrency} {remaining.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
            <View
              className={`h-full ${percentageSpent > 100 ? "bg-red-400" : "bg-white"}`}
              style={{ width: `${Math.min(percentageSpent, 100)}%` }}
            />
          </View>
        </View>
      </View>

      {/* Expenses List */}
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-900">
            Expenses ({expenses.length})
          </Text>
          <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
            <Text className="text-white font-semibold text-sm">
              Add Expense
            </Text>
          </TouchableOpacity>
        </View>

        {expenses.length === 0 ? (
          <View className="items-center justify-center py-12">
            <AntDesign name="inbox" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No expenses yet</Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <View
              key={expense._id}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    {expense.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {expense.category}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {trip.baseCurrency} {expense.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TripDetailScreen;
