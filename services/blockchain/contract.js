const ethers = require('ethers');
const abi = ('./abi.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function issueCert(hash) {
    try {
        const tx = await contract.issueCert(hash);
        await tx.wait();
        console.log("Certificate stored on blockchain");
    } catch (error) {
        console.error("Error storing certificate:", error);
    }
}

async function revokeCert(hash) {
    try {
        const tx = await contract.revokeCert(hash);
        await tx.wait();
        console.log("Certificate revoked from blockchain");
    } catch (error) {
        console.error("Error revoking certificate:", error);
    }
}

async function verifyCert(hash) {
    try {
        const isValid = await contract.verifyCert(hash);
        console.log("Certificate verified from blockchain");
        return isValid;
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return false;
    }
}
module.exports = { issueCert, revokeCert, verifyCert };
