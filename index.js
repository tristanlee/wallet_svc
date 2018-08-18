var server = require("./server");
var router = require("./router");
var wallet_svc = require("./wallet_svc");

var handle = {};
handle["/btc/addr"] = wallet_svc.btc_addr;
handle["/eth/addr"] = wallet_svc.eth_addr;

server.start(router.route, handle);
