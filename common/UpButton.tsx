"use client";

import { IoIosArrowRoundUp } from "react-icons/io";

const UpButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 flex lg:h-15.5 lg:w-15.5 items-center justify-center rounded-full bg-[#E4E4E4] text-white transition hover:scale-110
          lg:bottom-6.5 lg:right-6.5"
    >
      <IoIosArrowRoundUp size={24} className="lg:h-24 lg:2-24" />
    </button>
  );
};

export default UpButton;
