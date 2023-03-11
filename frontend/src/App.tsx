import React, { useState, useEffect } from 'react';
import { Wallet, ethers, utils, Contract, BigNumber } from 'ethers';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyToken from '../src/assets/MyToken.json';
import './App.css';

const API_URL = 'http://localhost:3000/contract-address';
const API_URL_MINT = 'http://localhost:3000/request-tokens';

function App() {
  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    'HARD CODE ALCHEMY KEY HERE'
  );
  
  const [blockNumber, setBlockNumber] = useState<number | string | undefined>();
  const [userWallet, setUserWallet] = useState<Wallet | undefined>();
  const [userEthBalance, setUserEthBalance] = useState<number | undefined>(
    undefined
  );
  // const [userTokenBalance, setUserTokenBalance] = useState<number | undefined>(
  //   undefined
  // );
  const [tokenContractAddress, setTokenContractAddress] = useState<
    string | undefined
  >(undefined);
  const [tokenContract, setTokenContract] = useState<Contract | undefined>(
    undefined
  );
  const [tokenTotalSupply, setTokenTotalSupply] = useState<
    number | string | undefined
  >(undefined);

  // useEffect(() => {
  //   // Setup provider
  //   const myProvider = new ethers.providers.AlchemyProvider(
  //     'goerli',
  //     process.env.ALCHEMY_API_KEY
  //   );
  //   setProvider(myProvider);

  //   // Setup Wallet
  //   const privateKey = process.env.PRIVATE_KEY;
  //   if (privateKey) {
  //     const wallet = new ethers.Wallet(privateKey, provider);
  //     console.log(`Connected to the wallet address: ${wallet.address}`);
  //     // Connect wallet to a provider
  //     const myWallet = wallet.connect(myProvider);
  //     setUserWallet(myWallet);
  //   }
  // }, []);

  const syncBlock = () => {
    console.log(provider);
    console.log(userWallet);
    setBlockNumber('loading... ');

    provider.getBlock('latest').then((block) => {
      setBlockNumber(block.number);
    });

    fetch(API_URL)
      .then((response: Response) => response.json())
      .then((data: { address: string }) => {
        console.log(data);
        setTokenContractAddress(data.address);
        setTokenTotalSupply('Loading... ');
      })
      .catch((error) => console.error(error));
  };

  const connectWallet = () => {
    console.log(provider);
    console.log(userWallet);

    // Connect wallet to a provider
    const wallet = Wallet.createRandom();
    if (provider) {
      const myWallet: Wallet = wallet.connect(provider);
      setUserWallet(myWallet);
    }

    if (userWallet) {
      userWallet
        .getBalance()
        .then((balanceBN) => {
          const balanceStr = utils.formatEther(balanceBN);
          setUserEthBalance(parseFloat(balanceStr));
        })
        .catch((error) => console.log(error));
    }
  };

  const updateTokenInfo = () => {
    setTokenTotalSupply('Loading... ');

    const contract = new ethers.Contract(
      tokenContractAddress ?? '',
      MyToken.abi,
      userWallet ?? provider
    );
    setTokenContract(contract);
    contract['totalSupply']().then((totalSupplyBN: BigNumber) => {
      const totalSupplyStr = utils.formatEther(totalSupplyBN);
      setTokenTotalSupply(totalSupplyStr);
    });
  };

  return (
    <div className='App'>
      <h1>Vote dApp</h1>
      <p>Vote Here</p>
      {blockNumber && (
        <p>
          We are connected to the Goerli blockchain at the block:
          {' ' + blockNumber}
        </p>
      )}
      {tokenContractAddress && (
        <p>
          We are connected to token contract address:
          {' ' + tokenContractAddress}
        </p>
        )}
        {tokenTotalSupply && (
        <p>
          Token total supply:
          {' ' + tokenTotalSupply}
        </p>
        )}
      {userWallet && (
        <>
          <p>
            User Wallet Address:
            {' ' + userWallet.address}
          </p>
          <p>
            Balance:
            {' ' + userEthBalance + 'ETH'}
          </p>
        </>
      )}
      <Button className='m-1' onClick={syncBlock}>
        Sync
      </Button>
      <Button className='m-1' onClick={connectWallet}>
        Connect Wallet
      </Button>
      <Button className='m-1' onClick={updateTokenInfo}>
        Update Token Info
      </Button>
      <Button className='m-1' variant='primary'>
        Vote
      </Button>
      <Button className='m-1' variant='danger'>
        Reset
      </Button>
    </div>
  );
}

export default App;
