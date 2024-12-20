import { ethers } from "ethers";

// Load environment variables
const providerUrl = process.env.INFURA_PROJECT_URL; // URL for Base network (Infura, etc.)
const privateKey = process.env.PRIVATE_KEY; // Wallet private key for signing transactions
const contractAddress = process.env.CONTRACT_ADDRESS; // Address of your ERC-721 contract
const abi = JSON.parse(process.env.CONTRACT_ABI); // ABI of your ERC-721 contract

// Initialize the provider and signer
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

/**
 * Mint a MycoBud NFT to a specific address
 * @param {string} to - Wallet address of the recipient
 * @param {string} tokenURI - Metadata URI for the NFT
 */
export const mintMycoBud = async (to, tokenURI) => {
  try {
    const tx = await contract.mint(to, tokenURI); // Call the mint function
    console.log("Minting transaction sent:", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("NFT minted successfully!");
    return tx.hash;
  } catch (err) {
    console.error("Error minting NFT:", err);
    throw err;
  }
};

/**
 * Burn a Spore NFT
 * @param {string} tokenId - The ID of the NFT to burn
 */
export const burnSporeNFT = async (tokenId) => {
  try {
    const tx = await contract.burn(tokenId); // Call the burn function
    console.log("Burning transaction sent:", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("NFT burned successfully!");
    return tx.hash;
  } catch (err) {
    console.error("Error burning NFT:", err);
    throw err;
  }
};
