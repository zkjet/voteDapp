import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

import { API_BASE_URL } from '../config/URLs';

export default function RequestToken({ signer }) {
  const [errorMessage, setErrorMessage] = React.useState(null);

  function handleSubmit() {
    if (!signer) {
      setErrorMessage('Error: Signer not available');
      return;
    }

    axios({
      method: 'GET',
      url: `${API_BASE_URL}ballot/winner`,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((resp) =>
        alert(`Currently winning Proposal is ${resp.data.winner}!`)
      )
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message);
      });
  }
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Get Winner</Card.Title>
          <Card.Text>Submit to determine the winner.</Card.Text>
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

