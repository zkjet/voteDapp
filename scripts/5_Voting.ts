import { MyToken, MyToken__factory, Ballot__factory, Ballot } from "../typechain-types";
import { ethers, Wallet } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

const BALLOT_CONTRACT_ADDRESS = "0x332dF6eBac06590BbEfA6Fa560e312a6C54E5fa2";

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
    const walletHardeep = new ethers.Wallet(Joshua_Pk);
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
    const walletJosh = new ethers.Wallet(Owen_Pk);
    console.log(`Connected to Josh's wallet address: ${walletJosh.address}`);
                    
                    // 2. CREATE SIGNERS FROM WALLET

    const signerJoshua = walletJoshua.connect(provider);
    const signerHardeep = walletHardeep.connect(provider);
    const signerChris = walletChris.connect(provider);
    const signerLindsay = walletLindsay.connect(provider);
    const signerOwen = walletOwen.connect(provider);
    const signerJosh = walletJosh.connect(provider);

                    // 3. INSTANTIATE TOKENIZED BALLOT CONTRACT AND ATTACH TO IT

    // Joshua attaches to the contract and instantiates it
    const ballotContractFactory = new Ballot__factory(signerJoshua);
    console.log("Attaching to contract ...");
    const ballotContract = ballotContractFactory.attach(BALLOT_CONTRACT_ADDRESS);
    console.log(`Attached to TokenizedBallot contract at ${ballotContract.address}`);

                    // 4. VOTE
    // // Joshua voting power before vote 
    // let votingPower = await ballotContract.votingPower(walletJoshua.address);
    // console.log({votingPower});
    // // Hardeep voting power before vote 
    // votingPower = await ballotContract.connect(signerHardeep).votingPower(walletHardeep.address);
    // console.log({votingPower});

    // Joshua casts 1 vote for strawberry, the 0 indexed arg
    console.log("Joshua votes once for strawberry")
    const voteTxJoshua1 = await ballotContract.connect(signerJoshua).vote(0, ethers.utils.parseEther("1"));
    const voteTxJoshua1Receipt = await voteTxJoshua1.wait();
    // Joshua casts one vote for chocolate, the 2 indexed arg
    console.log("Joshua votes once for chocolate")
    const voteTxJoshua2 = await ballotContract.connect(signerJoshua).vote(2, ethers.utils.parseEther("1"));
    const voteTxJoshua2Receipt = await voteTxJoshua2.wait();
    // Hardeep casts two votes for caramel, the 1 indexed arg
    console.log("Hardeep votes once for caramel")
    const voteTxHardeep = await ballotContract.connect(signerHardeep).vote(1, ethers.utils.parseEther("1"));
    const voteTxHardeepReceipt = await voteTxHardeep.wait();
    console.log(`Hardeep's vote is recorded in block ${voteTxHardeepReceipt.blockNumber}`);
    // Chris casts 5 votes for strawberry, the 0 indexed arg
    console.log("Chris votes 5 times for chocolate")
    const voteTxChris = await ballotContract.connect(signerChris).vote(2, ethers.utils.parseEther("5"));
    const voteTxChrisReceipt = await voteTxChris.wait();
    // Lindsay casts 3 votes for caramel, the 1 indexed arg
    console.log("Lindsay votes 3 times for caramel")
    const voteTxLindsay = await ballotContract.connect(signerLindsay).vote(1, ethers.utils.parseEther("3"));
    const voteTxLindsayReceipt = await voteTxLindsay.wait();
    // Owen casts 5 votes for chocolate, the 2 indexed arg
    console.log("Owen votes 5 times for chocolate")
    const voteTxOwen = await ballotContract.connect(signerOwen).vote(2, ethers.utils.parseEther("5"), );
    const voteTxOwenReceipt = await voteTxOwen.wait();
    // Josh casts 3 votes for strawberry, the 0 indexed arg
    console.log("Josh votes 3 times for strawberry")
    const voteTxJosh = await ballotContract.connect(signerJosh).vote(0, ethers.utils.parseEther("3"));
    const voteTxJoshReceipt = await voteTxJosh.wait();
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});