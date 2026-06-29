"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import mainLogo from "@/public/common/main-logo.png";

export const MainHeader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        setVisible(currentScrollY < lastScrollY);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex h-20 w-full items-center px-20 bg-white transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link href="/home">
        <Image src={mainLogo} alt="Logo" width={48} height={48} />
      </Link>

      <nav className="absolute left-1/2 flex -translate-x-1/2 gap-7 font-semibold text-[#878787]">
        <Link href="/home">소개</Link>
        <Link href="/projects">프로젝트</Link>
        <Link href="/programs">프로그램</Link>
        <Link href="/contact">문의</Link>
      </nav>
    </header>
  );
};
