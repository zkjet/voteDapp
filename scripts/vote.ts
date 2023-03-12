import {  Ballot__factory } from "../typechain-types";
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

    
//const LOCAL_BALLOT_CONTRACT_ADDRESS = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
const BALLOT_CONTRACT_ADDRESS = "0xB1637f1Dbc9c23218Ee1A5A534B45cC249444196";

async function main () {
    //const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const provider = new ethers.providers.InfuraProvider('sepolia', process.env.INFURA_API_KEY);

    const  pk = process.env.PRIVATE_KEY;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const deployerWallet = new ethers.Wallet(pk);
    console.log(`Connected to deployer's wallet address: ${deployerWallet.address}`);

    const deployer = deployerWallet.connect(provider);
    
    const ballotContractFactory = new Ballot__factory(deployer);
    console.log("Attaching to contract ...");
    const ballotContract = ballotContractFactory.attach(BALLOT_CONTRACT_ADDRESS);
    console.log(`Attached to TokenizedBallot contract at ${ballotContract.address}`);

    console.log("deployer voting once for strawberry")
    let voteTx = await ballotContract.connect(deployer).vote(0, ethers.utils.parseEther("1"));
    let voteTxReceipt = await voteTx.wait();
    console.log("deployer voted once for strawberry")

    console.log("deployer voting twice for chocolate")
    voteTx = await ballotContract.connect(deployer).vote(1, ethers.utils.parseEther("2"));
    voteTxReceipt = await voteTx.wait();
    console.log("deployer voted twcie for chocolate")

    console.log("deployer voting thrice for caramel")
    voteTx = await ballotContract.connect(deployer).vote(2, ethers.utils.parseEther("3"));
    voteTxReceipt = await voteTx.wait();
    console.log("deployer voted thrice for caramel")
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});