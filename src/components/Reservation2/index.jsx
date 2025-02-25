"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import "./Reservation2.css"

function Reservation2() {
  const [profileImage, setProfileImage] = useState(null)
  const [petInfo, setPetInfo] = useState({
    name: "",
    pet_mbti: "",
  })
  // 트레이너 정보를 저장할 상태 추가
  const [trainerInfo, setTrainerInfo] = useState({
    name: "로딩 중...",
    trainer_mbti: "",
    trainer_image_url: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        console.log("데이터 로딩 시작...")

        // 현재 로그인한 사용자 정보 가져오기
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("사용자 정보 조회 에러:", userError)
          return
        }

        if (!user) {
          console.log("로그인된 사용자가 없습니다.")
          return
        }

        console.log("현재 로그인한 사용자 ID:", user.id)

        // 반려견 정보 가져오기
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("uuid_id", user.id)
          .maybeSingle()

        if (petError) {
          console.error("반려견 데이터 조회 에러:", petError)
        } else if (petData) {
          setProfileImage(petData.image_url)
          setPetInfo({
            name: petData.name || "",
            pet_mbti: petData.pet_mbti || "",
          })
          console.log("반려견 정보 로드 완료:", petData.name)
        } else {
          console.log("반려견 정보가 없습니다.")
        }

        // 트레이너 정보 가져오기 - 현재 로그인한 사용자의 UUID로 필터링
        const { data: trainerData, error: trainerError } = await supabase
          .from("trainers")
          .select("name, trainer_mbti, trainer_image_url")
          .eq("uuid_id", user.id) // 현재 로그인한 사용자의 UUID로 필터링
          .maybeSingle()

        if (trainerError) {
          console.error("트레이너 데이터 조회 에러:", trainerError)
        } else if (trainerData) {
          setTrainerInfo({
            name: trainerData.name || "이름 없음",
            trainer_mbti: trainerData.trainer_mbti || "",
            trainer_image_url: trainerData.trainer_image_url,
          })
          console.log("트레이너 정보 로드 완료:", trainerData.name)
        } else {
          console.log("트레이너 정보가 없습니다.")
          // 트레이너 정보가 없는 경우 기본값 설정
          setTrainerInfo({
            name: "트레이너 정보 없음",
            trainer_mbti: "",
            trainer_image_url: null,
          })
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // localStorage 변경 감지 함수
    const checkNavigation = () => {
      try {
        const trigger = localStorage.getItem("navigationTrigger")
        if (!trigger) return

        console.log("🔍 네비게이션 트리거 확인:", trigger)

        const data = JSON.parse(trigger)

        // 10초 이내의 트리거만 처리
        const now = new Date().getTime()
        const isRecent = now - data.timestamp < 10000 // 10초 이내

        console.log("⏱️ 트리거 시간 차이:", now - data.timestamp, "ms, 유효:", isRecent)

        if (isRecent && data.action === "navigate") {
          console.log("✅ 유효한 트리거 발견, 페이지 이동 시작:", data.target)

          // 트리거 데이터 삭제
          localStorage.removeItem("navigationTrigger")

          // 페이지 이동
          window.location.href = data.target
        } else if (!isRecent) {
          // 오래된 트리거 삭제
          localStorage.removeItem("navigationTrigger")
          console.log("🗑️ 오래된 트리거 삭제")
        }
      } catch (error) {
        console.error("Navigation check error:", error)
      }
    }

    // 초기 실행
    checkNavigation()

    // BroadcastChannel 설정
    let bc
    try {
      bc = new BroadcastChannel("navigation_channel")
      bc.onmessage = (event) => {
        console.log("📡 브로드캐스트 메시지 수신:", event.data)
        if (event.data && event.data.action === "navigate") {
          console.log("✅ 브로드캐스트 메시지로 페이지 이동 시작:", event.data.target)
          window.location.href = event.data.target
        }
      }
    } catch (error) {
      console.error("브로드캐스트 채널 오류:", error)
    }

    // storage 이벤트 리스너 등록
    const handleStorageChange = (e) => {
      console.log("🔄 스토리지 변경 감지:", e.key)
      if (e.key === "navigationTrigger") {
        checkNavigation()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 주기적으로 확인 (폴링)
    const interval = setInterval(checkNavigation, 300) // 300ms마다 확인

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
      if (bc) bc.close()
    }
  }, [])

  return (
    <div className="reservation2-container">
      <header className="reservation2-header">
        <div className="reservation2-header-content">
          <h1>예약내역</h1>
          <div className="reservation2-header-buttons">
            <button className="reservation2-header-button active">진행 예약</button>
            <Link
              to="/LastPage"
              className="reservation2-header-button"
              style={{ background: "none", border: "none", textDecoration: "none" }}
            >
              지난 예약
            </Link>
          </div>
        </div>
      </header>

      <div className="reservation2-match-content">
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>데이터를 불러오는 중...</div>
        ) : (
          <div className="reservation2-match-card">
            <div className="reservation2-match-date">2025년 2월 28일</div>
            <div className="reservation2-match-status">매칭 완료!</div>
            <div className="reservation2-match-players">
              <div className="reservation2-player">
                <div className="reservation2-player-avatar">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="반려견 프로필"
                      className="reservation2-avatar-image"
                      onError={(e) => {
                        console.error("이미지 로드 실패:", profileImage)
                        e.target.src = "/placeholder.svg"
                        setProfileImage(null)
                      }}
                    />
                  ) : (
                    <div className="reservation2-avatar-placeholder">
                      <span>프로필 없음</span>
                    </div>
                  )}
                </div>
                <div className="reservation2-player-name">{petInfo.name || "이름"}</div>
                <div className="reservation2-player-detail">
                  {petInfo.pet_mbti ? `멍BTI : ${petInfo.pet_mbti}` : "멍BTI 미등록"}
                </div>
              </div>
              <div className="reservation2-match-image">
                <img src="/reservationicons/matching.png" alt="Matched" className="reservation2-match-icon" />
              </div>
              <div className="reservation2-trainer">
                <div className="reservation2-trainer-avatar">
                  {trainerInfo.trainer_image_url ? (
                    <img
                      src={trainerInfo.trainer_image_url || "/placeholder.svg"}
                      alt="트레이너 프로필"
                      className="reservation2-trainer-image"
                      onError={(e) => {
                        console.error("트레이너 이미지 로드 실패:", trainerInfo.trainer_image_url)
                        e.target.src = "/trainerprofile/trainer.jpg"
                      }}
                    />
                  ) : (
                    <img
                      src="/trainerprofile/trainer.jpg"
                      alt="기본 트레이너 이미지"
                      className="reservation2-trainer-image"
                    />
                  )}
                </div>
                <div className="reservation2-trainer-name">{trainerInfo.name}</div>
                <div className="reservation2-trainer-detail">
                  {trainerInfo.trainer_mbti ? `MBTI : ${trainerInfo.trainer_mbti}` : "MBTI 미등록"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservation2

