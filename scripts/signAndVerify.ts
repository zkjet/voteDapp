import { ethers } from "hardhat";
require("dotenv").config();

async function main() {
    const  pk = process.env.PRIVATE_KEY_CHRIS;
    if(!pk || pk.length <= 0) throw new Error("Missing environment: private key");
    const signer = new ethers.Wallet(pk);

    // process.env.REQUEST_MESSAGE === "REQUEST"
    if(process.env.REQUEST_MESSAGE) {
        //frontend signing
        let sigRequest = await signer.signMessage(process.env.REQUEST_MESSAGE);
        console.log(`signature ${sigRequest} generated by address ${signer.address}`);

        //backend verification
        let address = await ethers.utils.verifyMessage(process.env.REQUEST_MESSAGE, sigRequest);
        if(address === signer.address) {
            console.log(`signature verified for address ${address}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
