import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const TOKEN_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";
const MINT_AMOUNT = "10";

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;  
  ballotContract: ethers.Contract;    

  constructor(private config: ConfigService) {
    this.provider = ethers.getDefaultProvider('sepolia');
    this.tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, this.provider);
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

      const pk = this.config.get<string>('PRIVATE_KEY');
      if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");

      const deployerWallet = new ethers.Wallet(pk);
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

      const approveAmount = ethers.utils.parseEther(MINT_AMOUNT);
      const approveResult = await this.tokenContract.connect(deployer).transfer(to, approveAmount);
      console.log(`approve result: ${JSON.stringify(approveResult.hash)}`);
      return approveResult.hash;
    }
    throw new Error("Signature verification failed");
  }
}