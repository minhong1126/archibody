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
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E4E4] text-white transition hover:scale-110"
    >
      <IoIosArrowRoundUp size={20} />
    </button>
  );
};

export default UpButton;
