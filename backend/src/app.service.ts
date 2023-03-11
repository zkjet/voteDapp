import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'

const CONTRACT_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;      

  constructor(private config: ConfigService) {
    this.provider = ethers.getDefaultProvider('sepolia');
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, tokenJson.abi, this.provider);
  }

  async getAllowance(from: string, to: string): Promise<number> {
    return parseInt(ethers.utils.formatEther(await this.contract.allowance(from, to)));
  }

  async getTotalSupply(): Promise<number> {
    return parseFloat(ethers.utils.formatEther(await this.contract.totalSupply()));
  }

  getTokenAddress(): string {
    const pk = this.config.get<string>('PRIVATE_KEY');
    console.log(`pk: ${JSON.stringify(pk)}`);
    return this.contract.address;
  }

  async giveApproval(to: string, amount: number, signature: string): Promise<boolean> {
    const pk = this.config.get<string>('PRIVATE_KEY');
    
    return await this.contract.approve(to, amount);
  }
}
 