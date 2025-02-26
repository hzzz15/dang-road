import React, { useState } from "react";
import "./Trainer.css";

function Trainer({ name, experience, trainer_mbti, match_scores, trainer_image_url }) {
  const [imageError, setImageError] = useState(false);

  console.log(`🖼️ 트레이너 ${name}의 이미지 URL:`, trainer_image_url); // ✅ 디버깅 로그 추가

  return (
    <div className="trainer-card">
      <div className="trainer-image-container">
        {trainer_image_url && !imageError ? (
          <img 
            src={trainer_image_url} 
            alt={name || "트레이너"} 
            className="trainer-image"
            onError={() => {
              console.error(`🚨 이미지 로딩 실패: ${trainer_image_url}`);
              setImageError(true);
            }}
          />
        ) : (
          <div className="trainer-image-fallback">
            {name ? name.charAt(0).toUpperCase() : "T"}
          </div>
        )}
      </div>

      <div className="trainer-info">
        <p className="trainer-name">{name}</p>
        <p className="trainer-mbti">MBTI : {trainer_mbti}</p>
        <p className="trainer-score">총 궁합: {match_scores?.total_match_score}</p>
      </div>
    </div>
  );
}

export default Trainer;
