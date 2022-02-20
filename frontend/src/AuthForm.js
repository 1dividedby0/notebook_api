import {
    useEffect,
    useState,
} from "react";
import { Button, TextField, FormControl } from "@material-ui/core";
// import { useMetaMask } from "metamask-react";
import { AUTH_MANAGER_CONTRACT, BACKEND_REQUEST_HOST, SHARD_A_ADDRESS, SHARD_B_ADDRESS, SHARD_C_ADDRESS, TOKEN_MANAGER_CONTRACT, NFT_ADDRESS } from "./constants";
var bigInt = require("big-integer");

const Web3 = require('web3');
const testnet = 'https://kovan.infura.io/v3/0e6d69134d4b46b5aa434d33ee9c9bcd';
// var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
var web3 = new Web3(window.ethereum);

function shard(addr) {
    // let address = "0xB42425e8Dfa1023642809918Fc8037C084a52570";
    let address = addr.slice(2);

    if (address.length !== 40) {
        console.log("oh no bad address");
    }

    let int_add = new bigInt(address, 16);

    // random.seed(524)
    let rand = bigInt.randBetween("0", "2e64");

    let shardA = int_add.add(1 * rand);
    let shardB = int_add.add(2 * rand);
    let shardC = int_add.add(3 * rand);

    console.log(shardA);
    console.log(shardB);
    console.log(shardC);

    return [shardA.toString(), shardB.toString(), shardC.toString()];
}

export default function AuthForm() {
    const [name, setName] = useState('');
    const [wallet, setWallet] = useState('');
    const [SSN, setSSN] = useState('');
    const [authStatus, setAuthStatus] = useState('');

    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleWalletChange(event) {
        setWallet(event.target.value);
    }

    function handleSSNChange(event) {
        setSSN(event.target.value);
    }

    function handleFormSubmit(event) {
        if (typeof window.ethereum !== 'undefined') {
            console.log(window.ethereum);
        }

        let abiShard = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "authManagerAdd",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenAdd",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "shardAStr",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "user",
                        "type": "string"
                    }
                ],
                "name": "authenticate",
                "outputs": [],
                "stateMutability": "nonpayable",
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
                "name": "users",
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

        const wallet_address = window.ethereum.selectedAddress;
        let shards = shard(wallet_address);

        console.log(wallet_address.toString());

        let name = Math.random() * 100000;

        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };

        var contractShardA = new web3.eth.Contract(abiShard, SHARD_A_ADDRESS, call_params);
        contractShardA.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[0], name.toString()).send();

        var contractShardB = new web3.eth.Contract(abiShard, SHARD_B_ADDRESS, call_params);
        contractShardB.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[1], name.toString()).send();

        var contractShardC = new web3.eth.Contract(abiShard, SHARD_C_ADDRESS, call_params);
        contractShardC.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[2], name.toString()).send();




        // fetch(
        //     `${BACKEND_REQUEST_HOST}/api/v1/auth/authenticate/`,
        //     {
        //         method: "POST",
        //         body: JSON.stringify({
        //             name: name,
        //             wallet: wallet,
        //             SSN: SSN
        //         }),
        //     }
        // ).then((res) => res.json())
        //     .then((res_json) => {
        //         if (res_json["success"]) {
        //             setAuthStatus("Successfully authenticated!");
        //         } else {
        //             setAuthStatus("Failed to authenticate.");
        //         }
        //     });
        event.preventDefault();
    }

    function handleConnect(event) {
        window.ethereum.request({ method: 'eth_requestAccounts' });
        event.preventDefault();
    }

    function handleBuyNFT(event) {
        const wallet_address = window.ethereum.selectedAddress;
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        let abiNFT = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_approved",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_approved",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenAdd",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_uri",
                        "type": "string"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
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
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "getApproved",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
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
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ownerOf",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "_interfaceID",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
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
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "_symbol",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "tokenURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        var contractNFT = new web3.eth.Contract(abiNFT, NFT_ADDRESS, call_params);
        contractNFT.methods.mint(TOKEN_MANAGER_CONTRACT, wallet_address.toString(), Math.floor(Math.random() * 100), Math.random().toString()).send()
        console.log(wallet_address.toString())
        event.preventDefault();
    }

    useEffect(() => {
        if (authStatus !== "") {
            alert(authStatus);
            setAuthStatus("");
        }
    }, [authStatus]);

    return (
        <FormControl>
            <TextField
                label="Full Name"
                value={name}
                onChange={handleNameChange}
            >
            </TextField>
            <TextField
                label="Wallet Address"
                value={wallet}
                onChange={handleWalletChange}
            >
            </TextField>
            <TextField
                label="SSN"
                value={SSN}
                onChange={handleSSNChange}
            >
            </TextField>
            <Button
                variant="outlined"
                onClick={handleFormSubmit}
            >
                Authenticate
            </Button>
            <Button
                variant="outlined"
                onClick={handleConnect}
            >
                Connect
            </Button>
            <Button
                variant="outlined"
                onClick={handleBuyNFT}
            >
                Buy NFT
            </Button>
        </FormControl>
    );
}
