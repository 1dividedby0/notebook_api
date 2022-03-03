import {
    useEffect,
    useState,
} from "react";
import { Button, TextField, FormControl } from "@material-ui/core";
import { AUTH_MANAGER_CONTRACT, BACKEND_REQUEST_HOST, SHARD_A_ADDRESS, SHARD_B_ADDRESS, SHARD_C_ADDRESS, TOKEN_MANAGER_CONTRACT, NFT_ADDRESS, ABI_NFT_CONTRACT, ABI_TOKEN_CONTRACT, ABI_AUTHENTICATE } from "./constants";
var bigInt = require("big-integer");

const Web3 = require('web3');
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

    function approveAndBuyNFT() {
        const wallet_address = window.ethereum.selectedAddress;
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractToken = new web3.eth.Contract(ABI_TOKEN_CONTRACT, TOKEN_MANAGER_CONTRACT, call_params);
        contractToken.methods.approve(NFT_ADDRESS, 1000000000000).send().then(function (receipt) {
            buyNFT();
        });
    }

    function buyNFT() {
        const wallet_address = window.ethereum.selectedAddress;
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractNFT = new web3.eth.Contract(ABI_NFT_CONTRACT, NFT_ADDRESS, call_params);
        contractNFT.methods.mint(TOKEN_MANAGER_CONTRACT, wallet_address.toString(), Math.floor(Math.random() * 100), Math.random().toString()).send()
    }

    function authenticate() {
        const wallet_address = window.ethereum.selectedAddress;
        let shards = shard(wallet_address);

        let name = Math.random() * 100000;

        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };

        var contractShardA = new web3.eth.Contract(ABI_AUTHENTICATE, SHARD_A_ADDRESS, call_params);
        contractShardA.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[0], name.toString()).send();

        var contractShardB = new web3.eth.Contract(ABI_AUTHENTICATE, SHARD_B_ADDRESS, call_params);
        contractShardB.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[1], name.toString()).send();

        var contractShardC = new web3.eth.Contract(ABI_AUTHENTICATE, SHARD_C_ADDRESS, call_params);
        contractShardC.methods.authenticate(AUTH_MANAGER_CONTRACT, TOKEN_MANAGER_CONTRACT, shards[2], name.toString()).send().then(approveAndBuyNFT);
    }

    function handleAuthenticate(event) {
        if (typeof window.ethereum !== 'undefined') {
            console.log(window.ethereum);
        }

        if (window.ethereum.selectedAddress == null) {
            web3.eth.requestAccounts().then(authenticate);
        } else {
            authenticate();
        }

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
                onClick={handleAuthenticate}
            >
                Create Notebook
            </Button>
        </FormControl>
    );
}
