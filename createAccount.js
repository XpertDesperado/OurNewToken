var request = require('request');

function createKeyPair() {
    // create a completely new and unique pair of keys
    var pair = StellarSdk.Keypair.random();
    // see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html

    return { secret: pair.secret(), public: pair.publicKey() };
}

function fundTestAccount(keyPair) {
    // The SDK does not have tools for creating test accounts, so you'll have to
    // make your own HTTP request.
    request.get({
        url: 'https://horizon-testnet.stellar.org/friendbot',
        qs: { addr: pair.publicKey() },
        json: true
    }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error('ERROR!', error || body);
        }
        else {
            console.log('SUCCESS! You have a new account :)\n', body);
        }
    });
}

fundTestAccount(createKeyPair())