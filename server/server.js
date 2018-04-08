'use strict';

const Hapi = require('hapi');
const mybcoin = require('./bcoin/coin');
const cosmos = require('./cosmos_wallet');
//const mybcoin = require('./bcoin/coin_mock');
const SERVER_PORT = 3001;

const server = Hapi.server({
    host: 'localhost',
    port: SERVER_PORT,
    routes: {cors: {origin: ['*'], credentials: true}}
});

const SESSION_KEY = 'cgpayment';

const GCI = cosmos.loadGCI();

// ----------------------
// Client-facing portion 
// ----------------------

// Session object structure:
// {
//  wallet: {
//    "cosmosAddress": "STRING" // Cosmos adress of the user on the cosmos sidechain
//    "mediaCreditAddress": "STRING" // Bitcoin address for the user to charge their credit to
//  },
//  publishers: {
//   "Washington Post": { 
//    address: "0xBADABADA"
//    amount: 3,
//    requestedAt: 1523158005415 // time from Date.now() when requested (millisecs since Jan 1st 1970)
//   },
//   "New-York Times": { 
//    address: "0xBADABBBB"
//    amount: 5,
//    requestedAt: 1523157803067
//   },
//  ....
//  }
// }

function createJson(msg) {
    return {message: msg};
}

function btoa(s) {
    if (s) {
        return Buffer.from(s).toString('base64');
    }
    return '';
}

function atob(s) {
    if (s) {
        return Buffer.from(s, 'base64').toString();
    }
    return '';
}

// Validate pay API call (bcoin-based - phase 1)
server.route({
    method: 'GET',
    path: '/validate-pay/{publisher}/{amount}',
    handler: async function (request, h) {
        // *** Parameter validation ***
        console.log('validate-pay');

        // Receive required amount as a parameter
        const amount = request.params.amount;
        if (!amount) {
            return h.response(createJson("Invalid request, please specify amount")).code(400);
        }

        // Receive publisher name
        const publisher = request.params.publisher;
        console.log('publisher', publisher);
        if (!publisher) {
            return h.response(createJson("Invalid request, please specify publisher")).code(400);
        }

        const sessionData = request.yar.get(SESSION_KEY) || {publishers: {}};

        console.log('Current session data', sessionData);

        const thisPublisherEntry = sessionData.publishers[publisher];

        // Reusable handler bits
        const returnError = (type, err) => {
            let msg = `Server - error ${type} for publisher ${publisher}: ${JSON.stringify(err)}`;
            console.log(msg);
            return h.response(createJson(msg)).code(500);
        };

        const createAddress = (accountId) => {
          return mybcoin.createAddress(accountId).then((paymentAddress) => {
            console.log('Server - generated payment address: ', JSON.stringify(paymentAddress));
            sessionData.publishers[publisher] = {
              amount: amount,
              address: paymentAddress,
              requestedAt: Date.now()
            };
            request.yar.set(SESSION_KEY, sessionData);
            const data = { sendPaymentTo: paymentAddress, firstVisit: true };
            console.log('returning data', data);
            return h.response(data).code(403);
          }).catch((err) => returnError("creating address", err));
        };

        // Actual handler logic

        if (!thisPublisherEntry || !thisPublisherEntry.address) {
            // First time user sending this, generate a publisher accout (if needed) and a payment address for the user
            const accountId = publisher;
            return mybcoin.getAccount(accountId).then((res) => {
                if (!res) {
                    // Account does not exist - create it first, then the address
                    return mybcoin.createAccount(accountId)
                      .then(() => createAddress(accountId))
                      .catch((err) => returnError("creating account", err));
                } else {
                    // Account already exists - create the new address.
                    return createAddress(accountId);
                }
            }).catch((err) => returnError("getting account", err));
        } else {
            // Entry exists and hence payment address is defined, check for sufficient balance at that address.
            console.log('publisher', thisPublisherEntry);
            return mybcoin.hasBalance(thisPublisherEntry['address'], thisPublisherEntry['amount']).then((res) => {
                if (res) {
                    console.log('hasBalance', res);
                    return h.response(createJson("Authorized")).code(200);
                } else {
                    console.log('sending 403', res);
                    return h.response({ sendPaymentTo: thisPublisherEntry['address'], firstVisit: false}).code(403);
                }
            }).catch((err) => returnError("checking balance", err));
        }
    }
});

