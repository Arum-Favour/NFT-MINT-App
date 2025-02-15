import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
  name: String,
  description: String,
  logoUrl: String,
  tokenId: Number,
  walletAddress: String,
});

//export and creation of the NFT model
const NFT = mongoose.model("NFT", nftSchema);

export default NFT;
