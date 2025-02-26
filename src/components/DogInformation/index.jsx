"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocation } from "react-router-dom"
import "./DogInformation.css"
import { supabase } from "../../lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

export default function DogInformation() {
  const location = useLocation()
  const mbtiFromTest = location.state?.mbti || ""

  // 상태값들
  const [birthYear, setBirthYear] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [weight, setWeight] = useState("")
  const [petName, setPetName] = useState("")
  const [petBreed, setPetBreed] = useState("")
  const [petGender, setPetGender] = useState("")
  const [petNeutered, setPetNeutered] = useState("")
  const [petNotes, setPetNotes] = useState("")
  const [petImage, setPetImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [petSize, setPetSize] = useState("")
  const [petMbti, setPetMbti] = useState(mbtiFromTest || "")
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // 날짜 유효성 검사 함수
  const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date) && date.toISOString().slice(0, 10) === dateString
  }

  // 이미지 URL 유효성 검사 함수
  const validateImageUrl = useCallback(async (url) => {
    try {
      const validUrl = new URL(url)
      console.log("✅ 유효한 이미지 URL:", validUrl.toString())
      return validUrl.toString()
    } catch (error) {
      console.error("❌ 잘못된 이미지 URL 형식:", error)
      return null
    }
  }, [])

  // Supabase에서 데이터 불러오기
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setIsLoading(true)
        console.log("🔍 반려견 데이터 조회 시작")

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("사용자 정보 조회 에러:", userError.message)
          return
        }

        if (!user) {
          console.log("로그인된 사용자가 없습니다.")
          return
        }

        console.log("👤 현재 사용자 ID:", user.id)

        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("uuid_id", user.id)
          .maybeSingle()

        if (petError) {
          console.error("반려견 데이터 조회 에러:", petError.message)
          return
        }

        console.log("📋 조회된 반려견 데이터:", petData)

        if (petData) {
          console.log("✅ 반려견 데이터 존재, 상태 업데이트 시작")

          if (petData.birth_date) {
            const [year, month, day] = petData.birth_date.split("-")
            setBirthYear(year || "")
            setBirthMonth(month || "")
            setBirthDay(day || "")
          }

          setPetName(petData.name || "")
          setPetBreed(petData.breed || "")
          setPetGender(petData.gender || "")
          setWeight(petData.weight ? petData.weight.toString() : "")
          setPetSize(petData.size || "")
          setPetNeutered(petData.is_neutered ? "yes" : "no")
          setPetNotes(petData.notes || "")
          setPetMbti(petData.pet_mbti || mbtiFromTest || "")

          // 이미지 URL이 있는 경우 프리뷰 설정
          if (petData.image_url) {
            const validatedUrl = await validateImageUrl(petData.image_url)
            if (validatedUrl) {
              setPreviewImage(validatedUrl)
              setImageError(false)
            } else {
              setPreviewImage(null)
              setImageError(true)
            }
          }

          console.log("✅ 상태 업데이트 완료")
        } else {
          console.log("ℹ️ 등록된 반려견 정보가 없습니다.")
        }
      } catch (error) {
        console.error("🚨 데이터 불러오기 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPetData()
  }, [mbtiFromTest, validateImageUrl])

  const handleNumberInput = (e, setter, maxLength) => {
    const value = e.target.value.replace(/\D/g, "")
    setter(value.slice(0, maxLength))
  }

  const isYearValid = (year) => {
    const currentYear = new Date().getFullYear()
    return year >= 1900 && year <= currentYear
  }

  const isMonthValid = (month) => {
    const monthNum = Number.parseInt(month, 10)
    return monthNum >= 1 && monthNum <= 12
  }

  const isDayValid = (year, month, day) => {
    if (!year || !month || !day) return true
    const daysInMonth = new Date(year, Number.parseInt(month, 10), 0).getDate()
    const dayNum = Number.parseInt(day, 10)
    return dayNum >= 1 && dayNum <= daysInMonth
  }

  const handleWeightInput = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "")
    const parts = value.split(".")
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 1) parts[1] = parts[1].slice(0, 1)

    const updatedWeight = parts.join(".")
    setWeight(updatedWeight)

    if (updatedWeight === "") {
      setPetSize("")
      return
    }

    const parsedWeight = Number.parseFloat(updatedWeight)
    if (!isNaN(parsedWeight)) {
      setPetSize(parsedWeight > 15 ? "대형견" : "소형/중형견")
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("파일 크기는 5MB를 초과할 수 없습니다.")
        }
  
        // 이미지 타입 체크
        if (!file.type.startsWith("image/")) {
          throw new Error("이미지 파일만 업로드 가능합니다.")
        }
  
        setPetImage(file)
        setImageError(false)
        
        // blob URL 생성 제거
        // 이미지 미리보기는 파일 자체를 사용
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
  
      } catch (error) {
        console.error("❌ 이미지 처리 중 오류:", error)
        alert(error.message)
        setPetImage(null)
        setPreviewImage(null)
        setImageError(true)
      }
    }
  }

  const uploadImageToSupabase = async (file) => {
    if (!file) {
      console.error("❌ 업로드할 파일이 없습니다.")
      return null
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("🚨 사용자 정보를 가져올 수 없습니다:", userError?.message)
      alert("로그인이 필요합니다.")
      return null
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    try {
      const { data, error } = await supabase.storage.from("pets_images").upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("❌ 이미지 업로드 실패:", error.message)
        return null
      }

      const { publicUrl } = supabase.storage.from("pets_images").getPublicUrl(filePath)

      const validatedUrl = await validateImageUrl(publicUrl)
      if (!validatedUrl) {
        throw new Error("유효하지 않은 이미지 URL이 생성되었습니다.")
      }

      console.log("🎉 업로드 성공! 이미지 URL:", validatedUrl)
      return validatedUrl
    } catch (err) {
      console.error("❌ 이미지 업로드 중 오류 발생:", err.message)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("✅ handleSubmit 실행됨")

    try {
      // 필수 입력값 검증
      if (!petName?.trim()) throw new Error("이름을 입력해주세요.")
      if (!petGender) throw new Error("성별을 선택해주세요.")
      if (!petBreed?.trim()) throw new Error("품종을 입력해주세요.")
      if (!birthYear || !birthMonth || !birthDay) throw new Error("생년월일을 입력해주세요.")
      if (!weight) throw new Error("몸무게를 입력해주세요.")
      if (!petNeutered) throw new Error("중성화 여부를 선택해주세요.")

      // 현재 로그인된 사용자 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("로그인이 필요합니다.")
      }

      console.log("현재 로그인된 사용자:", user)

      // 날짜 형식 검증
      const birthDate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
      if (!isValidDate(birthDate)) {
        throw new Error("올바른 날짜 형식이 아닙니다.")
      }

      // 몸무게 숫자 변환 및 검증
      const weightNum = Number.parseFloat(weight)
      if (isNaN(weightNum) || weightNum <= 0) {
        throw new Error("올바른 몸무게를 입력해주세요.")
      }

      // 이미지 업로드 (새 이미지가 있는 경우)
      let imageUrl = previewImage
      if (petImage) {
        const uploadedUrl = await uploadImageToSupabase(petImage)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // 반려견 정보 객체
      const petInfo = {
        uuid_id: user.id,
        name: petName.trim(),
        breed: petBreed.trim(),
        size: petSize || "소형/중형견",
        weight: weightNum,
        gender: petGender,
        notes: petNotes?.trim() || "",
        pet_mbti: petMbti || "",
        is_neutered: petNeutered === "yes",
        image_url: imageUrl,
        birth_date: birthDate,
      }

      console.log("저장할 반려견 정보:", petInfo)

      // 기존 데이터 확인
      const { data: existingPet, error: queryError } = await supabase
        .from("pets")
        .select("id")
        .eq("uuid_id", user.id)
        .maybeSingle()

      if (queryError) {
        console.error("데이터 조회 에러:", queryError)
        throw new Error("데이터 조회 중 오류가 발생했습니다.")
      }

      let result
      if (existingPet) {
        // 업데이트
        console.log("기존 데이터 업데이트")
        result = await supabase.from("pets").update(petInfo).eq("id", existingPet.id).select()
      } else {
        // 새로 생성
        console.log("새 데이터 생성")
        result = await supabase.from("pets").insert([petInfo]).select()
      }

      if (result.error) {
        console.error("데이터베이스 에러:", result.error)
        throw new Error("저장에 실패했습니다.")
      }

      console.log("저장된 데이터:", result.data)
      alert("반려동물 정보가 성공적으로 저장되었습니다!")
      window.location.href = "/ProfilePage"
    } catch (error) {
      console.error("❌ 저장 실패:", error)
      alert(error.message)
    }
  }

  if (isLoading) {
    return <div className="loading">데이터를 불러오는 중...</div>
  }

  return (
    <div className="doginformation-container" style={{ height: "100%", overflowY: "auto" }}>
      <header className="doginformation-header">
        <a href="/ProfilePage" className="doginformation-back-button">
          <img src="/icons/back.png" alt="뒤로가기" className="doginformation-back-icon" />
        </a>

        <div className="doginformation-image-container" onClick={() => document.getElementById("imageUpload").click()}>
          <div className="doginformation-image">
            {previewImage ? (
              <img
                src={previewImage || "/placeholder.svg"}
                alt="미리보기"
                className="image-preview"
                onError={(e) => {
                  console.error("❌ 이미지 로딩 실패:", previewImage)
                  e.target.src = "/placeholder.svg"
                  setPreviewImage(null)
                  setImageError(true)
                }}
              />
            ) : (
              <span className="doginformation-text">{imageError ? "이미지 로드 실패" : "사진 등록"}</span>
            )}
          </div>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </header>

      <div className="doginformation-content">
        <form className="doginformation-form" onSubmit={handleSubmit}>
          <h2 className="doginformation-form-title">기본 사항</h2>

          <div className="doginformation-form-group">
            <label className="doginformation-label">이름</label>
            <input
              type="text"
              className="doginformation-form-input"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="반려견 이름"
            />
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">성별</label>
            <div className="doginformation-radio-group">
              <label className="doginformation-radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={petGender === "female"}
                  onChange={() => setPetGender("female")}
                />
                <span>여자아이</span>
              </label>
              <label className="doginformation-radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={petGender === "male"}
                  onChange={() => setPetGender("male")}
                />
                <span>남자아이</span>
              </label>
            </div>
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">품종</label>
            <input
              type="text"
              className="doginformation-form-input"
              value={petBreed}
              onChange={(e) => setPetBreed(e.target.value)}
              placeholder="품종"
            />
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">생일</label>
            <div className="doginformation-date-inputs">
              <input
                type="text"
                className={`doginformation-form-input doginformation-date-input ${!isYearValid(birthYear) ? "invalid-date" : ""}`}
                placeholder="YYYY"
                value={birthYear}
                onChange={(e) => handleNumberInput(e, setBirthYear, 4)}
              />
              <span className="doginformation-date-separator">-</span>
              <input
                type="text"
                className={`doginformation-form-input doginformation-date-input ${!isMonthValid(birthMonth) ? "invalid-date" : ""}`}
                placeholder="MM"
                value={birthMonth}
                onChange={(e) => handleNumberInput(e, setBirthMonth, 2)}
              />
              <span className="doginformation-date-separator">-</span>
              <input
                type="text"
                className={`doginformation-form-input doginformation-date-input ${!isDayValid(birthYear, birthMonth, birthDay) ? "invalid-date" : ""}`}
                placeholder="DD"
                value={birthDay}
                onChange={(e) => handleNumberInput(e, setBirthDay, 2)}
              />
            </div>
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">몸무게</label>
            <input
              type="text"
              className="doginformation-form-input"
              value={weight}
              onChange={handleWeightInput}
              placeholder="00.0"
            />
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">중성화</label>
            <div className="doginformation-radio-group">
              <label className="doginformation-radio-label">
                <input
                  type="radio"
                  name="neutered"
                  value="yes"
                  checked={petNeutered === "yes"}
                  onChange={() => setPetNeutered("yes")}
                />
                <span>했어요</span>
              </label>
              <label className="doginformation-radio-label">
                <input
                  type="radio"
                  name="neutered"
                  value="no"
                  checked={petNeutered === "no"}
                  onChange={() => setPetNeutered("no")}
                />
                <span>안 했어요</span>
              </label>
            </div>
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">댕BTI</label>
            <div className="doginformation-mbti-container">
              <input
                type="text"
                className="doginformation-form-input doginformation-mbti-input"
                value={petMbti}
                placeholder="ENFP"
                maxLength="4"
                readOnly
                disabled
                title="댕BTI 테스트 후 자동으로 입력됩니다"
              />
              <a href="/DbtiPage" className="doginformation-mbti-button-link">
                <button type="button" className="doginformation-mbti-button">
                  테스트
                </button>
              </a>
            </div>
          </div>

          <div className="doginformation-form-group">
            <label className="doginformation-label">참고사항</label>
            <textarea
              className="doginformation-form-input doginformation-textarea"
              value={petNotes}
              onChange={(e) => setPetNotes(e.target.value)}
              placeholder="특이 사항을 입력해주세요."
            />
          </div>

          <button type="submit" className="doginformation-submit-button">
            등록 완료
          </button>
        </form>
      </div>
    </div>
  )
}

