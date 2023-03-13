import axios from 'axios';
import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import * as ethers from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import ballotJson from '../assets/Ballot.json';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { API_BASE_URL } from '../config/URLs';

const TOKEN_ADDRESS = '0x0AE684f99f58F7d09B415281A78eC8eabc0DF40f';

export default function Mint({ signer }) {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const { active, account, chainId, error, library, activate } = useWeb3React();

  function handleAddressChange(event) {
    if (event.target.value === 'Input address for mint') {
      setErrorMessage(`Please input address`);
      return;
    }
    setErrorMessage(null);
    setAddress((event.target.value).toString());
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
    // const address = await signer.getAddress();
    // const tokenContract = await new ethers.Contract(
    //   TOKEN_ADDRESS,
    //   tokenJson.abi,
    //   signer
    // );
    const parsedAmount = ethers.utils.parseEther(amount.toString()).toString();
    console.log(parsedAmount);
    console.log(amount);
    console.log(address);
    const response = await axios.post('http://localhost:3001/token/mint', {
        address: address,
        amount: amount
    });
    console.log(response);
    // if (parsedAmount > 0) {
    //     axios({
    //         method: 'POST',
    //         url: `${API_BASE_URL}token/mint?address=${address}&amount=${amount}`,
    //         headers: { 'Content-Type': 'application/json' },
    //       })
    //         .then((resp) =>
    //           alert(`Currently winning Proposal is ${resp.data}!`)
    //         )
    //         .catch((error) => {
    //           console.error(error);
    //           setErrorMessage(error.message);
    //         });
    // }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className='mb-3'>Mint</Card.Title>

          <Card.Text className='mt-3'>
            Enter the address to mint to.
          </Card.Text>
          <div className='mb-3'>
            <input
              aria-label='Votes'
              className='form-control'
              placeholder='Enter Address'
              type='string'
            //   min={0}
              onInput={handleAddressChange}
              value={address}
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
              onInput={handleAmountChange}
              value={amount}
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
