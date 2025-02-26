"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Reservation2_T.css"
import CalendarComponent from "../CalendarComponent"

function Reservation2_T() {
  const navigate = useNavigate()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleOnClick = () => {
    setIsNavigating(true)

    setTimeout(() => {
      navigate("/Reservation_TPage")
    }, 2000) // 2 seconds delay
  }

  return (
    <div className="reservation2-t-container">
      <header className="reservation2-t-header">
        <div className="reservation2-t-header-content">
          <h1>예약내역</h1>
          <div className="reservation2-t-header-buttons">
            <button className="reservation2-t-header-button active">진행 예약</button>
            <Link
              to="/Last_TPage"
              className="reservation2-t-header-button"
              style={{ background: "none", border: "none", textDecoration: "none" }}
            >
              지난 예약
            </Link>
          </div>
        </div>
      </header>
      <main className="reservation2-t-main">
        <CalendarComponent />
        <div className="reservation2-t-matching-text">{isNavigating ? "매칭 중..." : "매칭을 시작하시겠습니까?"}</div>
        <div className="reservation2-t-toggle-buttons">
          <button
            className={`reservation2-t-switch-btn on ${isNavigating ? "disabled" : ""}`}
            onClick={handleOnClick}
            disabled={isNavigating}
          >
            ON
          </button>
          <button className="reservation2-t-switch-btn off" disabled={isNavigating}>
            OFF
          </button>
        </div>
      </main>
      <div className="reservation2-t-bottom-space"></div>
    </div>
  )
}

export default Reservation2_T

