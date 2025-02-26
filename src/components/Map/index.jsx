import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { supabase } from "../../lib/supabaseClient";
import RealTimeLocation from "../RealTimeLocation";

const TMAP_API_KEY = process.env.REACT_APP_TMAP_API_KEY;

const Map = ({ onDataReady }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [steps, setSteps] = useState(null);
  const [time, setTime] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const endMarkerRef = useRef(null);
  const [uuidId, setUuidId] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [prevEndLocation, setPrevEndLocation] = useState(null);

  useEffect(() => {
    const fetchUserUUID = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("🚨 UUID 가져오기 실패:", error);
        return;
      }

      console.log("✅ Supabase에서 가져온 uuid_id:", session.user.id);
      setUuidId(session.user.id);
    };

    fetchUserUUID();
  }, []);

  // ✅ `uuid_id`가 설정된 후 데이터 가져오기
  useEffect(() => {
    if (uuidId) {
        fetchReservationId(uuidId);
    }
  }, [uuidId]);

  // ✅ reservationId가 설정된 후 주소 가져오기
  useEffect(() => {
    if (reservationId) {
        console.log("reservationId 변경 감지됨:", reservationId);
        fetchAddresses();
    }
  }, [reservationId]);

  // ✅ `uuid_id` 기반으로 `reservation_id` 조회
  const fetchReservationId = async (uuidId) => {
    console.log("가져온 uuidId:", uuidId)
    try {
      const response = await axios.get(
        `http://localhost:8000/api/reservations/latest?uuid_id=${uuidId}`
      );
      console.log("📌 예약 데이터 응답:", response.data);

      if (response.data && response.data.id) {
        setReservationId(response.data.id); // ✅ reservationId 설정
        console.log("✅ 가져온 예약 ID:", response.data.id);
      } else {
        console.error("🚨 현재 사용자에 대한 예약 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("🚨 예약 데이터를 불러오는 데 실패했습니다:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/address`);
      const data = await response.json();

      console.log(" 예약에서 가져온 주소 데이터:", data);

      const startLocation = {
        latitude: data.latitude,
        longitude: data.longitude
      };
      setStartLocation(startLocation);
      setEndLocation(startLocation); // 초기 목적지는 출발지와 동일하게 설정
      
      initializeMap(startLocation, startLocation);
    } catch (error) {
      console.error("🚨 주소 데이터를 불러오는데 실패했습니다:", error);
    }
  };

    // ✅ 실시간 목적지 업데이트 (30초마다 호출됨)
  const handleRealTimeLocationUpdate = (newLocation) => {
    console.log("📍 실시간 목적지 업데이트:", newLocation);
    setEndLocation(newLocation); // 목적지 업데이트

    if (endMarkerRef.current) {
      console.log("기존 현위치 마커 위치 변경");
      endMarkerRef.current.setPosition(new window.Tmapv2.LatLng(newLocation.latitude, newLocation.longitude));
    }
  };

  useEffect(() => {
    if (!startLocation || !endLocation) return;
    if (prevEndLocation && prevEndLocation.latitude === endLocation.latitude && prevEndLocation.longitude === endLocation.longitude) {
      console.log("⏳ 위치 변화 없음, API 요청 생략");
      return;
    }

    console.log("📌 위치 변화 감지됨! 지도 및 경로 업데이트 실행");
    fetchWalkingDistance(startLocation, endLocation);
    setPrevEndLocation(endLocation);
  }, [endLocation]);

  const fetchWalkingDistance = async (start, end) => {
    try {
      const requestData = {
        startX: start.longitude.toFixed(6),
        startY: start.latitude.toFixed(6),
        endX: end.longitude.toFixed(6),
        endY: end.latitude.toFixed(6),
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "출발지",
        endName: "목적지",
      };

      const headers = { "Content-Type": "application/json", "appKey": TMAP_API_KEY };

      const response = await axios.post(
        `https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1`,
        JSON.stringify(requestData),
        { headers }
      );

      const resultData = response.data.features;
      console.log("🚶 Tmap API 응답 데이터:", resultData);

      let totalDistance = 0;
      let totalTime = 0;

      resultData.forEach((feature) => {
        if (feature.properties.distance) totalDistance += feature.properties.distance;
        if (feature.properties.time) totalTime += feature.properties.time;
      });

      const distanceKm = (totalDistance / 1000).toFixed(2); // km 단위 변환
      const estimatedSteps = Math.round(totalDistance / 0.7); // 걸음 수 (1걸음 = 약 0.7m)
      const estimatedTime = Math.ceil(totalTime / 60); // 분 단위 변환

      setDistance(distanceKm);
      setTime(estimatedTime);
      setSteps(estimatedSteps);

      console.log(`📏 거리: ${distanceKm} km`);
      console.log(`🚶‍♂️ 걸음 수: ${estimatedSteps} 걸음`);
      console.log(`⏳ 예상 소요 시간: ${estimatedTime} 분`);

      // ✅ 부모 컴포넌트로 데이터 전달
      onDataReady({ 
        uuidId,
        distance: distanceKm, 
        steps: estimatedSteps, 
        time: estimatedTime,
        startLocation: start,
        endLocation: end,

      });
      setTimeout(() => {
        drawPedestrianRoute(start, end, map);
      }, 1000);
    } catch (error) {
      console.error("🚨 거리 데이터를 불러오는데 실패했습니다:", error);
    }
  };

  // ✅ Tmap API를 이용한 보행자 경로 요청
  const drawPedestrianRoute = async (start, end, mapInstance) => {
    try {
      console.log("📌 출발지:", start);
      console.log("📌 목적지:", end);
      if (!mapInstance) {
        console.error("mapInstance가 null 입니다");
        return;
      }

      const requestData = {
        startX: start.longitude.toFixed(6),
        startY: start.latitude.toFixed(6),
        endX: end.longitude.toFixed(6),
        endY: end.latitude.toFixed(6),
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "출발지",
        endName: "목적지",
      };

      console.log("📌 요청할 API 데이터:", requestData);

      const headers = {
        "Content-Type": "application/json",
        "appKey": TMAP_API_KEY,
      };

      const response = await axios.post(
        `https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1`,
        JSON.stringify(requestData),
        { headers }
      );

      const resultData = response.data.features;
      console.log("🚶 Tmap API 응답 데이터:", resultData);

      if (!resultData || resultData.length === 0) {
        console.error("🚨 API 오류 또는 경로 데이터가 없습니다.", resultData);
        return;
      }

      const drawInfoArr = [];
      for (let i = 0; i < resultData.length; i++) {
        const geometry = resultData[i].geometry;
        if (geometry.type === "LineString") {
          for (let j = 0; j < geometry.coordinates.length; j++) {
            const latLng = new window.Tmapv2.LatLng(
              geometry.coordinates[j][1],
              geometry.coordinates[j][0]
            );
            drawInfoArr.push(latLng);
          }
        }
      }

      console.log("📌 변환된 폴리라인 좌표 개수:", drawInfoArr.length);
      console.log("📌 변환된 폴리라인 좌표 목록:", drawInfoArr);

      // ✅ 기존 폴리라인 삭제
      if (polyline) {
        polyline.setMap(null);
        setPolyline(null);
      }

      // ✅ 새로운 폴리라인 추가
      const newPolyline = new window.Tmapv2.Polyline({
        path: drawInfoArr,
        strokeColor: "#0000FF",
        strokeWeight: 6,
        map: mapInstance,
        zIndex: 1000,
      });

      setPolyline(newPolyline);
      console.log("🛤️ 변환된 보행자 경로 폴리라인 추가 완료:", newPolyline);

    } catch (error) {
      console.error("🚨 경로 데이터를 불러오는데 실패했습니다:", error);
    }
  };

  const initializeMap = (startLocation, endLocation) => {
    if (map) {
      console.log("기존 지도 객체 삭제");
      map.destroy();
      setMap(null);
    }

    const newMap = new window.Tmapv2.Map(mapRef.current, {
      center: new window.Tmapv2.LatLng(startLocation.latitude, startLocation.longitude),
      width: "100%",
      height: "100%",
      zoom: 16,
    });

    setMap(newMap);

    const startMarkerInstance = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(startLocation.latitude, startLocation.longitude), 
      map: newMap, 
      icon: "/mapicons/start.png",
      iconSize: new window.Tmapv2.Size(32, 32) });
      endMarkerRef.current = new window.Tmapv2.Marker({ 
      position: new window.Tmapv2.LatLng(endLocation.latitude, endLocation.longitude), 
      map: newMap, 
      icon: "/mapicons/end.png", 
      iconSize: new window.Tmapv2.Size(32, 32) });

      setStartMarker(startMarkerInstance);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <RealTimeLocation onLocationUpdate={handleRealTimeLocationUpdate} />
      <div id="map" ref={mapRef} style={{ width: "100%", height: "80%", borderRadius: "20px" }} />
    </div>
  );
};

export default Map;