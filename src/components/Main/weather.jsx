import { useState, useEffect } from "react";

function Weather({ city, district }) {
  const [weather, setWeather] = useState(null);
  const API_KEY = "59648956232be7bc7f53e5bebe08c609";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
        );
        if (!response.ok) throw new Error("날씨 데이터를 가져오지 못했습니다.");
        const data = await response.json();
        setWeather({
          city: `${city} ${district}`, // 도시와 구를 합쳐서 표시
          temperature: Math.round(data.main.temp),
          temp_min: Math.round(data.main.temp_min),
          temp_max: Math.round(data.main.temp_max),
          wind_speed: data.wind.speed,
          rain_probability: data.rain ? `${data.rain["1h"] * 10}%` : "0%",
          weather_icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          description: data.weather[0].description,
        });
      } catch (error) {
        console.error("날씨 데이터 가져오기 실패:", error);
        setWeather(null);
      }
    };
    fetchWeather();
  }, [city, district]);

  if (!weather) {
    return <div className="weather-section">날씨 정보를 불러오는 중...</div>;
  }

  return (
    <div className="weather-section">
      <div className="location">{weather.city}</div>
      <div className="current-temp">{weather.temperature}°C</div>
      <div className="weather-right">
        <img src={weather.weather_icon || "/placeholder.svg"} alt="날씨 아이콘" className="weather-icon" />
        <p className="weather-description">{weather.description}</p>
      </div>
      <div className="min-max-temp">
        최저 {weather.temp_min}°C / 최고 {weather.temp_max}°C
      </div>
      <div className="rain-probability">강수 확률: {weather.rain_probability}</div>
    </div>
  );
}

export default Weather;