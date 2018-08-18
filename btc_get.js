


var bitcore = require('bitcore-lib');
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();
//var insight = new explorers.Insight({network: testnet});

testaddr = 'mzU8U6M6skuZ8kEEdsRCmvEXoCkEqzpzSM'
console.log(testaddr)
insight.getUnspentUtxos(testaddr, function(error, utxo) {
    let balance = 0;
    for (var i = 0; i < utxo.length; i++) {
        balance +=utxo[i]['satoshis'];
    }
    console.log('balance:'+ balance);
    //console.log(utxo);
    console.log(JSON.stringify(utxo));
});

