import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
require("dotenv").config();

const TOKEN_CONTRACT_ADDRESS = "0x0AE684f99f58F7d09B415281A78eC8eabc0DF40f";

async function main () {
    const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);

    const  pk = process.env.PRIVATE_KEY;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const deployerWallet = new ethers.Wallet(pk);
    console.log(`Connected to deployer's wallet address: ${deployerWallet.address}`);

   const deployer = deployerWallet.connect(provider);

   // ******SET DELEGATEES PRIVATE KEY******
   const dpk = process.env.PRIVATE_KEY_<USER>;
   if(!dpk || dpk.length <= 0) throw new Error("Missing environment: private key");
   const delegateeWallet = new ethers.Wallet(dpk);
   const delegatee = delegateeWallet.connect(provider);

    const tokenContractFactory = new MyToken__factory(deployer);
    console.log("Attaching to contract ...");
    const tokenContract = tokenContractFactory.attach(TOKEN_CONTRACT_ADDRESS);
    console.log(`Attached to MyToken contract at ${tokenContract.address}`);

    let delegateTx = await tokenContract.connect(delegatee).delegate(delegatee.address);
    let delegateTxReceipt = await delegateTx.wait();
    console.log(`Tokens delegated for ${delegatee.address} at block: ${delegateTxReceipt.blockNumber}`);
    let addressVP = await tokenContract.getVotes(delegatee.address);
    console.log(`delegatee has a vote power of ${ethers.utils.formatEther(addressVP)} units`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});