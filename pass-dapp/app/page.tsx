"use client";

import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { WhyMetamask } from "@/components/why-metamask";
import { Contract } from "ethers";
import Image from "next/image";
import { useState } from "react";

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
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "countryData",
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "inputs": [],
    "name": "getCountries",
    "outputs": [
      {
        "components": [
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
        "internalType": "struct DecentralizedPassport.Country[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
  }
];


export default function GetStarted() {
  const [listOfAccounts, setListOfAccounts] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("0");
  const [userRole, setUserRole] = useState<string>("-1");

  let provider: BrowserProvider;
  let signer: HDNodeWallet | null | undefined | ethers.Signer;

  const chooseAccount = async (account: string) => {
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
      alert("Please select an account");
      return;
    }

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const isAdmin = await contract.isAdmin();
      setUserRole(isAdmin ? "0" : "1");
      setCurrentState('4');
      return;
    } catch (err) {
      console.log(err);
      alert("Something went wrong!")
      return;
    }
  }


  const [countryName, setCountryName] = useState<string>("");
  const [latLong, setLatLong] = useState<string>("");

  const [countryData, setCountryData] = useState<any[]>([]);
  const addCountry = async () => {
    if (!countryName || !latLong) {
      alert("Please fill all the fields");
      return;
    }

    // check format
    const latLongArray = latLong.split(",");
    if (latLongArray.length !== 2) {
      alert("Invalid latitude and longitude format");
      return;
    }

    setIsLoading(true);

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.addCountry(countryName, latLong);
      alert("Country added successfully!");
      return;
    } catch (err) {
      console.log(err);
      alert("Something went wrong!")
      return;
    } finally {
      setIsLoading(false);
    }
  }
  const getCountries = async () => {

    setIsLoading(true);

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const countries = await contract.getCountries();

      console.log(countries);

      setCountryData(countries);

      return;
    } catch (err) {
      console.log(err);
      alert("Something went wrong!")
      return;
    } finally {
      setIsLoading(false);
    }
  }


  const [issuerName, setIssuerName] = useState<string>("");
  const [issuerAddress, setIssuerAddress] = useState<string>("");
  const [issuerCountry, setIssuerCountry] = useState<string>("");

  const [issuerSearchCountry, setIssuerSearchCountry] = useState<string>("");
  const [issuerData, setIssuerData] = useState<any[]>([]);

  const registerIssuer = async () => {
    if (!issuerName || !issuerAddress || !issuerCountry) {
      alert("Please fill all the fields");
      return;
    }

    setIsLoading(true);

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.registerIssuer(issuerAddress, issuerName, issuerCountry);
      alert("Issuer registered successfully!");
      return;
    } catch (err) {
      console.log(err);
      alert("Something went wrong!")
      return;
    } finally {
      setIsLoading(false);
    }
  }

  const getIssuerByCountry = async () => {
    setIsLoading(true);

    try {
      const contractAddress = "0xe2c987583ECcC7faE957dB2836f7AD7a6F4F4289";
      provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const issuers = await contract.getIssuerByCountry(issuerSearchCountry);

      console.log(issuers);
      setIssuerData(issuers);

      return;
    } catch (err) {
      console.log(err);
      alert("Something went wrong!")
      return;
    } finally {
      setIsLoading(false);
    }
  }


  const [currentTab, setCurrentTab] = useState<string>("0");

  const switchTab = (tab: string) => {
    setCurrentTab(tab);
  }

  return isLoading == true ? (
    <div className="flex flex-col justify-center align-middle items-center">
      <NavBar />
      <div role="status" className="min-w-[70%] p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>

    </div>
  ) : (
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
              <p className="text-sm text-center mb-4">
                {currentAccount}
              </p>
              <Button onClick={isAdminJS}>Confirm Role</Button>
            </div>
          )}

          {currentState === "4" && (
            <div className="mt-8">
              <h4 className="text-xl font-bold">You are an Admin</h4>
              <p className="text-sm text-center">
                You can now manage the passport system.
              </p>

              {/* TAbs */}
              <div className="flex flex-row gap-4 mt-8 justify-center items-center">
                <Button onClick={() => switchTab('0')}>Countries</Button>
                <Button onClick={() => switchTab('1')}>Issuers</Button>
              </div>


              {currentTab === '0' && (<div className="mb-32"><h2 className="text-xl font-bold mt-8">Countries</h2>
                <div className="flex flex-row flex-wrap justify-center items-center gap-4 mt-4">
                  <div className="bg-black bg-opacity-70 rounded-2xl p-4 border border-accent mt-4">
                    <h1 className="text-xl font-bold">Add Country</h1>
                    <input
                      type="text"
                      placeholder="Country Name"
                      value={countryName}
                      onChange={(e) => setCountryName(e.target.value)}
                      className="border border-accent p-2 rounded-lg w-full mt-4"
                    />
                    <input
                      type="text"
                      placeholder="Latitude, Longitude"
                      value={latLong}
                      onChange={(e) => setLatLong(e.target.value)}
                      className="border border-accent p-2 rounded-lg w-full mt-4"
                    />
                    <Button onClick={addCountry} className="mt-4">Add Country</Button>
                  </div>
                  <div className="flex flex-col flex-wrap justify-center items-center gap-4 mt-8">
                    <Button onClick={getCountries}>Get Countries</Button>
                    {countryData.length > 0 && (
                      <div className="bg-black bg-opacity-70 rounded-2xl p-4 border border-accent mt-4">
                        <h1 className="text-xl font-bold">Countries</h1>
                        <div className="flex flex-col gap-4 mt-4">
                          {countryData.map((country, index) => (
                            <div key={index} className="flex flex-col gap-1 border border-accent p-2 rounded-2xl align-middle justify-center items-center">
                              <p>{country.countryName.toString()}</p>
                              <p className="text-sm text-gray-400">{country.latLong.toString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div></div>)}


              {currentTab === "1" && (<div className="mb-32">
                <h2 className="text-xl font-bold mt-8">Issuers</h2>
                <div className="flex flex-row flex-wrap justify-center items-center gap-4 my-4">
                  <div className="bg-black bg-opacity-70 rounded-2xl p-4 border border-accent mt-4">
                    <h1 className="text-xl font-bold">Register Issuer</h1>
                    <input
                      type="text"
                      placeholder="Issuer Name"
                      value={issuerName}
                      onChange={(e) => setIssuerName(e.target.value)}
                      className="border border-accent p-2 rounded-lg w-full mt-4"
                    />
                    <input
                      type="text"
                      placeholder="Issuer Address"
                      value={issuerAddress}
                      onChange={(e) => setIssuerAddress(e.target.value)}
                      className="border border-accent p-2 rounded-lg w-full mt-4"
                    />
                    <input
                      type="text"
                      placeholder="Issuer Country"
                      value={issuerCountry}
                      onChange={(e) => setIssuerCountry(e.target.value)}
                      className="border border-accent p-2 rounded-lg w-full mt-4"
                    />
                    <Button onClick={registerIssuer} className="mt-4">Register Issuer</Button>
                  </div>

                  <div className="bg-black bg-opacity-70 rounded-2xl p-4 border border-accent mt-4">
                    <div className="flex flex-col flex-wrap justify-center items-center gap-2">
                      <h1 className="text-lg font-bold mb-2">Get Issuers by country</h1>
                      <input
                        type="text"
                        placeholder="Country Name"
                        value={issuerSearchCountry}
                        onChange={(e) => setIssuerSearchCountry(e.target.value)}
                        className="border border-accent p-2 rounded-lg w-full mt-4"
                      />
                      <Button disabled={!(issuerSearchCountry.length > 0)} onClick={getIssuerByCountry}>Get Issuers</Button>
                      {issuerData.length > 0 && (
                        <div className="bg-black bg-opacity-70 rounded-2xl p-4 border border-accent mt-4">
                          <h1 className="text-xl font-bold">Issuers</h1>
                          <div className="flex flex-col gap-4 mt-4">
                            {issuerData.map((issuer, index) => (
                              <div key={index} className="flex flex-col gap-1 border border-accent p-2 rounded-2xl align-middle justify-center items-center">
                                <p>{issuer.issuerName.toString()}</p>
                                <p className="text-sm text-gray-400">{issuer.issuerAddress.toString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>)}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}