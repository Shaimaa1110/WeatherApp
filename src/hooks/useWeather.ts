import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import { weatherService } from "../api/weatherService";
import { locationService } from "../services/locationService";
import { storageService } from "../services/storageService";
import { ForecastItem, TemperatureUnit, WeatherData } from "../types/weather";

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [currentCity, setCurrentCity] = useState<string>("");

  const fetchWeather = useCallback(
    async (city?: string, useLocation = false) => {
      setLoading(true);
      setError(null);

      try {
        let current, forecastRaw;

        if (useLocation) {
          const coords = await locationService.getCurrentLocation();
          current = await weatherService.getCurrentByCoords(
            coords.lat,
            coords.lon,
          );
          forecastRaw = await weatherService.getForecast(coords);
        } else if (city) {
          current = await weatherService.getCurrentWeather(city);
          forecastRaw = await weatherService.getForecast(city);
        } else {
          throw new Error("NO_INPUT");
        }

        const groupedByDay: { [date: string]: ForecastItem[] } = {};

        forecastRaw.list.forEach((item: ForecastItem) => {
          const date = item.dt_txt.split(" ")[0]; // "2026-07-24"
          if (!groupedByDay[date]) groupedByDay[date] = [];
          groupedByDay[date].push(item);
        });

        const sortedDates = Object.keys(groupedByDay).sort();

        const buildDayItem = (
          date: string,
          extraTemp?: number,
        ): ForecastItem => {
          const dayItems = groupedByDay[date];
          const temps = dayItems.map((i) => i.main.temp);

          if (extraTemp !== undefined) temps.push(extraTemp);

          const temp_max = Math.max(...temps);
          const temp_min = Math.min(...temps);

          const midDayItem =
            dayItems.find((i) => i.dt_txt.includes("12:00:00")) ||
            dayItems[Math.floor(dayItems.length / 2)];

          return {
            ...midDayItem,
            dt_txt: `${date} 12:00:00`,
            main: {
              ...midDayItem.main,
              temp_max,
              temp_min,
            },
          };
        };

        const todayDate = sortedDates[0];
        const todayForecast = todayDate
          ? buildDayItem(todayDate, current.main.temp)
          : null;

        const forecast: ForecastItem[] = sortedDates
          .slice(1, 6)
          .map((d) => buildDayItem(d));

        setData((prev) => {
          const weatherData: WeatherData = {
            current,
            forecast,
            todayForecast,
            unit: prev?.unit ?? "C",
          };
          storageService.saveWeather(weatherData);
          return weatherData;
        });

        setCurrentCity(current.name);
      } catch (err: any) {
        let message = "حدث خطأ غير متوقع";
        let shouldLoadCache = false;

        if (err.message === "CITY_NOT_FOUND") {
          message = "المدينة غير موجودة، جرب اسم آخر";
          setData(null);
        } else if (err.message === "LOCATION_PERMISSION_DENIED") {
          message = "تم رفض إذن الموقع";
          setData(null);
        } else if (err.message === "LOCATION_ERROR") {
          message = "تعذر الحصول على الموقع";
          setData(null);
        } else if (err.message === "NETWORK_ERROR") {
          message = "لا يوجد اتصال بالإنترنت";
          shouldLoadCache = true;
        } else {
          shouldLoadCache = true;
        }

        setError(message);

        if (shouldLoadCache) {
          const cached = await storageService.getCachedWeather();
          if (cached) setData(cached);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleUnit = () => {
    const newUnit: TemperatureUnit = unit === "C" ? "F" : "C";
    setUnit(newUnit);

    if (data) {
      setData({ ...data, unit: newUnit });
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchWeather(undefined, true);
    });

    return () => task.cancel();
  }, [fetchWeather]);

  return {
    data,
    loading,
    error,
    fetchWeather,
    toggleUnit,
    unit,
    currentCity,
  };
};
