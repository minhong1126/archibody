"use client";

import { useEffect, useRef, useState } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

const MENU_LINKS = [
  { label: "소개", href: "/about" },
  { label: "프로젝트", href: "/projects" },
  { label: "프로그램", href: "/programs" },
  { label: "문의", href: "/contact" },
];

const MainHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // 오토 하이드 헤더 - 최상단일 떄 or 스크롤을 살짝 올렸을 때만 헤더가 나옴
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 50) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full bg-white text-header-text transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"} `}
    >
      {/* 1024 이상일 떄는 데스크탑 버전 */}
      <div className="hidden w-full min-[1024px]:flex">
        <DesktopHeader menuItems={MENU_LINKS} />
      </div>

      {/* 1024 이하일 때는 모바일 버전 */}
      <div className="w-full min-[1024px]:hidden">
        <MobileHeader menuItems={MENU_LINKS} isHeaderVisible={isVisible} />
      </div>
    </header>
  );
};

export default MainHeader;
