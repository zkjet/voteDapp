import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import Sync from './components/Sync';
import RequestToken from './components/RequestToken';
import DelegateToken from './components/DelegateToken';
import QueryWinner from './components/QueryWinner';
import RecentVotes from './components/RecentVotes';
import Vote from './components/Vote';
import Mint from './components/Mint';

function App() {
  const [isConnected, setConnected] = React.useState(false);
  const [signer, setSigner] = React.useState(undefined);


  return (
    <>
      <div className='App mt-5'>
        <h1 className='title'>Vote dApp</h1>
        <Sync setConnected={setConnected} setSigner={setSigner} />
      </div>
      <div style={{ margin: 'auto' }}>
        {!isConnected ? null : (
          
            <div className='container'>
              <RequestToken className='card' signer={signer} />
              <DelegateToken className='card' signer={signer} />
              <Vote className='card' signer={signer} />
              <QueryWinner className='card' signer={signer} />
              <RecentVotes className='card' signer={signer} />
              <Mint className='card' signer={signer} />
            </div>
          
        )}
      </div>
    </>
  );
}

export default App;

