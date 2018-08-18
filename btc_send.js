

var bitcore = require('bitcore-lib');
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet
var explorers = require('bitcore-explorers');

var addr1 = 'mzU8U6M6skuZ8kEEdsRCmvEXoCkEqzpzSM'
var prvKey1 = bitcore.PrivateKey.fromWIF('cSntMVv6qYafRycByL2bPr73nFGQkP5NfdiZTTHhdX3gNqo2HACx');
var addr2 = 'mqzG7NnPo1C48MFgDUCWBqrR2V5mZc5gYy'

const unit = bitcore.Unit;
const insight = new explorers.Insight();
const minerFee = unit.fromMilis(1).toSatoshis(); //cost of transaction in satoshis (minerfee)
const transactionAmount = unit.fromMilis(100).toSatoshis(); //convert mBTC to Satoshis using bitcore unit

const utxo = [{"address":"mzU8U6M6skuZ8kEEdsRCmvEXoCkEqzpzSM","txid":"ed4512402a0f3d6ced518c1eed9dc1666e45a058ac5d185bcbca5d5b50216a4b","vout":1,"scriptPubKey":"76a914cfe1a25276bb2eda0a27ede7ce1cf9c3808f4d7a88ac","amount":0.55},{"address":"mzU8U6M6skuZ8kEEdsRCmvEXoCkEqzpzSM","txid":"c47ad728f5965366c009fb62977fdf36423c484ff40196c3ccc46e6f6a77cb6a","vout":1,"scriptPubKey":"76a914cfe1a25276bb2eda0a27ede7ce1cf9c3808f4d7a88ac","amount":1.1}]

//create a new transaction
try {
  let bitcore_transaction = new bitcore.Transaction()
    .from(utxo)
    .to(addr2, transactionAmount)
    .fee(minerFee)
    .change(addr1)
    .sign(prvKey1);

  //handle serialization errors
  if (bitcore_transaction.getSerializationError()) {
    console.log('serialization error');
    let error = bitcore_transaction.getSerializationError().message;
    switch (error) {
      case 'Some inputs have not been fully signed':
        //return reject('Please check your private key');
        break;
      default:
        //return reject(error);
    }
  }

  // broadcast the transaction to the blockchain
  insight.broadcast(bitcore_transaction, function(error, body) {
    if (error) {
        console.log('broadcast error', error);
      //reject('Error in broadcast: ', error);
    } else {
        console.log('transactionId:', body)
    }
  });

} catch (error) {

    //console.log(error.message);
  return reject(error.message);
}

