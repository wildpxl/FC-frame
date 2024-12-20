<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Burn Spore & Mint MycoBud</title>
  <script src="https://cdn.jsdelivr.net/npm/ethers@6.5.1/dist/ethers.min.js"></script>
</head>
<body>
  <h1>Burn Spore & Mint MycoBud NFT</h1>
  <button id="connect-wallet">Connect Wallet</button>
  <div id="spore-list" style="display: none;">
    <h2>Your Spore NFTs</h2>
    <ul id="spore-nfts"></ul>
  </div>
  <button id="burn-and-mint" disabled>Burn Selected Spore & Mint MycoBud</button>

  <script>
    const baseUrl = "http://localhost:3000";
    let userWalletAddress = null;
    let selectedTokenId = null;

    // Connect Wallet
    document.getElementById("connect-wallet").addEventListener("click", async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          userWalletAddress = await signer.getAddress();

          alert(`Connected to wallet: ${userWalletAddress}`);

          // Fetch user's Spore NFTs
          const response = await fetch(`${baseUrl}/get-user-nfts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: userWalletAddress }),
          });
          const data = await response.json();

          if (data.success) {
            const sporeList = document.getElementById("spore-nfts");
            sporeList.innerHTML = "";
            data.sporeNfts.forEach((token) => {
              const listItem = document.createElement("li");
              listItem.textContent = `Token ID: ${token.tokenId}`;
              listItem.addEventListener("click", () => {
                selectedTokenId = token.tokenId;
                alert(`Selected Token ID: ${selectedTokenId}`);
                document.getElementById("burn-and-mint").disabled = false;
              });
              sporeList.appendChild(listItem);
            });
            document.getElementById("spore-list").style.display = "block";
          } else {
            alert("Failed to fetch Spore NFTs.");
          }
        } else {
          alert("Please install MetaMask or another Ethereum wallet provider.");
        }
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    });

    // Burn Spore & Mint MycoBud
    document.getElementById("burn-and-mint").addEventListener("click", async () => {
      if (!selectedTokenId) {
        alert("Please select a Spore NFT to burn.");
        return;
      }

      const trustedData = prompt("Enter trusted data (if required):");

      try {
        const response = await fetch(`${baseUrl}/frame-action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trustedData, sporeTokenId: selectedTokenId }),
        });
        const data = await response.json();

        if (data.success) {
          alert(`Success: ${data.message}`);
          console.log("NFT Metadata:", data.metadata);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (err) {
        console.error("Error during burn and mint operation:", err);
        alert("Failed to complete the operation. Please try again.");
      }
    });
  </script>
</body>

</html>
