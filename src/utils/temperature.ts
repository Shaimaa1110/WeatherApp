import { TemperatureUnit } from "../types/weather";

export const formatTemp = (temp: number, unit: TemperatureUnit): string => {
  const convertedTemp =
    unit === "F" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);

  return `${convertedTemp}°${unit}`;
};
