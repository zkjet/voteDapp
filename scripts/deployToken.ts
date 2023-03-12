import { MyToken, MyToken__factory } from "../typechain-types";
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

async function main () {
    //const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);

    const  pk = process.env.PRIVATE_KEY;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const deployerWallet = new ethers.Wallet(pk);
    console.log(`Connected to deployer's wallet address: ${deployerWallet.address}`);

    const deployer = deployerWallet.connect(provider);

    const contractFactory = new MyToken__factory(deployer);
    const contract: MyToken = await contractFactory.deploy();
    const deployTransactionReceipt = await contract.deployTransaction.wait();
    console.log(`The Tokenized Vote Contract with address ${contract.address}`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});