import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex";
import { AntDesign } from "@expo/vector-icons";

const CreateTripScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createTrip = useMutation(api.mutations.createTrip);

  const handleCreate = async () => {
    if (!title || !budget) {
      alert("Please fill in title and budget");
      return;
    }

    setIsLoading(true);
    try {
      await createTrip({
        title,
        allocatedBudget: parseFloat(budget),
        baseCurrency: currency,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Create New Trip</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Trip Title *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Summer Vacation to Bali"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
          />
        </View>

        {/* Budget */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Budget *
          </Text>
          <View className="flex-row items-center">
            <TextInput
              value={budget}
              onChangeText={setBudget}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 mr-2"
            />
            <TextInput
              value={currency}
              onChangeText={setCurrency}
              placeholder="USD"
              placeholderTextColor="#9CA3AF"
              className="w-20 bg-gray-50 border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-900"
            />
          </View>
        </View>

        {/* Start Date */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Start Date (Optional)
          </Text>
          <TextInput
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
          />
        </View>

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            End Date (Optional)
          </Text>
          <TextInput
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreate}
          disabled={isLoading}
          className={`rounded-xl py-4 items-center mb-8 ${
            isLoading ? "bg-blue-400" : "bg-blue-600"
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Create Trip
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateTripScreen;
