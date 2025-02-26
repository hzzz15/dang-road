import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import "./Main_T.css"
import Weather from "./weather";

function Main_T() {
  const navigate = useNavigate()
  const [weatherLocation, setWeatherLocation] = useState(() => {
    // 초기 상태를 로컬 스토리지에서 가져오거나 기본값 설정
    const storedWeatherLocation = localStorage.getItem('weatherLocation');
    return storedWeatherLocation ? JSON.parse(storedWeatherLocation) : { city: '천안시', district: '동남구' };
  });

  useEffect(() => {
    // 로컬 스토리지에서 날씨 정보를 가져옴
    const storedWeatherLocation = localStorage.getItem('weatherLocation');
    if (storedWeatherLocation) {
      setWeatherLocation(JSON.parse(storedWeatherLocation));
    }
  }, []);

  const handleClick = (item) => {
    switch (item) {
      case "MyProfile_T":
        navigate("/MyProfilePage")
        break
      case "Reservation_T":
        navigate("/Reservation_TPage")
        break
      case "Review_T":
        navigate("/Review_TPage")
        break
      case "Review":
        navigate("/ReviewPage")
        break
      default:
        console.log("Unknown item")
    }
  }

  return (
    <div className="Main_T-container" style={{ minHeight: "100%", overflowY: "auto" }}>
      <header>
        <h1>
          <img src="/mainicons/logo.png" alt="로고" className="Main_T-logo" />
        </h1>
      </header>

      <main className="main-t-content">
        <div className="Main_T-weather-section">
          {weatherLocation.city && weatherLocation.district ? (
            <Weather city={weatherLocation.city} district={weatherLocation.district} />
          ) : (
            <div>날씨 정보를 불러오는 중...</div>
          )}
        </div>

        <div className="Main_T-mbti-card clickable-card" onClick={() => handleClick("MyProfile_T")}>
          <h2>MY 프로필</h2>
        </div>

        <div className="Main_T-info-grid">
          <div className="Main_T-info-card clickable-card" onClick={() => handleClick("Reservation_T")}>
            <h3>지난 흔적 <br/>돌아보기</h3>
            <p></p>
            <p></p>
          </div>
          <div className="Main_T-info-card clickable-card" onClick={() => handleClick("Review_T")}>
            <h3>내 후기들</h3>
            <p></p>
            <p></p>
          </div>
        </div>
        <div className="Main_T-review-section clickable-card" onClick={() => handleClick("Review")}>
          <h3>후기</h3>
          <div className="Main_T-tags">
            <button className="Main_T-tag">소통 원활성</button>
            <button className="Main_T-tag">청결도</button>
            <button className="Main_T-tag">상황 공유</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Main_T