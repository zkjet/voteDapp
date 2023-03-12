import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
require("dotenv").config();

//const TOKEN_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_CONTRACT_ADDRESS = "0x0AE684f99f58F7d09B415281A78eC8eabc0DF40f";
const MINT_VALUE = ethers.utils.parseEther("1000");

async function main() {
     //const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);

    const  pk = process.env.PRIVATE_KEY;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const deployerWallet = new ethers.Wallet(pk);
    console.log(`Connected to deployer's wallet address: ${deployerWallet.address}`);

     const deployer = deployerWallet.connect(provider);

    const tokenContractFactory = new MyToken__factory(deployer);
    console.log("Attaching to contract ...");
    const tokenContract = tokenContractFactory.attach(TOKEN_CONTRACT_ADDRESS);
    console.log(`Attached to MyToken contract at ${tokenContract.address}`);

    console.log(`Minting tokens`);
    const mintTx = await tokenContract.mint(deployer.address, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log(`Minted tokens for ${deployer.address} at block ${mintTxReceipt.blockNumber}`);
    const tokenBalanceAccount = await tokenContract.balanceOf(deployer.address);
    console.log(`Address ${deployer.address} has a balance of ${ethers.utils.formatEther(tokenBalanceAccount)}\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});