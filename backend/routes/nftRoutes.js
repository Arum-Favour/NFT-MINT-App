import express from "express";
const router = express.Router();
import NFT from "../models/NftSchema.js";
import { body, param } from "express-validator";
import {
  createNft,
  getNftById,
  getNftsByWalletAddress,
} from "../controllers/nftRouteController.js";

//N.B: FULL ROUTE LOGIC CAN BE FOUND IN THE CONTROLLERS FOLDER (FOR BETTER READABILITY AND REFACTORING)

// Create and Store the NFT Data
/**
 * @swagger
 * /api/nfts:
 *   post:
 *     summary: Create and store NFT data
 *     description: Stores NFT metadata with name, description, logo URL, token ID, and wallet address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               tokenId:
 *                 type: number
 *               walletAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: NFT stored successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("logoUrl").isURL().withMessage("Logo URL must be a valid URL"),
    body("tokenId")
      .isInt({ min: 1 })
      .withMessage("Token ID must be a positive integer"),
    body("walletAddress").notEmpty().withMessage("Wallet address is required"),
  ],
  createNft
);

// Getting NFT Data by it's ID
/**
 * @swagger
 * /api/nfts/{tokenId}:
 *   get:
 *     summary: Get NFT data by token ID
 *     description: Retrieve NFT metadata using the token ID.
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the NFT
 *     responses:
 *       200:
 *         description: NFT data retrieved successfully
 *       404:
 *         description: NFT not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:tokenId",
  [param("tokenId").isInt().withMessage("Token ID must be an integer")],
  getNftById
);

// Get NFT Gallery by Wallet Address
/**
 * @swagger
 * /api/nfts/user/{walletAddress}:
 *   get:
 *     summary: Get NFTs by wallet address
 *     description: Retrieve a list of NFTs associated with a specific wallet address.
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address of the NFT owner
 *     responses:
 *       200:
 *         description: NFTs retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/user/:walletAddress",
  [param("walletAddress").notEmpty().withMessage("Wallet address is required")],
  getNftsByWalletAddress
);
export default router;
