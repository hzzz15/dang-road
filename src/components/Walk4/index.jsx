import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Trainer from "../Trainer"; 
import "./Walk4.css";

const Walk4 = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const pet_id = 140; // 예시

  useEffect(() => {
    if (!pet_id) {
      console.error("pet_id가 전달되지 않았습니다.");
      return;
    }
    fetch(`http://localhost:8000/match/pet/${pet_id}/matches`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ API 응답 데이터:", data);
        setTrainers(data.matches || []); // ✅ 변환 없이 원본 데이터 그대로 사용
        setLoading(false);
      })
      .catch((error) => {
        console.error("🚨 트레이너 데이터를 불러오는 중 오류 발생:", error);
        setLoading(false);
      });
  }, [pet_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Walk4-container">
      <header className="Walk4-header">
        <button className="Walk4-back-button" onClick={() => navigate("/Walk3Page")}>
          <img src="/icons/back.png" alt="뒤로가기" />
        </button>
        <h1 className="Walk4-title">
          트레이너를 <br /> 선택하시겠습니까?
        </h1>
        <button className="Walk4-info-button" onClick={() => navigate("/Walk4_noticePage")}>
          <img src="/icons/question.png" alt="도움말" />
        </button>
      </header>

      <div className="Walk4-trainer-list">
        {trainers.map((trainer) => (
          <Trainer key={trainer.trainer_id} {...trainer} />
        ))}
      </div>

      <div className="Walk4-bottom">
        <button className="Walk4-next-button" onClick={() => navigate("/Walk5Page")}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Walk4;
