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
        const account = db.get('addresses').find({address: address}).value();
        // console.log('account', account);
        const accountId = account['name'];

        let history = await getAccountInputHistory(accountId);
        console.log('history', history);
        const transactions = [];
        history = history.map((walletHistory) => {
            const inputs = walletHistory.inputs || [];
            inputs.filter((h) => {
                return h['address'] === address;
            });
        });
        let total = 0;
        transactions.map((t) => {
            total += t['value'];
        });
        console.log('balance', total, history, requiredBalance, accountId);
        requiredBalance = parseFloat(requiredBalance);
        return total >= requiredBalance;
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

    // [
    //     {
    //         "wid": 1,
    //         "id": "primary",
    //         "hash": "f5968051ce275d89b7a6b797eb6e6b081243ecf027872fc6949fae443e21b858",
    //         "height": -1,
    //         "block": null,
    //         "time": 0,
    //         "mtime": 1503690544,
    //         "date": "2017-08-25T19:49:04Z",
    //         "size": 226,
    //         "virtualSize": 226,
    //         "fee": 0,
    //         "rate": 0,
    //         "confirmations": 0,
    //         "inputs": [
    //             {
    //                 "value": 0,
    //                 "address": "mp2w1u4oqZnHDd1zDeAvCTX9B3SaFsUFQx",
    //                 "path": null
    //             }
    //         ],
    //         "outputs": [
    //             {
    //                 "value": 100000,
    //                 "address": "myCkrhQbJwqM8wKi9YuhyTjN3pukNuWxZ9",
    //                 "path": {
    //                     "name": "default",
    //                     "account": 0,
    //                     "change": false,
    //                     "derivation": "m/0'/0/3"
    //                 }
    //             },
    //             {
    //                 "value": 29790920,
    //                 "address": "mqNm1rSYVqD23Aj6fkupApuSok9DNZAeBk",
    //                 "path": null
    //             }
    //         ],
    //         "tx": "0100000001ef8a38cc946c57634c2db05fc298bf94f5c88829c5a6e2b0610fcc7b38a9264f010000006b483045022100e98db5ddb92686fe77bb44f86ce8bf6ff693c1a1fb2fb434c6eeed7cf5e7bed4022053dca3980a902ece82fb8e9e5204c26946893388e4663dbb71e78946f49dd0f90121024c4abc2a3683891b35c04e6d40a07ee78e7d86ad9d7a14265fe214fe84513676ffffffff02a0860100000000001976a914c2013ac1a5f6a9ae91f66e71bbfae4cc762c2ca988acc892c601000000001976a9146c2483bf52052e1125fc75dd77dad06d65b70a8288ac00000000"
    //     },
    //     ...
    // ]
    async function getAccountInputHistory(accountId) {
        const response = await httpWallet.getHistory(accountId);
        console.log('input history', response);
        return response;
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
        getAccountInputHistory: getAccountInputHistory,
        createAccount: createAccount,
        createAddress: createAddress,
        hasBalance: hasBalance,
        httpWallet: httpWallet,
        db: db
    }

})();
module.exports = library;

