/// <reference types="navermaps" />
'use client';

import { useRef } from 'react';
import Script from 'next/script';

type Props = {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
};

const KEY_ID = process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID;

export const NaverMap = ({ lat, lng, zoom = 16, className = '' }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    if (!mapRef.current || typeof naver === 'undefined') return;

    const position = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(mapRef.current, {
      center: position,
      zoom,
      zoomControl: true, // 확대/축소 버튼
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    });

    new naver.maps.Marker({ position, map });
  };

  if (!KEY_ID) {
    return (
      <div
        className={`grid place-items-center bg-neutral-100 text-sm text-neutral-500 ${className}`}
      >
        지도를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${KEY_ID}`}
        strategy="afterInteractive"
        onReady={initMap}
      />
      <div ref={mapRef} className={className} />
    </>
  );
};
