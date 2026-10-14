import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplet,
  Leaf,
  LucideIcon,
  MapPin,
  Snowflake,
  Sun,
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
type DailyWeather = {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: string[];
  uv_index_max: number[];
  weather_code: number[];
};
type WeatherInfo = {
  label: string;
  icon: LucideIcon;
  color: string;
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const [weatherCurrentCode, setWeatherCurrentCode] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [minTemperature, setMinTemperature] = useState<number | null>(null);
  const [maxTemperature, setMaxTemperature] = useState<number | null>(null);
  const [appTemp, setAppTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [windDirection, setWindDirection] = useState<number | null>(null);
  const [rainChance, setRainChance] = useState<number | null>(null);
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [hourly, setHourly] = useState<HourlyWeather | null>(null);
  const [dailyWeather, setDailyWeather] = useState<DailyWeather | null>(null);
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
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };

  const formatDailyDate = (time: string) => {
    const date = new Date(time);

    const weekdays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

    const weekday = weekdays[(date.getDay() + 6) % 7];

    return weekday;
  };

  const dailyAveTemp = (index: number) => {
    const min = dailyWeather?.temperature_2m_min[index];
    const max = dailyWeather?.temperature_2m_max[index];

    if (min == null || max == null) return null;

    return (min + max) / 2;
  };

  const weatherCodes: Record<number, WeatherInfo | undefined> = {
    0: { label: "Clear sky", icon: Sun, color: "#F5A623" },
    1: { label: "Mainly clear", icon: CloudSun, color: "#F0B13F" },
    2: { label: "Partly cloudy", icon: CloudSun, color: "#E9B54F" },
    3: { label: "Overcast", icon: Cloud, color: "#8A9BB0" },
    45: { label: "Fog", icon: CloudFog, color: "#A3B1C2" },
    48: { label: "Depositing rime fog", icon: CloudFog, color: "#97A6B8" },
    51: { label: "Light drizzle", icon: CloudDrizzle, color: "#7FB2E0" },
    53: { label: "Moderate drizzle", icon: CloudDrizzle, color: "#6FA8DC" },
    55: { label: "Dense drizzle", icon: CloudDrizzle, color: "#5B97D3" },
    56: { label: "Light freezing drizzle", icon: CloudDrizzle, color: "#6CC0DC" },
    57: { label: "Dense freezing drizzle", icon: CloudDrizzle, color: "#52B0D2" },
    61: { label: "Slight rain", icon: CloudRain, color: "#5A9BE0" },
    63: { label: "Moderate rain", icon: CloudRain, color: "#3B7DD8" },
    65: { label: "Heavy rain", icon: CloudRain, color: "#2F5FB3" },
    66: { label: "Light freezing rain", icon: CloudRain, color: "#4FB0D8" },
    67: { label: "Heavy freezing rain", icon: CloudRain, color: "#3A9CC8" },
    71: { label: "Slight snowfall", icon: CloudSnow, color: "#8FC3EA" },
    73: { label: "Moderate snowfall", icon: CloudSnow, color: "#7BB5E6" },
    75: { label: "Heavy snowfall", icon: CloudSnow, color: "#639FD8" },
    77: { label: "Snow grains", icon: Snowflake, color: "#8CC8E8" },
    80: { label: "Slight rain showers", icon: CloudRain, color: "#4C8DE0" },
    81: { label: "Moderate rain showers", icon: CloudRain, color: "#3B7DD8" },
    82: { label: "Violent rain showers", icon: CloudRain, color: "#2A4F9E" },
    85: { label: "Slight snow showers", icon: CloudSnow, color: "#86BDE8" },
    86: { label: "Heavy snow showers", icon: CloudSnow, color: "#6AA5DC" },
    95: { label: "Thunderstorm", icon: CloudLightning, color: "#7A5AC8" },
    96: { label: "Thunderstorm with slight hail", icon: CloudHail, color: "#5C7FA8" },
    97: { label: "Heavy thunderstorm", icon: CloudLightning, color: "#5B3FA8" },
    99: { label: "Thunderstorm with heavy hail", icon: CloudHail, color: "#4A6C99" },
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
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

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
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,precipitation_probability,uv_index,temperature_2m_min,temperature_2m_max" +
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
      setWeatherCurrentCode(data.current.weather_code);
      setMaxTemperature(data.daily.temperature_2m_max[0]);
      setMinTemperature(data.daily.temperature_2m_min[0]);
      setUvIndex(data.current.uv_index);
      setAqi(airData.current.european_aqi);
      setHourly(data.hourly);
      setDailyWeather(data.daily);
      console.log("Current:", data.current);
      console.log("Hourly:", data.hourly);
      console.log("Daily:", data.daily);
      // console.log("Air quality:", airData.current);
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
  const currentWeather = weatherCodes[weatherCurrentCode ?? -1];
  const CurrentIcon = currentWeather?.icon;
  const currentWeatherLabel = currentWeather?.label ?? "Loading weather...";
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <MapPin size={20} color="#2B3A4F" />
        <Text style={styles.textColor}>San Jose Del Monte, Bulacan</Text>
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.dateText}>
          {currentDate} • {formatTime12hrs(currentTime.getHours(), currentTime.getMinutes())}
        </Text>
        <View style={styles.conditionRow}>
          {CurrentIcon && (
            <CurrentIcon size={32} strokeWidth={1.8} color={currentWeather?.color ?? "#4F86C6"} />
          )}
          <Text style={styles.conditionText}>{currentWeatherLabel}</Text>
        </View>
        <View style={styles.weatherDisplay}>
          <View style={styles.temperatureRow}>
            <Text style={styles.temperature}>{temperature ?? "--"}</Text>
            <Text style={styles.degree}>°</Text>
          </View>
        </View>

        <Text style={styles.highLow}>
          H: {maxTemperature ?? "--"}° • L: {minTemperature ?? "--"}°
        </Text>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Droplet size={16} color="#2F80ED" />
            <Text style={styles.chipText}>Rain {rainChance ?? "--"}%</Text>
          </View>
          <View style={styles.chip}>
            <Leaf size={16} color="#3FA66B" />
            <Text style={styles.chipText}>
              Air quality {aqi ?? "--"} • {aqi !== null ? getAqiLabel(aqi) : "--"}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 16, gap: 8 }}>
        {/* Houry weather */}

        <View
          style={{
            backgroundColor: "#F8FBFF",
            padding: 16,
            borderRadius: 16,
            gap: 2,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#2B3A4F" }}>Hourly</Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}
          >
            {hourly?.time.slice(isCurrentHour, isCurrentHour + 5).map((time, index) => {
              const actualTemp = isCurrentHour + index;
              const weather = weatherCodes[hourly.weather_code[actualTemp]];
              const WeatherIcon = weather?.icon;

              return (
                <View
                  key={time}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: index === 0 ? "#2F80ED" : "#9AABC0",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {index === 0 ? "Now" : formatHourly(time)}
                  </Text>

                  {WeatherIcon && <WeatherIcon color={weather?.color ?? "#6C8EBF"} />}

                  <Text style={{ fontSize: 12, color: "#2B3A4F" }}>
                    {hourly.temperature_2m[actualTemp]}°
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ backgroundColor: "#F8FBFF", padding: 16, borderRadius: 16, gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#2B3A4F" }}>Daily</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            {dailyWeather?.time.map((time, index) => {
              const weather = weatherCodes[dailyWeather.weather_code[index]];
              const WeatherIcon = weather?.icon;
              return (
                <View
                  key={time}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={
                      index === 0
                        ? { color: "#2F80ED", fontSize: 12 }
                        : { color: "#9AABC0", fontSize: 12 }
                    }
                  >
                    {index === 0 ? "Today" : formatDailyDate(time)}
                  </Text>
                  {WeatherIcon && <WeatherIcon color={weather?.color ?? "#6C8EBF"} />}
                  <Text style={{ fontSize: 12, color: "#2B3A4F" }}>
                    {dailyAveTemp(index)?.toFixed(1) ?? "--"}°
                  </Text>
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
            backgroundColor: "#F8FBFF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Thermometer size={14} color={"#6B7F99"} />
            <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Feels Like Temp</Text>
          </View>
          <Text style={{ color: "#2B3A4F", fontWeight: 700, fontSize: 20 }}>
            {appTemp !== null ? `${appTemp}` : "--"}°
          </Text>
          {/* <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>

        <View
          style={{
            backgroundColor: "#F8FBFF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Droplet size={14} color={"#6B7F99"} />
            <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humidity</Text>
          </View>
          <Text style={{ color: "#2B3A4F", fontWeight: 700, fontSize: 20 }}>
            {humidity !== null ? `${humidity}` : "--"}%
          </Text>
          {/* <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "#F8FBFF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Wind size={14} color={"#6B7F99"} />
            <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Wind</Text>
          </View>
          <Text style={{ color: "#2B3A4F", fontWeight: 700, fontSize: 20 }}>
            {appTemp !== null ? `${windSpeed} km/h` : "--"}{" "}
            {windDirection !== null ? getWindDirection(windDirection) : "--"}
          </Text>
          {/* <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "#F8FBFF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CloudRain size={14} color={"#6B7F99"} />
            <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Precipitation</Text>
          </View>
          <Text style={{ color: "#2B3A4F", fontWeight: 700, fontSize: 20 }}>
            {precipitation !== null ? `${precipitation}mm` : "--"}
          </Text>
          {/* <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "#F8FBFF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 16,
            width: "49%",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ThermometerSun size={14} color={"#6B7F99"} />
            <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>UV Index</Text>
          </View>
          <Text style={{ color: "#2B3A4F", fontWeight: 700, fontSize: 20 }}>
            {uvIndex !== null ? `${uvIndex} ${getUVLabel(uvIndex)}` : "--"}
          </Text>
          {/* <Text style={{ color: "#6B7F99", fontSize: 11.5 }}>Humid, feels warmer</Text> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEBFA",
  },
  header: {
    minHeight: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  textColor: {
    color: "#2B3A4F",
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  dateText: {
    color: "#6B7F99",
    fontSize: 13,
  },
  weatherDisplay: {
    alignItems: "center",
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2B3A4F",
  },
  temperatureRow: {
    alignSelf: "center",
    marginTop: 4,
  },
  temperature: {
    color: "#2B3A4F",
    fontSize: 128,
    fontWeight: "600",
    lineHeight: 136,
    includeFontPadding: false,
  },
  degree: {
    position: "absolute",
    left: "100%",
    top: 10,
    color: "#2B3A4F",
    fontSize: 56,
    fontWeight: "600",
    lineHeight: 60,
    includeFontPadding: false,
  },
  highLow: {
    color: "#6B7F99",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
    color: "#2B3A4F",
  },
});
