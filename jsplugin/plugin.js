const library = (function () {
    // Axios required for now (could use native http module if dependencyless).
    const axios = require('axios');

    const BASE_URL = "http://localhost.com:3000";

    console.log('plugin');
    function addStyleString(str) {
        const node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    const blur = `html {
        -webkit-filter: blur(3px);
        -moz-filter: blur(3px);
        filter: blur(3px);
    }`;

    function showPaywallDialog() {
        // const myWindow = window.open("", "", "width=200, height=100");
        // myWindow.document.write("<p>A new window!</p>");
        // myWindow.blur();
        // let popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
        // $("<p>Hello World!</p>").dialog();

        axios.post(`${BASE_URL}/user`, {
            firstName: 'Fred',
            lastName: 'Flintstone'
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function setup() {
        addStyleString(blur);
        showPaywallDialog();
    }

    return {
        setup: setup,
    }

})();
module.exports = library;

