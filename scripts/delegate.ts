import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
require("dotenv").config();

//const LOCAL_TOKEN_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_CONTRACT_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";

async function main () {
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

    let delegateTx = await tokenContract.delegate(deployer.address);
    let delegateTxReceipt = await delegateTx.wait();
    console.log(`Tokens delegated for ${deployer.address} at block: ${delegateTxReceipt.blockNumber}`);
    let deployerVP = await tokenContract.getVotes(deployer.address);
    console.log(`deployer has a vote power of ${ethers.utils.formatEther(deployerVP)} units`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});