"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./Dbti_result.css"

const DbtiResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mbti } = location.state || {}

  // MBTI 유형별 설명 데이터
  const mbtiDescriptions = {
    ENTJ: {
      title: "대담한 지휘관형",
      descriptions: [
        "리더십이 강하며, 훈련을 잘 받아들이는 강아지 🏆",
        "보호 본능이 있어 경비견 역할을 잘할 가능성이 큼 🛡️",
      ],
    },
    ENTP: {
      title: "자유로운 혁신가형",
      descriptions: [
        "창의적이고 즉흥적인 행동을 보이며, 호기심이 많음 🔥",
        "새로운 훈련을 빨리 배우지만, 쉽게 질려서 자주 바꿔줘야 함",
      ],
    },
    ENFJ: {
      title: "열정적인 지도자형",
      descriptions: [
        "주인과의 교감을 중요하게 여기며, 감정이 풍부한 강아지 💖",
        "새로운 사람과 강아지에게 친절하며, 리더십이 있음 🌟",
      ],
    },
    ENFP: {
      title: "에너지 넘치는 탐험가형",
      descriptions: [
        "자유롭고 즉흥적인 성향이 강하며, 산책을 가장 좋아함 🏃‍♂️",
        "새로운 경험을 좋아하고, 사람들과 어울리는 것을 즐김 👫",
      ],
    },
    ISTJ: {
      title: "신뢰할 수 있는 관리자형",
      descriptions: ["규칙적인 생활을 좋아하고, 안정적인 환경을 선호함 🏡", "보호 본능이 강하고, 충성심이 깊음 💖"],
    },
    ISTP: {
      title: "침착한 문제 해결사형",
      descriptions: [
        "독립적인 성향이 강하고, 혼자 있는 걸 잘 견딤 🌳",
        "장난감을 분석하거나, 새로운 도전을 하는 걸 좋아함 🛠️",
      ],
    },
    ISFJ: {
      title: "온화한 수호자형",
      descriptions: [
        "가족과 깊은 유대감을 형성하며, 애착이 강함 🏠",
        "보호 본능이 있으며, 낯선 사람보다는 아는 사람을 선호함 🤗",
      ],
    },
    ISFP: {
      title: "자유로운 예술가형",
      descriptions: [
        "감각이 예민하고, 조용한 환경을 좋아하는 강아지 🎨",
        "자유로운 산책을 선호하며, 즉흥적인 행동을 자주 보임",
      ],
    },
    INTJ: {
      title: "전략적인 사색가형",
      descriptions: [
        "계획적인 산책과 훈련을 선호하며, 변화를 싫어함 ⚖️",
        "낯가림이 있지만, 신뢰가 쌓이면 깊은 애정을 표현함",
      ],
    },
    INTP: {
      title: "논리적인 사색가형",
      descriptions: [
        "혼자 탐색하는 걸 좋아하며, 자유로운 환경에서 잘 성장함 🌍",
        "훈련을 재미있게 풀어줘야 집중력이 유지됨",
      ],
    },
    INFJ: {
      title: "사려 깊은 조력자형",
      descriptions: [
        "낯선 사람에게는 조심스럽지만, 신뢰가 생기면 애정을 표현함 🐶",
        "차분한 환경을 좋아하며, 강한 소음이나 변화를 싫어함",
      ],
    },
    INFP: {
      title: "꿈 많은 이상가형",
      descriptions: [
        "혼자 있는 걸 잘 견디며, 감성이 풍부한 강아지 🎭",
        "규칙적인 훈련보다는 자유로운 산책을 선호함 🌿",
      ],
    },
  }

  // 만약 mbti 값이 없으면 홈이나 테스트 페이지로 리다이렉트
  useEffect(() => {
    if (!mbti) {
      navigate("/", { replace: true })
    }
  }, [mbti, navigate])

  // 현재 MBTI에 해당하는 설명 가져오기
  const currentMbtiInfo = mbti ? mbtiDescriptions[mbti] : null

  return (
    <div className="DbtiResult-container">
      {/* 헤더 */}
      <header className="DbtiResult-header">
        <div className="DbtiResult-header-content">
          <img
            src="/resultlasticons/back.png"
            alt="뒤로가기"
            className="DbtiResult-back-icon"
            onClick={() => navigate(-1)}
          />
          <h1>댕BTI TEST</h1>
          <p className="DbtiResult-description">우리 댕댕이의 댕BTI를 검사해보세요!</p>
        </div>
      </header>

      {/* 결과 박스 */}
      <div className="DbtiResult-box">
        {mbti && currentMbtiInfo ? (
          <div className="DbtiResult-content">
            <p className="DbtiResult-mbti">당신의 강아지 댕BTI : {mbti}</p>
            <p className="DbtiResult-title">{currentMbtiInfo.title}</p>
            <div className="DbtiResult-descriptions">
              {currentMbtiInfo.descriptions.map((desc, index) => (
                <p key={index} className="DbtiResult-description-item">
                  {desc}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="DbtiResult-text">결과를 불러올 수 없습니다.</p>
        )}
      </div>

      {/* 등록하기 버튼 */}
      <button className="DbtiResult-button" onClick={() => navigate("/DogInformationPage", { state: { mbti } })}>
        등록하기
      </button>
    </div>
  )
}

export default DbtiResult

