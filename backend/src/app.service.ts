import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'

const TOKEN_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;  
  ballotContract: ethers.Contract;    

  constructor(private config: ConfigService) {
    this.provider = ethers.getDefaultProvider('sepolia');
    this.tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, this.provider);
  }

  async getTokenAllowance(from: string, to: string): Promise<number> {
    const allowance = await ethers.utils.formatEther(await this.tokenContract.allowance(from, to));
    console.log(`allowance is: ${allowance}`);
    return parseInt(allowance);
  }

  async getTokenSupply(): Promise<number> {
    return await parseFloat(ethers.utils.formatEther(await this.tokenContract.totalSupply()));
  }

  getTokenAddress(): string {
    const pk = this.config.get<string>('PRIVATE_KEY');
    console.log(`pk: ${JSON.stringify(pk)}`);
    return this.tokenContract.address;
  }

  async giveApproval(to: string, amount: string, signature: string): Promise<boolean> {
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
      console.log(`approve result: ${JSON.stringify(approveResult)}`);
      return approveResult;
    }
  }
}
 