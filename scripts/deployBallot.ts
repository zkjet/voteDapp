import { Ballot__factory } from "../typechain-types";
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

const TOKEN_CONTRACT_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";
const TARGET_BLOCK_NUMBER = "3076079";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main () {
      // accepts arguments from the command line
      const args = process.argv;
      const proposals = args.slice(2);
      if (proposals.length <= 0) throw new Error("Missing parameters: proposals");

    //const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);

    const  pk = process.env.PRIVATE_KEY;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const deployerWallet = new ethers.Wallet(pk);
    console.log(`Connected to deployer's wallet address: ${deployerWallet.address}`);

    const deployer = deployerWallet.connect(provider);

    // deploy the ballot contract
    console.log("Deploying Ballot contract!");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    const ballotContractFactory = new Ballot__factory(deployer);
    console.log("Deploying contract ...");
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals), 
        TOKEN_CONTRACT_ADDRESS, 
        TARGET_BLOCK_NUMBER);
    const deployTxReceipt = await ballotContract.deployTransaction.wait();
    console.log(`The Ballot contract was deployed at the address ${ballotContract.address}`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});