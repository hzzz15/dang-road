import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { supabase } from "../../lib/supabaseClient"
import "./ResultLast.css"

function ResultLast() {
  const navigate = useNavigate()
  const [walkReports, setWalkReports] = useState([])
  const [profileImage, setProfileImage] = useState(null)

  const handleBackClick = () => {
    navigate("/ProfilePage")
  }

  // 강아지 프로필 이미지 가져오기
  useEffect(() => {
    const fetchPetProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("사용자 정보 조회 에러:", userError)
          return
        }

        if (!user) {
          console.log("로그인된 사용자가 없습니다.")
          return
        }

        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("image_url")
          .eq("uuid_id", user.id)
          .maybeSingle()

        if (petError) {
          console.error("반려견 데이터 조회 에러:", petError)
        } else if (petData?.image_url) {
          setProfileImage(petData.image_url)
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error)
      }
    }

    fetchPetProfile()
  }, [])

  // 산책 리포트 데이터 가져오기
  useEffect(() => {
    const fetchWalkReports = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/walk/reports")
        console.log("📥 불러온 산책 리포트 데이터:", response.data)
        setWalkReports(response.data)
      } catch (error) {
        console.error("🚨 산책 리포트 데이터를 불러오는 데 실패했습니다:", error)
      }
    }

    fetchWalkReports()
  }, [])

  return (
    <div className="resultlast-container" style={{height: '100%', overflowY: 'auto'}}>
      <header className="resultlast-header">
        <div className="resultlast-header-content">
          <img
            src="/resultlasticons/back.png"
            alt="뒤로가기"
            className="resultlast-back-icon"
            onClick={handleBackClick}
          />
          <h1>지난 산책 리포트</h1>
        </div>
      </header>

      <div className="resultlast-scrollable-container">
        {walkReports.length > 0 ? (
          walkReports.map((report, index) => (
            <div className="resultlast-walk-report-card" key={index}>
              <div className="resultlast-report-date">{new Date(report.created_at).toLocaleDateString()}</div>
              <div className="resultlast-report-title">하늘이 산책 리포트</div>

              <div className="resultlast-profile-section">
                <div className="resultlast-profile-circle resultlast-dog-photo">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="반려견 프로필"
                      onError={(e) => {
                        console.error("이미지 로드 실패:", profileImage)
                        e.target.src = "/placeholder.svg"
                        setProfileImage(null)
                      }}
                    />
                  ) : (
                    <div className="resultlast-avatar-placeholder">
                      <span>프로필 없음</span>
                    </div>
                  )}
                </div>
                <div className="resultlast-paw-prints">
                  <img
                    src="/resultlasticons/paw.png"
                    alt="발자국"
                    className="resultlast-paw-icon"
                  />
                </div>
                <div className="resultlast-profile-circle resultlast-user-photo">
                  <img src="/trainerprofile/karina.jpg" alt="프로필" />
                </div>
              </div>

              <div className="resultlast-walk-details">
                <div className="resultlast-detail-item">
                  <h3>걸음수</h3>
                  <p>{report.estimated_steps}</p>
                </div>

                <div className="resultlast-detail-item">
                  <h3>시간</h3>
                  <p>{report.estimated_time}분</p>
                </div>

                <div className="resultlast-detail-item">
                  <h3>특이사항</h3>
                  <div className="resultlast-notes-box">
                    <p>{"기록된 특이사항이 없습니다."}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="Resultlast-no-data">불러올 산책 리포트가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default ResultLast