import React from "react";
import rocketIcon from "../assets/rocketIcon.png";
import playIcon from "../assets/playIcon.png";

const HeroSection = () => {
  return (
    <div className="flex justify-center items-center w-4/5 mx-auto mt-20">
      <div className="flex flex-col justify-center items-center w-2/5 mx-auto gap-5">
        <h1 className="text-5xl font-bold text-white text-center">
          Discover & Collect Extraordinary NFTs
        </h1>
        <p className="text-[#D1D5DB] text-center mt-4">
          Explore unique NFTs created by artists worldwide.Enter the world of
          digital art and collectibles.
        </p>
        <div className="flex justify-evenly items-center w-full mt-1">
          <button className="flex items-center cursor-pointer text-white text-sm font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] justify-center py-1 px-0.5 h-[58px] gap-1 rounded-[12px] w-[194px]">
            <img src={rocketIcon} alt="rocket Icon" /> Start Creating
          </button>
          <button className="flex items-center cursor-pointer text-white text-sm font-bold bg-[#1F293780] justify-center py-1 px-0.5 h-[58px] gap-1 rounded-[12px] w-[194px] border-[#1F293780]">
            <img src={playIcon} alt="Play button Icon" />
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
