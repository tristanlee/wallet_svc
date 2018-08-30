var server = require("./server");
var router = require("./router");
var wallet_svc = require("./wallet_svc");

var handle = {};
handle["/btc/addr"] = wallet_svc.btc_addr;
handle["/btc/balance"] = wallet_svc.btc_balance;
handle["/btc/utxo"] = wallet_svc.btc_utxo;

handle["/eth/addr"] = wallet_svc.eth_addr;
handle["/eth/balance"] = wallet_svc.eth_balance;

handle["/cpcs/addr"] = wallet_svc.cpcs_addr;
handle["/cpcs/balance"] = wallet_svc.cpcs_balance;


server.start(router.route, handle);
