// WORK IN PROGRESS //

import { MyToken, MyToken__factory } from "../typechain-types";
import { ethers, Wallet } from 'ethers';
import * as dotenv from 'dotenv';
import { token } from "../typechain-types/@openzeppelin/contracts";
import { waitForDebugger } from "inspector";
dotenv.config();

const MINT_VALUE = ethers.utils.parseEther("10");

const TOKEN_CONTRACT_ADDRESS = "0xC9284c151C922B5BB2EB5fe0c1E603d551C55e94";

async function main () {
    // gets the goerli provider
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);

                    // 1. CONNECT ALL TEAM 4 TEST WALLETS

    // instantiate wallet for Joshua
    const Joshua_Pk = process.env.PRIVATE_KEY_JOSHUA;
    if(!Joshua_Pk || Joshua_Pk.length <= 0) throw new Error("Missing environment: private key for Joshua");
    const walletJoshua = new ethers.Wallet(Joshua_Pk);
    console.log(`Connected to Joshua's wallet address: ${walletJoshua.address}`);
    // instantiate wallet for Hardeep
    const Hardeep_Pk = process.env.PRIVATE_KEY_HARDEEP;
    if(!Hardeep_Pk || Hardeep_Pk.length <= 0) throw new Error("Missing environment: private key for Hardeep");
    const walletHardeep = new ethers.Wallet(Hardeep_Pk);
    console.log(`Connected to Hardeep's wallet address: ${walletHardeep.address}`);
    // instantiate wallet for Chris
    const Chris_Pk = process.env.PRIVATE_KEY_CHRIS;
    if(!Chris_Pk || Hardeep_Pk.length <= 0) throw new Error("Missing environment: private key for Chris");
    const walletChris = new ethers.Wallet(Chris_Pk);
    console.log(`Connected to Chris' wallet address: ${walletChris.address}`);
    // instantiate wallet for Lindsay
    const Lindsay_Pk = process.env.PRIVATE_KEY_LINDSAY;
    if(!Lindsay_Pk || Hardeep_Pk.length <= 0) throw new Error("Missing environment: private key for Lindsay");
    const walletLindsay = new ethers.Wallet(Lindsay_Pk);
    console.log(`Connected to Lindsay's wallet address: ${walletLindsay.address}`);
    // instantiate wallet for Owen
    const Owen_Pk = process.env.PRIVATE_KEY_OWEN;
    if(!Owen_Pk || Owen_Pk.length <= 0) throw new Error("Missing environment: private key for Owen");
    const walletOwen = new ethers.Wallet(Owen_Pk);
    console.log(`Connected to Owen's wallet address: ${walletOwen.address}`);
    // instantiate wallet for Josh
    const Josh_Pk = process.env.PRIVATE_KEY_JOSH;
    if(!Josh_Pk || Josh_Pk.length <= 0) throw new Error("Missing environment: private key for Josh");
    const walletJosh = new ethers.Wallet(Josh_Pk);
    console.log(`Connected to Josh's wallet address: ${walletJosh.address}`);
                    
                    // 2. CREATE SIGNERS FROM WALLET

    const signerJoshua = walletJoshua.connect(provider);
    const signerHardeep = walletHardeep.connect(provider);
    const signerChris = walletChris.connect(provider);
    const signerLindsay = walletLindsay.connect(provider);
    const signerOwen = walletOwen.connect(provider);
    const signerJosh = walletJosh.connect(provider);

                    // 3. ATTACH CONTRACT

    // Joshua attaches to the contract and instantiates it
    const tokenContractFactory = new MyToken__factory(signerJoshua);
    console.log("Attaching to contract ...");
    const tokenContract = tokenContractFactory.attach(TOKEN_CONTRACT_ADDRESS);
    console.log(`Attached to MyToken contract at ${tokenContract.address}`);

                    // 4. DELEGATE TOKENS FOR VOTING POWER

    // Check voting power for Joshua before delegation
    let votingPowerJoshua = await tokenContract.getVotes(walletJoshua.address);
    console.log(`Joshua has a vote power of ${ethers.utils.formatEther(votingPowerJoshua)} units`);
    // Check voting power for Hardeep before delegation
    let votingPowerHardeep = await tokenContract.connect(signerHardeep).getVotes(walletHardeep.address);
    console.log(`Hardeep has a vote power of ${ethers.utils.formatEther(votingPowerHardeep)} units`);
    // Check voting power for Chris before delegation
    let votingPowerChris = await tokenContract.connect(signerChris).getVotes(walletChris.address);
    console.log(`Chris has a vote power of ${ethers.utils.formatEther(votingPowerChris)} units`);
    // Check voting power for Lindsay before delegation
    let votingPowerLindsay = await tokenContract.connect(signerLindsay).getVotes(walletLindsay.address);
    console.log(`Lindsay has a vote power of ${ethers.utils.formatEther(votingPowerLindsay)} units`);
    // Check voting power for Owen before delegation
    let votingPowerOwen = await tokenContract.connect(signerOwen).getVotes(walletOwen.address);
    console.log(`Owen has a vote power of ${ethers.utils.formatEther(votingPowerOwen)} units`);
    // Check voting power for Josh before delegation
    let votingPowerJosh = await tokenContract.connect(signerJosh).getVotes(walletJosh.address);
    console.log(`Josh has a vote power of ${ethers.utils.formatEther(votingPowerJosh)} units`);

    // Self delegate for Joshua to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxJoshua = await tokenContract.delegate(walletJoshua.address);
    const delegateTxReceiptJoshua = await delegateTxJoshua.wait();
    console.log(`Tokens delegated for ${walletJoshua.address} at block: ${delegateTxReceiptJoshua.blockNumber}`);
    // Self delegate for Hardeep to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxHardeep = await tokenContract.connect(signerHardeep).delegate(walletHardeep.address);
    const delegateTxReceiptHardeep = await delegateTxHardeep.wait();
    console.log(`Tokens delegated for ${walletHardeep.address} at block: ${delegateTxReceiptHardeep.blockNumber}`);
    // Self delegate for Chris to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxChris = await tokenContract.connect(signerChris).delegate(walletChris.address);
    const delegateTxReceiptChris = await delegateTxChris.wait();
    console.log(`Tokens delegated for ${walletChris.address} at block: ${delegateTxReceiptChris.blockNumber}`);
    // Self delegate for Lindsay to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxLindsay = await tokenContract.connect(signerLindsay).delegate(walletLindsay.address);
    const delegateTxReceiptLindsay = await delegateTxLindsay.wait();
    console.log(`Tokens delegated for ${walletLindsay.address} at block: ${delegateTxReceiptLindsay.blockNumber}`);
    // Self delegate for Owen to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxOwen = await tokenContract.connect(signerOwen).delegate(walletOwen.address);
    const delegateTxReceiptOwen = await delegateTxOwen.wait();
    console.log(`Tokens delegated for ${walletOwen.address} at block: ${delegateTxReceiptOwen.blockNumber}`);
    // Self delegate for Josh to create checkpoint and grant voting power (delegates everything we have)
    const delegateTxJosh = await tokenContract.connect(signerJosh).delegate(walletJosh.address);
    const delegateTxReceiptJosh = await delegateTxJosh.wait();
    console.log(`Tokens delegated for ${walletJosh.address} at block: ${delegateTxReceiptJosh.blockNumber}`);

    // Check voting power for Joshua before delegation
    votingPowerJoshua = await tokenContract.getPastVotes(walletJoshua.address, delegateTxReceiptJoshua.blockNumber);
    console.log(`Joshua has a vote power of ${ethers.utils.formatEther(votingPowerJoshua)} units`);
    // Check voting power for Hardeep before delegation
    votingPowerHardeep = await tokenContract.getPastVotes(walletHardeep.address, delegateTxReceiptHardeep.blockNumber);
    console.log(`Hardeep has a vote power of ${ethers.utils.formatEther(votingPowerHardeep)} units`);
    // Check voting power for Chris after delegation
    votingPowerChris = await tokenContract.getPastVotes(walletChris.address, delegateTxReceiptChris.blockNumber);
    console.log(`Chris has a vote power of ${ethers.utils.formatEther(votingPowerChris)} units`);
    // Check voting power for Lindsay after delegation
    votingPowerLindsay = await tokenContract.getPastVotes(walletLindsay.address, delegateTxReceiptLindsay.blockNumber);
    console.log(`Lindsay has a vote power of ${ethers.utils.formatEther(votingPowerLindsay)} units`);
    // Check voting power for Owen after delegation
    votingPowerOwen = await tokenContract.getPastVotes(walletOwen.address, delegateTxReceiptOwen.blockNumber);
    console.log(`Owen has a vote power of ${ethers.utils.formatEther(votingPowerOwen)} units`);
    // Check voting power for Josh after delegation
    votingPowerJosh = await tokenContract.getPastVotes(walletJosh.address, delegateTxReceiptJosh.blockNumber);
    console.log(`Josh has a vote power of ${ethers.utils.formatEther(votingPowerJosh)} units`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});