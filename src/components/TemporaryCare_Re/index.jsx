"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import DogCard from "../Dog"
import "./TemporaryCare_Re.css"

const TemporaryCare_Re = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 초기 태그 상태를 빈 배열로 설정
  const [tags, setTags] = useState([])

  useEffect(() => {
    // location.state 데이터 확인
    console.log("location.state:", location.state)

    if (location.state?.top_3_tags) {
      console.log("받은 top_3_tags:", location.state.top_3_tags)
      
      const newTags = location.state.top_3_tags.map(([tagName, count]) => ({
        name: tagName,
        isSelected: false,
        count: count
      }))
      
      console.log("변환된 태그:", newTags)
      setTags(newTags)
    }
  }, [location.state])

  const handleTagClick = (index) => {
    const newTags = [...tags]
    newTags[index].isSelected = !newTags[index].isSelected
    setTags(newTags)
  }

  const recommendedDogs = location.state?.recommendedDogs || []

  return (
    <div className="TemporaryCare_Re-temporary-care">
      <header className="TemporaryCare_Re-header">
        <div className="TemporaryCare_Re-header-content">
          <button className="TemporaryCare_Re-back-button">
            <img
              src="/icons/back.png"
              alt="뒤로가기"
              className="TemporaryCare_Re-back-icon"
              onClick={() => navigate("/TemporaryCarePage")}
            />
          </button>
          <div className="TemporaryCare_Re-title-description">
            <h1>맞춤추천</h1>
            <p className="TemporaryCare_Re-description">
              당신의 마음과 맞는 강아지를 찾아보세요
              <br />
              특별한 인연을 맺고, 함께 행복한 추억을
              <br />
              만들어가요!
            </p>
          </div>
        </div>
      </header>

      <div className="TemporaryCare_Re-scrollable-content">
        <div className="TemporaryCare_Re-tags-container">
          <div className="TemporaryCare_Re-tags">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <button
                  key={index}
                  className={`TemporaryCare_Re-tag ${tag.isSelected ? "selected" : ""}`}
                  onClick={() => handleTagClick(index)}
                >
                  #{tag.name}
                </button>
              ))
            ) : (
              <p>태그를 불러오는 중...</p>
            )}
          </div>
        </div>

        <main className="TemporaryCare_Re-main-content">
          <div className="TemporaryCare_Re-dogs-grid">
            {recommendedDogs.length > 0 ? (
              recommendedDogs.map((dog, index) => <DogCard key={index} dog={dog} />)
            ) : (
              <p>추천된 강아지가 없습니다.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default TemporaryCare_Re