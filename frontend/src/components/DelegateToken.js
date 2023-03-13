import axios from 'axios';
import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import * as ethers from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import tokenJson from '../assets/MyToken.json';
import Card from 'react-bootstrap/Card';

const TOKEN_ADDRESS = '0x0AE684f99f58F7d09B415281A78eC8eabc0DF40f';

export default function DelegateToken({ signer }) {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { active, account, chainId, error, library, activate } = useWeb3React();

  async function handleSubmit() {
    if (!signer) {
      setErrorMessage('Error: Signer not available');
      return;
    }
    const address = await signer.getAddress();
    const tokenContract = await new ethers.Contract(
      TOKEN_ADDRESS,
      tokenJson.abi,
      signer
    );
    const delegateTx = await tokenContract.delegate(address);
    Button.disabled = true;
    console.log(delegateTx);
    const delegateTxReceipt = await delegateTx.wait();
    console.log(
      `Tokens delegated for ${address} at block: ${delegateTxReceipt.blockNumber}`
    );
    const addressVP = await tokenContract.getVotes(address);
    alert(
      `delegatee has a vote power of ${ethers.utils.formatEther(
        addressVP
      )} units`
    );
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Delegate Tokens</Card.Title>
          <Card.Text>Submit to delegate your tokens.</Card.Text>
          {errorMessage ? (
            <div className='alert alert-danger' role='alert'>
              {errorMessage}
            </div>
          ) : null}
          <Button
            className='m-1'
            variant='primary'
            onClick={handleSubmit}
            disabled={!signer}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
