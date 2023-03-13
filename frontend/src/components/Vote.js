import axios from "axios";
import React from "react";
import { Alert, Button } from "react-bootstrap";
import * as ethers from "ethers"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import ballotJson  from '../assets/Ballot.json';

const BALLOT_ADDRESS = "0xB1637f1Dbc9c23218Ee1A5A534B45cC249444196";

export default function DelegateToken({ signer }) {
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [votes, setVotes] = React.useState(0);
    const [propsal, setPropsal] = React.useState(null);
    const { active, account, chainId, error, library, activate } = useWeb3React();

    function handleProposalChange(event) {
        setPropsal(event.target.value);
    }

    function handleVoteChange(event) {
        setVotes(event.target.value);
    }

    async function handleSubmit() {
        if (!signer) {
            setErrorMessage("Error: Signer not available");
            return;
        }

        if (isNaN(votes)) {
            setErrorMessage(`${votes} is not a number`);
            return;
        }
    
        if (isNaN(propsal)) {
            setErrorMessage(`${propsal} is not a number`);
            return;
        }
    
        const address = await signer.getAddress();
        const ballotContract = await new ethers.Contract(BALLOT_ADDRESS, ballotJson.abi, signer);
        const parsedVotes = ethers.utils.parseEther(votes.toString());
        console.log(parsedVotes);
        if(parsedVotes > 0) {
            const voteTx = await ballotContract.vote(propsal, ethers.utils.parseEther(votes), {gasLimit: 3e7});
            const voteTxReceipt = await voteTx.wait();
            alert(`${address}'s ${votes} vote(s) for proposal ${propsal} is recorded in block ${voteTxReceipt.blockNumber}`);
            console.log(`${address}'s ${votes} vote(s) for proposal ${propsal} is recorded in block ${voteTxReceipt.blockNumber}`);
        } else {
            alert(`Votes value needs to be greater than 1`);
        }
    }
    return (
        <>
            <div className="container mb-5">
                <h2 className="mb-3">Vote</h2>
                <div className="mb-3">
                    <input
                        aria-label="Proposal"
                        className="form-control"
                        placeholder="Select Proposal"
                        type="number"
                        onInput={handleProposalChange}
                        min={0}
                        max={2}
                        value={propsal}
                    />  
                </div>
                <div className="mb-3">
                    <input
                        aria-label="Votes"
                        className="form-control"
                        placeholder="Enter Votes"
                        type="number"
                        min={0}
                        onInput={handleVoteChange}
                        value={votes}
                    />
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