import React, { useState } from "react";
import "./Trainer.css";

function Trainer({ name, experience, trainer_mbti, match_scores, image }) {
  // 이미지 로딩 상태 관리
  const [imageError, setImageError] = useState(false);
  
  // 디버깅을 위한 로그
  console.log(`트레이너 ${name}의 이미지 URL:`, image);
  
  return (
    <div className="trainer-card">
      {/* 트레이너 사진 */}
      <div className="trainer-image-container">
        {image && !imageError ? (
          <img 
            src={image || "/placeholder.svg"} 
            alt={name || "트레이너"} 
            className="trainer-image"
            onError={(e) => {
              console.error(`이미지 로딩 실패: ${image}`);
              setImageError(true);
            }}
          />
        ) : (
          // 이미지가 없거나 로딩 실패 시 대체 UI 표시
          <div className="trainer-image-fallback">
            {name ? name.charAt(0).toUpperCase() : "T"}
          </div>
        )}
      </div>

      {/* 트레이너 정보 */}
      <div className="trainer-info">
        <div className="trainer-text">
          <p className="trainer-name">{name || "이름 없음"}</p>
          <p className="trainer-mbti">MBTI: {trainer_mbti || "미정"}</p>
        </div>
        <div className="trainer-match-scores">
          <p>총 궁합: {match_scores?.total_match_score || "0"}</p>
        </div>
      </div>
    </div>
  );
}

export default Trainer;