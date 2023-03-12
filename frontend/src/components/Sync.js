import React from "react";
import Button from "react-bootstrap/Button";

import axios from "axios";
import { ethers } from "ethers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import { API_BASE_URL } from "../config/URLs";

const Injected = new InjectedConnector({
    supportedChainIds: [11155111],
});

const updateInterval = 5000;

export default function Sync({ setConnected, setSigner }) {
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [gasPrice, setGasPrice] = React.useState(null);
    const [balance, setBalance] = React.useState(null);
    const [tokenBalance, setTokenBalance] = React.useState(null);
    const [tokenSupply, setTokenSupply] = React.useState(null);

    const { active, account, chainId, error, library, activate } = useWeb3React();

    // Set Error Message (swithc to Sepolia, or unkonwn)
    React.useEffect(() => {
        if (error === undefined) {
            setErrorMessage(null);
            return;
        }
        if (error instanceof UnsupportedChainIdError) setErrorMessage("Please switch to Sepolia network");
        else setErrorMessage("Error: Unknown");
    }, [error]);

    // Set the isConnected for App
    React.useEffect(() => {
        if (error) setConnected(false);
        setConnected(active);
    }, [active, error, setConnected]);

    // Get the Signer for App
    React.useEffect(() => {
        if (!!library) setSigner(library?.getSigner());
    }, [library, setSigner]);

    // Get Account Balanc
    React.useEffect(() => {
        if (!!library && account) {
            library.getBalance(account).then((balanceBN) => {
                const balanceStr = ethers.utils.formatEther(balanceBN);
                setBalance(balanceStr);
            });
        }
    }, [account, library]);

    // Get Gas Price (interval)
    React.useEffect(() => {
        let gasPriceChecker;
        if (!!library && account) {
            library.getBalance(account).then((balanceBN) => {
                const balanceStr = ethers.utils.formatEther(balanceBN);
                setBalance(balanceStr);
            });

            function checkGasPrice() {
                library.getGasPrice().then((gasPriceBN) => {
                    const gasPriceStr = ethers.utils.formatEther(gasPriceBN);
                    setGasPrice(gasPriceStr);
                });
            }

            checkGasPrice();
            gasPriceChecker = setInterval(() => {
                checkGasPrice();
            }, updateInterval);
        }
        return () => {
            clearTimeout(gasPriceChecker);
        };
    }, [account, library]);

    // Get Account Token Balance (MTK)
    React.useEffect(() => {
        if (account) {
            axios({
                mathod: "GET",
                url: `${API_BASE_URL}token/balance-of?address=${account}`,
            })
                .then((resp) => {
                    setTokenBalance(resp.data.balance);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [account]);

    React.useEffect(() => {
        if (account) {
            axios({
                mathod: "GET",
                url: `${API_BASE_URL}token/supply`,
            })
                .then((resp) => {
                    setTokenSupply(resp.data.supply);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [account]);

    return (
        <>
            {errorMessage ? (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            ) : null}
            {!active ? (
                <Button
                    onClick={() => {
                        activate(Injected);
                    }}
                >
                    Connect
                </Button>
            ) : (
                <>
                    <div className="alert alert-info" role="alert">
                        <div>Network ID: {chainId} (Sepolia)</div>
                        <div>Account: {account}</div>
                        {!gasPrice ? null : <div>Gas Price: {gasPrice} Sepolia ETH</div>}
                        {!balance ? null : <div>Balance: {balance} Sepolia ETH</div>}
                        {!tokenBalance ? null : <div>Token Balance: {tokenBalance} MTK</div>}
                        {!tokenSupply ? null : <div>Total Token Supply: {tokenSupply} MTK</div>}
                    </div>
                </>
            )}
        </>
    );
}
