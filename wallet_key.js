

const bip39 = require('bip39');
const bip32 = require('bip32');
var bitcore = require('bitcore-lib');
var http = require('http');
var url = require('url');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

const btc_xprv = 'xprvA1fXubx4qKBMSLm38iuJhwN5rEEJFQhFkifdQ6t4CxKNjCpRPVvxxNXXgWMGBDHe5xaTw7TLb911Bgk8sAXYwn994BWTShZkQRxK9tuLp4p'
// import xprv
var xnode = bip32.fromBase58(btc_xprv);

function BtcSvcKey (uid) {
    var wal = xnode.derive(uid) // uid is a number
    var key = wal.toWIF()
    return JSON.stringify({'key': key});
}

function BtcSvc (q, res) {
    var uid = parseInt(q.uid);
    if (uid >= 0) {
        var retStr = BtcSvcKey(uid);
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

    //}).listen(8091, 'localhost');
    }).listen(8091);





