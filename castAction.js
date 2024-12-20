import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const main = async () => {
  const neynarClient = new NeynarAPIClient("YOUR_API_KEY_HERE"); // Replace with your Neynar API key

  // Create the cast action
  const castActionRequest = {
    name: "Get Cast Hash",
    route: "/get-cast-hash",
    description: "Show the cast hash after minting",
    icon: "hash",
    frame: {
      path: "/cast-hash",
    },
  };

  try {
    const castAction = await neynarClient.createCastAction(castActionRequest);
    console.log("Cast action created successfully:", castAction);
  } catch (error) {
    console.error("Error creating cast action:", error);
  }
};

main();
