import express from "express";
import neynarSdk from "@neynar/nodejs-sdk";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const { NeynarAPIClient } = neynarSdk;
const app = express();
const PORT = 3000;

// Neynar API setup
const neynarClient = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY,
});

// Blockchain setup
const provider = new ethers.JsonRpcProvider(`https://base-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const sporeContractAddress = process.env.SPORE_CONTRACT_ADDRESS;
const mycoBudContractAddress = process.env.MYCOBUD_CONTRACT_ADDRESS;

// Spore NFT contract ABI
const sporeAbi = [
  // Replace with the actual Spore NFT contract ABI
];

// MycoBud NFT contract ABI
const mycoBudAbi = [
  // Replace with the actual MycoBud NFT contract ABI
];

const sporeContract = new ethers.Contract(sporeContractAddress, sporeAbi, provider);
const mycoBudContract = new ethers.Contract(mycoBudContractAddress, mycoBudAbi, provider);

// Predefined MycoBud GIFs
const mycoBudGifs = [
  "https://ipfs.io/ipfs/QmExampleGif1",
  "https://ipfs.io/ipfs/QmExampleGif2",
  "https://ipfs.io/ipfs/QmExampleGif3",
  "https://ipfs.io/ipfs/QmExampleGif4",
];

// Function to select a random GIF
const getRandomMycoBudGif = () => {
  const randomIndex = Math.floor(Math.random() * mycoBudGifs.length);
  return mycoBudGifs[randomIndex];
};

// Middleware for JSON parsing
app.use(express.json());

// Endpoint to get user's Spore NFTs
app.post("/get-user-nfts", async (req, res) => {
  const { walletAddress } = req.body;

  try {
    const balance = await sporeContract.balanceOf(walletAddress);
    const tokenIds = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await sporeContract.tokenOfOwnerByIndex(walletAddress, i);
      tokenIds.push({ tokenId: tokenId.toString() });
    }

    res.status(200).json({ success: true, sporeNfts: tokenIds });
  } catch (error) {
    console.error("Error fetching Spore NFTs:", error);
    res.status(500).json({ success: false, error: "Failed to fetch NFTs." });
  }
});

// Frame action endpoint
app.post("/frame-action", async (req, res) => {
  const { trustedData, sporeTokenId } = req.body;

  try {
    const validationResult = await neynarClient.validateFrameAction(trustedData.messageBytes);

    if (!validationResult.valid) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const userAddress = validationResult.action.interactor.custody_address;

    // Check ownership of Spore NFT
    const ownerOfToken = await sporeContract.ownerOf(sporeTokenId);
    if (ownerOfToken.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(400).json({ error: `Token ID ${sporeTokenId} is not owned by the user.` });
    }

    // Burn the Spore NFT
    const sporeBurnTx = await sporeContract.connect(provider.getSigner(userAddress)).burn(sporeTokenId);
    await sporeBurnTx.wait();

    // Mint MycoBud NFT
    const randomGif = getRandomMycoBudGif();
    const metadata = {
      name: "MycoBud NFT",
      description: "A dynamic MycoBud NFT with a unique GIF.",
      image: randomGif,
    };

    const mycoBudMintTx = await mycoBudContract.connect(provider.getSigner(userAddress)).mint(userAddress, JSON.stringify(metadata));
    await mycoBudMintTx.wait();

    return res.status(200).json({
      success: true,
      message: `Spore NFT burned, and MycoBud NFT minted successfully.`,
      metadata,
    });
  } catch (error) {
    console.error("Error handling frame action:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
