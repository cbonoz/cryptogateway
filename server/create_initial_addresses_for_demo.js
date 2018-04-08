let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')
let home = require('user-home')
let { join } = require('path')

//Run This function to find the GCI output by the testnet
function loadGCI() {
    return fs.readFileSync('gci_demo.txt','utf8')
}


const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('cosmos.json');
const db = low(adapter);
db.defaults({addresses: []}).write();


async function main() {
  GCI = loadGCI()
  let client = await lotion.connect(GCI)
  let wallet = coins.wallet(client)

  // wallet methods:
  //This is needed to populate the blockchain with wallets for use for the demo since initiating a new wallet is not changing the state of the blockchain
  for (i = 0; i < 10; i ++) {
    pathNewFolder = join(home, i.toString())
    let tempwallet = coins.wallet(pathNewFolder, client)
    let data = {address: tempwallet.address(), balance: i*10}
    db.get('addresses').push(data).write()
  }

  const allData = db.get('addresses').values()
  console.log('addData', JSON.stringify(allData))

}

main()