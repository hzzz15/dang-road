"use client"

import { useState, useEffect, useRef } from "react"
import "./Live.css"
import Map from "../Map"

function Live() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("walk")
  const mapRef = useRef(null); // ✅ Map 컴포넌트에 대한 ref 추가

  // ✅ 산책 시작 상태 감지를 위한 이벤트 리스너
  useEffect(() => {
    // localStorage 변경 감지 함수
    const checkWalkStatus = () => {
      try {
        const walkData = localStorage.getItem("walkStarted");
        if (!walkData) return;

        const data = JSON.parse(walkData);
        const now = new Date().getTime();
        const isRecent = now - data.timestamp < 10000; // 10초 이내

        if (isRecent && data.started) {
          console.log("✅ Live 컴포넌트: 산책 시작 감지, Map 위치 갱신");
          if (mapRef.current && mapRef.current.updateCurrentLocation) {
            mapRef.current.updateCurrentLocation();
          }
          // 처리 후 데이터 삭제
          localStorage.removeItem("walkStarted");
        } else if (!isRecent) {
          // 오래된 데이터 삭제
          localStorage.removeItem("walkStarted");
        }
      } catch (error) {
        console.error("산책 상태 확인 오류:", error);
      }
    };

    // 초기 실행
    checkWalkStatus();

    // BroadcastChannel 설정
    let bc;
    try {
      bc = new BroadcastChannel("walk_channel");
      bc.onmessage = (event) => {
        console.log("📡 Live 컴포넌트: 산책 채널 메시지 수신:", event.data);
        if (event.data && event.data.action === "walkStarted") {
          console.log("✅ Live 컴포넌트: 산책 시작 메시지 수신, Map 위치 갱신");
          if (mapRef.current && mapRef.current.updateCurrentLocation) {
            mapRef.current.updateCurrentLocation();
          }
        }
      };
    } catch (error) {
      console.error("브로드캐스트 채널 오류:", error);
    }

    // storage 이벤트 리스너 등록
    const handleStorageChange = (e) => {
      if (e.key === "walkStarted") {
        checkWalkStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // 주기적으로 확인 (폴링)
    const interval = setInterval(checkWalkStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
      if (bc) bc.close();
    };
  }, []);

  // 기존 localStorage 네비게이션 관련 useEffect 유지
  useEffect(() => {
    // localStorage 변경 감지 함수
    const checkNavigation = () => {
      try {
        const trigger = localStorage.getItem("navigationTrigger")
        if (!trigger) return

        console.log("🔍 네비게이션 트리거 확인:", trigger)

        const data = JSON.parse(trigger)

        // 10초 이내의 트리거만 처리 (시간 범위 확장)
        const now = new Date().getTime()
        const isRecent = now - data.timestamp < 10000 // 10초로 확장

        console.log("⏱️ 트리거 시간 차이:", now - data.timestamp, "ms, 유효:", isRecent)

        if (isRecent && data.action === "navigate") {
          console.log("✅ 유효한 트리거 발견, 페이지 이동 시작:", data.target)

          // 트리거 데이터 삭제
          localStorage.removeItem("navigationTrigger")

          // 페이지 이동
          window.location.href = data.target
        } else if (!isRecent) {
          // 오래된 트리거 삭제
          localStorage.removeItem("navigationTrigger")
          console.log("🗑️ 오래된 트리거 삭제")
        }
      } catch (error) {
        console.error("Navigation check error:", error)
      }
    }

    // 초기 실행
    checkNavigation()

    // BroadcastChannel 설정 (추가)
    let bc
    try {
      bc = new BroadcastChannel("navigation_channel")
      bc.onmessage = (event) => {
        console.log("📡 브로드캐스트 메시지 수신:", event.data)
        if (event.data && event.data.action === "navigate") {
          console.log("✅ 브로드캐스트 메시지로 페이지 이동 시작:", event.data.target)
          window.location.href = event.data.target
        }
      }
    } catch (error) {
      console.error("브로드캐스트 채널 오류:", error)
    }

    // storage 이벤트 리스너 등록
    const handleStorageChange = (e) => {
      console.log("🔄 스토리지 변경 감지:", e.key)
      if (e.key === "navigationTrigger") {
        checkNavigation()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 주기적으로 확인 (폴링) - 더 자주 확인
    const interval = setInterval(checkNavigation, 300) // 300ms로 단축

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
      if (bc) bc.close()
    }
  }, [])

  // 트레이너의 자동 응답 메시지 설정
  const getTrainerResponse = (userMessage) => {
    if (userMessage.includes("지금 바로 산책 요청할 수 있나요?")) {
      return "현재 일정 확인 후 가능한 시간에 알려드릴게요!"
    } else if (userMessage.includes("언제 가능해요")) {
      return "내일 오후 3시에 가능합니다."
    } else if (userMessage.includes("산책할 때 우리 집 주변에서 해주실 수 있나요?")) {
      return "네! 원하시는 경로가 있으면 알려주세요!"
    } else if (userMessage.includes("산책 중에 간식도 줄 수 있나요?")) {
      return "네! 보호자님이 주시는 간식이라면 산책 중에 급여 가능합니다."
    } else if (userMessage.includes("우리 강아지가 겁이 많아서 천천히 산책해 주실 수 있을까요?")) {
      return "네! 강아지 속도에 맞춰 편하게 산책할 수 있도록 할게요."
    } else if (userMessage.includes("산책 후에 강아지가 어땠는지 피드백 받을 수 있나요?")) {
      return "네! 컨디션이나 행동 패턴을 간단히 정리해서 보내드릴게요!"
    } else if (userMessage.includes("안녕하세요")) {
      return "안녕하세요!"
    } else {
      return "네, 알겠습니다!"
    }
  }

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  // 메시지 전송 핸들러
  const sendMessage = () => {
    if (!message.trim() || isSending) return

    setIsSending(true)

    const userMessage = message.trim()
    setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: "user" }])

    setMessage("")

    setTimeout(() => {
      const trainerReply = getTrainerResponse(userMessage)
      setMessages((prevMessages) => [...prevMessages, { text: trainerReply, sender: "trainer" }])
      setIsSending(false)
    }, 1000)
  }

  return (
    <div className="live-container" style={{ minHeight: "100%", overflowY: "auto", overflowX: "hidden" }}>
      {/* 헤더 */}
      <header className="live-header">
        <div className="live-header-content">
          <h1>라이브</h1>
          <div className="live-header-buttons">
            <button
              className={`live-header-button ${activeTab === "walk" ? "active" : ""}`}
              onClick={() => setActiveTab("walk")}
            >
              산책 경로
            </button>
            <button
              className={`live-header-button ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              채팅 하기
            </button>
          </div>
        </div>
      </header>

      {/* 산책경로 탭이 활성화되었을 때 Map 컴포넌트 표시 */}
      {activeTab === "walk" && (
        <div className="live-map-container">
          <Map ref={mapRef} /> {/* ✅ ref 추가 */}
        </div>
      )}

      {/* 채팅하기 탭이 활성화되었을 때 메시지 표시 */}
      {activeTab === "chat" && (
        <div className="live-chat-container">
          {/* 채팅 메시지 영역 (스크롤 가능) */}
          <div className="live-chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`live-chat-message ${msg.sender === "user" ? "user" : "trainer"}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* 입력창 (하단 고정) */}
          <div className="live-chat-input-wrapper">
            <div className="live-chat-input-container">
              <input
                type="text"
                className="live-chat-input"
                value={message}
                onChange={handleInputChange}
                placeholder="메시지를 입력하세요..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <button className="live-chat-send-button" onClick={sendMessage} disabled={isSending}>
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Live