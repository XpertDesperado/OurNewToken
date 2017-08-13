var request = require('request');
var Stellar = require('stellar-sdk');
Stellar.Network.usePublicNetwork();

var server = new Stellar.Server('https://horizon-testnet.stellar.org');


// Get predefined account info
var config = require('./config.json');

var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;



function createKeyPair() {
    // create a completely new and unique pair of keys
    var pair = Stellar.Keypair.random();

    // console.log(pair);
    // see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html

    return { secret: pair.secret(), public: pair.publicKey() };
}

function fundTestAccount(keyPair, callback) {
    // The SDK does not have tools for creating test accounts, so you'll have to
    // make your own HTTP request.
    request.get({
        url: 'https://horizon-testnet.stellar.org/friendbot',
        qs: { addr: keyPair.public },
        json: true
    }, function(error, response, body) {
        callback(body, error);
    });
}

function createNewAccount() {
    var kp = createKeyPair();

    fundTestAccount(kp, function(body, error) {
        if (error) {
            console.error('ERROR!', error || body);
        }
        else {
            console.log('SUCCESS! You have a new account :)\n', body);

            console.log(kp);
        }
    }); 
}

function getBalances(publicKey, callback) {
    server.loadAccount(publicKey).then(function(acct) {
        var balances = acct.balances;
        console.log("----------------")
        console.log(acct._baseAccount._accountId); // 
        for (var i in balances) {

            console.log(""); // extra newline

            var b = balances[i];
            if (b.asset_type == 'native') {
                // Lumens
                console.log("Lumens");
                console.log("Balance: "+b.balance);
            }
            else {
                console.log(b.asset_code);
                console.log("Balance: "+b.balance);
                console.log("Limit: "+b.limit);
                console.log("Issuer: "+b.asset_issuer);
            }
        }

        if (callback) callback();
    });
}

getBalances(test1KeyPair.public, function() {
    getBalances(test2KeyPair.public, function() {
        getBalances(test3KeyPair.public);
    });
});


// Create new account
// createNewAccount();

// Check account info
