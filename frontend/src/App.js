import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import Sync from "./components/Sync";

function App() {
    const [isConnected, setConnected] = React.useState(false);
    const [, setSigner] = React.useState(undefined);

    return (
        <div className="App mt-5">
            <h1 className="p-3">Vote dApp</h1>
            <Sync setConnected={setConnected} setSigner={setSigner} />
            {!isConnected ? null : (
                <>
                    <Button className="m-1" variant="primary" onClick={() => alert("not implmented")}>
                        Vote
                    </Button>
                    <Button className="m-1" variant="secondary" onClick={() => alert("not implmented")}>
                        Delegate
                    </Button>
                </>
            )}
        </div>
    );
}

export default App;
