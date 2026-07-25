import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CurrentWeatherCard from "../components/CurrentWeather";
import ForecastList from "../components/ForecastList";
import SearchBar from "../components/SearchBar";
import { useWeather } from "../hooks/useWeather";

const HomeScreen = () => {
  const { data, loading, error, fetchWeather, toggleUnit, unit, currentCity } =
    useWeather();

  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      fetchWeather(searchText.trim());
      setSearchText("");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather(currentCity || undefined, !currentCity);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-[#0A0A0A]"
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-row justify-between items-center px-5 mb-5">
        <Text className="text-[32px] font-bold text-white">الطقس</Text>
        <TouchableOpacity
          onPress={toggleUnit}
          className="bg-[#1F2937] px-4 py-2 rounded-[20px]"
        >
          <Text className="text-[#60A5FA] font-semibold">
            {unit === "C" ? "°C / °F" : "°F / °C"}
          </Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
      />

      {loading && !data && (
        <ActivityIndicator
          size="large"
          color="#0EA5E9"
          style={{ marginTop: 100 }}
        />
      )}

      {error && (
        <View className="bg-[#450A0A] m-5 p-5 rounded-xl items-center">
          <Text className="text-[#FCA5A5] text-center mb-3">{error}</Text>
        </View>
      )}

      {data && (
        <>
          <CurrentWeatherCard data={data.current} unit={unit} />

          <Text className="text-xl text-white font-semibold mx-5 mt-[10px] mb-[15px] text-right">
            توقعات الأيام القادمة
          </Text>
          <ForecastList forecast={data.forecast} unit={unit} />
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
