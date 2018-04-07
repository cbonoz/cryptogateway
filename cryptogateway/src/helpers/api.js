/**
 * Created by cbuonocore on 3/16/18.
 */

const library = (function () {
    const PORT = 9001;
    // TODO: replace with prod endpoint.
    const BASE_URL = `http://localhost:${PORT}`;

    const axios = require('axios');

    //
    // function getFileMetadatasForAddress(address) {
    //     const url = `${BASE_URL}/api/files/${address}`;
    //     return axios.get(url, getHeaders()).then(response => response.data);
    // }
    //
    // function postGetFile(address, fileName) {
    //     const url = `${BASE_URL}/api/file`;
    //     return axios.post(url, {
    //         address: address,
    //         fileName: fileName
    //     }).then(response => {
    //         const data = response.data;
    //         return data;
    //     });
    // }

    return {
        BASE_URL: BASE_URL,
    }

})();
module.exports = library;

