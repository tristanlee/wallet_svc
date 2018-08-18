

const bip39 = require('bip39');
const bip32 = require('bip32');

//Generate mnemonic
var mnemonic = bip39.generateMnemonic();
console.log(mnemonic);

var seed_node = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

//BIP44 BTC node
var wallet_hdpath = "m/44'/0'/0'/0"; //bitcoin path
var xnode = seed_node.derivePath(wallet_hdpath);
var xpub = xnode.neutered().toBase58();
var xprv = xnode.toBase58();
console.log('BTC:', xpub);
console.log('BTC:', xprv);

//BIP44 ETH node
var wallet_hdpath = "m/44'/60'/0'/0"; //ETH path
var xnode = seed_node.derivePath(wallet_hdpath);
var xpub = xnode.neutered().toBase58();
var xprv = xnode.toBase58();
console.log('ETH:', xpub);
console.log('ETH:', xprv);

/*
// import xprv
var xnode = bip32.fromBase58(xprv);
var xpub1 = xnode.neutered().toBase58();
var xprv1 = xnode.toBase58();
console.log(xpub1);
console.log(xprv1);
*/



