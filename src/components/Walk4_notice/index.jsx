import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Walk4_notice.css";

const Walk4_notice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTrainer = location.state?.selectedTrainer;

  return (
    <div className="Walk4_notice-container">
      <header className="Walk4_notice-header">
        <button className="Walk4_notice-back-button" onClick={() => navigate("/Walk4Page")}> 
          <img src="/icons/back.png" alt="뒤로가기" />
        </button>
        <h1 className="Walk4_notice-title">
          {selectedTrainer ? 
            `이러한 이유로 \n추천합니다!` : 
            "트레이너 추천 이유"}
        </h1>
      </header>

      <div className="Walk4_notice-content">
        {selectedTrainer ? (
          <div className="recommendation-container">
            <p>{selectedTrainer.recommendation || "추천 메시지가 없습니다."}</p>
          </div>
        ) : (
          <p className="no-trainer-message">선택된 트레이너가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Walk4_notice;