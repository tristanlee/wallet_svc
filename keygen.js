

const bip39 = require('bip39');
const bip32 = require('bip32');
var bitcore = require('bitcore-lib');
var eth_hdkey = require('ethereumjs-wallet/hdkey');
var http = require('http');
var url = require('url');

const btc_xprv = 'xprvA1fXubx4qKBMSLm38iuJhwN5rEEJFQhFkifdQ6t4CxKNjCpRPVvxxNXXgWMGBDHe5xaTw7TLb911Bgk8sAXYwn994BWTShZkQRxK9tuLp4p'
// import xprv
var btc_xnode = bip32.fromBase58(btc_xprv);

const eth_xprv = 'xprvA1RuqvTnKTLTKBV1fJcxkrV2NJEdwih8FRAQyUzYQqjGmnsvk2h5y5UBf56mTtgvqmrzsAAEav2EZou5y9W3FzmeEdnfGTAWvbFpbKHXXCz' 
// import xpub
var eth_xnode = eth_hdkey.fromExtendedKey(eth_xprv);


function SvcErr (res, errStr) {
    retStr = JSON.stringify({'error': errStr});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(retStr);
}

function btc_key(res, req) {
    console.log("Request handler 'btc_key' was called.");

    var q = url.parse(req.url, true).query;
    const uid = parseInt(q.uid);
    if (uid >= 0) {
        var wal = btc_xnode.derive(uid) // uid is a number
        var key = wal.toWIF()
        var retStr = JSON.stringify({'key': key});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(retStr);
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function eth_key(res, req) {
    console.log("Request handler 'eth_key' was called.");

    var q = url.parse(req.url, true).query;
    const uid = parseInt(q.uid);
    if (uid >= 0) {
        var wal = eth_xnode.deriveChild(uid) // uid is a number
        var key = wal.getWallet().getPrivateKeyString() // String
        var retStr = JSON.stringify({'key': key});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(retStr);
        return 
    }

    //parameter error
    SvcErr(res, 'parameter error');
}

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  //http.createServer(onRequest).listen(8091);
  http.createServer(onRequest).listen(8091, 'localhost');
  console.log("Server has started.");
}

var handle = {};
handle["/btc/key"] = btc_key;
handle["/eth/key"] = eth_key;
handle["/cpcs/key"] = eth_key;

start(route, handle);


