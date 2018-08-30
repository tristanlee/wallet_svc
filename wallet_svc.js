const bip39 = require('bip39');
const bip32 = require('bip32');
var http = require('http');
var url = require('url');
var bitcore = require('bitcore-lib');
var eth_hdkey = require('ethereumjs-wallet/hdkey');
var Web3 = require('web3');
var config = require('./config/config');
var RpcClient = require('bitcoind-rpc');

const {promisify} = require('util');

var btc_rpc = new RpcClient(config.btc);

var provider_uri = 'http://'+config.eth.host+':'+config.eth.port;
var provider = new Web3.providers.HttpProvider(provider_uri);
//var provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/MEDIUMTUTORIAL");
//var provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/MEDIUMTUTORIAL");

var web3 = new Web3(provider);
var utils = web3.utils;
var eth = web3.eth;


const btc_xpub = 'xpub6EetK7UxfgjeepqWEkSK55JpQG4nesR77wbECVHfmHrMc19Zw3FDWAr1XpJ7xHxLQBwrgsik2qY98hXRSbR2DsSyCCRtreJduHzfmpSj1yH' 
// import xpub
var btc_xnode = bip32.fromBase58(btc_xpub);

const eth_xpub = 'xpub6ERGFRzg9ptkXfZUmL9y7zRkvL58MBQyce61msQ9yBGFebD5Ha1LWsnfWK2XFyH9jqzsKBhYt6TYTAZq5eCJQRoZXUmyPBudicPAAFtb9iG' 
// import xpub
var eth_xnode = eth_hdkey.fromExtendedKey(eth_xpub);


function SvcErr (res, errStr) {
    retStr = JSON.stringify({'error': errStr});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(retStr);
}

function BtcSvcAddr (uid) {
    var wal = btc_xnode.derive(uid) // uid is a number
    var addr = bitcore.PublicKey(wal.publicKey).toAddress().toString();
    return JSON.stringify({'addr': addr});
}

function EthSvcAddr (uid) {
    var wal = eth_xnode.deriveChild(uid) // userid is a number
    var addr = wal.getWallet().getChecksumAddressString();
    return JSON.stringify({'addr': addr});
}

function btc_addr(res, req) {
    console.log("Request handler 'btc_addr' was called.");

    var q = url.parse(req.url, true).query;
    const uid = parseInt(q.uid);
    if (uid >= 0) {
        var retStr = BtcSvcAddr(uid);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(retStr);
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function eth_addr(res, req) {
    console.log("Request handler 'eth_addr' was called.");

    var q = url.parse(req.url, true).query;
    const uid = parseInt(q.uid);
    if (uid >= 0) {
        var retStr = EthSvcAddr(uid);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(retStr);
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function btc_balance(res, req) {
    console.log("Request handler 'btc_balance' was called.");

    var q = url.parse(req.url, true).query;

    if (bitcore.Address.isValid(q.addr)) {
        btc_rpc.listunspent(1, 99999999, [q.addr], function(error, ret) {
            if (error) {
                //rpc error
                SvcErr(res, err.toString());
                return;
            }

            let utxo = ret.result
            let balance = 0;
            for (var i = 0; i < utxo.length; i++) {
                balance +=utxo[i]['amount'];
            }

            retStr = JSON.stringify({'balance': balance});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(retStr);
        });
        
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function btc_utxo(res, req) {
    console.log("Request handler 'btc_utxo' was called.");

    var q = url.parse(req.url, true).query;

    if (bitcore.Address.isValid(q.addr)) {
        btc_rpc.listunspent(1, 99999999, [q.addr], function(error, ret) {
            if (error) {
                //rpc error
                SvcErr(res, err.toString());
                return;
            }

            let utxo = ret.result
            retStr = JSON.stringify({'utxo': utxo});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(retStr);
        });
        
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function eth_balance(res, req) {
    console.log("Request handler 'eth_balance' was called.");

    var q = url.parse(req.url, true).query;
    if (utils.isAddress(q.addr)) {
        eth.getBalance(q.addr)
        .then(ret => {
            var balance = utils.fromWei(ret.toString(), 'ether');
            retStr = JSON.stringify({'balance': balance});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(retStr);
        })
        .catch(err => {
            //rpc error
            SvcErr(res, err.toString());
        })

        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

const {cpcs_abi, cpcs_caddr} = require('./token/token.js')
function cpcs_balance(res, req) {
    console.log("Request handler 'cpcs_balance' was called.");

    var q = url.parse(req.url, true).query;
    if (utils.isAddress(q.addr)) {
        var tcoin = new eth.Contract(cpcs_abi, cpcs_caddr); //token contract

        //get balance
        tcoin.methods.balanceOf(q.addr).call()
        .then(ret => {
            var balance = ret.toString();
            retStr = JSON.stringify({'balance': balance});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(retStr);
        })
        .catch(err => {
            //rpc error
            SvcErr(res, err.toString());
        })

        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

exports.btc_addr = btc_addr;
exports.btc_balance = btc_balance;
exports.btc_utxo = btc_utxo;

exports.eth_addr = eth_addr;
exports.eth_balance = eth_balance;

exports.cpcs_balance = cpcs_balance;

