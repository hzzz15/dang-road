"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./TemporaryCare_test.css"

const questions = [
  {
    id: "q1",
    question: "평소 집에 머무르는 시간이 많은 편인가요?",
    choices: [
      { text: "네, 집에 있는 시간이 많아요", tags: ["실내생활OK", "혼자있는시간많음", "분리불안없음"] },
      { text: "아니요, 외출이 많은 편이에요", tags: ["단독생활OK", "마당있음"] },
    ],
  },
  {
    id: "q2",
    question: "강아지가 혼자 있는 시간이 많아도 괜찮을까요?",
    choices: [
      { text: "네, 장시간 혼자 있어야 할 수도 있어요", tags: ["단독생활OK", "혼자있는시간많음", "분리불안없음"] },
      { text: "아니요, 항상 함께 있어 줄 수 있어요", tags: ["사람좋아", "애교쟁이"] },
    ],
  },
  {
    id: "q3",
    question: "거주 환경이 어떻게 되시나요?",
    choices: [
      { text: "아파트에 거주해요", tags: ["아파트OK", "실내생활OK"] },
      { text: "단독주택 또는 마당이 있어요", tags: ["마당있음"] },
      { text: "반려동물 출입이 가능한 공간이 있어요", tags: ["반려동물동반가능"] },
    ],
  },
  {
    id: "q4",
    question: "강아지가 어떤 성향이었으면 좋겠나요?",
    choices: [
      { text: "활발하고 산책을 좋아하는 아이", tags: ["에너자이저", "산책최고", "호기심천국"] },
      { text: "조용하고 차분한 아이", tags: ["소심소심", "조용조용", "순둥이"] },
      { text: "독립적인 성향이 강한 아이", tags: ["독립심짱", "시크도도"] },
      { text: "애교가 많고 사람을 좋아하는 아이", tags: ["애교쟁이", "사람좋아"] },
    ],
  },
  {
    id: "q5",
    question: "강아지가 처음 보는 사람이나 환경에 대해 어떻게 반응하면 좋겠나요?",
    choices: [
      { text: "낯가림이 없고 친화적인 아이", tags: ["사람좋아", "사회성좋아요", "강아지친화력굿"] },
      { text: "조용하고 신중한 아이", tags: ["소심소심", "조용조용"] },
      { text: "경계심이 있는 아이", tags: ["경계심있음"] },
    ],
  },
  {
    id: "q6",
    question: "강아지와 함께 산책을 자주 나가실 계획인가요?",
    choices: [
      { text: "매일 산책이 가능해요!", tags: ["산책최고", "에너자이저"] },
      { text: "하루 한 번 정도는 나갈 수 있어요", tags: ["산책최고", "적당히짖어요"] },
      { text: "자주 나가지는 못할 것 같아요", tags: ["실내생활OK", "조용조용"] },
    ],
  },
  {
    id: "q7",
    question: "강아지가 훈련을 잘 따라오는 성향이면 좋겠나요?",
    choices: [
      { text: "네, 훈련이 잘 되어 있는 아이였으면 좋겠어요", tags: ["훈련잘됨", "똑똑이"] },
      { text: "굳이 훈련을 신경 쓰지 않아도 괜찮아요", tags: ["자유로운성향"] },
    ],
  },
  {
    id: "q8",
    question: "강아지가 짖는 것이 걱정되시나요?",
    choices: [
      { text: "조용한 아이였으면 좋겠어요", tags: ["조용조용", "소심소심"] },
      { text: "적당히 경계심이 있는 아이는 괜찮아요", tags: ["적당히짖어요", "경계심있음"] },
    ],
  },
  {
    id: "q9",
    question: "강아지가 장난감을 좋아하는 성향이면 좋겠나요?",
    choices: [
      { text: "네, 장난감을 좋아하는 아이였으면 좋겠어요", tags: ["장난감최고", "꾸러기"] },
      { text: "아니요, 차분한 성향이 더 좋아요", tags: ["소심소심", "조용조용"] },
    ],
  },
  {
    id: "q10",
    question: "강아지에게 음식에 대한 관심이 많으면 좋겠나요?",
    choices: [
      { text: "네, 간식을 잘 먹는 아이였으면 좋겠어요", tags: ["먹는거최고", "훈련잘됨"] },
      { text: "아니요, 너무 음식 집착이 심한 건 부담스러워요", tags: ["시크도도", "독립심짱"] },
    ],
  },
]

const TemporaryCareTest = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice.text)
    setSelectedTags((prevTags) => [...new Set([...prevTags, ...choice.tags])])
  }

  const handleNext = async () => {
    if (selectedChoice !== null) {
      setSelectedChoice(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        await submitTest(selectedTags)
      }
    }
  }

  const submitTest = async (selectedTags) => {
    try {
      const queryString = new URLSearchParams({
        tags: selectedTags.join(","),
      }).toString()

      const response = await fetch(`http://localhost:8000/api/recommend_dogs?${queryString}`, {
        method: "GET",
      })

      if (!response.ok) {
        console.error("서버 에러:", response.status)
        return
      }

      const data = await response.json()
      console.log("FastAPI 응답:", data)
      console.log("전달하는 데이터:", {
        recommendedDogs: data.recommended_dogs,
        top_3_tags: data.top_3_tags
      })

      navigate("/TemporaryCare_RePage", { 
        state: { 
          recommendedDogs: data.recommended_dogs,
          top_3_tags: data.top_3_tags
        } 
      })
    } catch (error) {
      console.error("테스트 제출 실패:", error)
    }
  }

  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="TemporaryCare-test-container">
      <header className="TemporaryCare-test-header">
        <div className="TemporaryCare-test-header-content">
          <img
            src="/resultlasticons/back.png"
            alt="뒤로가기"
            className="TemporaryCare-test-back-icon"
            onClick={handleBackClick}
          />
          <h1>짝꿍댕 테스트</h1>
          <p className="TemporaryCare-test-description">우리 강아지와 잘 맞는 보호자를 찾아보세요!</p>
        </div>
      </header>

      <div className="TemporaryCare-test-progress-bar-container">
        <div
          className="TemporaryCare-test-progress-bar"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="TemporaryCare-test-test-container">
        <h2 className="TemporaryCare-test-question-number">질문 {currentIndex + 1}.</h2>
        <h1 className="TemporaryCare-test-question-text">{questions[currentIndex].question}</h1>

        <div className="TemporaryCare-test-choices-container">
          {questions[currentIndex].choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoiceSelect(choice)}
              className={`TemporaryCare-test-choice-button ${selectedChoice === choice.text ? "selected" : ""}`}
            >
              {choice.text}
            </button>
          ))}
        </div>

        <button
          className={`TemporaryCare-test-next-button ${selectedChoice !== null ? "" : "disabled"}`}
          onClick={handleNext}
          disabled={selectedChoice === null}
        >
          {isLastQuestion ? "결과보기" : "다음으로"}
        </button>
      </div>
    </div>
  )
}

export default TemporaryCareTest