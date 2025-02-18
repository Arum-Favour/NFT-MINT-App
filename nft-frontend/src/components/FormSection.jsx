import React, { useState, useEffect } from "react";
import MintIcon from "../assets/MintIcon.png";
import CheckIcon from "../assets/CheckIcon.png";
import ShareIcon from "../assets/ShareIcon.png";
import axios from "axios";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";

const contractAddress = "0x743f49311a82fe72eb474c44e78da2a6e0ae951c";
import contractAbi from "../contractAbi.json";

const FormSection = () => {
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const [tokenId, setTokenId] = useState(null);
  const [nft, setNft] = useState({ name: "", description: "", logoUrl: "" });
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState(null);
  const [nfts, setNfts] = useState([]); // Store all NFTs

  const { data: exists } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "checkId",
    args: tokenId ? [tokenId] : undefined,
    enabled: !!tokenId,
  });

  const {
    isLoading,
    isSuccess: isTxnSuccess,
    isError,
  } = useWaitForTransactionReceipt({ hash });

  // Fetch all NFTs from the backend
  const fetchAllNfts = async () => {
    try {
      const response = await axios.get("https://nft-mint-app.onrender.com/api/nfts");
      setNfts(response.data);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    if (isTxnSuccess) {
      fetchAllNfts(); // Refresh NFT list after minting
      setIsMinting(false);
    }
  }, [isTxnSuccess]);

  useEffect(() => {
    fetchAllNfts(); // Load NFTs on component mount
  }, []);

  const generateUniqueTokenId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleMint = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsMinting(true);
    try {
      let newTokenId = generateUniqueTokenId();
      while (exists) {
        newTokenId = generateUniqueTokenId();
      }
      setTokenId(newTokenId);

      const metadata = { ...nft, tokenId: newTokenId, walletAddress: address };
      await axios.post("https://nft-mint-app.onrender.com/api/nfts", metadata);
      const metadataUrl = `https://nft-mint-app.onrender.com/api/nfts/${newTokenId}`;

      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "mint",
        args: [newTokenId, metadataUrl],
      });
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Please try again.");
      setIsMinting(false);
    }
  };

  const handleMintAnother = () => {
    setMintedNft(null);
    setNft({ name: "", description: "", logoUrl: "" });
  };

 return (
  <div className="flex justify-center items-center w-full sm:w-4/5 mx-auto mt-10 sm:mt-20 h-auto px-4">
    {!mintedNft ? (
      <div className="flex flex-col justify-center w-full sm:w-4/5 md:w-2/5 bg-[#11182780] h-auto p-4 sm:p-8 rounded-[18px] border-[#374151] border-[1px]">
        <h2 className="text-white text-xl sm:text-2xl font-bold text-center sm:text-left">
          Mint Your NFT
        </h2>
        <form
          className="flex flex-col mt-5 sm:mt-7 w-full gap-4 h-full"
          onSubmit={(e) => {
            handleMint();
            e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#9CA3AF] text-sm sm:text-[14px] font-normal">
              NFT Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter NFT name"
              value={nft.name}
              onChange={(e) => setNft({ ...nft, name: e.target.value })}
              className="h-[50px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC] w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-[#9CA3AF] text-sm sm:text-[14px] font-normal">
              Description
            </label>
            <textarea
              id="description"
              placeholder="NFT Description"
              value={nft.description}
              onChange={(e) => setNft({ ...nft, description: e.target.value })}
              className="h-[96px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC] w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="logoUrl" className="text-[#9CA3AF] text-sm sm:text-[14px] font-normal">
              Image URL
            </label>
            <input
              type="text"
              id="logoUrl"
              placeholder="Logo URL"
              value={nft.logoUrl}
              onChange={(e) => setNft({ ...nft, logoUrl: e.target.value })}
              className="h-[50px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC] w-full"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center text-white text-lg sm:text-[18px] font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] py-3 sm:py-4 px-2 rounded-[8px] w-full cursor-pointer mt-4"
          >
            <img src={MintIcon} alt="Nft Logo" className="w-5 h-5" disabled={isLoading} />
            {isMinting ? "Minting..." : "Mint NFT"}
          </button>
        </form>
      </div>
    ) : (
      <div className="flex justify-center items-center w-full mx-auto mt-10 sm:mt-20 px-4">
        <div className="flex flex-col w-full sm:w-4/5 md:w-2/5 bg-[#11182780] h-auto p-4 sm:p-6 rounded-[18px] border-[#10B981] border-[1px]">
          <div className="h-[60px] sm:h-[80px] w-[60px] sm:w-[80px] bg-[#10B98133] justify-center items-center rounded-full mx-auto flex mt-4">
            <img src={CheckIcon} alt="check Icon" className="w-5 sm:w-[22px] h-5 sm:h-[31px]" />
          </div>
          <h2 className="text-[#10B981] text-xl sm:text-2xl font-bold text-center">
            NFT Minted Successfully!
          </h2>
          <p className="text-[#9CA3AF] text-center text-[16px] sm:text-[18px]">
            Your NFT has been created and added to your collection.
          </p>
          <div className="w-full sm:w-[90%] bg-[#1F293780] flex flex-col p-4 sm:p-6 gap-3.5 mx-auto mt-5 sm:mt-7 rounded-[12px]">
            <img src={mintedNft.logoUrl} alt="NFT" className="h-[200px] sm:h-[258px] mx-auto" />
            <div>
              <p className="text-sm text-[#9CA3AF]">NFT Name</p>
              <h4 className="text-white text-lg sm:text-[18px] font-bold">{mintedNft.name}</h4>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">Description</p>
              <p className="text-[16px] sm:text-[18px] text-[#D1D5DB]">{mintedNft.description}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">NFT ID</p>
              <h1 className="text-[18px] text-[#10B981]">{mintedNft.tokenId}</h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between mt-5 sm:mt-7 w-full sm:w-[90%] mx-auto items-center gap-3">
            <button className="flex items-center justify-center text-white text-[18px] font-normal bg-[#1F2937] py-3 px-2 rounded-[8px] w-full sm:w-[48%] cursor-pointer">
              <img src={ShareIcon} alt="Nft Logo" className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={handleMintAnother}
              className="flex items-center justify-center text-white text-[18px] font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] py-3 px-2 rounded-[8px] w-full sm:w-[48%] cursor-pointer"
            >
              <img src={MintIcon} alt="Nft Logo" className="w-5 h-5" />
              Mint Another
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default FormSection;
