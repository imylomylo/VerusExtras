const axios = require('axios');
const config = require('./config'); // Import the config.js file

// Function to make a remote RPC call
async function makeRpcCall(method, params) {
  try {
    // Construct the JSON-RPC request payload
    const requestData = {
      jsonrpc: '2.0',
      method: method,
      params: params || [], // Optional params
      id: 1,
    };

    // Define the Axios config for the HTTP request
    const axiosConfig = {
      method: 'post',
      url: config.VERUS, // This is the URL from the config.js file
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    // Make the HTTP request to the Verus RPC server
    const response = await axios(axiosConfig);

    // Return the RPC response data
    return response.data;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to call getrawtransaction
async function getRawTransaction(txid) {
  try {
    const rawTransaction = await makeRpcCall('getrawtransaction', [txid]);
    return rawTransaction;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to call decoderawtransaction
async function decodeRawTransaction(txid) {
  try {
    // First, get the raw transaction
    const rawTransaction = await getRawTransaction(txid);

    // Then, decode it
    const decodedTransaction = await makeRpcCall('decoderawtransaction', [rawTransaction]);
    return decodedTransaction;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to call getaddressutxos
async function getAddressUtxos(address) {
  try {
    const utxos = await makeRpcCall('getaddressutxos', [address]);
    return utxos;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

module.exports = {
  getRawTransaction,
  decodeRawTransaction,
  getAddressUtxos,
};
