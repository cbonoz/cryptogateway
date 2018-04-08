const mybcoin = require('./bcoin/coin');

const accountName = 'www_cryptogateway_com_articles';
const address = '2N27DfM51JBzXLZW6Zymk3JmDLLrELLQJt1'

async function test() {
    // const receiveAddress = await mybcoin.httpWallet.createAddress(accountName);
    // console.log('receiveAddress', receiveAddress);
    // return receiveAddress;

    let history = await mybcoin.getAccountInputHistory(accountName);
    console.log('history', history);
    const transactions = [];
    let total = 0;
    history = history.map((walletHistory) => {
        const ts = walletHistory['outputs'] || [];
        ts.map((t) => {
            if(t['address'] === address) {
                total += t['value'] / mybcoin.SATOSHI_PER_BTC
            }
        });
    });
    return total;
}

test().then((res) => console.log('res', res)).catch((err) => {
    console.error('err', err)
});

// const address = ;
// const db = mybcoin.db;
// const account = db.get('addresses').find({address: '2NDdAxEhpLUM5ukPkedPA9mdJSjZc2DXcwT'}).value();
// console.log('account', account);
