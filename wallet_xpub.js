

const bip39 = require('bip39');
const bip32 = require('bip32');

//Generate mnemonic
var mnemonic = bip39.generateMnemonic();
console.log(mnemonic);

var seed_node = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

//BIP44 BTC node
const wallet_hdpath = "m/44'/0'/0'/0"; //bitcoin path
var btc_node = seed_node.derivePath(wallet_hdpath);
var btc_xpub = btc_node.neutered().toBase58();
var btc_xprv = btc_node.toBase58();
console.log('btc:', btc_xpub);
console.log('btc:', btc_xprv);

/*
// import xprv
var xnode = bip32.fromBase58(xprv);
var xpub1 = xnode.neutered().toBase58();
var xprv1 = xnode.toBase58();
console.log(xpub1);
console.log(xprv1);
*/



