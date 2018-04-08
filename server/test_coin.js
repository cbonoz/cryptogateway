let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')

let home = require('user-home')
let { join } = require('path')

let app = lotion({ initialState: {}, devMode: true })

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('cosmos.json');
const db = low(adapter);

const addressMap = {};
const values = db.get('addresses').value();
values.map((entry) => {
  addressMap[entry.address] = entry.balance;
})

console.log('addressMap', addressMap)

app.use(coins({
  name: 'testcoin',
  initialBalances: addressMap
}))


//If you listen on the port for tendermint and then hit slash, you can get a list of everything you can query from tendermint
app.listen(3002).then(function(appInfo) {
    console.log(appInfo)
    fs.writeFileSync('gci.txt',getGCI(appInfo),'utf8')
})


//This returns the Glboal Chain Index for the current run
function getGCI(appInfo) {
  return appInfo['GCI']
}