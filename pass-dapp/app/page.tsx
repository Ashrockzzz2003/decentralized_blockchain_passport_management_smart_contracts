"use client";

import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { WhyMetamask } from "@/components/why-metamask";
import { Contract } from "ethers";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "countryId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "countryName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "latLong",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "name": "CountryAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "countryId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "countryName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "latLong",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "name": "CountryUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issuerId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "issuerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "issuerName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issuerCountryId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "name": "IssuerAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "countryByName",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "countryId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "countryName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "latLong",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "isCountry",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isIssuer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_countryName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_latLong",
        "type": "string"
      }
    ],
    "name": "addCountry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_countryId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_countryName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_latLong",
        "type": "string"
      }
    ],
    "name": "updateCountry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_issuerAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_issuerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_issuerCountry",
        "type": "string"
      }
    ],
    "name": "registerIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_countryName",
        "type": "string"
      }
    ],
    "name": "getIssuerByCountry",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "issuerId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "issuerAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "issuerName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "issuerCountryId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct DecentralizedPassport.Issuer[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_userName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_userDob",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_userCountry",
        "type": "string"
      }
    ],
    "name": "requestPassport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPendingPassport",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "passportId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "userDob",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "userCountryId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "issuedBy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct DecentralizedPassport.PassportData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_passportId",
        "type": "uint256"
      }
    ],
    "name": "approvePassport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPassport",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "passportId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "userDob",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "userCountryId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "issuedBy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct DecentralizedPassport.PassportData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getPassportByAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "passportId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "userDob",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "userCountryId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "issuedBy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct DecentralizedPassport.PassportData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "verifyPassport",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

export default function GetStarted() {
  const [listOfAccounts, setListOfAccounts] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("0");

  let provider: BrowserProvider;
  let signer: HDNodeWallet | null | undefined | ethers.Signer;

  const chooseAccount = (account: string) => {
    setCurrentAccount(account);
    setCurrentState('3');
  }

  const checkIfWalletConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setListOfAccounts(accounts);
        setCurrentState('2');
        return true;
      }
      return false;
    } catch (error: Error | any) {
      alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
      return false;
    }
  };

  const _connectToMetaMask = async () => {
    setIsLoading(true);
    try {
      const isWalletConnected = await checkIfWalletConnected();
      if (!isWalletConnected) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await checkIfWalletConnected();
      }
      setIsLoading(false);
    } catch (error: Error | any) {
      alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
      setIsLoading(false);
    }
  };

  const isAdminJS = async () => {
    if (!currentAccount) {
      alert("Please connect to MetaMask first!");
      return false;
    }

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const isAdmin = await contract.isAdmin();

      alert(`Is Admin: ${isAdmin}`);

      return isAdmin;
    } catch (err) {
      alert("Something went wrong!")
      return false;
    }
  }


  return (
    <div className="flex flex-col justify-center align-middle items-center">
      <NavBar />

      <div className="flex flex-col flex-1 justify-center items-center">

        <div className="mt-8 text-center flex flex-col justify-center items-center align-middle">
          <h1 className="text-4xl font-bold">Decentralized Passport</h1>
          <p className="text-sm text-center">
            A decentralized passport system using Ethereum blockchain.
          </p>
          <Image
            src="/mm-logo.png"
            alt="MetaMask"
            width={420}
            height={240}
            className="rounded-lg mt-4"
          />

          {isLoading && (
            <>
              <h1 className="text-xl font-bold mt-8">Connecting to MetaMask...</h1>
              <p className="text-sm text-center">
                Please wait while we connect to MetaMask.
              </p>
            </>
          )}


          {currentState === '0' && (
            <div className="mt-8">
              <Button onClick={() => setCurrentState('1')}>Get Started</Button>
            </div>
          )}

          {currentState === '1' && (
            <div className="mt-8">
              <Button onClick={_connectToMetaMask}>Connect to MetaMask</Button>
            </div>
          )}

          {currentState === "2" && (
            <div className="mt-8">
              <h1 className="text-xl font-bold">Choose an account</h1>
              <div className="flex flex-col gap-4 mt-4">
                {listOfAccounts.map((account, index) => (
                  <div key={index} className="flex flex-row gap-4 border border-accent p-2 rounded-2xl align-middle justify-center items-center">
                    <p>{account.toString()}</p>
                    <Button onClick={() => chooseAccount(account)}>Select</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentState === "3" && (
            <div className="mt-8 bg-black bg-opacity-70 rounded-2xl p-4 border border-accent">
              <h1 className="text-xl font-bold">Connected Account</h1>
              <p className="text-sm text-center">
                {currentAccount}
              </p>

              <div className="mt-8">
                <Button onClick={isAdminJS}>Check if Admin</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}