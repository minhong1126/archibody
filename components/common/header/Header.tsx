'use client';

import { useEffect, useRef, useState } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const MENU_LINKS = [
  { label: '소개', href: '/about' },
  { label: '프로젝트', href: '/projects' },
  { label: '프로그램', href: '/programs' },
  { label: '문의', href: '/contact' },
];

const MainHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  // 헤더 실제 높이를 --header-h CSS 변수로 공유 (화면 크기에 따라 바뀌어도 자동 반영)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${el.offsetHeight}px`,
      );
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // 스크롤 방향에 따라 헤더 숨김/표시
  useEffect(() => {
    const mainEl = document.querySelector('main');

    const getScrollY = () => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      if (isDesktop && mainEl) return mainEl.scrollTop;
      return window.scrollY;
    };

    const handleScroll = () => {
      const currentY = getScrollY();

      if (currentY < 50) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    mainEl?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mainEl?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`text-header-text fixed z-50 flex w-full bg-white transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="hidden w-full min-[1024px]:flex">
        <DesktopHeader menuItems={MENU_LINKS} />
      </div>

      <div className="w-full min-[1024px]:hidden">
        <MobileHeader menuItems={MENU_LINKS} isHeaderVisible={isVisible} />
      </div>
    </header>
  );
};

export default MainHeader;
