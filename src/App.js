import React from 'react';
import { Route, Routes } from "react-router-dom"


// 인트로 로그인 회원가입
import IntroPage from "./pages/IntroPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Signup2Page from "./pages/Signup2Page"


// 메인
import MainPage from "./pages/MainPage"
import Main_TPage from "./pages/Main_TPage" // 트레이너

// 메인/후기
import ReviewPage from "./pages/ReviewPage"


// 예약내역/진행예약
import ReservationPage from "./pages/ReservationPage"
import Reservation1Page from "./pages/Reservation1Page"
import Reservation2Page from "./pages/Reservation2Page"
import Reservation_TPage from "./pages/Reservation_TPage" // 트레이너
import Reservation2_TPage from "./pages/Reservation2_TPage" // 트레이너


// 예약내역/지난예약
import LastPage from "./pages/LastPage"
import LastReviewPage from "./pages/LastReviewPage"
import Last_TPage from "./pages/Last_TPage" // 트레이너


// 라이브
import LivePage from "./pages/LivePage"
import LiveResertPage from "./pages/LiveResertPage"
import Live_TPage from "./pages/Live_TPage" // 트레이너
import LiveResert_TPage from "./pages/LiveResert_TPage" // 트레이너


// 발도장
import LikePage from "./pages/LikePage"
import Like_TPage from "./pages/Like_TPage" // 트레이너


// 프로필
import ProfilePage from "./pages/ProfilePage"
import Profile_TPage from "./pages/Profile_TPage" // 트레이너
import MyProfilePage from "./pages/MyProfilePage"
import DogInformationPage from "./pages/DogInformationPage"
import TrainerInformationPage from "./pages/TrainerInformationPage" // 트레이너

// 프로필/지난산책리포트
import ResultLastPage from "./pages/ResultLastPage"

// 프로필/내후기확인하기
import Review_TPage from "./pages/Review_TPage" // 트레이너


// DBTI
import DbtiPage from "./pages/DbtiPage"
import MBTITest from "./components/Dbti/index.jsx"
import DbtiResult from "./components/Dbti_result/index.jsx"
import Dbti_resultPage from "./pages/Dbti_resultPage"


// 임시보호
import TemporaryCarePage from "./pages/TemporaryCarePage"
import TemporaryCare_RePage from "./pages/TemporaryCare_RePage"
import TemporaryCare_testPage from "./pages/TemporaryCare_testPage"


// 산책
import WalkPage from "./pages/WalkPage"
import Walk2Page from "./pages/Walk2Page"
import Walk3Page from "./pages/Walk3Page"
import Walk4Page from "./pages/Walk4Page"
import Walk4_noticePage from "./pages/Walk4_noticePage"
import Walk5Page from "./pages/Walk5Page"
import PricePage from "./pages/PricePage"



function App() {
  return (
    <Routes>
      {/* 인트로 로그인 회원가입 */}
      <Route path="/IntroPage" element={<IntroPage />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/SignupPage" element={<SignupPage />} />
      <Route path="/Signup2Page" element={<Signup2Page />} />


      {/* 메인 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/Main_TPage" element={<Main_TPage />} />

      {/* 메인/후기 */}
      <Route path="/ReviewPage" element={<ReviewPage />} />



      {/* 예약내역/진행예약 */}
      <Route path="/ReservationPage" element={<ReservationPage />} />
      <Route path="/Reservation1Page" element={<Reservation1Page />} />
      <Route path="/Reservation2Page" element={<Reservation2Page />} />
      <Route path="/Reservation_TPage" element={<Reservation_TPage />} />
      <Route path="/Reservation2_TPage" element={<Reservation2_TPage />} />


      {/* 예약내역/지난예약 */}
      <Route path="/LastPage" element={<LastPage />} />
      <Route path="/LastReviewPage" element={<LastReviewPage />} />
      <Route path="/Last_TPage" element={<Last_TPage />} />



      {/* 라이브 */}
      <Route path="/LivePage" element={<LivePage />} />
      <Route path="/LiveResertPage" element={<LiveResertPage />} />
      <Route path="/Live_TPage" element={<Live_TPage />} />
      <Route path="/LiveResert_TPage" element={<LiveResert_TPage />} />



      {/* 발도장 */}
      <Route path="/LikePage" element={<LikePage />} />
      <Route path="/Like_TPage" element={<Like_TPage />} />



      {/* 프로필 */}
      <Route path="/ProfilePage" element={<ProfilePage />} />
      <Route path="/Profile_TPage" element={<Profile_TPage />} />
      <Route path="/MyProfilePage" element={<MyProfilePage />} />
      <Route path="/DogInformationPage" element={<DogInformationPage />} />
      <Route path="/TrainerInformationPage" element={<TrainerInformationPage />} />

      {/* 프로필/지난산책리포트 */}
      <Route path="/ResultLastPage" element={<ResultLastPage />} />

      {/* 프로필/내후기확인하기 */}
      <Route path="/Review_TPage" element={<Review_TPage />} />



      {/* DBTI */}
      <Route path="/DbtiPage" element={<DbtiPage />} />
      <Route path="/" element={<MBTITest />} />
      <Route path="/Dbti_resultPage" element={<DbtiResult />} />
      <Route path="/Dbti_resultPage" element={<Dbti_resultPage />} />



      {/* 임시보호 */}
      <Route path="/TemporaryCarePage" element={<TemporaryCarePage />} />
      <Route path="/TemporaryCare_RePage" element={<TemporaryCare_RePage />} />
      <Route path="/TemporaryCare_testPage" element={<TemporaryCare_testPage />} />



      {/* 산책 */}
      <Route path="/WalkPage" element={<WalkPage />} />
      <Route path="/Walk2Page" element={<Walk2Page />} />
      <Route path="/Walk3Page" element={<Walk3Page />} />
      <Route path="/Walk4Page" element={<Walk4Page />} />
      <Route path="/Walk4_noticePage" element={<Walk4_noticePage />} />
      <Route path="/Walk5Page" element={<Walk5Page />} />
      <Route path="/PricePage" element={<PricePage />} />
    </Routes>
  )
}

export default App

