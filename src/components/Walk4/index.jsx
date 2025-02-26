import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Trainer from "../Trainer"; 
import { supabase } from "../../lib/supabaseClient";
import "./Walk4.css";

const Walk4 = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const pet_id = 140; // 예시

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/match/pet/${pet_id}/matches`)
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data.matches || []);
        console.log("📢 트레이너 데이터 로드 완료:", data.matches);
      })
      .catch((error) => console.error("🚨 트레이너 데이터 로드 오류:", error))
      .finally(() => setLoading(false));
  }, [pet_id]);

  // ✅ 트레이너 카드 클릭 시 선택
  const handleSelectTrainer = (trainer) => {
    console.log("🔹 트레이너 선택됨:", trainer);
    setSelectedTrainer(trainer);
  };

  // ✅ "다음으로" 버튼 클릭 시: 트레이너 ID를 localStorage에 저장하고 Walk5로 이동
  const handleNext = async () => {
    if (!selectedTrainer) {
      alert("트레이너를 선택해주세요!");
      return;
    }

    // ✅ 선택된 트레이너 ID 로컬 스토리지에 저장
    localStorage.setItem("selected_trainer_id", selectedTrainer.trainer_id);
    console.log("✅ 선택한 트레이너 ID 로컬 스토리지에 저장:", selectedTrainer.trainer_id);

    console.log("✅ 선택한 트레이너:", selectedTrainer);

    // Walk5로 이동
    navigate("/Walk5Page");
  };

  return (
    <div className="Walk4-container">
      <header className="Walk4-header">
        <button className="Walk4-back-button" onClick={() => navigate("/Walk3Page")}>
          <img src="/icons/back.png" alt="뒤로가기" />
        </button>
        <h1 className="Walk4-title">트레이너를 선택하시겠습니까?</h1>
      </header>

      <div className="Walk4-content">
        {loading ? (
          <div className="Walk4-loading">로딩 중...</div>
        ) : trainers.length === 0 ? (
          <p className="Walk4-no-trainer">추천할 트레이너가 없습니다.</p>
        ) : (
          <div className="Walk4-trainer-list">
            {trainers.map((trainer) => (
              <div
                key={trainer.trainer_id}
                className={`trainer-card ${selectedTrainer?.trainer_id === trainer.trainer_id ? "selected" : ""}`}
                onClick={() => handleSelectTrainer(trainer)}
              >
                <Trainer {...trainer} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTrainer && (
        <div className="Walk4-selected-info">
          <p>선택한 트레이너: <strong>{selectedTrainer.name}</strong></p>
        </div>
      )}

      <div className="Walk4-bottom">
        <button
          className={`Walk4-next-button ${selectedTrainer ? "" : "disabled"}`} 
          onClick={handleNext}
          disabled={!selectedTrainer}
        >
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Walk4;
