"use client";

import { useRef, ReactNode } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CustomSwiperProps {
  items: ReactNode[]; // Accepts array of React components
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({ items }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative w-full flex justify-center">
      <div
        ref={trackRef}
        className="flex gap-5 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {items.map((component, index) => (
          <div
            key={index}
            className="snap-start shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            {component}
          </div>
        ))}
      </div>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-lg text-black"
      >
        <IoIosArrowBack size={24} />
      </button>

      <button
        onClick={() => scroll(1)}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-lg text-black"
      >
        <IoIosArrowForward size={24} />
      </button>
    </div>
  );
};

export default CustomSwiper;
