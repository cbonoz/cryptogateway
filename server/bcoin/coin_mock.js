const library = (function () {
    return {
        getAccount: (accountId) => {
          return Promise.resolve(true);
        },
        createAccount: (accountId) => {
          return Promise.resolve(true);
        },
        createAddress: (accountId) => {
          return Promise.resolve("ADDRESS");
        },
        hasBalance: (address, amount) => {
          return Promise.resolve(amount > 1);
        },
//        httpWallet: httpWallet
    }

})();
module.exports = library;

