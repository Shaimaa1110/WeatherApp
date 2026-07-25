module.exports = {
  expo: {
    name: "Weather App",
    slug: "weather-app",
    version: "1.0.0",
    extra: {
      openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "اسمح للتطبيق بالوصول إلى موقعك لعرض الطقس الحالي.",
        },
      ],
    ],
  },
};
