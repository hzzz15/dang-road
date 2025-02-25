import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Live_T.css";
import Map from "../Map";
import WalkEndPopup from "../WalkEndPopup";

function Live_T() {
  const [activeTab, setActiveTab] = useState("walk");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEndingWalk, setIsEndingWalk] = useState(false);
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const handleStartWalk = () => {
    setPopupMessage("산책을 시작하시겠습니까?");
    setIsPopupVisible(true);
    setIsEndingWalk(false);
  };

  const handleEndWalk = () => {
    setPopupMessage("산책을 종료하시겠습니까?");
    setIsPopupVisible(true);
    setIsEndingWalk(true);
  };

  const handlePopupConfirm = () => {
    setIsPopupVisible(false);
    if (isEndingWalk) {
      navigate("/LiveResert_TPage");
    } else {
      // 현재 Map 컴포넌트의 위치 갱신
      if (mapRef.current && mapRef.current.updateCurrentLocation) {
        mapRef.current.updateCurrentLocation();
      }
      
      // ✅ 산책 시작 상태를 localStorage에 저장
      localStorage.setItem("walkStarted", JSON.stringify({
        timestamp: new Date().getTime(),
        started: true
      }));
      
      // ✅ BroadcastChannel을 통해 다른 페이지에 알림
      try {
        const bc = new BroadcastChannel("walk_channel");
        bc.postMessage({ action: "walkStarted" });
        setTimeout(() => bc.close(), 1000); // 메시지 전송 후 채널 닫기
      } catch (error) {
        console.error("브로드캐스트 채널 오류:", error);
      }
    }
  };

  const handlePopupCancel = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="live-T-container">
      <header className="live-T-header">
        <div className="live-T-header-content">
          <h1>라이브</h1>
          <div className="live-T-header-buttons">
            <button
              className={`live-T-header-button ${activeTab === "walk" ? "active" : ""}`}
              onClick={() => setActiveTab("walk")}
            >
              산책 경로
            </button>
            <button
              className={`live-T-header-button ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              채팅 하기
            </button>
          </div>
        </div>
      </header>

      {activeTab === "walk" && (
        <div className="live-T-map-container">
          <Map ref={mapRef} />
        </div>
      )}
      {activeTab === "chat" && <div className="live-T-chat-message">채팅하기 페이지 아직 미완성</div>}

      {activeTab === "walk" && (
        <div className="live-T-button-container">
          <button className="live-T-start-button" onClick={handleStartWalk}>산책 시작</button>
          <button className="live-T-end-button" onClick={handleEndWalk}>산책 종료</button>
        </div>
      )}

      {isPopupVisible && (
        <WalkEndPopup
          message={popupMessage}
          onConfirm={handlePopupConfirm}
          onCancel={handlePopupCancel}
        />
      )}
    </div>
  );
}

export default Live_T;