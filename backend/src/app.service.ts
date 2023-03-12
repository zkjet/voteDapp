import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/Ballot.json';

// These are test contract - deployer is PRIVATE_KEY_HARDEEP
// Fresh contracts will need to be deployed when ready for "go-live"
const TOKEN_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";
const BALLOT_ADDRESS = "0xB1637f1Dbc9c23218Ee1A5A534B45cC249444196";
const MINT_AMOUNT = "10";

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;  
  ballotContract: ethers.Contract;   
  votesMap = new Map(); 

  constructor(private config: ConfigService) {
    this.provider = ethers.getDefaultProvider('sepolia');
    this.tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, this.provider);
    this.ballotContract = new ethers.Contract(BALLOT_ADDRESS, ballotJson.abi, this.provider);

    // Event listening and handling
    this.ballotContract.on('voted', (_proposalName: string, _totalVotes: ethers.BigNumber, _voteReceived: ethers.BigNumber) => {
      let proposalName = ethers.utils.parseBytes32String(_proposalName);
      let totalVotes = parseFloat(ethers.utils.formatEther(_totalVotes));
      let voteReceived = parseFloat(ethers.utils.formatEther(_voteReceived));

      console.log(`proposalName ${proposalName} just recieved ${voteReceived} votes for a total of ${totalVotes} votes.`);
      this.votesMap.set(proposalName, { totalVotes: totalVotes, voteReceived: voteReceived });
    });
  }

  getTokenAddress(): string {
    return this.tokenContract.address;
  }

  async getTokenSupply(): Promise<number> {
    return await parseFloat(ethers.utils.formatEther(await this.tokenContract.totalSupply()));
  }

  async getBalanceOf(address: string): Promise<number> {
    const balance =  await this.tokenContract.balanceOf(address);
    console.log(`balance: ${balance}`);
    const balanceFormatted = parseFloat(ethers.utils.formatEther(balance));
    console.log(`balance: ${balanceFormatted}`);
    return balanceFormatted;
  }

  async getTokenAllowance(from: string, to: string): Promise<number> {
    const allowance = await ethers.utils.formatEther(await this.tokenContract.allowance(from, to));
    console.log(`allowance is: ${allowance}`);
    return parseFloat(allowance);
  }

  async giveApproval(to: string, amount: string, signature: string): Promise<string> {
    const approveMessage = this.config.get<string>('APPROVE_MESSAGE');
    const pubKey = this.config.get<string>('PUBLIC_KEY');
    const address = await ethers.utils.verifyMessage(approveMessage, signature);
    if (address === pubKey) {
      console.log(`signature verified from address: ${address}`);

      const privKey = this.config.get<string>('PRIVATE_KEY');
      if(!privKey || privKey.length <= 0) throw new Error("Missing environment: private key");

      const deployerWallet = new ethers.Wallet(privKey);
      const deployer = deployerWallet.connect(this.provider);
      console.log(`deployer connected with: ${deployer.address}`);

      const approveAmount = ethers.utils.parseEther(amount);
      const approveResult = await this.tokenContract.connect(deployer).approve(to, approveAmount);
      console.log(`approve result: ${JSON.stringify(approveResult.hash)}`);
      return approveResult.hash;
    }
    throw new Error("Signature verification failed");
  }

  async requestTokens(to: string, amount: string, signature: string): Promise<string> {
    const requestMessage = this.config.get<string>('REQUEST_MESSAGE');
    const address = await ethers.utils.verifyMessage(requestMessage, signature);
    if (to === address) {
      console.log(`signature verified for address: ${to}`);

      const privKey = this.config.get<string>('PRIVATE_KEY');
      if(!privKey || privKey.length <= 0) throw new Error("Missing environment: private key");

      const deployerWallet = new ethers.Wallet(privKey);
      const deployer = deployerWallet.connect(this.provider);
      console.log(`deployer connected with: ${deployer.address}`);

      const requestAmount = ethers.utils.parseEther(amount);
      const requestResult = await this.tokenContract.connect(deployer).transfer(to, requestAmount);
      console.log(`approve result: ${JSON.stringify(requestResult.hash)}`);
      return requestResult.hash;
    }
    throw new Error("Signature verification failed");
  }

  // this service mints tokens on chain
  async mintTokens(address: string, amount: string): Promise<string> {
    // TODO: 
    const MINT_VALUE = ethers.utils.parseEther(amount);
    // load pk from env file or using NEST config model
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    // create a signer
    if (!privateKey || privateKey.length <= 0) throw new Error("Missing environment: Mnemonic seed");
    const wallet = new ethers.Wallet(privateKey);
    console.log("wallet created");
    const signer = wallet.connect(this.provider);
    console.log("signer created");
    // call the mint function
    const mintTx = await this.tokenContract.connect(signer).mint(wallet.address, MINT_VALUE);
    // let mintTx = await this.contractBallot.mint(wallet.address, amount);
    let mintTxReceipt = await mintTx.wait();
    let hash = mintTxReceipt.txHash;
    // return transaction hash
    console.log(hash)
    return hash;
  }

  async getBallotWinner(): Promise<string> {
    const winner = ethers.utils.parseBytes32String(await this.ballotContract.winnerName());
    console.log(`The winner is ${winner}!`)
    return winner;
  }

  getVotes(): Object {
    return this.convertMapToObject(this.votesMap);
  }

  private convertMapToObject(map) {
    let votesObj = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
    return votesObj;
  }
}