// Return a list of bcoin payment requests and whether they were made
server.route({
    method: 'GET',
    path: '/payments/list',
    handler: async function (request, h) {
        const sessionData = request.yar.get(SESSION_KEY);
        if (!sessionData) {
            return h.response([]);
        }

        let payments = [];
        Object.keys(sessionData.publishers).forEach(async (k) => {
            let entry = sessionData.publishers[k];
            let hasBalance = await mybcoin.hasBalance(entry.address, entry.amount);
            payments.push({publisher: k, amount: entry.amount, paid: hasBalance, requestedAt: entry.requestedAt});
        });

        return h.response(payments).code(200);
    }
});

/// *** CryptoGateway Loading API: Micro-transactions via Cosmos - Phase 2 ***

// *** Cosmos wallet ***

const hasCosmosAddressInSession = (sessionData) => (sessionData && sessionData.wallet && sessionData.wallet.cosmosAddress);

const createCosmosAddress = async (folder) => {
  return await cosmos.getAddressFromSecretKeyPath(GCI, await cosmos.newVisitorSecretKeyFolder(GCI, folder));
};

const MEDIA_CREDIT_ACCOUNT = "MediaCredit";

const DEMO_PUBLISHER_PATH_FOLDER = '0';
const DEMO_USER_PATH_FOLDER = '1';

// Show the MediaCredit balance and wallet info. Use this to get the bitcoin address to charge, and know your current balance
server.route({
    method: 'GET',
    path: '/wallet-info',
    handler: async function (request, h) {

        const returnError = (type, err) => {
          let msg = `Server - error ${type}: ${JSON.stringify(err)}`;
          console.log(msg);
          return h.response(createJson(msg)).code(500);
        };

        const sessionData = request.yar.get(SESSION_KEY);
        if (!hasCosmosAddressInSession(sessionData)) {
          // 1. Generate a new cosmos address
          let cosmosAddress = createCosmosAddress(DEMO_USER_PATH_FOLDER);

          // 2. Generate bitcoin address for the user to charge bitcoin into
          let bitcoinAddress =
            await mybcoin.createAccount(MEDIA_CREDIT_ACCOUNT)
              .then(() => createAddress(MEDIA_CREDIT_ACCOUNT))
              .catch((err) => returnError("creating media credit bitcoin address", err));

          sessionData.wallet = {
            cosmosAddress: cosmosAddress,
            mediaCreditAddress: bitcoinAddress
          };

          request.yar.set(SESSION_KEY, sessionData);
          
          return h.response({ balance: 0, mediaCreditAddress: bitcoinAddress }).code(200);
        }

        // We have a cosmos address - return balance (also return the bitcoin charge address in case the user wants to add more funds)

        return h.response({
          mediaCreditAddress: sessionData.wallet.mediaCreditAddress,
          balance: await cosmos.loadBalance(GCI, sessionData.wallet.cosmosAddress)
        }).code(200);
    }
});

// Performs a micro-payment to a publisher. Note that it's a POST request.
server.route({
    method: 'POST',
    path: '/micro-pay/{publisher}/{amount}',
    handler: async function (request, h) {
        const sessionData = request.yar.get(SESSION_KEY);
        if (!hasCosmosAddressInSession(sessionData)) {
            return h.response("Unknown user").code(400);
        }

        const amount = request.params.amount;
        if (!amount) {
            return h.response(createJson("Invalid request, please specify amount")).code(400);
        }

        const publisher = request.params.publisher;
        if (!publisher) {
            return h.response(createJson("Invalid request, please specify publisher")).code(400);
        }

        let publisherAddress = createCosmosAddress(DEMO_PUBLISHER_PATH_FOLDER);
        let success = await cosmos.runTransaction(GCI, DEMO_USER_PATH_FOLDER, publisherAddress, amount);
        return h.response({ success: success }).code((success) ? 200 : 400);
    }
});

// Start the server
async function start() {

    try {
        // Configure the session
        // We save payment requests in the session structure. yar automatically uses cookie data + server-side storage as needed
        // We need to store payment requests + generated addresses
        await server.register({
            plugin: require('yar'),
            options: {
                storeBlank: false,
                cookieOptions: {
                    password: 'crypto-gateway-super-long-secret-password-string',
                    ttl: null, // can be millisec, this is per-session for easy testing
                    //isSecure: true, // Makes the cookie HTTPS only - enable in production
                    isSecure: false,
                    /*
                     isHttpOnly: true,
                     encoding: 'base64json',
                     clearInvalid: false, // remove invalid cookies
                     strictHeader: false // don't allow violations of RFC 6265
                     */
                }
            }
        });
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
}

start();
