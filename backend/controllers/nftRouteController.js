import { validationResult } from "express-validator";
import NFT from "../models/NftSchema.js";

//Route Controller for creating and storing NFTs
export const createNft = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn("Validation failed:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, logoUrl, tokenId, walletAddress } = req.body;
    const existingNFT = await NFT.findOne({ tokenId });
    if (existingNFT) {
      return res
        .status(409)
        .json({ message: "NFT with this ID already exists" });
    }

    const newNFT = new NFT({
      name,
      description,
      logoUrl,
      tokenId,
      walletAddress,
    });
    await newNFT.save();
    res.status(201).json({ message: "NFT stored successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
};

//Route Controller for getting NFTs based on ID
export const getNftById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn("Validation failed:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nft = await NFT.findOne({ tokenId: req.params.tokenId });
    if (!nft) return res.status(404).json({ message: "NFT not found" });
    res.status(200).json(nft);
  } catch (error) {
    handleErrors(res, error);
  }
};

//Route Controller for getting NFTs based user Wallet Address
export const getNftsByWalletAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn("Validation failed:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nfts = await NFT.find({ walletAddress: req.params.walletAddress });
    if (!nfts.length) {
      return res
        .status(404)
        .json({ message: "No NFTs found for this address" });
    }
    res.status(200).json(nfts);
  } catch (error) {
    handleErrors(res, error);
  }
};


function handleErrors(res, error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
