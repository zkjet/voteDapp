import axios from 'axios';
import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import * as ethers from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import ballotJson from '../assets/Ballot.json';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const API_URL_MINT = "http://localhost:3000/mint-tokens";

export default function Mint({ signer }) {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [address, setAddress] = React.useState(null);
  const { active, account, chainId, error, library, activate } = useWeb3React();

  function handleAddressChange(event) {
    if (event.target.value === 'Input address for mint') {
      setErrorMessage(`Please input address`);
      return;
    }
    setErrorMessage(null);
    setAddress(event.target.value);
  }

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  async function handleSubmit() {
    if (!signer) {
      setErrorMessage('Error: Signer not available');
      return;
    }

    if (isNaN(address)) {
      setErrorMessage(`Please enter an address`);
      return;
    }

    if (isNaN(amount)) {
      setErrorMessage(`Please enter an amount`);
      return;
    }

    const address = await signer.getAddress();
    const tokenContract = await new ethers.Contract(
      TOKEN_ADDRESS,
      ballotJson.abi,
      signer
    );
    const parsedAmount = ethers.utils.parseEther(amount.toString());
    console.log(parsedAmount);
    if (parsedAmount > 0) {
      const mintTx = await tokenContract.mint(
        propsal,
        ethers.utils.parseEther(amount),
        {gasLimit: 3e7}
      );
      const voteTxReceipt = await voteTx.wait();
      alert(
        `${address}'s ${votes} vote(s) for proposal ${propsal} is recorded in block ${voteTxReceipt.blockNumber}`
      );
      console.log(
        `${address}'s ${votes} vote(s) for proposal ${propsal} is recorded in block ${voteTxReceipt.blockNumber}`
      );
    } else {
      alert(`Votes value needs to be greater than 1`);
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className='mb-3'>Vote</Card.Title>

          <Card.Text className='mt-3'>
            Enter the address to mint to.
          </Card.Text>
          <div className='mb-3'>
            <input
              aria-label='Votes'
              className='form-control'
              placeholder='Enter Address'
              type='number'
              min={0}
              onInput={handleVoteChange}
              value={votes}
            />
          </div>
          {errorMessage ? (
            <div className='alert alert-danger' role='alert'>
              {errorMessage}
            </div>
          ) : null}

          <Card.Text className='mt-3'>
            Enter the amount of tokens to mint.
          </Card.Text>
          <div className='mb-3'>
            <input
              aria-label='Amount'
              className='form-control'
              placeholder='Enter Votes'
              type='number'
              min={0}
              onInput={handleVoteChange}
              value={votes}
            />
          </div>
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
