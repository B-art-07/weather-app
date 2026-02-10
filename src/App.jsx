import React, { useState } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog
} from "react-icons/wi";
import { IoSearch } from "react-icons/io5";

const api = {
  key: import.meta.env.VITE_OPENWEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

export default function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    try {
      setError("");
      const res = await fetch(
        `${api.base}weather?q=${query}&units=metric&appid=${api.key}`
      );
      const data = await res.json();

      if (data.cod !== 200) setError(data.message);
      else setWeather(data);
    } catch {
      setError("Network error");
    }
  };

  const icon = (type) => {
    switch (type) {
      case "Clouds": return <WiCloudy size={100} />;
      case "Rain": return <WiRain size={100} />;
      case "Snow": return <WiSnow size={100} />;
      case "Thunderstorm": return <WiThunderstorm size={100} />;
      case "Mist":
      case "Haze": return <WiFog size={100} />;
      default: return <WiDaySunny size={100} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white p-4">
      
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">

        {/* Search */}
        <div className="flex items-center bg-white/10 rounded-full px-4 py-3 mb-6">
          <input
            className="bg-transparent w-full outline-none placeholder-white/60"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <button onClick={search}>
            <IoSearch size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-red-300">{error}</p>
        )}

        {/* Weather */}
        {weather && (
          <div className="text-center space-y-4">

            {icon(weather.weather[0].main)}

            <h1 className="text-5xl font-bold">
              {Math.round(weather.main.temp)}°
            </h1>

            <p className="capitalize opacity-80">
              {weather.weather[0].description}
            </p>

            <h2 className="text-xl font-semibold">
              {weather.name}, {weather.sys.country}
            </h2>

            {/* Details */}
            <div className="flex justify-between text-sm mt-6 opacity-80">
              <span>💧 {weather.main.humidity}%</span>
              <span>💨 {weather.wind.speed} m/s</span>
              <span>🌡 {Math.round(weather.main.feels_like)}°</span>
            </div>

          </div>
        )}

        {!weather && !error && (
          <p className="text-center opacity-50">
            Search a city to get weather
          </p>
        )}

      </div>
    </div>
  );
}
