import { CurrentWeather, ForecastResponse } from "../types/weather";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherService = {
  async getCurrentWeather(query: string): Promise<CurrentWeather> {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`,
    );

    if (!response.ok) {
      if (response.status === 404) throw new Error("CITY_NOT_FOUND");
      throw new Error("API_ERROR");
    }
    return response.json();
  },

  async getCurrentByCoords(lat: number, lon: number): Promise<CurrentWeather> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );
    if (!response.ok) throw new Error("API_ERROR");
    return response.json();
  },

  async getForecast(
    query: string | { lat: number; lon: number },
  ): Promise<ForecastResponse> {
    let url = `${BASE_URL}/forecast?appid=${API_KEY}&units=metric`;

    if (typeof query === "string") {
      url += `&q=${encodeURIComponent(query)}`;
    } else {
      url += `&lat=${query.lat}&lon=${query.lon}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("API_ERROR");
    return response.json();
  },
};
