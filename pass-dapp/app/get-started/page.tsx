"use client";

import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { WhyMetamask } from "@/components/why-metamask";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const { ethers } = require("ethers");

export interface AccountType {
    address?: string;
    balance?: string;
    chainId?: string;
    network?: string;
}

export default function GetStarted() {

    const [currentAccount, setCurrentAccountData] = useState<AccountType>({})
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        _connectToMetaMask();
    }, [])


    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) {
                return false;
            };
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            console.log(accounts);
            if (accounts.length > 0) {
                setCurrentAccountData(accounts[0]);
                return true;
            } else {
                setCurrentAccountData({});
            }
        } catch (error) {
            console.log("[ERROR-checkIfWalletConnected]: ", error);
        } finally {
            return false;
        }
    };

    const _connectToMetaMask = useCallback(async () => {

        if (await checkIfWalletConnected()) {
            return;
        }

        setIsLoading(true);
        const ethereum = window.ethereum;
        // Check if MetaMask is installed
        if (typeof ethereum !== "undefined") {
            try {
                // Request access to the user's MetaMask accounts
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                // Get the connected Ethereum address
                const address = accounts[0];
                // Create an ethers.js provider using the injected provider from MetaMask
                const provider = new ethers.BrowserProvider(ethereum);
                // Get the account balance
                const balance = await provider.getBalance(address);
                // Get the network ID from MetaMask
                const network = await provider.getNetwork();
                // Update state with the results
                setCurrentAccountData({
                    address,
                    balance: ethers.formatEther(balance),
                    // The chainId property is a bigint, change to a string
                    chainId: network.chainId.toString(),
                    network: network.name,
                });
            } catch (error: Error | any) {
                alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please install MetaMask Extension!");
            setIsLoading(false);
        }
    }, []);



    return (
        <div className="flex flex-col justify-center align-middle items-center">
            <NavBar />

            <div className="flex flex-col flex-1 justify-center items-center">


                {currentAccount.address ? (
                    <div className="mt-8 flex flex-col justify-center items-center align-middle gap-4">
                        <Image
                            src="/mm-logo.png"
                            alt="MetaMask"
                            width={320}
                            height={140}
                            className="rounded-lg"
                        />
                        <div className=" bg-[#202020] p-4 rounded-2xl">
                            <h1 className="text-xl font-bold text-center">Connected Account</h1>
                            <p className="text-sm text-center">
                                {currentAccount.address}
                            </p>
                            <p className="text-sm text-center">
                                {currentAccount.balance} ETH
                            </p>
                            <p className="text-sm text-center">
                                {currentAccount.network} (Chain ID: {currentAccount.chainId})
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-center">
                        <h1 className="text-xl font-bold">Connect to MetaMask</h1>
                        <p className="text-sm text-center">
                            Connect to MetaMask to access your Ethereum account.
                        </p>
                        <div className="flex flex-col justify-center items-center align-middle gap-4 mt-8">
                            <Image
                                src="/mm-logo.png"
                                alt="MetaMask"
                                width={320}
                                height={140}
                                className="rounded-lg"
                            />
                            <Button onClick={_connectToMetaMask}>Connect to MetaMask</Button>
                        </div>
                    </div>
                )}


                <WhyMetamask />
            </div>
        </div>
    );
}