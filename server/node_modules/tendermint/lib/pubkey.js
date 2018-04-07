'use strict';

var struct = require('varstruct');

var _require = require('./hash.js'),
    ripemd160 = _require.ripemd160;

var _require2 = require('./types.js'),
    VarHexBuffer = _require2.VarHexBuffer;

var AddressBytes = struct([{ name: 'type', type: struct.Byte }, { name: 'key', type: VarHexBuffer }]);

var types = {
  'ed25519': 1,
  'secp256k1': 2
};

function getAddress(pubkey) {
  var type = types[pubkey.type];
  if (type == null) {
    throw Error('Invalid pubkey type');
  }
  var bytes = AddressBytes.encode({
    type: type,
    key: pubkey.data
  });
  return ripemd160(bytes);
}

module.exports = getAddress;