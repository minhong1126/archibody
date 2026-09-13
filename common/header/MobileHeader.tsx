'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { MenuItem } from '@/type/common/headerType';
import Image from 'next/image';
import { HiChevronLeft, HiBars3 } from 'react-icons/hi2';
import logo from '@/public/common/main-logo.png';

type MobileHeaderProps = {
  menuItems: MenuItem[];
  isHeaderVisible: boolean;
};

const MobileHeader = ({ menuItems, isHeaderVisible }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // portal은 클라이언트에서만 document.body에 접근 가능
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // 헤더가 스크롤로 숨겨지면 열려있던 메뉴도 자동으로 닫기
  useEffect(() => {
    if (!isHeaderVisible) {
      setIsMenuOpen(false);
    }
  }, [isHeaderVisible]);

  // 메뉴 열려있는 동안 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <div
        className={`relative flex h-28 w-full items-center justify-center overflow-hidden bg-white ${isMenuOpen && 'hidden'}`}
      >
        <Link
          href="/"
          aria-label="홈으로 이동"
          className="absolute top-1/2 left-1/2 -translate-1/2"
        >
          <Image width={36} height={36} src={logo} alt="logo" />
        </Link>

        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-1/2 right-6.75 -translate-y-1/2"
        >
          <HiBars3 className="size-5 text-neutral-400" />
        </button>
      </div>

      {mounted &&
        createPortal(
          <div
            className={`text-header-text fixed inset-0 h-screen w-full bg-white transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden={!isMenuOpen}
          >
            <div className="relative flex h-28 w-full items-center justify-center">
              <Link
                href="/"
                aria-label="홈으로 이동"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-1/2 left-1/2 -translate-1/2"
              >
                <Image width={36} height={36} src={logo} alt="logo" />
              </Link>

              <button
                type="button"
                aria-label="뒤로가기"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-1/2 left-6.75 -translate-y-1/2"
              >
                <HiChevronLeft className="size-5" height={15} width={9} />
              </button>
            </div>

            <nav className="flex flex-col items-start justify-start gap-5 px-[33px] pt-[45px] text-[clamp(14px,3.5vw,24px)]">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="self-stretch text-left text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
};

export default MobileHeader;
