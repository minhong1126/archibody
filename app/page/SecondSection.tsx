"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const images = [
  "/home/home1.jpg",
  "/home/home2.jpg",
  "/home/home3.jpg",
  "/home/home4.jpg",
  "/home/home5.jpg",
];

const SecondSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-[calc(100vh-60px)] w-[75%] mx-auto">
      <div className="w-full h-[80%] overflow-hidden">
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full h-full shrink-0 relative">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 버튼 */}
      <div className="flex gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-[#9C9C9C] scale-110 "
                : "bg-[#E6E6E6] hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SecondSection;
