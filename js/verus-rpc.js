const axios = require('axios');
const config = require('./config'); // Import the config.js file
// Constants for flag values
const FLAG_REVOKE = 0x8000;
const FLAG_DELAYLOCK = 0x02;
// Constants for block types
const BLOCK_MINED = 'mined';
const BLOCK_MINTED = 'minted';

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

// Function to get block count
async function getBlockCount() {
  try {
    const blockCount = await makeRpcCall('getblockcount');
    return blockCount;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to get block by height
async function getBlockByHeight(height) {
  try {
    const block = await makeRpcCall('getblock', [height]);
    return block;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to call z_getbalance
async function getBalance(address) {
  try {
    const balance = await makeRpcCall('z_getbalance', [address]);
    return parseFloat(balance); // Convert balance to a float
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to send currency to a list of destinations
async function sendCurrency(address, destinations) {
  try {
    const response = await makeRpcCall('sendcurrency', [address, destinations]);
    return response;
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

// Function to check identity-related information
// from valutcheck.sh
async function checkIdentityInformation(names) {
  try {
    for (const name of names) {
      const nameWithoutSuffix = name.replace(/@$/, ''); // Remove '@' suffix
      const response = await makeRpcCall('getidentity', [`${nameWithoutSuffix}@`]);
      const id = response.identity;

      if (!id) {
        console.log(`${name}@ ID not registered`);
        continue;
      }

      const timelock = id.timelock;
      const flags = id.flags;

      if (flagCheck(flags, FLAG_DELAYLOCK)) {
        console.log(`${name}@ Delay lock of ${timelock + 20} blocks active.`);
      } else if (flagCheck(flags, FLAG_REVOKE)) {
        console.log(`${name}@ Is Revoked.`);
      } else {
        const blockHeight = await makeRpcCall('getblockcount');
        if (timelock > blockHeight) {
          console.log(`${name}@ Timelock unlocks in ${timelock - blockHeight} blocks.`);
        } else {
          console.log(`${name}@ Unlocked.`);
        }
      }
    }
  } catch (error) {
    // Handle errors here
    throw error;
  }
}

// Function to defragment UTXOs
async function defragUtxos(address, chunk = 5000) {
  try {
    const balance = await getBalance(address);
    const amount = balance - config.DEFAULT_FEE;
    const chunks = Math.floor(amount / chunk);
    const remainder = (amount - chunks * chunk).toFixed(8);

    console.log(`Address: ${address}`);
    console.log(`Breaking balance of ${balance} into ${chunks} of ${chunk} plus ${remainder}`);
    console.log();

    const destinations = [];

    for (let i = 0; i < chunks; i++) {
      destinations.push({ address: address, amount: chunk });
    }

    if (remainder > 0) {
      destinations.push({ address: address, amount: parseFloat(remainder) });
    }

    console.log(`Running: verus sendcurrency ${address} ${JSON.stringify(destinations)}`);
    console.log();

    const result = await sendCurrency(address, destinations);
    console.log(result); // Output the result of the sendcurrency RPC call
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
  }
}
// Function to calculate the ratio of staking and mining blocks in the last N blocks
async function ratioStakingMiningNBlocks(N) {
  try {
    const blockCount = await getBlockCount();
    const startHeight = blockCount - N + 1;

    console.log(`Block count: ${blockCount}`);
    console.log(`Scanning back to height: ${startHeight}`);
    console.log();

    let minedCount = 0;
    let mintedCount = 0;

    for (let height = startHeight; height <= blockCount; height++) {
      const block = await getBlockByHeight(height);
      const blockType = block.blocktype;
      console.log(`${height}: ${blockType}`);

      if (blockType === BLOCK_MINED) {
        minedCount++;
      } else if (blockType === BLOCK_MINTED) {
        mintedCount++;
      }
    }

    console.log(`Mined: ${minedCount} of ${N}`);
    console.log(`Minted: ${mintedCount} of ${N}`);
    console.log(`Mined Percent: ${(100 * minedCount / N).toFixed(2)}%`);
    console.log(`Minted Percent: ${(100 * mintedCount / N).toFixed(2)}%`);
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
  }
}

module.exports = {
  getBalance,
  sendCurrency,
  getBlockCount,
  getBlockByHeight,
  getRawTransaction,
  decodeRawTransaction,
  getAddressUtxos,
  checkIdentityInformation,
  defragUtxos,
  ratioStakingMiningNBlocks,
};
