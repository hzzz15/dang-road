"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Dbti.css"

// 각 카테고리별 질문 데이터
const questions = {
  "E/I": [
    {
      id: "ei1",
      question: "강아지가 산책 나가자고 하면?",
      choices: ["줄을 당기면서 빨리 나가고 싶어함.", "주인이 준비할 때까지 조용히 기다림."],
    },
    {
      id: "ei2",
      question: "다른 강아지를 만나면?",
      choices: ["바로 달려가서 인사함.", "조심스럽게 접근하거나 관심이 없음."],
    },
    {
      id: "ei3",
      question: "새로운 장소에 가면?",
      choices: ["신나서 이곳저곳 뛰어다님.", "처음엔 조심스럽고 경계함."],
    },
  ],
  "S/N": [
    {
      id: "sn1",
      question: "주인이 집에 없을 때?",
      choices: ["불안해하며 짖거나 문 앞에서 기다림.", "혼자서도 잘 놀거나 별 신경 안 씀."],
    },
    {
      id: "sn2",
      question: "가족이나 친구가 집에 오면?",
      choices: ["격하게 반기고 애정 표현을 많이 함.", "처음엔 거리를 두고 지켜봄."],
    },
    {
      id: "sn3",
      question: "다른 강아지들과 함께 산책하면?",
      choices: ["같이 뛰어놀고 신나함.", "혼자 조용히 걷거나 따로 다님."],
    },
  ],
  "T/F": [
    {
      id: "tf1",
      question: "훈련할 때(앉아, 기다려 등)?",
      choices: ["쉽게 따라하고 집중력이 높음.", "금방 흥미를 잃고 다른 곳에 관심 가짐."],
    },
    {
      id: "tf2",
      question: "간식을 줄 때?",
      choices: ["훈련을 해야만 간식을 받는 걸 이해함.", "주인이 주기만을 기대하며 기다림."],
    },
    {
      id: "tf3",
      question: "산책 중 명령을 내리면?",
      choices: ["바로 반응하며 따른다.", "기분에 따라 반응이 다름."],
    },
  ],
  "J/P": [
    {
      id: "jp1",
      question: "산책 시간이나 식사 시간이 일정하지 않으면?",
      choices: ["평소와 다르면 불안해하거나 낑낑거림.", "달라져도 크게 신경 쓰지 않음."],
    },
    {
      id: "jp2",
      question: "집 안에서 행동 패턴은?",
      choices: ["정해진 자리에서 쉬고, 일정한 루틴을 따름.", "여기저기 돌아다니며 자유롭게 놈."],
    },
    {
      id: "jp3",
      question: "새로운 장난감을 주면?",
      choices: ["천천히 익숙해지고 기존의 장난감을 더 좋아함.", "새로운 것에 바로 관심을 보이며 흥분함."],
    },
  ],
}

const MBTITest = () => {
  const navigate = useNavigate()
  const [allQuestions, setAllQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)

  // 각 질문에 해당하는 카테고리 정보를 포함하여 하나의 배열로 평탄화합니다.
  useEffect(() => {
    const flattenedQuestions = []
    for (const category in questions) {
      questions[category].forEach((q) => {
        flattenedQuestions.push({ ...q, category })
      })
    }
    setAllQuestions(flattenedQuestions)
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  // 선택지 클릭 시, 해당 질문의 카테고리 정보를 기반으로 MBTI를 저장합니다.
  const handleChoiceSelect = (choiceIndex) => {
    const currentQuestion = allQuestions[currentIndex]
    const letter =
      choiceIndex === 0 ? currentQuestion.category[0] : currentQuestion.category[2]
    setSelectedChoice(letter)
  }

  const handleNext = async () => {
    if (selectedChoice !== null) {
      const updatedAnswers = [...answers, selectedChoice]
      setAnswers(updatedAnswers)
      setSelectedChoice(null)
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // 마지막 질문에서는 결과 제출
        await submitTest(updatedAnswers)
      }
    }
  }

  // GET 방식으로 답변 데이터를 쿼리 스트링에 담아 백엔드에 요청
  const submitTest = async (allAnswers) => {
    try {
      const queryString = new URLSearchParams({
        answers: allAnswers.join(","),
      }).toString()

      // 절대 URL을 사용하여 백엔드 서버 (localhost:8000)의 API 엔드포인트에 GET 요청
      const response = await fetch(`http://localhost:8000/api/submitMbtiTest?${queryString}`, {
        method: "GET",
      })

      if (!response.ok) {
        console.error("서버 에러:", response.status)
        return
      }

      const data = await response.json()
      console.log("서버 응답:", data)
      navigate("/Dbti_resultPage", { state: { mbti: data.mbti } })
    } catch (error) {
      console.error("테스트 제출 실패:", error)
    }
  }

  const isLastQuestion = currentIndex === allQuestions.length - 1

  if (allQuestions.length === 0) {
    return <div className="Dbti-test-container">질문을 불러오는 중입니다...</div>
  }

  return (
    <div className="Dbti-test-container">
      <header className="Dbti-test-header">
        <div className="Dbti-test-header-content">
          <img
            src="/resultlasticons/back.png"
            alt="뒤로가기"
            className="Dbti-test-back-icon"
            onClick={handleBackClick}
          />
          <h1>댕BTI TEST</h1>
          <p className="Dbti-test-description">우리 댕댕이의 댕BTI를 검사해보세요!</p>
        </div>
      </header>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
        />
      </div>

      <div className="test-container">
        <h2 className="question-number">질문 {currentIndex + 1}.</h2>
        <h1 className="question-text">{allQuestions[currentIndex].question}</h1>

        <div className="choices-container">
          {allQuestions[currentIndex].choices.map((choice, index) => {
            const optionLetter =
              index === 0
                ? allQuestions[currentIndex].category[0]
                : allQuestions[currentIndex].category[2]
            return (
              <button
                key={index}
                onClick={() => handleChoiceSelect(index)}
                className={`choice-button ${
                  selectedChoice === optionLetter ? "selected" : ""
                }`}
              >
                {choice}
              </button>
            )
          })}
        </div>

        <button
          className={`next-button ${selectedChoice !== null ? "" : "disabled"}`}
          onClick={handleNext}
          disabled={selectedChoice === null}
        >
          {isLastQuestion ? "결과보기" : "다음으로"}
        </button>
      </div>
    </div>
  )
}

export default MBTITest
