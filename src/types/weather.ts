export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: WeatherCondition[];
  name: string;
  sys: {
    country: string;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: WeatherCondition[];
  dt_txt: string;
}

export interface ForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: ForecastItem[];
}

export type TemperatureUnit = "C" | "F";

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastItem[];
  todayForecast: ForecastItem | null;
  unit: TemperatureUnit;
}
