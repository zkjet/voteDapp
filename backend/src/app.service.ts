import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../src/assets/MyToken.json';

const CONTRACT_ADDRESS = '0xb8579cF7B8D0e3D8F6996D3A2956E30cA39A982B';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider,
    );
  }

  getContractAddress(): string {
    return this.contract.address;
  }
}
