"use client";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Select,
  SelectItem,
} from "@jamsr-ui/react";
import Image from "next/image";
import { useState } from "react";
import { Clock, Close, Heart } from "./svgs";

interface QuickViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
  price: string;
  mainPrice: string;
  colors?: { colorImage: string; colorName: string }[];
}

export default function QuickViewDialog({
  isOpen,
  onOpenChange,
  imageSrc,
  altText,
  title,
  description,
  price,
  mainPrice,
  colors = [],
}: QuickViewDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const sizes = Array.from({ length: (12 - 6.5) / 0.5 + 1 }, (_, i) =>
    (6.5 + i * 0.5).toFixed(1)
  );

  const handleAddToCart = () => {
    console.log("Selected Color:", selectedColor);
    console.log("Selected Size:", selectedSize);
    console.log("Quantity:", quantity);

    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
  };

  return (
    <Dialog
      className="overflow-visible max-h-[500px] min-w-[900px]"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      closeButton={
        <IconButton
          label="button"
          className="absolute -right-3 -top-3 p-1 z-50"
          radius="full"
          onClick={() => onOpenChange(false)}
        >
          <Close />
        </IconButton>
      }
    >
      <DialogContent>
        <div className="flex w-full">
          <div className="basis-1/2 overflow-hidden rounded-s-lg">
            <Image
              width={200}
              height={200}
              src={imageSrc}
              alt={altText}
              className="w-full max-h-[500px] h-full object-cover"
            />
          </div>
          <div className="basis-1/2 flex flex-col h-full">
            <div className="py-5 px-4 ">
              <div className="flex justify-between">
                <div>
                  <p className="text-md text-neutral-500">{description}</p>
                  <h1 className="text-xl font-semibold">{title}</h1>
                </div>
                <div>
                  <p className="text-neutral-500 font-semibold line-through">
                    {mainPrice}
                  </p>
                  <p className="text-md text-red-500 font-semibold">{price}</p>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto flex-grow h-[320px] px-4">
              {colors.length > 0 && (
                <div>
                  <p className="text-md font-semibold">Colors</p>
                  <div className="flex py-2 gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.colorName)}
                        className={`rounded-full border ${
                          selectedColor === color.colorName
                            ? "border-sky-500"
                            : ""
                        }`}
                      >
                        <Avatar
                          alt={color.colorName}
                          src={color.colorImage}
                          width={50}
                          height={50}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-md font-semibold">Sizes</p>
                <div className="py-2 grid grid-cols-3 gap-4">
                  {sizes.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedSize(Number(num))}
                      className={`outline-1 py-2 rounded-lg ${
                        selectedSize === Number(num)
                          ? "outline-2 outline-sky-500"
                          : ""
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-sm flex items-center text-orange-400">
                  <Clock className="w-4 h-4" />
                  Low in stock
                </p>
              </div>
            </div>
            <div className="p-4 flex gap-2 justify-between items-center">
              <Select
                className="w-[60px]"
                defaultValue={["1"]}
                onValueChange={(value) => setQuantity(Number(value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem value={String(num)} key={num}>
                    {num}
                  </SelectItem>
                ))}
              </Select>
              <Button
                size="lg"
                className="flex-grow bg-neutral-300 text-black ui-hover:bg-neutral-200"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <IconButton
                label="like"
                disableAnimation
                disableRipple
                className=" bg-transparent border border-neutral-500"
              >
                <Heart className="h-6 w-6" />
              </IconButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
