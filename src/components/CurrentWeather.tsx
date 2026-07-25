import React from "react";
import { Image, Text, View } from "react-native";
import { CurrentWeather } from "../types/weather";
import { formatTemp } from "../utils/temperature";

interface Props {
  data: CurrentWeather;
  unit: "C" | "F";
}

const CurrentWeatherCard: React.FC<Props> = ({ data, unit }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <View className="bg-[#1E2937] m-5 rounded-3xl p-6 items-center">
      <View className="items-center mb-4">
        <Text className="text-[36px] text-white font-semibold">
          {data.name}
        </Text>
        <Text className="text-lg text-[#94A3B8]">{data.sys.country}</Text>
      </View>

      <Image source={{ uri: iconUrl }} className="w-[180px] h-[180px] my-2.5" />

      <Text className="text-[72px] text-white font-extralight">
        {formatTemp(data.main.temp, unit)}
      </Text>

      <Text className="text-xl text-[#CBD5E1] capitalize mb-4">
        {data.weather[0].description}
      </Text>

      <Text className="text-[15px] text-[#94A3B8] mb-3">
        الإحساس الفعلي {formatTemp(data.main.feels_like, unit)}
      </Text>

      <View className="flex-row gap-[30px]">
        <Text className="text-lg text-[#94A3B8]">
          ↑ {formatTemp(data.main.temp_max, unit)}
        </Text>
        <Text className="text-lg text-[#94A3B8]">
          ↓ {formatTemp(data.main.temp_min, unit)}
        </Text>
      </View>

      <View className="flex-row justify-around w-full mt-5 pt-4 border-t border-[#334155]">
        <View className="items-center">
          <Text className="text-[13px] text-[#94A3B8] mb-1">الرطوبة</Text>
          <Text className="text-lg text-white font-semibold">
            {data.main.humidity}%
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-[13px] text-[#94A3B8] mb-1">الرياح</Text>
          <Text className="text-lg text-white font-semibold">
            {data.wind.speed} م/ث
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeatherCard;
