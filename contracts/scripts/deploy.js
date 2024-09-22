const hre = require("hardhat");

async function main() {
  const ASSET_NFT = await hre.ethers.getContractFactory("AssetNFT");
  const asset_nft = await ASSET_NFT.deploy();

  await asset_nft.deployed();

  console.log("ASSET NFT deployed to:", asset_nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
