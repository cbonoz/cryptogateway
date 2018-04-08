const mybcoin = require('./bcoin/coin');

const accountName = 'defasult';

async function test() {
    const receiveAddress = await mybcoin.httpWallet.createAddress(accountName);
    console.log('receiveAddress', receiveAddress);
    return receiveAddress;
}

mybcoin.getAccount(accountName).then((res) => console.log('res', res)).catch((err) => {console.error('err', err)});
