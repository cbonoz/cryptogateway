'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    host:'localhost',
    port:8000
});

const COOKIE_KEY = 'cgpayment';

// ---------------------------------
// Blockchain interaction functions
// ---------------------------------

function generateNewAddress() {
  // TODO generate a new address and return it
  return 0;
}

function hasBalance(address, requiredBalance) {
  // TODO check if the address has (at least) the required balance, return boolean
  return false;
}

// ---------
// Web part
// ---------

// Configure the cookie
// The cookie will store the payment address we generated for this browser
server.state(COOKIE_KEY, {
    ttl: null, // can be millisec, this is per-session for easy testing
    //isSecure: true, // Makes the cookie HTTPS only - enable in production
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

// Add our validate pay API route
server.route({
    method:'GET',
    path:'/validate-pay/{amount?}',
    handler:function(request, h) {

      // Receive required amount as a parameter
      let amount = request.params.amount;
      if (!amount)
        return h.response("Invalid request, please specify amount").code(400);

      // If no cookie exists, create a blockchain address, return it to the caller, and set it as the cookie

      const cookieVal = request.state[COOKIE_KEY];
      if (!cookieVal) {
        let paymentAddress = generateNewAddress();
        let payload = { sendPaymentTo: paymentAddress };
        return h.response(payload).code(403).state(COOKIE_KEY, payload);
      }
      else {
        // Note that we don't validate cookie structure for now...
        let payload = cookieVal;
        if (hasBalance(payload.sendPaymentTo, amount))
          return h.response("Okay");
        else
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
