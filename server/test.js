const mybcoin = require('./bcoin/coin');

const accountName = 'wwwcryptogatewaycom';

async function test() {
    const receiveAddress = await mybcoin.httpWallet.createAddress(accountName);
    console.log('receiveAddress', receiveAddress);
    return receiveAddress;
}

// mybcoin.createAddress(accountName).then((res) => console.log('res', res)).catch((err) => {console.error('err', err)});

// const address = ;
const db = mybcoin.db;
const account = db.get('addresses').find({address: '2Mw28wAfJ6qdofSM28fe7gCxfZBG7WTKGkW'}).value();
console.log('account', account);
