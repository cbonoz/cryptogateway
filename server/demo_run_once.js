let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')

let home = require('user-home')
let { join } = require('path')

let app = lotion({ initialState: {}, devMode: true })



app.use(coins({
  name: 'testcoin',
  initialBalances: {
    // map addresses to balances
    'aSQK5GzNyWFJn7s1U5CpcNUZqQpen3BA': 10,
    'bSQK5GzNyWFJn7s1U5CpcNUZqQpen3BA': 20,
    'cSQK5GzNyWFJn7s1U5CpcNUZqQpen3BA':30
  }
}))

//If you listen on the port for tendermint and then hit slash, you can get a list of everything you can query from tendermint
app.listen(3000).then(function(appInfo) {
    console.log(appInfo)
    fs.writeFileSync('gci_demo.txt',getGCI(appInfo),'utf8')
})


//This returns the Glboal Chain Index for the current run
function getGCI(appInfo) {
  return appInfo['GCI']
}