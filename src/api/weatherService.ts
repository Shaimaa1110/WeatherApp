import axios, { AxiosError } from "axios";
import { CurrentWeather, ForecastResponse } from "../types/weather";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    appid: API_KEY,
    units: "metric",
  },
});

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      if (axiosError.response.status === 404) {
        throw new Error("CITY_NOT_FOUND");
      }
      throw new Error("API_ERROR");
    }

    if (axiosError.request) {
      throw new Error("NETWORK_ERROR");
    }
  }

  throw new Error("API_ERROR");
};

export const weatherService = {
  async getCurrentWeather(query: string): Promise<CurrentWeather> {
    try {
      const response = await apiClient.get<CurrentWeather>("/weather", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getCurrentByCoords(lat: number, lon: number): Promise<CurrentWeather> {
    try {
      const response = await apiClient.get<CurrentWeather>("/weather", {
        params: { lat, lon },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getForecast(
    query: string | { lat: number; lon: number },
  ): Promise<ForecastResponse> {
    try {
      const params =
        typeof query === "string"
          ? { q: query }
          : { lat: query.lat, lon: query.lon };

      const response = await apiClient.get<ForecastResponse>("/forecast", {
        params,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
