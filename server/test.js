const mybcoin = require('./bcoin/coin');



async function test() {
    const accountName = "testdfdf";
    const receiveAddress = await mybcoin.httpWallet.createAddress(accountName);
    console.log('receiveAddress', receiveAddress)
}

test().then((res) => console.log('res', res)).catch((err) => {console.error('err', err)})
