import React, { useState } from "react";
import "./Trainer.css";

function Trainer({ name, experience, trainer_mbti, total_match_score, trainer_image_url, onClick }) {
  const [imageError, setImageError] = useState(false);

  console.log(`📢 트레이너 컴포넌트 데이터 - ${name}:`, {
    name,
    experience,
    trainer_mbti,
    total_match_score,
    trainer_image_url,
  });

  return (
    <div className="trainer-card" onClick={onClick}> {/* ✅ 클릭 가능하게 변경 */}
      <div className="trainer-image-container">
        {trainer_image_url && !imageError ? (
          <img 
            src={trainer_image_url} 
            alt={name || "트레이너"} 
            className="trainer-image"
            onError={() => setImageError(true)}
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
        <p className="trainer-score">총 궁합 : {total_match_score || "점수 없음"}</p>
      </div>
    </div>
  );
}

export default Trainer;
