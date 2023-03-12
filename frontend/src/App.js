import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import Sync from "./components/Sync";

function App() {
    const [isConnected, setConnected] = React.useState(false);
    const [, setSigner] = React.useState(undefined);

    return (
        <>
            <div className="App mt-5">
                <h1 className="p-3">Vote dApp</h1>
                <Sync setConnected={setConnected} setSigner={setSigner} />
            </div>
            <div style={{ maxWidth: 960, margin: "auto" }}>
                {!isConnected ? null : (
                    <>
                        <div className="container mb-5">
                            <h2 className="mb-3">Request Tokens</h2>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Amount (MTK)"
                                    aria-label="Amount (MTK)"
                                />
                            </div>
                            <Button className="m-1" variant="primary" onClick={() => alert("not implmented")}>
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default App;
