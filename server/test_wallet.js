let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')
let home = require('user-home')
let { join } = require('path')


//Need to initiate folderCount as 0. May not be needed if handling folder path names by hashing serverside
var folderCount = 0

//Run This function to find the GCI output by the testnet
function loadGCI() {
    return fs.readFileSync('gci.txt','utf8')
}

//Run this function to connect to the testnet and query for the balances of an account
async function loadBalance(GCI, address) {
    let client = await lotion.connect(GCI)
    accounts = client.state.accounts
    return await accounts[address]['balance']
}

//Run this function to check if an address has a balance
async function hasBalance(GCI, address) {
  if (await loadBalance(GCI, address) > 0) {
    return true
  } else {
    return false
  }
}

//Run this function to create a new address for a new cookie.
//FOLDERCOUNT is a name or number to uniquely identify the new folder
//Returns a path to a new folder that contains a new Secret Key
//If a secret key already exists in FOLDERCOUNT, then return the same path
//Will be depricated after wallet.js can support buffers for secret keys rather than paths
async function newVisitorSecretKeyFolder(GCI, folderCount) {
  pathNewFolder = join(home, folderCount)
  let client = await lotion.connect(GCI)
  let wallet = coins.wallet(pathNewFolder,client)
  secret = fs.readFileSync(pathNewFolder+'/secret', 'utf8') //Can remove this line
  return pathNewFolder
}

//Run this function to return the address from a secret key path
//May be depricated after wallet.js can support buffers for secret key rathern than paths
async function getAddressFromSecretKeyPath(GCI, pathFolder) {
  let client = await lotion.connect(GCI)
  let wallet = coins.wallet(pathNewFolder,client)
  return wallet.address()
}


//Run this function to connect to the testnet make a transaction of AMOUNT from a secret key using its PATHFOLDER to an ADDRESS
//Returns the transaction hash
async function runTrasaction(GCI, pathFolder, address, amount) {
  let client = await lotion.connect(GCI)
  let wallet = coins.wallet(pathNewFolder,client)
  return await wallet.send(address, amount)
}

async function main() {
    GCI = loadGCI()
    path = await newVisitorSecretKeyFolder(GCI, '1')
    newAddress = await getAddressFromSecretKeyPath(GCI, path)

    for (i = 0; i < 10; i++) {
      let path = await newVisitorSecretKeyFolder(GCI, i.toString())
      let addr = await getAddressFromSecretKeyPath(GCI, path)
      console.log('Wallet ' + addr + ' has ' + await loadBalance(GCI, addr))
    }

    await runTrasaction(GCI,'/home/darwinzhangli/1', '6fod7JwSczeEjoegM7UoEHGt43JG8WBNy', 2)


    for (i = 0; i < 10; i++) {
      let path = await newVisitorSecretKeyFolder(GCI, i.toString())
      let addr = await getAddressFromSecretKeyPath(GCI, path)
      console.log('Wallet ' + addr + ' has ' + await loadBalance(GCI, addr))
    }

}

main()