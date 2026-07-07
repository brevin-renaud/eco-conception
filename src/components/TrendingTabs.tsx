"use client";
import Link from "next/link";
import { Tab, Tabs } from "@jamsr-ui/react";

import CardComponent from "@/components/HoverButtonCard";
import TabImageSwiper from "@/components/TabImageSwiper";
import { NextArrow } from "./svgs";
import womencardData from "@/data/WomenCloths";
import mencardData from "@/data/MenCloths";

const TrendingTabs = () => {
  return (
    <Tabs
      classNames={{
        tab: " w-[200px] ",
      }}
      variant="bordered"
      defaultValue="men"
    >
      <Tab value="men" heading="Men">
        <div className=" py-6 w-full">
          <TabImageSwiper
            items={mencardData.slice(0, 6).map((card, index) => (
              <CardComponent
                href="/product/women/categories/product-details"
                key={index}
                imageSrc={card.imageSrc}
                altText={card.altText}
                title={card.title}
                description={card.description}
                price={card.price}
                mainPrice={card.mainPrice}
                isTrending={card.isTrending}
                colors={card.colors}
                showInfoText="Quick view"
              />
            ))}
          />
        </div>
        <div className="py-4 flex justify-center">
          <Link
            href="product/men"
            className="hover:text-blue-400 hover:underline underline-offset-4 flex items-center text-lg "
          >
            <p>Show all men</p>
            <NextArrow className="h-3" />
          </Link>
        </div>
      </Tab>
      <Tab value="women" heading="Women">
        <div>
          <div className=" py-6 w-full">
            <TabImageSwiper
              items={womencardData.slice(0, 6).map((card, index) => (
                <CardComponent
                  href="/product/women/categories/product-details"
                  key={index}
                  imageSrc={card.imageSrc}
                  altText={card.altText}
                  title={card.title}
                  description={card.description}
                  price={card.price}
                  isTrending={card.isTrending}
                  mainPrice={card.price}
                  showInfoText="Quick view"
                />
              ))}
            />
          </div>
          <div className="py-5 flex justify-center">
            <Link
              href="/product/women/categories"
              className="  hover:text-blue-400 hover:underline underline-offset-4 flex items-center text-lg "
            >
              <p>Show all women</p>
              <NextArrow className="h-3" />
            </Link>
          </div>
        </div>
      </Tab>
    </Tabs>
  );
};

export default TrendingTabs;
