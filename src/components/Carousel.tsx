"use client";
import { useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IconButton } from "@jamsr-ui/react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    src: "/images/carousel/4.png",
    title: "Fall favorites",
    description: "Our always-in-season staple, in brand new colors and your favorite fits.",
    buttons: [{ text: "Shop women's clothing", link: "/product/women/mini-categories" }],
  },
  {
    src: "/images/carousel/5.png",
    title: "New styles",
    description: "From lightweight layers to the perfect pair of pants, new seasonal favorites are here.",
    buttons: [
      { text: "Shop men", link: "/product/men" },
      { text: "Shop women", link: "/product/women/categories" },
    ],
  },
  {
    src: "/images/carousel/6.png",
    title: "Up to 50% off",
    description: "Summer sale",
    buttons: [
      { text: "Shop men", link: "/product/men" },
      { text: "Shop women", link: "/product/women/categories" },
    ],
  },
];

const SWIPE_THRESHOLD = 50;

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) =>
    setCurrentIndex((i + slides.length) % slides.length);
  const nextSlide = () => goTo(currentIndex + 1);
  const prevSlide = () => goTo(currentIndex - 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -SWIPE_THRESHOLD) nextSlide();
    else if (delta > SWIPE_THRESHOLD) prevSlide();
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full py-4 mx-auto rounded-lg overflow-hidden">
      <div
        className="relative w-full h-[200px] md:h-[300px] lg:h-[480px] overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-full shrink-0 bg-black text-white text-center"
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="rounded-lg pointer-events-none object-cover"
              />
              <div
                className={`text-black/75 absolute top-1/2 ${
                  index === 0 ? "left-1/2 -translate-x-1/2" : "left-[33%]"
                } -translate-y-1/2 px-4 text-center w-2/3`}
              >
                <h2 className="text-5xl font-bold">{slide.title}</h2>
                <p className="text-md">{slide.description}</p>
                <div className="mt-2 flex justify-center gap-2">
                  {slide.buttons.map((button, btnIndex) => (
                    <Link
                      key={btnIndex}
                      href={button.link}
                      className="hover:text-white font-semibold text-lg px-4 py-2 rounded-lg underline underline-offset-4 tracking-tight leading-tight"
                    >
                      {button.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <IconButton
        disableRipple
        label="back"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 ui-hover:bg-white bg-white text-black p-2 rounded-full z-20"
      >
        <IoIosArrowBack size={24} />
      </IconButton>

      <IconButton
        disableRipple
        label="next"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 ui-hover:bg-white bg-white p-2 rounded-full text-black z-20"
      >
        <IoIosArrowForward size={24} />
      </IconButton>
    </div>
  );
};

export default Carousel;
