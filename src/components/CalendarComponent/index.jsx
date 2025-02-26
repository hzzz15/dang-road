"use client"

import { useState } from "react"
import "./CalendarComponent.css"

export default function CalendarComponent({ selectedDate, setSelectedDate }) {
  // 내부에서 선택된 날짜 상태 관리
  const [internalSelectedDate, setInternalSelectedDate] = useState(null)

  const isPastDate = (date, month) => {
    // 2025년 2월 27일까지를 과거 날짜로 처리
    const today = new Date(2025, 1, 27) // 2025년 2월 27일
    const checkDate = new Date(2025, month, date)
    return checkDate <= today
  }

  const isToday = (date) => {
    return date === 28 // 2025년 2월 28일을 오늘로 표시
  }

  const calendar = [
    [
      { date: 26, month: 0 },
      { date: 27, month: 0 },
      { date: 28, month: 0 },
      { date: 29, month: 0 },
      { date: 30, month: 0 },
      { date: 31, month: 0 },
      { date: 1, month: 1 },
    ],
    [
      { date: 2, month: 1 },
      { date: 3, month: 1 },
      { date: 4, month: 1 },
      { date: 5, month: 1 },
      { date: 6, month: 1 },
      { date: 7, month: 1 },
      { date: 8, month: 1 },
    ],
    [
      { date: 9, month: 1 },
      { date: 10, month: 1 },
      { date: 11, month: 1 },
      { date: 12, month: 1 },
      { date: 13, month: 1 },
      { date: 14, month: 1 },
      { date: 15, month: 1 },
    ],
    [
      { date: 16, month: 1 },
      { date: 17, month: 1 },
      { date: 18, month: 1 },
      { date: 19, month: 1 },
      { date: 20, month: 1 },
      { date: 21, month: 1 },
      { date: 22, month: 1 },
    ],
    [
      { date: 23, month: 1 },
      { date: 24, month: 1 },
      { date: 25, month: 1 },
      { date: 26, month: 1 },
      { date: 27, month: 1 },
      { date: 28, month: 1 },
      { date: 1, month: 2 },
    ],
  ]

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  const handleDateClick = (date, month) => {
    if (!isPastDate(date, month) && month === 1) {
      // 내부 상태만 변경하고 외부 상태는 변경하지 않음
      setInternalSelectedDate(date)
      // 클릭 시 시각적 효과만 유지하고 다른 기능은 제거
    }
  }

  return (
    <div className="calendar-component">
      <div className="calendar-header">
        <button className="calendar-arrow">‹</button>
        <span className="calendar-month-text">2025년 2월</span>
        <button className="calendar-arrow">›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-dates">
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.map(({ date, month }) => (
                <button
                  key={`${weekIndex}-${date}-${month}`}
                  className={`calendar-date ${isPastDate(date, month) ? "calendar-past" : ""} ${
                    internalSelectedDate === date && month === 1 ? "calendar-selected" : ""
                  } ${isToday(date) && month === 1 ? "calendar-today" : ""} ${
                    month !== 1 ? "calendar-other-month" : ""
                  }`}
                  onClick={() => handleDateClick(date, month)}
                  disabled={isPastDate(date, month) || month !== 1}
                >
                  {date}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

