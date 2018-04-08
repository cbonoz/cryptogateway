const library = (function () {
    const uuidv4 = require('uuid/v4');
    const bcoin = require('bcoin');
    const Client = bcoin.http.Client;
    const Wallet = bcoin.http.Wallet;

    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('db.json');
    const db = low(adapter);

    // Initialize local server db (if needed).
    // OWNER_WALLET_ID: wallet id owned by us - cryptogateway
    //      -> accounts: Customer Company Accounts (ex: forbes.com)
    //             -> addresses: Individuals (site visitors).
    db.defaults({accounts: [], addresses: []}).write();

    const OWNER_WALLET_ID = 'primaryId';
    const ACCOUNT_TYPE = 'multisig';
    // TODO: remove
    const PASSPHRASE = 'passphrase';

    const httpWallet = new Wallet({
        network: 'testnet',
        uri: 'http://localhost:18332',
        apiKey: 'hunter3',
        id: OWNER_WALLET_ID
    });

    const client = new Client({
        network: 'testnet',
        uri: 'http://localhost:18332',
        apiKey: 'hunter3',
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
        // console.log(response);
        const currentBalance = response['unconfirmed']; // get the unconfirmed balance (to include pending).
        return currentBalance >= requiredBalance;
    }

    // {
    //     "wid": 1,
    //     "id": "test",
    //     "name": "menace",
    //     "initialized": true,
    //     "witness": false,
    //     "watchOnly": false,
    //     "type": "multisig",
    //     "m": 1,
    //     "n": 1,
    //     "accountIndex": 1,
    //     "receiveDepth": 1,
    //     "changeDepth": 1,
    //     "nestedDepth": 0,
    //     "lookahead": 10,
    //     "receiveAddress": "mg7b3H3ZCHx3fwvUf8gaRHwcgsL7WdJQXv",
    //     "nestedAddress": null,
    //     "changeAddress": "mkYtQFpxDcqutMJtyzKNFPnn97zhft56wH",
    //     "accountKey": "tpubDC5u44zLNUVo55dtQsJRsbQgeNfrp8ctxVEdDqDQtR7ES9XG5h1SGhkv2HCuKA2RZysaFzkuy5bgxF9egvG5BJgapWwbYMU4BJ1SeSj916G",
    //     "keys": []
    // }
    async function createAccount(accountId) {
        const options = {
            type: ACCOUNT_TYPE,
            passphrase: PASSPHRASE,
            witness: 'false',
            watchOnly: true,
        };
        const account = await httpWallet.createAccount(accountId, options);
        db.get('accounts').push(account).write();
        // console.log(account);
        return account['name'];
    }

    // {
    //     "wid": 1,
    //     "id": "test",
    //     "name": "default",
    //     "initialized": true,
    //     "witness": false,
    //     "watchOnly": false,
    //     "type": "pubkeyhash",
    //     "m": 1,
    //     "n": 1,
    //     "accountIndex": 0,
    //     "receiveDepth": 8,
    //     "changeDepth": 1,
    //     "nestedDepth": 0,
    //     "lookahead": 10,
    //     "receiveAddress": "mu5Puppq4Es3mibRskMwoGjoZujHCFRwGS",
    //     "nestedAddress": null,
    //     "changeAddress": "n3nFYgQR2mrLwC3X66xHNsx4UqhS3rkSnY",
    //     "accountKey": "tpubDC5u44zLNUVo2gPVdqCbtX644PKccH5VZB3nqUgeCiwKoi6BQZGtr5d6hhougcD6PqjszsbR3xHrQ5k8yTbUt64aSthWuNdGi7zSwfGVuxc",
    //     "keys": []
    // }
    async function getAccount(accountId) {
        const accountInfo = await client.getAccount(OWNER_WALLET_ID, accountId);
        // console.log(accountInfo);
        return accountInfo;
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
    async function createAddress(accountId) {
        const receiveAddress = await httpWallet.createAddress(accountId);
        // Add a new live account to the local db.k
        db.get('addresses').push(receiveAddress).write();
        // const text = JSON.stringify(receiveAddress);
        console.log('receiveAddress', accountId);
        return receiveAddress['address'];
    }

    return {
        getAccount: getAccount,
        createAccount: createAccount,
        createAddress: createAddress,
        hasBalance: hasBalance,
        httpWallet: httpWallet
    }

})();
module.exports = library;

