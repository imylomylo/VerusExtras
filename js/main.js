const verusRpc = require('./verus-rpc');
const transactionHash = 'your-transaction-hash-here';
const address = 'your-address-here';
const addressToDefrag = 'your-address-here';
const N = 100; // Replace with the desired number of blocks to scan
const numBlocks = 100; // Replace with the desired number of blocks

// Usage examples for transaction-related methods
verusRpc.getRawTransaction(transactionHash)
  .then((rawTransaction) => {
    console.log('Raw Transaction:', rawTransaction);
    return verusRpc.decodeRawTransaction(rawTransaction);
  })
  .then((decodedTransaction) => {
    console.log('Decoded Transaction:', decodedTransaction);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Usage example for getAddressUtxos
verusRpc.getAddressUtxos(address)
  .then((utxos) => {
    console.log('Address UTXOs:', utxos);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

verusRpc.defragUtxos(addressToDefrag)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

verusRpc.ratioStakingMiningNBlocks(N)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

verusRpc.avgBlocktimeNBlocks(numBlocks);
