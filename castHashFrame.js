import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const main = async () => {
  const neynarClient = new NeynarAPIClient("YOUR_API_KEY_HERE"); // Replace with your Neynar API key

  // Create the cast hash frame
  const creationRequest = {
    name: "cast-hash-frame",
    pages: [
      {
        title: "Resulting Cast Hash",
        image: {
          url: "https://your-mycobud-nft-image-url.com", // Display MycoBud NFT
          aspect_ratio: "1.91:1",
        },
        description: "This is the resulting cast hash:",
        dynamic: {
          cast_hash: "c.frameData?.castId?.hash || 'Unavailable'",
        },
        uuid: "cast-hash-frame",
        version: "vNext",
      },
    ],
  };

  try {
    const frame = await neynarClient.publishNeynarFrame(creationRequest);
    console.log("Frame created successfully:", frame);
  } catch (error) {
    console.error("Error creating frame:", error);
  }
};

main();
