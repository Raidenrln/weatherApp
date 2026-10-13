import { Cloud, CloudSun, Droplet, Leaf, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const [temperature, setTemperature] = useState<Number | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    weekday: "long",
    day: "numeric",
  });

  const labelIconWeather = {
    1: {
      label: "Clear sky",
      icon: Cloud,
    },
  } as const;

  const getAqiLabel = (aqi: number) => {
    if (aqi < 20) return "Good";
    if (aqi < 40) return "Fair";
    if (aqi < 60) return "Moderate";
    if (aqi < 80) return "Poor";
    if (aqi <= 100) return "Very poor";
    return "Extremely poor";
  };
  useEffect(() => {
    const getWeather = async () => {
      const WEATHER_URL =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=14.8133&longitude=121.0453" +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m" +
        "&hourly=temperature_2m,weather_code" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
        "&forecast_days=7" +
        "&timezone=Asia%2FManila";
      const AIR_QUALITY_URL =
        "https://air-quality-api.open-meteo.com/v1/air-quality" +
        "?latitude=14.8133&longitude=121.0453" +
        "&current=european_aqi,pm2_5,pm10" +
        "&timezone=Asia%2FManila";

      const response = await fetch(WEATHER_URL);
      const responseAir = await fetch(AIR_QUALITY_URL);
      const data = await response.json();
      const airData = await responseAir.json();
      setTemperature(data.current.temperature_2m);
      setAqi(airData.current.european_aqi);
      console.log("Current:", data.current);
      console.log("Hourly:", data.hourly);
      console.log("Daily:", data.daily);
      console.log("Air quality:", airData.current);
    };

    getWeather();
    const intervalWeather = setInterval(
      () => {
        getWeather();
      },
      15 * 60 * 1000,
    );
    return () => clearInterval(intervalWeather);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <MapPin size={20} color="#1B252F" />
        <Text style={styles.textColor}>San Jose Del Monte, Bulacan</Text>
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.dateText}>{currentDate} • 09:11 AM</Text>

        <View style={styles.weatherDisplay}>
          <CloudSun size={64} color="#E9A23B" strokeWidth={1.8} />
          <Text style={styles.temperature}>{temperature !== null ? `${temperature}°` : "--°"}</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 600, color: "#1B252F" }}>Partly cloudy</Text>
        <View>
          <Text style={{ color: "#657383", padding: 8, fontSize: 16 }}>H: 33° • L: 26°</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
                gap: 6,
              }}
            >
              <Droplet size={16} color={"blue"} />
              <Text style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>Rain 40%</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
                gap: 6,
              }}
            >
              <Leaf size={16} color={"green"} />
              <Text style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>
                Air quality {aqi} • {aqi !== null ? getAqiLabel(aqi) : "--"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ backgroundColor: "white", padding: 16, borderRadius: 16 }}>
          <Text style={{ fontSize: 16 }}>HOURLY</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={{ color: "blue" }}>Now</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>30°</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text>11 AM</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>26°</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={{ color: "blue" }}>Now</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>30°</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={{ color: "blue" }}>Now</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>30°</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={{ color: "blue" }}>Now</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>30°</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={{ color: "blue" }}>Now</Text>
              <CloudSun />
              <Text style={{ fontSize: 16 }}>30°</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFF6",
  },
  header: {
    minHeight: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  textColor: {
    color: "#1B252F",
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  dateText: {
    color: "#657383",
    fontSize: 14,
  },
  weatherDisplay: {
    alignItems: "center",
    gap: -12,
  },
  temperature: {
    color: "#1B252F",
    fontSize: 128,
    fontWeight: "600",
    lineHeight: 130,
    marginTop: -12,
  },
});
