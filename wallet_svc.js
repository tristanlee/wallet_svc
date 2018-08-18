const bip39 = require('bip39');
const bip32 = require('bip32');
var http = require('http');
var url = require('url');
var bitcore = require('bitcore-lib');
var eth_hdkey = require('ethereumjs-wallet/hdkey');
//var explorers = require('bitcore-explorers');
//var insight = new explorers.Insight();

const btc_xpub = 'xpub6EetK7UxfgjeepqWEkSK55JpQG4nesR77wbECVHfmHrMc19Zw3FDWAr1XpJ7xHxLQBwrgsik2qY98hXRSbR2DsSyCCRtreJduHzfmpSj1yH' 
// import xpub
var btc_xnode = bip32.fromBase58(btc_xpub);

const eth_xpub = 'xpub6ERGFRzg9ptkXfZUmL9y7zRkvL58MBQyce61msQ9yBGFebD5Ha1LWsnfWK2XFyH9jqzsKBhYt6TYTAZq5eCJQRoZXUmyPBudicPAAFtb9iG' 
// import xpub
var eth_xnode = eth_hdkey.fromExtendedKey(eth_xpub);


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

function BtcSvc (q, res) {
    var uid = parseInt(q.uid);
    if (uid >= 0) {
        var retStr = BtcSvcAddr(uid);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(retStr);
        return 
    }

    //error page
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("404 not found");
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

    //error page
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("404 not found");
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

    //error page
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("404 not found");
}

exports.btc_addr = btc_addr;
exports.eth_addr = eth_addr;
