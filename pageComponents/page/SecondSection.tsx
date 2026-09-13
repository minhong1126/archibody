'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  '/home/home1.jpg',
  '/home/home2.jpg',
  '/home/home3.jpg',
  '/home/home4.jpg',
  '/home/home5.jpg',
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
    <section className="mx-auto flex w-full flex-col items-center justify-center gap-6 px-6 py-16 lg:size-full lg:gap-10 lg:p-0 lg:px-[10%]">
      <div className="flex w-full flex-col items-center gap-6 lg:gap-10">
        <div className="aspect-390/214 w-full overflow-hidden lg:aspect-1238/624">
          <div
            className="flex size-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={index} className="relative size-full shrink-0">
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

        <div className="hidden gap-2 lg:flex lg:gap-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`size-2 rounded-full transition-all duration-300 lg:size-2.5 ${
                currentIndex === index
                  ? 'scale-110 bg-[#9C9C9C]'
                  : 'bg-[#E6E6E6] hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondSection;
