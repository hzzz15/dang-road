import React, { useState } from "react";
import "./Live.css";
import Map from "../Map";

function Live() {
  const [message, setMessage] = useState(""); // 현재 입력된 메시지
  const [messages, setMessages] = useState([]); // 채팅 메시지 리스트
  const [isSending, setIsSending] = useState(false); // ✅ 중복 전송 방지 플래그
  const [activeTab, setActiveTab] = useState("walk"); // 현재 활성화된 탭 ('walk' | 'chat')
  const [walkData, setWalkData] = useState({
    uuidId: null,
    distance: 0,
    steps: 0,
    time: 0,
    startLocation: null,
    endLocation: null,
  });

  // ✅ Map에서 받은 데이터 저장
  const handleRouteData = (data) => {
    console.log("📥 Map에서 받은 데이터:", data);
    setWalkData({
      uuidId: data.uuidId,
      distance: data.distance,
      steps: data.steps,
      time: data.time,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
    });
  };

  // ✅ 트레이너의 자동 응답 메시지 설정
  const getTrainerResponse = (userMessage) => {
    if (userMessage.includes("지금 바로 산책 요청할 수 있나요?")) {
      return "현재 일정 확인 후 가능한 시간에 알려드릴게요!";
    } else if (userMessage.includes("언제 가능해요")) {
      return "내일 오후 3시에 가능합니다.";
    } else if (userMessage.includes("산책할 때 우리 집 주변에서 해주실 수 있나요?")) {
      return "네! 원하시는 경로가 있으면 알려주세요!";
    }else if (userMessage.includes("산책 중에 간식도 줄 수 있나요?")) {
      return "네! 보호자님이 주시는 간식이라면 산책 중에 급여 가능합니다.";
    }else if (userMessage.includes("우리 강아지가 겁이 많아서 천천히 산책해 주실 수 있을까요?")) {
      return "네! 강아지 속도에 맞춰 편하게 산책할 수 있도록 할게요.";
    }else if (userMessage.includes("산책 후에 강아지가 어땠는지 피드백 받을 수 있나요?")) {
      return "네! 컨디션이나 행동 패턴을 간단히 정리해서 보내드릴게요!";
    }else if (userMessage.includes("안녕하세요")) {
      return "안녕하세요!";
    } else {
      return "네, 알겠습니다!";
    }
  };

  // ✅ 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // ✅ 메시지 전송 핸들러 (중복 전송 방지 + 트레이너 답장 2초 지연)
  const sendMessage = () => {
    if (!message.trim() || isSending) return; // ✅ 빈 메시지 또는 중복 실행 방지

    setIsSending(true); // ✅ 전송 중 상태로 변경

    const userMessage = message.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: "user" }, // ✅ 사용자 메시지 추가
    ]);

    setMessage(""); // ✅ 입력창 초기화

    // ✅ 2초 뒤에 트레이너 답장 추가
    setTimeout(() => {
      const trainerReply = getTrainerResponse(userMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: trainerReply, sender: "trainer" } // ✅ 트레이너 자동 응답 추가 (2초 지연)
      ]);
      setIsSending(false); // ✅ 일정 시간 후 다시 전송 가능하게 변경
    }, 1000); // ✅ 2000ms = 2초 후 응답
  };
  
  return (
    <div className="live-container" style={{ minHeight: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
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
          <Map onDataReady={handleRouteData}/>
        </div>
      )}
      
      {/* 채팅하기 탭이 활성화되었을 때 메시지 표시 */}
      {activeTab === "chat" &&
        <div className="live-chat-container">
        {/* 채팅 메시지 영역 (스크롤 가능) */}
          <div className="live-chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`live-chat-message ${msg.sender === "user" ? "user" : "trainer"}`}
              >
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
                placeholder="메시지를 입력하세요..." // ✅ 플레이스홀더 추가
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // ✅ Enter 키 중복 방지
                    sendMessage();
                  }
                }}
              />
              <button className="live-chat-send-button" onClick={sendMessage} disabled={isSending}>
                전송
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Live;