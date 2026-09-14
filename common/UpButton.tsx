'use client';

import { IoIosArrowRoundUp } from 'react-icons/io';

const UpButton = () => {
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('main');

    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-4 bottom-4 z-50 flex size-10 items-center justify-center rounded-full bg-[#E4E4E4] text-white transition hover:scale-110 lg:right-6.5 lg:bottom-6.5 lg:size-15.5"
    >
      <IoIosArrowRoundUp size={24} className="lg:size-24" />
    </button>
  );
};

export default UpButton;
