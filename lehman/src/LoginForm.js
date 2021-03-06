import {
    useEffect,
    useState,
    useContext
} from "react";
import { Button, FormControl } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
// import { NotebookContext } from "./data";
import { Web3Storage } from 'web3.storage'
import { ETHERSCAN_APIKEY, NFT_CONTRACT, STORAGE_TOKEN, ABI_NFT_CONTRACT } from "./constants";
import { NotebookContext } from "./data";

var bigInt = require("big-integer");

const Web3 = require('web3');
var web3 = new Web3(window.ethereum);

const storage = new Web3Storage({ token: STORAGE_TOKEN });

export default function LoginForm() {
    const [notebook, setNotebook] = useContext(NotebookContext);
    const [logs, setLogs] = useState([]);

    async function upload(newLogs) {
        const wallet_address = window.ethereum.selectedAddress;
        // add new files to files
        var files = [];
        console.log(`Uploading ${logs.length + newLogs.length} logs`)
        for (var i = 0; i < logs.length + newLogs.length; i++) {
            var file_name = Math.random() * 10000000;
            files.push(new File([logs.concat(newLogs)[i].text], `${file_name}`));
        }
        const newCID = await storage.put(files);

        var newLogsRows = [];
        for (let log of newLogs) {
            newLogsRows.push({ "id": newCID, "text": log });
        }

        setLogs(logs.concat(newLogsRows));
        // update notebook contract cid
        console.log('Content added with CID:', newCID);
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractNFT = new web3.eth.Contract(ABI_NFT_CONTRACT, NFT_CONTRACT, call_params);
        contractNFT.methods.pushRootCID(notebook, newCID).send();
    }

    async function getLogsFromCID(rootCID) {
        console.log(rootCID)
        const res = await storage.get(rootCID)
        if (!res.ok) {
            setLogs([]);
            return;
        }
        const files = await res.files()
        var logs_rows = [];
        for (const file of files) {
            console.log(`${file.cid} ${file.name} ${file.size}`);
            console.log(file);
            logs_rows.push({ "id": file.cid, "text": file.name });
        }
        setLogs(logs_rows);
    }

    async function getLogs() {
        // get cid of notebook from notebook contract
        const wallet_address = window.ethereum.selectedAddress;
        let call_params = { from: wallet_address, gasPrice: 20000000000, gas: 4000000 };
        var contractNFT = new web3.eth.Contract(ABI_NFT_CONTRACT, NFT_CONTRACT, call_params);
        console.log(notebook);
        contractNFT.methods.pullRootCID(notebook).call(function (err, res) {
            console.log(err);
            getLogsFromCID(res);
        });
    }

    async function handleGetNFT(event) {
        const wallet_address = window.ethereum.selectedAddress;
        const api_addr = `https://api-kovan.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${NFT_CONTRACT}&address=${wallet_address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_APIKEY}`;
        const response = await fetch(api_addr);
        const data = await response.json();
        console.log(data);
        setNotebook(web3.utils.toBN(data["result"][0]["hash"]));
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
            getLogs();
        }
    }, [notebook]);

    const columns = [
        {
            field: "id", headerName: "ID", width: 1000,
            field: "text", headerName: "Transaction", width: 1000
        }
    ]

    return (
        <div>
            <FormControl>
                <Button variant="outlined" onClick={handleGetNFT}>Sign in with Notebook</Button>
                <Button variant="outlined" onClick={handleRequestLoan}>Request Loan</Button>
                <Button variant="outlined" onClick={handleDefaultLoan}>Default on Loan</Button>
            </FormControl>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={logs}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
}