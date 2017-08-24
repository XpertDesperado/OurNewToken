// Get predefined account info
var config = require('./config.json');

var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;

// SDK which uses the test network
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

// Keys for accounts to issue and receive the new asset
var test1Keys = StellarSdk.Keypair.fromSecret(test1KeyPair.secret); // issuer for SkyToken
var test2Keys = StellarSdk.Keypair.fromSecret(test2KeyPair.secret);
var test3Keys = StellarSdk.Keypair.fromSecret(test3KeyPair.secret);

// use the test network
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


// Batch transaction
// 5 lumens from Acct1 -> Acct3
// 2 lumens from Acct3 -> Acct2
function exercise1() {
    server.loadAccount(test1Keys.publicKey())
    .then(function(sourceAccount) {

        // Start building the transaction.
        var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.payment({
            destination: test3KeyPair.public,
            asset: StellarSdk.Asset.native(), // Lumens.
            amount: "5"
        }))
        .addOperation(StellarSdk.Operation.payment({
            source: test2KeyPair.public,
            destination: test3KeyPair.public,
            asset: StellarSdk.Asset.native(), // Lumens.
            amount: "2"
        }))
        // A memo allows you to add your own metadata to a transaction. It's
        // optional and does not affect how Stellar treats the transaction.
        .addMemo(StellarSdk.Memo.text('Test Transaction'))
        .build();

        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(test1Keys);
        transaction.sign(test2Keys);

        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
    })
    .then(function(result) {
        console.log('Success! Results:', result);
    })
    .catch(function(error) {
        console.error('Something went wrong!');
        console.log(JSON.stringify(error));
    });
}

// Something
function exercise2() {

}

// exercise1();