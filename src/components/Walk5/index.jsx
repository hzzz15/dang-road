"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Walk5.css";

export default function Walk5() {
  const navigate = useNavigate();
  const [requestText, setRequestText] = useState(""); // 요청사항 입력
  const [selectedPet, setSelectedPet] = useState(null); // 선택된 반려동물 ID
  const [latestAddress, setLatestAddress] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [petInfo, setPetInfo] = useState({
    name: "",
    size: "",
    birth_date: "",
    gender: ""
  });

  // ✅ 현재 로그인한 사용자 UUID 가져오기
  const getUserUUID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error("🚨 사용자 세션을 가져올 수 없습니다.", error);
      return null;
    }
    console.log("🔑 현재 로그인된 사용자 UUID:", data.session.user.id);
    return data.session.user.id;
  };

  // ✅ 가장 최근 주소 가져오기
  const fetchLatestAddress = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/address/latest");
      const data = await response.json();

      if (response.ok && data) {
        console.log("📌 최신 주소 데이터:", data);
        setLatestAddress(data);
      } else {
        console.warn("⚠️ 최신 주소 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("🚨 주소 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchLatestAddress();
  }, []);

  // ✅ "다음으로" 버튼 클릭 시 reservations 테이블에 데이터 저장 후 페이지 이동
  const handleNext = async () => {
    const userUUID = await getUserUUID();
    if (!userUUID) {
      console.error("🚨 로그인된 사용자가 없습니다.");
      return;
    }

    if (!latestAddress) {
      console.error("🚨 최신 주소 정보가 없습니다.");
    }

    // ✅ Walk4에서 저장한 트레이너 ID 가져오기
    const storedTrainerId = localStorage.getItem("selected_trainer_id");
    if (!storedTrainerId) {
      console.error("🚨 선택된 트레이너 ID가 없습니다.");
      alert("트레이너가 선택되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    const requestData = {
      uuid_id: userUUID,
      pet_id: 140, // 예시
      trainer_id: storedTrainerId, // ✅ 로컬 스토리지에서 불러온 ID 사용
      schedule: new Date().toISOString().split("Z")[0],
      status: "pending",
      address: latestAddress.address,
      latitude: latestAddress.latitude,
      longitude: latestAddress.longitude,
      // + 필요하면 requestText(요청사항)도 같이 전송 가능
    };

    console.log("📤 서버로 전송할 데이터:", requestData);

    try {
      const response = await fetch("http://localhost:8000/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ 예약 생성 완료! 예약 ID:", result.reservation_id);

        // ✅ 예약 ID를 로컬 스토리지에 저장 (Reservation2에서 조회 가능)
        localStorage.setItem("reservation_id", result.reservation_id);

        // 다음 페이지로 이동
        navigate("/Reservation2Page");
      } else {
        console.error("🚨 예약 생성 실패:", result);
      }
    } catch (error) {
      console.error("🚨 API 요청 중 오류 발생:", error);
    }
  };

  // ✅ 최신 주소 재조회
  useEffect(() => {
    fetchLatestAddress();
  }, []);

  // ✅ 반려동물 프로필 정보 조회
  useEffect(() => {
    const fetchPetProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error("사용자 정보 조회 에러:", userError);
          return;
        }

        if (!user) {
          console.log("로그인된 사용자가 없습니다.");
          return;
        }

        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("uuid_id", user.id)
          .maybeSingle();

        if (petError) {
          console.error("반려견 데이터 조회 에러:", petError);
          return;
        }

        if (petData) {
          setProfileImage(petData.image_url);
          setPetInfo({
            name: petData.name || "",
            size: petData.size || "",
            birth_date: petData.birth_date || "",
            gender: petData.gender === "female" ? "여아" : "남아"
          });
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchPetProfile();
  }, []);

  // ✅ 나이 계산 함수
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (today.getDate() < birth.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    if (years > 0) {
      return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
    }
    return `${months}개월`;
  };



  return (
    <div className="Walk5-container">
      <div className="Walk5-header">
        <button className="Walk5-back-button" onClick={() => navigate("/Walk4Page")}>
          <img src="/icons/back.png" alt="뒤로가기" className="Walk5-back-icon" />
        </button>
        <h1 className="Walk5-title">
          반려동물에 대해
          <br />
          알려주세요
        </h1>
      </div>

      <div className="Walk5-content">
        <div className="Walk5-profile-card">
          <div className="Walk5-profile-image">
            {profileImage ? (
              <img
                src={profileImage || "/placeholder.svg"}
                alt="반려동물 프로필"
                onError={(e) => {
                  console.error("이미지 로드 실패:", profileImage);
                  e.target.src = "/placeholder.svg";
                  setProfileImage(null);
                }}
              />
            ) : (
              <div className="Walk5-profile-placeholder">
                <span>프로필 없음</span>
              </div>
            )}
          </div>
          <div className="Walk5-profile-info">
            <div className="Walk5-name">{petInfo.name || "이름"}</div>
            <div className="Walk5-details">
              {`${petInfo.size || "사이즈"}\n${petInfo.gender || "성별"} · ${calculateAge(petInfo.birth_date) || "나이"}`}
            </div>
          </div>
          <button className="Walk5-edit-button">
            <input type="checkbox" className="Walk5-checkbox" defaultChecked />
          </button>
        </div>

        <div className="Walk5-request-section">
          <h2 className="Walk5-section-title">요청사항</h2>
          <textarea
            className="Walk5-request-input"
            placeholder="요청사항을 꼼꼼하게 적어주세요!"
            rows={6}
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
          />
        </div>

        <div className="Walk5-info-box">
          <p className="Walk5-info-title">📢 강아지 인식표 착용했나요?</p>
          <p className="Walk5-info-text">
            반려견의 안전을 위해 인식표 착용은 필수입니다.
            인식표를 착용하지 않은 강아지는 산책이 불가능하며, 이를 어기고 산책 중 발생한 사고에 대한 책임은 보호자에게 있습니다.
          </p>
        </div>
      </div>

      <div className="Walk5-bottom-section">
        <button className="Walk5-next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}
