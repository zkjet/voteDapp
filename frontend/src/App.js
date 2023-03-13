import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Sync from "./components/Sync";
import RequestToken from "./components/RequestToken";
import DelegateToken from "./components/DelegateToken";
import QueryWinner from "./components/QueryWinner";
import RecentVotes from "./components/RecentVotes";
import Vote from "./components/Vote";

function App() {
    const [isConnected, setConnected] = React.useState(false);
    const [signer, setSigner] = React.useState(undefined);

    return (
        <>
            <div className="App mt-5">
                <h1 className="p-3">Vote dApp</h1>
                <Sync setConnected={setConnected} setSigner={setSigner} />
            </div>
            <div style={{ maxWidth: 960, margin: "auto" }}>
                {!isConnected ? null : (
                    <>
                        <RequestToken signer={signer} />
                        <DelegateToken signer={signer} />
                        <Vote signer={signer} />
                        <QueryWinner signer={signer} />
                        <RecentVotes signer={signer} />
                    </>
                )}
            </div>
        </>
    );
}

export default App;
