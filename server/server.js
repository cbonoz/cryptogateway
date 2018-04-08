'use strict';

const Hapi = require('hapi');
const mybcoin = require('./bcoin/coin');
const SERVER_PORT = 8000;

const server = Hapi.server({
    host: 'localhost',
    port: SERVER_PORT
});

const COOKIE_KEY = 'cgpayment';
const ALLOWED_VIEWS = 0;

// ---------------------------------
// Blockchain interaction functions
// ---------------------------------

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
        let payload = request.state[COOKIE_KEY];
        console.log('current payload', payload);

        if (!payload) {
            // no cookie present or generated yet.
            payload = {sendPaymentTo: null, viewCount: 0};
        }
        payload.viewCount += 1;
        if (payload.viewCount <= ALLOWED_VIEWS) {
            return h.response("Authorized").code(200).state(COOKIE_KEY, payload);
        }

        if (!payload.sendPaymentTo) {
            // First time user sending this, generate a 403.
            mybcoin.createAddress().then((paymentAddress) => {
                console.log('back in server', JSON.stringify(paymentAddress));
                payload.sendPaymentTo = paymentAddress;
                return h.response(payload).code(403).state(COOKIE_KEY, payload);
            }).catch((err) => {
                return h.response(err).code(500);
            });
        } else {
            // Payment address is defined, check for sufficient balance at that address.
            mybcoin.hasBalance(payload.sendPaymentTo, amount).then((res) => {
                if (res) {
                    return h.response("Authorized").code(200).state(COOKIE_KEY, payload);
                } else {
                    // Else not authorized.
                    // For now the client can't tell if the address is new or not. We can change this if needed
                    return h.response(payload).code(403).state(COOKIE_KEY, payload);
                }
            });
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
}

start();
