import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrentWeather, ForecastResponse } from "../types/weather";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCurrentWeatherByCity: builder.query<CurrentWeather, string>({
      query: (city) =>
        `/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    }),

    getCurrentWeatherByCoords: builder.query<
      CurrentWeather,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) =>
        `/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    }),

    getForecastByCity: builder.query<ForecastResponse, string>({
      query: (city) =>
        `/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    }),

    getForecastByCoords: builder.query<
      ForecastResponse,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) =>
        `/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    }),
  }),
});

export const {
  useLazyGetCurrentWeatherByCityQuery,
  useLazyGetCurrentWeatherByCoordsQuery,
  useLazyGetForecastByCityQuery,
  useLazyGetForecastByCoordsQuery,
} = weatherApi;
