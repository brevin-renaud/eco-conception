"use client";
import { Button, Chip } from "@jamsr-ui/react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Fire, Heart } from "./svgs";
import { useState } from "react";

const QuickViewDialog = dynamic(() => import("./QuickViewDialog"), {
  ssr: false,
});

interface CardComponentProps {
  href: string;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
  price: string;
  mainPrice: string;
  onLike?: () => void;
  showInfoText?: string;
  className?: string;
  isTrending?: boolean;
  colors?: { colorImage: string; colorName: string }[];
}

export default function CardComponent({
  href,
  imageSrc,
  altText,
  title,
  description,
  price,
  mainPrice,
  onLike = () => {},
  showInfoText = "Show Info",
  className = "",
  isTrending = false,
  colors = [],
}: CardComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <Link href={href} className={`text-start cursor-pointer ${className}`}>
        <div className="relative h-[300px] md:h-[400px] rounded-lg group transition-transform duration-300 overflow-hidden">
          {isTrending && (
            <Chip size="sm" color="success" className="absolute top-3 left-3  text-white pe-3 font-semibold">
              <Fire className="h-3 w-3" /> Trending
            </Chip>
          )}

          <Image
            width={200}
            height={200}
            src={imageSrc}
            alt={altText}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="w-full h-full object-cover"
          />

          <div
            className="absolute p-1 top-3 right-3 bg-white text-black rounded-full cursor-pointer"
            onClick={onLike}
          >
            <Heart className="h-6 w-6" />
          </div>

          <Button
            className="text-md ui-hover:none  font-semibold hover:text-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-neutral-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            size="sm"
            disableAnimation
            disableRipple
            startContent={<MdOutlineRemoveRedEye />}
            onClick={handleInfo}
          >
            {showInfoText}
          </Button>
        </div>
        <div className="px-1">
          <h1 className="text-md font-semibold mt-2">{title}</h1>
          <p className="text-sm font-semibold text-neutral-500">{description}</p>
          <p className="text-sm font-semibold text-neutral-500">{price}</p>
        </div>
      </Link>

      {isOpen && (
        <QuickViewDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          imageSrc={imageSrc}
          altText={altText}
          title={title}
          description={description}
          price={price}
          mainPrice={mainPrice}
          colors={colors}
        />
      )}
    </>
  );
}
