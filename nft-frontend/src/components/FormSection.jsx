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

  useEffect(() => {
    if (isTxnSuccess) {
      fetchMintedNft();
    }
    if (isError) {
      setIsMinting(false);
    }
  }, [isTxnSuccess, isError]);

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
      await axios.post("http://localhost:5000/api/nfts", metadata);
      const metadataUrl = `http://localhost:5000/api/nfts/${newTokenId}`;

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

  const fetchMintedNft = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/nfts/${tokenId}`
      );
      setMintedNft(response.data);
      setIsMinting(false);
    } catch (error) {
      console.error("Error fetching minted NFT:", error);
    }
  };

  const handleMintAnother = () => {
    setMintedNft(null);
    setNft({ name: "", description: "", logoUrl: "" });
  };

  return (
    <div className="flex justify-center items-center w-4/5 mx-auto mt-20 h-auto">
      {!mintedNft ? (
        <div className="flex justify-center flex-col w-2/5 bg-[#11182780] h-[506px] p-8 rounded-[18px] border-[#374151] border-[1px]">
          <h2 className="text-white text-2xl font-bold">Mint Your NFT</h2>
          <form
            className="flex flex-col mt-7 w-full gap-4 h-full"
            onSubmit={(e) => {
              handleMint();
              e.preventDefault();
            }}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-[#9CA3AF] text-[14px] font-normal"
              >
                NFT Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter NFT name"
                value={nft.name}
                onChange={(e) => setNft({ ...nft, name: e.target.value })}
                className="h-[50px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-[#9CA3AF] text-[14px] font-normal"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="NFT Description"
                value={nft.description}
                onChange={(e) =>
                  setNft({ ...nft, description: e.target.value })
                }
                className="h-[96px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="logoUrl"
                className="text-[#9CA3AF] text-[14px] font-normal"
              >
                Image URL
              </label>
              <input
                type="text"
                id="logoUrl"
                placeholder="Logo URL"
                value={nft.logoUrl}
                onChange={(e) => setNft({ ...nft, logoUrl: e.target.value })}
                className="h-[50px] p-3 rounded-[8px] bg-[#1F2937] text-white border-[#374151] border-[1px] placeholder-[#ADAEBC]"
              />
            </div>
            <button
              type="submit"
              className="flex items-center text-white text-[18px] font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] justify-center py-1 px-0.5 h-[58px] gap-1 mt-4 rounded-[8px] w-full cursor-pointer"
            >
              <img src={MintIcon} alt="Nft Logo" disabled={isLoading} />{" "}
              {isMinting ? "Minting..." : "Mint NFT"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full mx-auto mt-20 h-auto">
          <div className="flex flex-col w-2/5 bg-[#11182780] h-auto p-5 rounded-[18px] border-[#10B981] border-[1px]">
            <div className="h-[80px] w-[80px] bg-[#10B98133] justify-center items-center rounded-full mx-auto flex mt-4">
              <img
                src={CheckIcon}
                alt="check Icon"
                className="w-[22px] h-[31px]"
              />
            </div>
            <h2 className="text-[#10B981] text-2xl font-bold text-center">
              NFT Minted Successful
            </h2>
            <p className="text-[#9CA3AF] text-center text-[18px]">
              Your NFT has been created and added to your collection
            </p>

            <div className="w-[90%] bg-[#1F293780] flex flex-col p-6 gap-3.5 mx-auto mt-7 rounded-[12px]">
              <img src={mintedNft.logoUrl} alt="NFT" className="h-[258px]" />
              <div>
                <p className="text-[18px] text-[#9CA3AF]">NFT Name</p>
                <h4 className="text-white text-[18px] font-bold">
                  {mintedNft.name}
                </h4>
              </div>
              <div>
                <p className="text-sm text-[#9CA3AF]">Description</p>
                <p className="text-[18px] text-[#D1D5DB]">
                  {mintedNft.description}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#9CA3AF]">NFT ID</p>
                <h1 className="text-[18px] text-[#10B981]">
                  {mintedNft.tokenId}
                </h1>
              </div>
            </div>
            <div className="flex justify-between mt-7 w-[90%] mx-auto items-center">
              <button className="flex items-center text-white text-[18px] font-normal bg-[#1F2937] justify-center py-1 px-0.5 h-[58px] gap-1 mt-4 rounded-[8px] w-[48%] cursor-pointer">
                <img src={ShareIcon} alt="Nft Logo" /> Share
              </button>
              <button
                onClick={handleMintAnother}
                className="flex items-center text-white text-[18px] font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] justify-center py-1 px-0.5 h-[58px] gap-1 mt-4 rounded-[8px] w-[48%] cursor-pointer"
              >
                <img src={MintIcon} alt="Nft Logo" /> Mint Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSection;
