import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplet,
  Leaf,
  MapPin,
  Thermometer,
  ThermometerSun,
  Wind,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HourlyWeather = {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const [temperature, setTemperature] = useState<Number | null>(null);
  const [appTemp, setAppTemp] = useState<Number | null>(null);
  const [humidity, setHumidity] = useState<Number | null>(null);
  const [windSpeed, setWindSpeed] = useState<Number | null>(null);
  const [windDirection, setWindDirection] = useState<number | null>(null);
  const [rainChance, setRainChance] = useState<number | null>(null);
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [hourly, setHourly] = useState<HourlyWeather | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    weekday: "long",
    day: "numeric",
  });

  const currentTime = new Date();

  const isCurrentHour =
    hourly?.time.findIndex((time) => {
      const now = new Date();
      const date = new Date(time);

      return date.getHours() === now.getHours() && date.getDate() === now.getDate();
    }) ?? 0;
  const formatTime12hrs = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = String(hours % 12 || 12).padStart(2, "0");
    const formatMin = String(minutes).padStart(2, "0");

    return `${hour12}:${formatMin} ${period}`;
  };

  const formatHourly = (time: string) => {
    const date = new Date(time);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };
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

  function getWindDirection(degrees: number): string {
    const directions = [
      "North",
      "North East",
      "East",
      "South East",
      "South",
      "South West",
      "West",
      "North West",
    ];

    return directions[Math.round(degrees / 45) % 8];
  }

  function getUVLabel(uv: number): string {
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
  }

  useEffect(() => {
    const getWeather = async () => {
      const WEATHER_URL =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=14.8133&longitude=121.0453" +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,precipitation_probability" +
        "&hourly=temperature_2m,weather_code" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max" +
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
      setAppTemp(data.current.apparent_temperature);
      setHumidity(data.current.relative_humidity_2m);
      setWindSpeed(data.current.wind_speed_10m);
      setWindDirection(data.current.wind_direction_10m);
      setRainChance(data.current.precipitation_probability);
      setPrecipitation(data.current.precipitation);
      setUvIndex(data.daily.uv_index_max[0]);
      setAqi(airData.current.european_aqi);
      setHourly(data.hourly);
      console.log("Current:", data.current);
      console.log("Hourly:", data.hourly);
      console.log("Daily:", data.daily);
      console.log("Air quality:", airData.current);
    };
    // hourly?.time.map((t) => console.log(formatHourly(t)));
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <MapPin size={20} color="#1B252F" />
        <Text style={styles.textColor}>San Jose Del Monte, Bulacan</Text>
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.dateText}>
          {currentDate} • {formatTime12hrs(currentTime.getHours(), currentTime.getHours())}
        </Text>

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
              <Text style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>
                Rain {rainChance}%
              </Text>
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
      {/* Houry weather */}
      <View style={{ padding: 16 }}>
        <View style={{ backgroundColor: "white", padding: 16, borderRadius: 16 }}>
          <Text style={{ fontSize: 16 }}>HOURLY</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            {hourly?.time.slice(isCurrentHour, isCurrentHour + 5).map((time, index) => {
              const actualTemp = isCurrentHour + index;
              return (
                <View
                  key={time}
                  style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
                >
                  <Text style={{ color: "blue" }}>{index === 0 ? "Now" : formatHourly(time)}</Text>
                  <CloudSun />
                  <Text style={{ fontSize: 16 }}>{hourly.temperature_2m[actualTemp]}°</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      {/* Weather data */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Thermometer size={14} color={"#657383"} />
            <Text style={{ color: "#657383", fontSize: 11.5 }}>Feels like</Text>
          </View>
          <Text style={{ color: "#1B252F", fontWeight: 700, fontSize: 20 }}>
            {appTemp !== null ? `${appTemp}` : "--"}°
          </Text>
          {/* <Text style={{ color: "#657383", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>

        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Droplet size={14} color={"#657383"} />
            <Text style={{ color: "#657383", fontSize: 11.5 }}>Humidity</Text>
          </View>
          <Text style={{ color: "#1B252F", fontWeight: 700, fontSize: 20 }}>
            {appTemp !== null ? `${humidity}` : "--"}%
          </Text>
          {/* <Text style={{ color: "#657383", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Wind size={14} color={"#657383"} />
            <Text style={{ color: "#657383", fontSize: 11.5 }}>Wind</Text>
          </View>
          <Text style={{ color: "#1B252F", fontWeight: 700, fontSize: 20 }}>
            {appTemp !== null ? `${windSpeed} km/h` : "--"}{" "}
            {windDirection !== null ? getWindDirection(windDirection) : "--"}
          </Text>
          {/* <Text style={{ color: "#657383", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CloudRain size={14} color={"#657383"} />
            <Text style={{ color: "#657383", fontSize: 11.5 }}>Precipitation</Text>
          </View>
          <Text style={{ color: "#1B252F", fontWeight: 700, fontSize: 20 }}>
            {precipitation !== null ? `${precipitation}` : "--"}%
          </Text>
          {/* <Text style={{ color: "#657383", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ThermometerSun size={14} color={"#657383"} />
            <Text style={{ color: "#657383", fontSize: 11.5 }}>UV Index</Text>
          </View>
          <Text style={{ color: "#1B252F", fontWeight: 700, fontSize: 20 }}>
            {uvIndex !== null ? `${uvIndex} ${getUVLabel(uvIndex)}` : "--"}
          </Text>
          {/* <Text style={{ color: "#657383", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
      </View>
    </ScrollView>
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
