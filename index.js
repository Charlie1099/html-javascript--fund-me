import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
    if (window.ethereum !== "undefined"){
       await window.ethereum.request({method: "eth_requestAccounts"})
       console.log("connected!!")
       connectButton.innerHTML = "Connected"
        

    } else {
        connectButton.innerHTML = "Meta Mask is needed!"

    }
}

async function fund(ethAmount){
    console.log(`Funding with ${ethAmount}...`)
    ethAmount = "1"
    if (window.ethereum !== "undefined") {
        //provider/ connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        //signer/wallet
        const signer = provider.getSigner()
        console.log(signer)
        //our contract that we are interacting with

        // ABI & address
        try {
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount),})
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}.....`)
    provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
    })
    //creating a listener 
}