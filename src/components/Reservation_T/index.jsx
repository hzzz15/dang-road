"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Reservation_T.css"
import { supabase } from "../../lib/supabaseClient"

function Reservation_T() {
  // 기존 예약 리스트 구조 유지
  const [reservationlist, setReservationlist] = useState([
    {
      id: "1",
      date: "2023년 06월 15일",
      dogName: "로딩 중...",
      DBTI: "로딩 중...",
      dogImage: "/placeholder.svg",
      trainerName: "로딩 중...",
      trainerMBTI: "로딩 중...",
      trainerImage: "/placeholder.svg"
    }
  ])
  
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // 강아지와 트레이너 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        console.log("데이터 로딩 시작...")
        
        // 현재 로그인한 사용자 정보 가져오기
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error("로그인이 필요합니다:", userError)
          return
        }
        
        console.log("로그인 사용자 ID:", user.id)
        
        // 강아지 정보 가져오기 - DogInformation에서 등록한 정보
        // 현재 로그인한 사용자와 연결된 강아지 정보를 가져옵니다
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("name, pet_mbti, image_url")
          .eq("uuid_id", user.id)  // 현재 사용자의 강아지 정보
          .maybeSingle()  // 단일 결과 반환
        
        if (petError) {
          console.error("강아지 정보 조회 실패:", petError)
        } else {
          console.log("조회된 강아지 정보:", petData)
        }
        
        // 트레이너 정보 가져오기 - TrainerInformation에서 등록한 정보
        const { data: trainerData, error: trainerError } = await supabase
          .from("trainers")
          .select("name, trainer_mbti, trainer_image_url")
          .eq("uuid_id", user.id)
          .single()
          
        if (trainerError) {
          console.error("트레이너 정보 조회 실패:", trainerError)
        } else {
          console.log("조회된 트레이너 정보:", trainerData)
        }
        
        // 가져온 정보로 예약 리스트 업데이트
        setReservationlist(prevList => 
          prevList.map(reservation => ({
            ...reservation,
            // 강아지 정보 업데이트 (데이터가 있는 경우에만)
            ...(petData && {
              dogName: petData.name || "정보 없음",
              DBTI: petData.pet_mbti || "정보 없음",
              dogImage: petData.image_url || "/dogprofile/dog.jpg"
            }),
            // 트레이너 정보 업데이트 (데이터가 있는 경우에만)
            ...(trainerData && {
              trainerName: trainerData.name || "정보 없음",
              trainerMBTI: trainerData.trainer_mbti || "정보 없음",
              trainerImage: trainerData.trainer_image_url || "/trainerprofile/trainer.jpg"
            })
          }))
        )
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleDelete = (id) => {
    setReservationlist((prevList) => prevList.filter((reservation) => reservation.id !== id))
  }

  return (
    <div className="reservation-t-container">
      <header className="reservation-t-header">
        <div className="reservation-t-header-content">
          <h1>예약내역</h1>
          <div className="reservation-t-header-buttons">
            <button className="reservation-t-header-button active">진행 예약</button>
            <Link
              to="/Last_TPage"
              className="reservation-t-header-button"
              style={{ background: "none", border: "none", textDecoration: "none" }}
            >
              지난 예약
            </Link>
          </div>
        </div>
      </header>
      <main className="reservation-t-main">
        {isLoading ? (
          <div className="reservation-t-chat-message">
            <div>데이터를 불러오는 중...</div>
          </div>
        ) : reservationlist.length > 0 ? (
          <div className="reservation-t-match-content">
            {reservationlist.map((reservation) => (
              <div key={reservation.id} className="reservation-t-match-card">
                <div className="reservation-t-match-date">{reservation.date}</div>
                <div className="reservation-t-match-status">매칭완료!</div>
                <div className="reservation-t-match-players">
                  <div className="reservation-t-player">
                    <div className="reservation-t-player-avatar">
                      <img 
                        src={reservation.dogImage || "/placeholder.svg"} 
                        alt="강아지 사진" 
                        className="reservation-t-avatar-image"
                        onError={(e) => {
                          console.log("강아지 이미지 로드 실패:", e.target.src)
                          e.target.src = "/dogprofile/dog.jpg"
                        }}
                      />
                    </div>
                    <div className="reservation-t-player-name">{reservation.dogName}</div>
                    <div className="reservation-t-player-detail">{reservation.DBTI}</div>
                  </div>
                  <div className="reservation-t-match-image">
                    <img src="/reservationicons/matching.png" alt="Matching" className="reservation-t-match-icon" />
                  </div>
                  <div className="reservation-t-player">
                    <div className="reservation-t-player-avatar">
                      <img
                        src={reservation.trainerImage || "/placeholder.svg"}
                        alt="트레이너 사진"
                        className="reservation-t-avatar-image"
                        onError={(e) => {
                          console.log("트레이너 이미지 로드 실패:", e.target.src)
                          e.target.src = "/trainerprofile/trainer.jpg"
                        }}
                      />
                    </div>
                    <div className="reservation-t-player-name">{reservation.trainerName}</div>
                    <div className="reservation-t-player-detail">{reservation.trainerMBTI}</div>
                  </div>
                </div>
                <div className="reservation-t-match-confirmation">
                  <p className="reservation-t-match-question">매칭하시겠습니까?</p>
                  <div className="reservation-t-match-buttons">
                    <button
                      onClick={() => navigate("/Live_TPage")}
                      className="reservation-t-match-button reservation-t-match-button-yes"
                    >
                      예
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="reservation-t-match-button reservation-t-match-button-no"
                    >
                      아니오
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="reservation-t-chat-message">
            <div>아직 예약이 없습니다.</div>
          </div>
        )}
      </main>
      <div className="reservation-t-bottom-space"></div>
    </div>
  )
}

export default Reservation_T