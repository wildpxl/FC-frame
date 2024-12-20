import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";

// Function to initialize Irys uploader
export const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY); // Replace with your private key in .env
  return irysUploader;
};

// Function to fund Irys
export const fundIrysAccount = async () => {
  const irysUploader = await getIrysUploader();
  try {
    const fundTx = await irysUploader.fund(irysUploader.utils.toAtomic(0.05)); // Funding 0.05 ETH
    console.log(`Successfully funded ${irysUploader.utils.fromAtomic(fundTx.quantity)} ${irysUploader.token}`);
  } catch (e) {
    console.error("Error funding Irys:", e);
  }
};

// Function to upload data
export const uploadDataToIrys = async (data) => {
  const irysUploader = await getIrysUploader();
  try {
    const receipt = await irysUploader.upload(data);
    console.log(`Data uploaded: https://gateway.irys.xyz/${receipt.id}`);
    return receipt;
  } catch (e) {
    console.error("Error uploading data:", e);
    throw e;
  }
};

// Function to upload a file
export const uploadFileToIrys = async (filePath) => {
  const irysUploader = await getIrysUploader();
  try {
    const receipt = await irysUploader.uploadFile(filePath);
    console.log(`File uploaded: https://gateway.irys.xyz/${receipt.id}`);
    return receipt;
  } catch (e) {
    console.error("Error uploading file:", e);
    throw e;
  }
};
