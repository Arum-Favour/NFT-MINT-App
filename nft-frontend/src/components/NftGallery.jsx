import React, { useState, useEffect } from "react";
import NftArt from "../assets/NftArt.jpg";
import axios from "axios";
import { useAccount } from "wagmi";

const NftGallery = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;
      try {
        const res = await axios.get(
          `https://nft-mint-app.onrender.com/api/nfts/user/${address}`
        );
        setNfts(res.data);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      }
    };

    fetchNFTs();
  }, [address]);

  return (
    <div className="flex w-4/5 justify-center items-start flex-col mx-auto mt-20">
      <h2 className="text-2xl text-[#FFFFFF] font-bold">Your NFT Gallery</h2>
      <div className="w-full  mt-9 mb-9 grid grid-cols-3 gap-6">
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div
              key={index}
              className="flex flex-col h-auto bg-[#11182780] pb-7 rounded-[12px]"
            >
              <img
                src={nft.logoUrl || NftArt}
                alt="NFT"
                className="w-full h-[200px] object-cover rounded-tl-[12px] rounded-tr-[12px]"
              />
              <div className="w-4/5 mx-auto flex justify-between mt-4 flex-col gap-3.5">
                <h3 className="text-white text-lg font-bold">{nft.name}</h3>
                <p className="text-[#9CA3AF] text-sm">{nft.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white font-bold text-center">
            No NFTs found, please mint your first one using the widget above
          </p>
        )}
      </div>
    </div>
  );
};

export default NftGallery;
