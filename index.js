import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = documnet.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (window.ethereum !== "undefined"){
       await window.ethereum.request({method: "eth_requestAccounts"})
       console.log("connected!!")
       connectButton.innerHTML = "Connected"
        

    } else {
        connectButton.innerHTML = "Meta Mask is needed!"

    }
}

async function getBalance () {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund(){
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}...`)
    
    if (window.ethereum !== "undefined") {
        //provider/ connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        //signer/wallet
        const signer = provider.getSigner()
        console.log(signer)
        //our contract that we are interacting with
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // ABI & address
        try {
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount),})
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
      }
}
//creating a listener
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        )
        resolve()
      })
    })
  }

 async function withdraw() {
    if(typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse. provider)

      } catch(error) {
        console.log(error)
      }
    }
  }