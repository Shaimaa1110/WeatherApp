import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "@weather_cache";

export const storageService = {
  async saveWeather(data: any) {
    try {
      const cacheData = {
        ...data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.error("Failed to save cache", e);
    }
  },

  async getCachedWeather() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > 30 * 60 * 1000; // 30 minutes

      if (isExpired) {
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsed;
    } catch (e) {
      console.error("Failed to load cache", e);
      return null;
    }
  },
};
