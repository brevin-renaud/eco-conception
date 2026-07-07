"use client";

import { useRef, ReactNode } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface TabImageSwiperProps {
  items: ReactNode[]; // Accepts array of React components
  ButtonClassName?: string;
}

const TabImageSwiper: React.FC<TabImageSwiperProps> = ({
  items,
  ButtonClassName = " absolute -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-lg text-black",
}) => {
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
            className="snap-start shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/4"
          >
            {component}
          </div>
        ))}
      </div>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className={`left-2 top-1/2 ${ButtonClassName}`}
      >
        <IoIosArrowBack size={24} />
      </button>

      <button
        onClick={() => scroll(1)}
        aria-label="Next"
        className={`right-2 top-1/2 ${ButtonClassName}`}
      >
        <IoIosArrowForward size={24} />
      </button>
    </div>
  );
};

export default TabImageSwiper;
