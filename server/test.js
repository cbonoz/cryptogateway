const bcoin = require('bcoin')
const Client = bcoin.http.Client;
const Wallet = bcoin.http.Wallet;

const client = new Client({
    network: 'testnet',
    uri: 'http://localhost:18332',
    apiKey: 'hunter3',
});

const wallet = new Wallet({
    network: 'testnet',
    uri: 'http://localhost:18332',
    apiKey: 'hunter3',
    id: 'primary'
});

(async () => {
    const wallets = await client.getWallets();
    console.log(wallets)
})();


id='foo1'
passphrase='bar'
witness='false'

const options = {
    id: id,
    passphrase: passphrase,
    witness: witness,
    watchOnly: true,
    accountKey: accountKey
};

(async() => {
    const newWallet = await client.createWallet(options)
    console.log('new wallet', newWallet)
})();


// (async () => {
//     const wallet = await httpWallet.getInfo();
//     console.log(wallet);
// })();


// let account='bar';
// const httpWallet = bcoin.http.Wallet({ id: id });

// (async () => {
//     const response = httpWallet.getBalance(account);
//     console.log(response);
// })();