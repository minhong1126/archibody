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
      className={`text-header-text fixed z-50 flex w-full bg-white transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} `}
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
