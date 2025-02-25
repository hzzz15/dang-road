"use client"

import { useState, useEffect } from "react"
import "./LiveResert.css"

function LiveResert() {
  const [activeTab, setActiveTab] = useState("walk") // 'walk' 또는 'chat'
  const [walkReport, setWalkReport] = useState(null)

  // 컴포넌트가 마운트될 때 localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedReport = localStorage.getItem("walkReport")
    if (savedReport) {
      try {
        const parsedReport = JSON.parse(savedReport)
        console.log("불러온 산책 리포트:", parsedReport)
        setWalkReport(parsedReport)
      } catch (error) {
        console.error("산책 리포트 파싱 오류:", error)
      }
    }
  }, [])

  // 시간 포맷팅 함수 (분 -> 시간:분 형식)
  const formatTime = (minutes) => {
    if (!minutes) return "00:00"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className="liveresert-container" style={{ minHeight: "100%", overflowY: "auto" }}>
      {/* 헤더 */}
      <header className="liveresert-header">
        <div className="liveresert-header-content">
          <h1>라이브</h1>
          <div className="liveresert-header-buttons">
            <button
              className={`liveresert-header-button ${activeTab === "walk" ? "active" : ""}`}
              onClick={() => setActiveTab("walk")}
            >
              산책 경로
            </button>
            <button
              className={`liveresert-header-button ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              채팅 하기
            </button>
          </div>
        </div>
      </header>
      {/* 산책경로 탭이 활성화되었을 때 메시지 표시 */}
      {activeTab === "walk" && (
        <div className="liveresert-container">
          <div className="liveresert-walk-report-card">
            <div className="liveresert-report-date">{walkReport ? walkReport.date : "0000년 00월 00일"}</div>
            <div className="liveresert-report-title">
              {walkReport ? `${walkReport.dogName} 산책 리포트` : "○○이 산책 리포트"}
            </div>

            <div className="liveresert-profile-section">
              <div className="liveresert-profile-circle liveresert-dog-photo">
                <img
                  src={walkReport?.dogImage || "/dogprofile/dog.jpg"}
                  alt="강아지사진"
                  onError={(e) => {
                    console.error("강아지 이미지 로드 실패")
                    e.target.src = "/dogprofile/dog.jpg"
                  }}
                />
              </div>
              <div className="liveresert-paw-prints">
                <img src="/livereserticons/paw.png" alt="발자국" className="liveresert-paw-icon" />
              </div>
              <div className="liveresert-profile-circle liveresert-user-photo">
                <img
                  src={walkReport?.trainerImage || "/trainerprofile/trainer.jpg"}
                  alt="프로필"
                  onError={(e) => {
                    console.error("트레이너 이미지 로드 실패")
                    e.target.src = "/trainerprofile/trainer.jpg"
                  }}
                />
              </div>
            </div>

            <div className="liveresert-walk-details">
              <div className="liveresert-detail-item">
                <h3>걸음수</h3>
                <p>{walkReport ? `${walkReport.steps} 걸음` : "00"}</p>
              </div>

              <div className="liveresert-detail-item">
                <h3>시간</h3>
                <p>{walkReport ? `${walkReport.time} 분` : "00시00분 ~ 00시00분"}</p>
              </div>

              <div className="liveresert-detail-item">
                <h3>특이사항</h3>
                <div className="liveresert-notes-box">
                  {walkReport?.feedback && <p style={{ padding: "10px", margin: 0 }}>{walkReport.feedback}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 채팅하기 탭이 활성화되었을 때 메시지 표시 */}
      {activeTab === "chat" && <div className="liveresert-chat-message">채팅하기 페이지 아직 미완성</div>}
    </div>
  )
}

export default LiveResert

