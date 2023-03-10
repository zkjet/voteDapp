import axios from 'axios';
import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

import { API_BASE_URL } from '../config/URLs';

export default function RequestToken({ signer }) {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [amount, setAmount] = React.useState(0);

  function handleChange(event) {
    setAmount(event.target.value);
  }

  function handleSubmit() {
    if (!signer) {
      setErrorMessage('Error: Signer not available');
      return;
    }

    if (isNaN(amount)) {
      setErrorMessage(`${amount} is not a number`);
      return;
    }

    const getAddress = signer.getAddress();
    const getSignature = signer.signMessage('REQUEST');

    Promise.all([getAddress, getSignature]).then((value) => {
      axios({
        method: 'POST',
        url: `${API_BASE_URL}token/request`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          to: value[0],
          signature: value[1],
          amount: amount,
        },
      })
        .then((resp) => alert(`Transfer complete: ${resp.data.transfered}`))
        .catch((error) => {
          console.error(error);
          setErrorMessage(error.message);
        });
    });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Request Tokens</Card.Title>
          <Card.Text>
            Enter the amount of tokens to request.
          </Card.Text>
          <div className='mb-3'>
          <input
            aria-label='Amount (MTK)'
            className='form-control'
            type='number'
            onInput={handleChange}
            min={0}
            max={100}
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
