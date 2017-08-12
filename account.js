var request = require('request');
var Stellar = require('stellar-sdk');
Stellar.Network.usePublicNetwork();

var server = new Stellar.Server('https://horizon-testnet.stellar.org');



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

// Create new account
// createNewAccount();

// Check account info
