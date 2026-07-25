import * as Location from "expo-location";

export const locationService = {
  async getCurrentLocation() {
    try {
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("PERMISSION_DENIED");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
    } catch (error: any) {
      if (error.message === "PERMISSION_DENIED") {
        throw new Error("LOCATION_PERMISSION_DENIED");
      }
      throw new Error("LOCATION_ERROR");
    }
  },
};
