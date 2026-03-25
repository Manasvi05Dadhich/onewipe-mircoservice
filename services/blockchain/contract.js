const ethers = require('ethers');
const abi = require('./abi.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function issueCert(hash) {
    try {

        const tx = await contract.issueCert(bytes32hash);
        await tx.wait();
        console.log("Certificate stored on blockchain");
    } catch (error) {
        console.error("Error issuing certificate:", error);
    }
}

async function revokeCert(hash) {
    try {
        const bytes32hash = hash.startsWith('0x') ? hash : '0x' + hash;
        const tx = await contract.revokeCert(bytes32hash);
        await tx.wait();
        console.log("Certificate revoked from blockchain");
    } catch (error) {
        console.error("Error revoking certificate:", error);
    }
}

async function verifyCert(hash) {
    try {
        const bytes32hash = hash.startsWith('0x') ? hash : '0x' + hash;
        const isValid = await contract.verifyCert(bytes32hash);
        console.log("Certificate verified from blockchain");
        return isValid;
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return false;
    }
}
module.exports = { issueCert, revokeCert, verifyCert };