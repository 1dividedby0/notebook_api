import { Web3Storage, getFilesFromPath } from './node_modules/@web3-storage'
async function upload() {
    let token = "{{token}}";
    let file_paths_string = "{{file_paths_string}}";
    if (!token) {
        return console.error('A token is needed. You can create one on https://web3.storage')
    }
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