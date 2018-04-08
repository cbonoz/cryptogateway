let lotion = require('lotion')
let coins = require('coins')
let fs = require('fs')

let app = lotion({ initialState: {}, devMode: true })

app.use(coins({
  name: 'testcoin',
  initialBalances: {
    // map addresses to balances
    '04oDVBPIYP8h5V1eC1PSc/JU6Vo': 10,
    'OGccsuLV2xuoDau1XRc6hc7uO24': 20,
    'gSQK5GzNyWFJn7s1U5CpcNUZqQpen3BA':30
  }
}))

//If you listen on the port for tendermint and then hit slash, you can get a list of everything you can query from tendermint
app.listen(3000).then(function(appInfo) {
    console.log(appInfo)
    fs.writeFileSync('gci.txt',getGCI(appInfo),'utf8')
})


//This returns the Glboal Chain Index for the current run
function getGCI(appInfo) {
  return appInfo['GCI']
}