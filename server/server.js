'use strict';

const Hapi = require('hapi');
const mybcoin = require('./bcoin/coin');
const SERVER_PORT = 3001;

const server = Hapi.server({
    host: 'localhost',
    port: SERVER_PORT,
    routes: {cors: {origin: ['*']}}
});

const SESSION_KEY = 'cgpayment';

// ----------------------
// Client-facing portion 
// ----------------------

// Session object structure:
// {
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

// Add our validate pay API route
server.route({
    method: 'GET',
    path: '/validate-pay/{publisher}/{amount}',
    handler: async function (request, h) {

        // *** Parameter validation ***

        // Receive required amount as a parameter
        const amount = request.params.amount;
        if (!amount) {
            return h.response("Invalid request, please specify amount").code(400);
        }

        // Receive publisher name
        let publisher = request.params.publisher;
        publisher = publisher.replace(".", "");
        if (!publisher) {
            return h.response("Invalid  request, please specify publisher").code(400);
        }

        let sessionData = request.yar.get(SESSION_KEY);

        if (!sessionData) {
            // First-time user - generate fresh session data
            sessionData = {publishers: {}};
        }

        console.log('Current session data', sessionData);

        const thisPublisherEntry = sessionData.publishers[publisher];

        // Reusable handler bits

        const returnError = (type, err) => {
            let msg = `Server - error ${type} for publisher ${publisher}: ${JSON.stringify(err)}`;
            console.log(msg);
            return h.response(msg).code(500);
        };

        const createAddress = (accountId, firstVisit) => {
          return mybcoin.createAddress(accountId).then((paymentAddress) => {
            console.log('Server - generated payment address: ', JSON.stringify(paymentAddress));
            sessionData.publishers[publisher] = {
              amount: amount,
              address: paymentAddress,
              requestedAt: Date.now()
            };
            request.yar.set(SESSION_KEY, sessionData);
            return h.response({ sendPaymentTo: paymentAddress, firstVisit: firstVisit }).code(403);
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
                      .then(() => createAddress(accountId, true))
                      .catch((err) => returnError("creating account", err));
                } else {
                    // Account already exists - create the new address.
                    return createAddress(accountId, true);
                }
            }).catch((err) => returnError("error getting account", err));
        } else {
            // Entry exists and hence payment address is defined, check for sufficient balance at that address.
            return mybcoin.hasBalance(thisPublisherEntry.address, thisPublisherEntry.amount).then((res) => {
                if (res) {
                    return h.response("Authorized").code(200);
                } else {
                    return h.response({ sendPaymentTo: thisPublisherEntry.address, firstVisit: false}).code(403);
                }
            }).catch((err) => returnError("error checking balance", err));
        }
    }
});

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
            let hasBalane = await mybcoin.hasBalance(entry.address, entry.amount);
            payments.push({publisher: k, amount: entry.amount, paid: hasBalance, requestedAt: entry.requestedAt});
        });

        return h.response(payments).code(200);
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
                    password: 'coingateway-super-secret-password',
                    //isSecure: true, // Makes the cookie HTTPS only - enable in production
                    isSecure: false,
                    /*
                     ttl: null, // can be millisec, this is per-session for easy testing
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
