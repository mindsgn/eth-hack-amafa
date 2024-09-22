const hre = require("hardhat");

async function main() {
  const contractAddress = "npx hardhat verify --network";

  console.log("Verifying contract on Polygonscan...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully on Polygonscan");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });