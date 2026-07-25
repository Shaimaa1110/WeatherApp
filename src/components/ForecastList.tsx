import React from "react";
import { Image, Text, View } from "react-native";
import { ForecastItem } from "../types/weather";
import { formatTemp } from "../utils/temperature";

interface Props {
  forecast: ForecastItem[];
  unit: "C" | "F";
}

const ForecastList: React.FC<Props> = ({ forecast, unit }) => {
  return (
    <View>
      {forecast.map((item, index) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString("ar-EG", { weekday: "long" });
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        return (
          <View
            key={`day-${index}`}
            className="flex-row items-center bg-[#1E2937] mx-5 my-1.5 p-4 rounded-2xl"
          >
            <Text className="text-white text-[17px] w-[100px]">{dayName}</Text>

            <Image
              source={{ uri: iconUrl }}
              className="w-[50px] h-[50px] mx-5"
            />

            <View className="flex-1 items-end">
              <Text className="text-lg text-white">
                ↑ {formatTemp(item.main.temp_max, unit)}
              </Text>
              <Text className="text-base text-[#94A3B8]">
                ↓ {formatTemp(item.main.temp_min, unit)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ForecastList;
