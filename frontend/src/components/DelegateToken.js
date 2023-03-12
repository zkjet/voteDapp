import axios from "axios";
import React from "react";
import { Alert, Button } from "react-bootstrap";
import * as ethers from "ethers"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import tokenJson  from '../assets/MyToken.json';

const TOKEN_ADDRESS = "0x3592d257a5fe4111036873754CAF934276C66025";

export default function DelegateToken({ signer }) {
    const [errorMessage, setErrorMessage] = React.useState(null);
    const { active, account, chainId, error, library, activate } = useWeb3React();

    async function handleSubmit() {
        if (!signer) {
            setErrorMessage("Error: Signer not available");
            return;
        }
        const address = await signer.getAddress();
        const tokenContract = await new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, signer);
        const delegateTx = await tokenContract.delegate(address);
        Button.disabled = true;
        console.log(delegateTx);
        const delegateTxReceipt = await delegateTx.wait();
        console.log(`Tokens delegated for ${address} at block: ${delegateTxReceipt.blockNumber}`);
        const addressVP = await tokenContract.getVotes(address);
        alert(`delegatee has a vote power of ${ethers.utils.formatEther(addressVP)} units`);
    }

    return (
        <>
            <div className="container mb-5">
                <h2 className="mb-3">Delegate Tokens</h2>
                <div className="mb-3">
                </div>
                {errorMessage ? (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                ) : null}
                <Button className="m-1" variant="primary" onClick={handleSubmit} disabled={!signer}>
                    Submit
                </Button>
            </div>
        </>
    );
}