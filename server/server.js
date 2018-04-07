'use strict';

const Hapi = require('hapi');
const coin = require('./coin/coin');
const client = coin.client();

const CLIENT_PORT = 3232;

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
// account: {publicKey, privateKey, address}
db.defaults({ accounts: [] }).write();

const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

const COOKIE_KEY = 'cgpayment';
const ALLOWED_VIEWS = 3;

// ---------------------------------
// Blockchain interaction functions
// ---------------------------------

// Check if the address has (at least) the required balance, return true or false.
function hasBalance(address, requiredBalance) {
    const currentBalance = client.getBalance(address);
    return currentBalance >= requiredBalance;
}

// ---------
// Web part
// ---------

// Configure the cookie
// The cookie will store the payment address we generated for this browser
server.state(COOKIE_KEY, {
    ttl: null, // can be millisec, this is per-session for easy testing
    //isSecure: true, // TODO: Makes the cookie HTTPS only - enable in production
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

// Add our validate pay API route
server.route({
    method: 'GET',
    path: '/validate-pay/{amount?}',
    handler: function (request, h) {

        // Receive required amount as a parameter
        const amount = request.params.amount;
        if (!amount) {
            return h.response("Invalid request, please specify amount").code(400);
        }

        // If no cookie exists, create a blockchain address, return it to the caller, and set it as the cookie
        const cookieVal = request.state[COOKIE_KEY];

        // no cookie present or generated yet.
        let payload;
        if (!cookieVal) {
            const privateKey = client.generatePrivateKey();
            const publicKey = client.generatePublicKey(privateKey);
            const paymentAddress = client.generateAddress(publicKey);
            payload = {sendPaymentTo: paymentAddress, viewCount: 0};
            // Add a new live account to the local db.
            db.get('accounts').push({ address: paymentAddress, publicKey: publicKey, privateKey: privateKey}).write();
        } else {
            payload = cookieVal;
        }

        // Note that we don't validate cookie structure for now...
        payload.viewCount += 1;
        if (hasBalance(payload.sendPaymentTo, amount) || payload.viewCount <= ALLOWED_VIEWS) {
            return h.response("Authorized").code(200).state(COOKIE_KEY, payload);
        } else {
            // Else not authorized.
            // For now the client can't tell if the address is new or not. We can change this if needed
            return h.response(payload).code(403).state(COOKIE_KEY, payload);
        }
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
};

start();
