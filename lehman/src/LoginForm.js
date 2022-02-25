import {
    useEffect,
    useState,
} from "react";
import { Button, TextField, FormControl } from "@material-ui/core";
import { NotebookContext } from "./data";
import { Web3Storage, getFilesFromPath } from './node_modules/web3.storage'
import { ETHERSCAN_APIKEY, NFT_CONTRACT, STORAGE_TOKEN } from "./constants";

async function upload() {
    let token = STORAGE_TOKEN;
    let file_paths = file_paths_string.split(",");
    if (file_paths.length < 1) {
        return console.error('Please supply the path to a file or directory')
    }

    const storage = new Web3Storage({ token })
    console.log(token);
    const files = []

    for (const path of file_paths) {
        const pathFiles = await getFilesFromPath(path)
        files.push(...pathFiles)
    }

    console.log(`Uploading ${files.length} files`)
    const cid = await storage.put(files)
    console.log('Content added with CID:', cid)
}

async function handleGetNFT(event) {
    const wallet_address = window.ethereum.selectedAddress;
    const api_addr = `https://api-kovan.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${NFT_CONTRACT}&address=${wallet_address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_APIKEY}`;
    const response = await fetch(api_addr);
    const data = await response.json();
}

export default function LoginForm() {
    return (
        <Button onClick={handleGetNFT}>Sign in with Notebook</Button>
    );
}