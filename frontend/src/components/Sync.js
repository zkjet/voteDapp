import React from "react";
import Button from "react-bootstrap/Button";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const Injected = new InjectedConnector({
    supportedChainIds: [11155111],
});

export default function Sync({ setConnected, setSigner }) {
    const [errorMessage, setErrorMessage] = React.useState(null);

    const { active, account, chainId, error, library, activate } = useWeb3React();

    React.useEffect(() => {
        if (error === undefined) {
            setErrorMessage(null);
            return;
        }
        if (error instanceof UnsupportedChainIdError) setErrorMessage("Please switch to Sepolia network");
        else setErrorMessage("Error: Unknown");
    }, [error]);

    React.useEffect(() => {
        if (error) setConnected(false);
        setConnected(active);
    }, [active, error, setConnected]);

    React.useEffect(() => {
        if (library !== undefined);
        setSigner(library?.getSigner());
    }, [library, setSigner]);

    return (
        <>
            {errorMessage ? (
                <div class="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            ) : null}
            {!active ? (
                <Button
                    onClick={() => {
                        activate(Injected);
                    }}
                >
                    Sync
                </Button>
            ) : (
                <>
                    <div class="alert alert-info" role="alert">
                        <div>Account: {account}</div>
                        <div>Network ID: {chainId}</div>
                    </div>
                </>
            )}
        </>
    );
}
