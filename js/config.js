// config.js

// This file should be modified to configure for your use.

// Path to the remote Verus RPC server
const VERUS_URL = "http://your-verus-rpc-server-url";

// Path to the Verus CLI rpc executable (no longer an executable but a URL)
const VERUS = VERUS_URL;
const VERUSARGS = "";
// const VERUSARGS = "-chain=VRSCTEST"; // Uncomment and modify if needed
const DEFAULT_FEE = 0.0001;

// Provides the path to the script executed, so the script can find relative paths to other VE scripts
const path = require('path');
const VEPATH = path.dirname(__filename);

// Initialize other variables (you can add more as needed)
let ID_Z = '';
let ID_T = '';
let ID_REFERRER = 'Verus Coin Foundation@';
let ID_RECOVERY = '';
let ID_REVOCATION = '';

module.exports = {
  VERUS,
  VERUSARGS,
  DEFAULT_FEE,
  VEPATH,
  ID_Z,
  ID_T,
  ID_REFERRER,
  ID_RECOVERY,
  ID_REVOCATION
};
