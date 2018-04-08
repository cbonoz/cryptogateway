let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')

var folderCount = 0;
var ipToAddress={};


//Run This function to find the GCI output by the testnet
function loadGCI() {
    return fs.readFileSync('gci.txt','utf8')
}

//Run this function to connect to the testnet and query for the balances of an account
async function loadBalance(GCI, address) {
    let client = await lotion.connect(GCI)
    accounts = await client.state.accounts
    return accounts[address]['balance']
}

//Run this function when a visitor visits the page
//Generates a new Wallet in a new folder and saves the secret key to a dictionary
//Returns the Secret key
function visitor(ipAddress, client) {
  pathNewFolder = '/home/darwinzhangli/' + folderCount
  let wallet = coins.wallet(pathNewFolder,client)
  secret = fs.readFileSync(pathNewFolder+'/secret', 'utf8')
  if (ipAddress in ipToAddress) {
    return ipToAddress[ipAddress]
  } else {
    ipToAddress[ipAddress] = secret
    return secret
  }
}

async function main() {
    GCI = loadGCI()
    console.log(await loadBalance(GCI, '04oDVBPIYP8h5V1eC1PSc/JU6Vo'))
    let client = await lotion.connect(GCI)
    let wallet = coins.wallet(client)
    // wallet methods:
    let address = wallet.address()
    console.log(address) // 'OGccsuLV2xuoDau1XRc6hc7uO24'
    accounts = await client.state.accounts

    console.log(Object.keys(await client.state.accounts))
    console.log(await client.state.accounts)

    let balance = await wallet.balance()
    console.log(balance) // 20
    
    let result = await wallet.send('04oDVBPIYP8h5V1eC1PSc5JU6Vo', 5)
    console.log(result) // { height: 42 }

}

main()