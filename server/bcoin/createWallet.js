/**
 * Created by cbuonocore on 4/7/18.
 */

/*
 * Script to create a new primary owner's for addresses for the CryptoGateway account server.
 */
const bcoin = require('bcoin')
const Client = bcoin.http.Client;
const Wallet = bcoin.http.Wallet;
const fs = require('fs');

const client = new Client({
    network: 'testnet',
    uri: 'http://localhost:18332',
    apiKey: 'hunter3',
});

// Enter your values here.
id='primaryId'
passphrase='passphrase'
witness='false'
accountKey='tpubDDh2XgSds1vBbeVgye88gsGQeCityoywRndtyrXcmvWqCgsFUyUKwzeDv8HiJhu9fC8jRAFMqxr4jj8eRTNTycmMao5wmsAScVf4jSMdPYZ'

const options = {
    id: id,
    passphrase: passphrase,
    witness: witness,
    watchOnly: true,
    accountKey: accountKey
};

(async() => {
    const newWallet = await client.createWallet(options)
    // Save this information.
    console.log('created owner wallet', newWallet)
    const walletInfo = JSON.stringify(newWallet);
    const walletFile = "./bcoin/wallet.json";
    fs.writeFile(walletFile, walletInfo, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Saved file: ", walletFile);
    });
})();


