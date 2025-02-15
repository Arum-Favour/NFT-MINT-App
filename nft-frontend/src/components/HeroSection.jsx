import rocketIcon from "../assets/rocketIcon.png";
import playIcon from "../assets/playIcon.png";

const HeroSection = () => {
  return (
    <div className="flex justify-center items-center w-full sm:w-4/5 mx-auto mt-10 sm:mt-20 px-4 max-w-screen-lg">
      <div className="flex flex-col justify-center items-center w-full sm:w-2/5 mx-auto gap-5 text-center">
        <h1 className="animate-pulse text-3xl sm:text-5xl font-bold text-white">
          Discover & Collect Extraordinary NFTs
        </h1>
        <p className="text-[#D1D5DB] mt-2 sm:mt-4">
          Explore unique NFTs created by artists worldwide. Enter the world of
          digital art and collectibles.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-3 sm:gap-5 mt-4">
          <button className="flex items-center cursor-pointer text-white text-sm font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] justify-center py-3 px-2 gap-2 rounded-[12px] w-full sm:w-[194px] hover:animate-bounce">
            <img src={rocketIcon} alt="rocket Icon" className="w-5 h-5" />
            Start Creating
          </button>
          <button className="flex items-center cursor-pointer text-white text-sm font-bold bg-[#1F293780] justify-center py-3 px-2 gap-2 rounded-[12px] w-full sm:w-[194px] border border-[#1F293780]">
            <img src={playIcon} alt="Play button Icon" className="w-5 h-5" />
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
