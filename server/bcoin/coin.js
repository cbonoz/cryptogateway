const library = (function () {
    const uuidv4 = require('uuid/v4');
    const bcoin = require('bcoin');
    const Client = bcoin.http.Client;
    const Wallet = bcoin.http.Wallet;

    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('db.json');
    const db = low(adapter);

    db.defaults({accounts: []}).write();

    const OWNER_WALLET_ID = 'primaryId';
    const OWNER_ACCOUNT = 'default';

    const client = new Client({
        network: 'testnet',
        uri: 'http://localhost:18332',
        apiKey: 'hunter3',
    });

    const httpWallet = new Wallet({
        network: 'testnet',
        uri: 'http://localhost:18332',
        apiKey: 'hunter3',
        id: OWNER_WALLET_ID
    });

    // {
    //     "wid": 1,
    //     "id": "foo",
    //     "account": 1,
    //     "unconfirmed": "8149.9999546",
    //     "confirmed": "8150.0"
    // }
    async function hasBalance(address, requiredBalance) {
        const receiveAddress = db.get('accounts').find({address: address}).value();
        const response = httpWallet.getBalance(receiveAddress['name']);
        console.log(response);
        const currentBalance = response['confirmed'];
        return currentBalance >= requiredBalance;
    }

    // {
    //     "network": "testnet",
    //     "wid": 1,
    //     "id": "foo",
    //     "name": "default",
    //     "account": 0,
    //     "branch": 0,
    //     "index": 9,
    //     "witness": false,
    //     "nested": false,
    //     "publicKey": "02801d9457837ed50e9538ee1806b6598e12a3c259fdc9258bbd32934f22cb1f80",
    //     "script": null,
    //     "program": null,
    //     "type": "pubkeyhash",
    //     "address": "mwX8J1CDGUqeQcJPnjNBG4s97vhQsJG7Eq"
    // }
    async function createAddress() {
        const accountName = uuidv4();
        const receiveAddress = await httpWallet.createAddress(accountName);
        // Add a new live account to the local db.
        if (receiveAddress) {
            db.get('accounts').push(receiveAddress).write();
            const text = JSON.stringify(receiveAddress);
            console.log('receiveAddress', accountName, text);
            return receiveAddress['address'];
        }
        throw "null receiveAddress from httpWallet.createAddress()"
    }

    return {
        createAddress: createAddress,
        hasBalance: hasBalance,
    }

})();
module.exports = library;

