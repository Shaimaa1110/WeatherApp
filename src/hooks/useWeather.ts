import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import {
  useLazyGetCurrentWeatherByCityQuery,
  useLazyGetCurrentWeatherByCoordsQuery,
  useLazyGetForecastByCityQuery,
  useLazyGetForecastByCoordsQuery,
} from "../api/weatherApi";
import { locationService } from "../services/locationService";
import { storageService } from "../services/storageService";
import { ForecastItem, TemperatureUnit, WeatherData } from "../types/weather";

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [currentCity, setCurrentCity] = useState<string>("");

  const [triggerCurrentByCity] = useLazyGetCurrentWeatherByCityQuery();
  const [triggerCurrentByCoords] = useLazyGetCurrentWeatherByCoordsQuery();
  const [triggerForecastByCity] = useLazyGetForecastByCityQuery();
  const [triggerForecastByCoords] = useLazyGetForecastByCoordsQuery();

  const fetchWeather = useCallback(
    async (city?: string, useLocation = false) => {
      setLoading(true);
      setError(null);

      try {
        let current, forecastRaw;

        if (useLocation) {
          const coords = await locationService.getCurrentLocation();

          const currentResult = await triggerCurrentByCoords(coords);
          if (currentResult.error) throw currentResult.error;
          current = currentResult.data;

          const forecastResult = await triggerForecastByCoords(coords);
          if (forecastResult.error) throw forecastResult.error;
          forecastRaw = forecastResult.data;
        } else if (city) {
          const currentResult = await triggerCurrentByCity(city);
          if (currentResult.error) throw currentResult.error;
          current = currentResult.data;

          const forecastResult = await triggerForecastByCity(city);
          if (forecastResult.error) throw forecastResult.error;
          forecastRaw = forecastResult.data;
        } else {
          throw new Error("NO_INPUT");
        }

        if (!current || !forecastRaw) throw new Error("API_ERROR");

        const groupedByDay: { [date: string]: ForecastItem[] } = {};

        forecastRaw.list.forEach((item: ForecastItem) => {
          const date = item.dt_txt.split(" ")[0];
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
            main: { ...midDayItem.main, temp_max, temp_min },
          };
        };

        const todayDateStr = new Date().toISOString().split("T")[0];
        const futureDates = sortedDates.filter((d) => d !== todayDateStr);
        const todayDate =
          sortedDates.find((d) => d === todayDateStr) || sortedDates[0];

        const todayForecast = todayDate
          ? buildDayItem(todayDate, current.main.temp)
          : null;

        const forecast: ForecastItem[] = futureDates
          .slice(0, 5)
          .map((d) => buildDayItem(d));

        setData((prev) => ({
          current,
          forecast,
          todayForecast,
          unit: prev?.unit ?? "C",
        }));

        setCurrentCity(current.name);
      } catch (err: any) {
        let message = "حدث خطأ غير متوقع";
        let shouldLoadCache = false;

        const status = err?.status;

        if (status === 404) {
          message = "المدينة غير موجودة، جرب اسم آخر";
          setData(null);
        } else if (err.message === "LOCATION_PERMISSION_DENIED") {
          message = "تم رفض إذن الموقع";
          setData(null);
        } else if (err.message === "LOCATION_ERROR") {
          message = "تعذر الحصول على الموقع";
          setData(null);
        } else if (
          status === "FETCH_ERROR" ||
          err.message === "NETWORK_ERROR"
        ) {
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
    [
      triggerCurrentByCity,
      triggerCurrentByCoords,
      triggerForecastByCity,
      triggerForecastByCoords,
    ],
  );

  useEffect(() => {
    if (data) {
      storageService.saveWeather(data);
    }
  }, [data]);

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
