import {
    useEffect,
    useState,
    useContext
} from "react";
import { Button, FormControl } from "@material-ui/core";
// import { NotebookContext } from "./data";
import { Web3Storage } from 'web3.storage'
import { ETHERSCAN_APIKEY, NFT_CONTRACT, STORAGE_TOKEN, ABI_NFT_CONTRACT } from "./constants";
import { NotebookContext } from "./data";

const Web3 = require('web3');
var web3 = new Web3(window.ethereum);

const storage = new Web3Storage({ STORAGE_TOKEN });

export default function LoginForm() {
    const [notebook, setNotebook] = useContext(NotebookContext);
    const [logs, setLogs] = useState();

    async function upload(newLogs) {
        const wallet_address = window.ethereum.selectedAddress;
        // add new files to files
        var files = [];
        console.log(`Uploading ${logs.length + newLogs.length} logs`)
        for (var i = 0; i < logs.length + newLogs.length; i++) {
            var file_name = Math.random() * 10000000;
            files.push(new File([logs.concat(newLogs)[i]], `${file_name}`));
        }
        const newCID = await storage.put(files);

        setLogs(logs.concat(newLogs));
        // update notebook contract cid
        console.log('Content added with CID:', newCID);
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractNFT = new web3.eth.Contract(ABI_NFT_CONTRACT, NFT_CONTRACT, call_params);
        contractNFT.methods.pushRootCID(notebook, newCID).send();
    }

    async function getLogsFromCID(rootCID) {
        const res = await client.get(rootCID)
        const files = await res.files()
        for (const file of files) {
            console.log(`${file.cid} ${file.name} ${file.size}`);
            console.log(file);
        }
        setLogs(files);
    }

    async function getLogs() {
        // get cid of notebook from notebook contract
        const wallet_address = window.ethereum.selectedAddress;
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractNFT = new web3.eth.Contract(ABI_NFT_CONTRACT, NFT_CONTRACT, call_params);
        contractNFT.methods.pullRootCID(notebook).send().then(getLogsFromCID);
    }

    async function handleGetNFT(event) {
        const wallet_address = window.ethereum.selectedAddress;
        const api_addr = `https://api-kovan.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${NFT_CONTRACT}&address=${wallet_address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_APIKEY}`;
        const response = await fetch(api_addr);
        const data = await response.json();
        console.log(data);
        setNotebook(data["hash"]);
        event.preventDefault();
    }

    async function handleRequestLoan(event) {
        const wallet_address = window.ethereum.selectedAddress;
        upload([`${wallet_address} requested a loan of $10k.`]);
        event.preventDefault();
    }

    async function handleDefaultLoan(event) {
        const wallet_address = window.ethereum.selectedAddress;
        upload([`${wallet_address} defaulted on their latest loan.`]);
        event.preventDefault();
    }

    useEffect(() => {
        if (notebook != null) {
            const retrievedLogs = getLogs();
            setLogs(retrievedLogs);
        }
    }, [notebook]);

    return (
        <FormControl>
            <Button variant="outlined" onClick={handleGetNFT}>Sign in with Notebook</Button>
            <Button variant="outlined" onClick={handleRequestLoan}>Request Loan</Button>
            <Button variant="outlined" onClick={handleDefaultLoan}>Default on Loan</Button>
        </FormControl>
    );
}