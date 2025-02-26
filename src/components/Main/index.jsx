"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./Main.css"
import Weather from "./weather"
import { supabase } from "../../lib/supabaseClient"

function Main() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [weatherLocation, setWeatherLocation] = useState(() => {
    const storedWeatherLocation = localStorage.getItem("weatherLocation")
    return storedWeatherLocation ? JSON.parse(storedWeatherLocation) : { city: "천안시", district: "동남구" }
  })

  // ✅ 로그인 상태 확인 (Supabase 세션 기반)
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("🚨 세션 가져오기 실패:", error.message)
        setIsLoggedIn(false)
        return
      }

      if (session) {
        console.log("✅ 로그인된 사용자 정보:", session.user)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }
    checkSession()

    // 날씨 정보를 로컬 스토리지에 저장
    localStorage.setItem("weatherLocation", JSON.stringify(weatherLocation))
  }, [weatherLocation])

  // ✅ 버튼 클릭 핸들러 (로그인 체크 후 이동)
  const handleClick = (item) => {
    console.log("현재 로그인 상태:", isLoggedIn)

    if (!isLoggedIn) {
      console.log("로그인 필요! 인트로 페이지로 이동")
      navigate("/IntroPage")
      return
    }

    switch (item) {
      case "dbti":
        navigate("/DbtiPage")
        break
      case "walk":
        navigate("/WalkPage")
        break
      case "temporarycare":
        navigate("/TemporaryCarePage")
        break
      case "review":
        navigate("/ReviewPage")
        break
      default:
        console.log("Unknown item")
    }
  }

  return (
    <div className="main-container" style={{ minHeight: "100%", overflowY: "auto" }}>
      <header>
        <h1>
          <img src="/mainicons/logo.png" alt="로고" className="main-logo" />
        </h1>
      </header>

      <main className="main-content">
        <div className="main-weather-section">
          {weatherLocation.city && weatherLocation.district ? (
            <Weather city={weatherLocation.city} district={weatherLocation.district} />
          ) : (
            <div>날씨 정보를 불러오는 중...</div>
          )}
        </div>

        <div className="dbti-card main-dbti-card clickable-card" onClick={() => handleClick("dbti")}>
          <h2>우리 댕댕이의 <br/>댕BTI는?!</h2>
          <div className="main-dog-images">
            <img src="/img/dog1.png" alt="강아지1" className="main-dog-image1" />
            <img src="/img/dog1.png" alt="강아지1" className="main-dog-image1-2" />
          </div>
        </div>

        <div className="main-info-grid">
          <div className="walk-card main-info-card clickable-card" onClick={() => handleClick("walk")}>
            <h3>산책</h3>
            <p>GPS 경로로 함께</p>
            <p>산책 로드 확인</p>
            <div className="main-dog-images">
              <img src="/img/dog2.png" alt="강아지2" className="main-dog-image2" />
              <img src="/img/dog3.png" alt="강아지3" className="main-dog-image3" />
            </div>
          </div>
          <div className="care-card main-info-card clickable-card" onClick={() => handleClick("temporarycare")}>
            <h3>임시보호</h3>
            <p>유기견에게</p>
            <p>임시 쉼터를</p>
            <div className="main-dog-images">
              <img src="/img/dog4.png" alt="강아지4" className="main-dog-image4" />
              <img src="/img/dog5.png" alt="강아지5" className="main-dog-image5" />
              <img src="/img/dog6.png" alt="강아지6" className="main-dog-image6" />
            </div>
          </div>
        </div>

        <div className="main-review-section clickable-card" onClick={() => handleClick("review")}>
          <h3>후기</h3>
          <div className="main-tags">
            <button className="main-tag">소통 원활성</button>
            <button className="main-tag">청결도</button>
            <button className="main-tag">상황 공유</button>
          </div>
          {/* <div className="main-dog-images">
            <img src="/img/dog7.png" alt="강아지7" className="main-dog-image7" />
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default Main

