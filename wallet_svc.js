

const bip39 = require('bip39');
const bip32 = require('bip32');
var bitcore = require('bitcore-lib');
var http = require('http');
var url = require('url');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

const btc_xpub = 'xpub6Eqd6zuCiEk7nviTvJeeY6fqucoS2zVGsQaCkBAqsxW8YoJucvk66vMHeRKwoqb73hSReQLoZfMX6CP6FeFjF9bvKwVDTr4zWpqsC6dP9mR' 
// import xpub
var xnode = bip32.fromBase58(btc_xpub);

function BtcSvcAddr (uid) {
    var wal = xnode.derive(uid) // uid is a number
    var addr = bitcore.PublicKey(wal.publicKey).toAddress().toString();
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
    res.end("Page not found");
}

http.createServer(function (req, res) {
    var q = url.parse(req.url, true).query;
    const coin = q.cn;
    const uid = parseInt(q.uid);
    
    //console.log(coin,  uid);
    switch (coin) {
        case 'btc': {
            BtcSvc(q, res)
        }
        break;
        case 'ltc': {
        }
        break;
        case 'eth': {
        }
        break;
        default: {
            //error page
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end("Page not found");
        }
    }

    //}).listen(8090, 'localhost');
    }).listen(8090);





