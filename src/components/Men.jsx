import Image from "next/image";
import Link from "next/link";
import React from "react";
import men from "@/data/Men";

import { Card } from "@jamsr-ui/react";
import { useTheme } from "@/context/ThemeContext";

const Men = () => {
  const { theme } = useTheme();
  return (
    <Card
      className={`px-8   ${
        theme === "light" ? "bg-white text-black border-none shadow" : "bg-[#181818] text-white"
      }`}
    >
      <div className=" grid md:grid-flow-col-dense md:my-2  ">
        {men.map((item, index) => (
          <div key={index} className="md:py-2">
            <h1 className="text-md font-semibold md:my-3">{item.title}</h1>
            {item.items.map((item, index) => (
              <Link
                href="#"
                className="text-sm text-neutral-400 underline-offset-4 hover:underline hover:text-current mb-3 block"
                key={index}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
        <div className="hidden md:block  w-full h-full  rounded-lg cursor-pointer relative overflow-hidden">
          <Image
            src="/images/men/3.jpg"
            alt="Men's collection"
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="md:py-[15px] border-t border-neutral-800">
        <div className=" container mx-auto md:flex justify-between gap-8 items-center ">
          <div className="flex items-center grow p-1 gap-4  rounded-md cursor-pointer ">
            <Image
              src="/shoes2.jpg"
              alt="shoes"
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-md object-cover"
            />
            <h1 className="text-md font-semibold tracking-wider">Shoes</h1>
          </div>
          <div className="flex items-center grow p-1 gap-4  rounded-md cursor-pointer">
            <Image
              src="/Accessories.avif"
              alt="accessories"
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-md object-cover"
            />
            <h1 className="text-md font-semibold tracking-wider ">
              Accessories
            </h1>
          </div>
          <div className="flex items-center grow p-1 gap-4  rounded-md cursor-pointer">
            <Image
              src="/Beg.avif"
              alt="backpacks"
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-md object-cover"
            />
            <h1 className="text-md font-semibold tracking-wider">Backpacks</h1>
          </div>
          <div className="flex items-center grow p-1 gap-4  rounded-md cursor-pointer">
            <Image
              src="/Socks.avif"
              alt="socks"
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-md object-cover"
            />
            <h1 className="text-md font-semibold tracking-wider">Socks</h1>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Men;
