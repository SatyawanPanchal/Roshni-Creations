/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";

import {
  trendingProducts,
  festiveProducts,
  handpickedProducts,
  bestsellerProducts,
} from "../data/products";
import HeroSection from "../components/home_page_components/HeroSection";

import FestiveSaleBanner from "../components/home_page_components/FestiveSaleBanner";
import Bestsellers from "../components/home_page_components/Bestsellers";
import Trending from "../components/home_page_components/Trending";
import ShopTheLook from "../components/home_page_components/ShopTheLook";
import RoshniInMotion from "../components/home_page_components/RoshniInMotion";
import CustomerReviews from "../components/home_page_components/CustomerReviews";
import VirtualStudioJewelry from "../components/home_page_components/VirtualStudioJewelry";
import ShopByCollection from "../components/home_page_components/ShopByCollection";
import RoshniCategories from "../components/category/RoshniCategories";
import LatestJewellery from "../components/home_page_components/LatestJewellery";
import CompactCategoryCircles from "../components/home_page_components/CompactCategoryCircles";
import { useLocation } from "react-router-dom";
// import NewArrivals from "../components/home_page_components/NewArrivals";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = decodeURIComponent(location.hash.slice(1));
    let secondFrame;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className="tw:flex tw:w-full tw:max-w-full tw:flex-col tw:items-center tw:justify-center tw:gap-0 tw:md:gap-5">
        <HeroSection />
        <CompactCategoryCircles />
        <LatestJewellery />
        <ShopByCollection />
        <Bestsellers />
        <FestiveSaleBanner />
        <Trending />
        <ShopTheLook />
        <RoshniInMotion />
        <CustomerReviews />
      </div>
    </>
  );
};

export default Home;

//  <div className="tw:flex tw:flex-col tw:items-center tw:gap-8 tw:md:gap-15">
        {/* <HeroSection /> */}
        {/* <NewArrivals /> */}
        {/* <NewArrivals/>
        <CompactCategoryCircles />
        <LatestJewellery />
        <ShopByCollection /> */}

        {/* <RoshniCategories/> */}
        {/* <VirtualStudioJewelry /> */}

        {/* <Bestsellers />
        <FestiveSaleBanner />
        <Trending />
        <ShopTheLook />
        <RoshniInMotion />
        <CustomerReviews />
      </div> */}