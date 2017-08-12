// Get predefined account info
var config = require('./config.json');

var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;

// SDK which uses the test network
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

// Server
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

function createToken() {
    // Keys for accounts to issue and receive the new asset
    var issuingKeys = StellarSdk.Keypair.fromSecret(test1KeyPair.secret);
    var receivingKeys = StellarSdk.Keypair.fromSecret(test2KeyPair.secret);

    // Create an object to represent the new asset
    var skyToken = new StellarSdk.Asset('SkyToken', issuingKeys.publicKey());

    // First, the receiving account must trust the asset
    server.loadAccount(receivingKeys.publicKey())
    .then(function(receiver) {
        var transaction = new StellarSdk.TransactionBuilder(receiver)

        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: skyToken,
            limit: '1000'
        }))
        .build();

        transaction.sign(receivingKeys);

        return server.submitTransaction(transaction);
    })

    // Second, the issuing account actually sends a payment using the asset
    .then(function() {
        return server.loadAccount(issuingKeys.publicKey())
    })
    .then(function(issuer) {
        var transaction = new StellarSdk.TransactionBuilder(issuer)
        .addOperation(StellarSdk.Operation.payment({
            destination: receivingKeys.publicKey(),
            asset: skyToken,
            amount: '10'
        }))
        .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
    })
    .catch(function(error) {
        console.error('Error!', error);
    });
}