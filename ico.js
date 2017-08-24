// SkyToken ICO Code
// 2017/08/24
// By: Matt Blessed and Max Fox
// 

// Stellar SDK
var StellarSdk = require('stellar-sdk');
// use the TEST NETWORK
StellarSdk.Network.useTestNetwork();
// the server
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


// Issuing account (independent test-network account)
var SKIAKeyPair = { secret: 'SBON2ASES7QZRWRX4XGC4SL6MDYFIJ3CQJM7TSLZ67JCO7FDEADXVWDL',
public: 'GDFDCKDQ65AG2WIFOJSWQI2VDNVROECQR7ECP2QWRJABRMXU6L2YQYIM' }
var SKIAKeys = StellarSdk.Keypair.fromSecret(SKIAKeyPair.secret);

// SkyToken Asset Object
var SkyTokenAsset = new StellarSdk.Asset("SkyToken", SKIAKeyPair.public);


// Code to create an offer
function ico() {
    var currentTimestamp = Math.floor(new Date().valueOf() / 1000);

    // create an offer
    server.loadAccount(SKIAKeys.publicKey())
    .then(function(sourceAccount) {
        // Start building the transaction.
        var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            // timebounds: {
                // minTime: (currentTimestamp-1)+"",
                // maxTime: (currentTimestamp+(60*5))+""
            // }
        })
        // Create an offer to sell 1MM SkyToken in exchange for XLM
        .addOperation(StellarSdk.Operation.manageOffer({
            selling: SkyTokenAsset,
            buying: StellarSdk.Asset.native(),
            amount: "1000",
            price: "1"
        }))
        .build();

        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(SKIAKeys);

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

// Get predefined account info
var config = require('./config.json');

// var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;

// Keys for accounts to issue and receive the new asset
// var test1Keys = StellarSdk.Keypair.fromSecret(test1KeyPair.secret);
var test2Keys = StellarSdk.Keypair.fromSecret(test2KeyPair.secret);
var test3Keys = StellarSdk.Keypair.fromSecret(test3KeyPair.secret);

// code to create a trustline
// Make it so that the receiving account "trusts" our custom asset
function trustToken(assetName, issuingAccountPublicKey, receivingAccountKeyPair, callback) {
    // Create an object to represent the new asset
    var customAsset = new StellarSdk.Asset(assetName, issuingAccountPublicKey);

    // First, the receiving account must trust the asset
    server.loadAccount(receivingAccountKeyPair.publicKey())
    .then(function(receiver) {
        var transaction = new StellarSdk.TransactionBuilder(receiver)

        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: customAsset,
            limit: '1000'
        }))
        .build();

        transaction.sign(receivingAccountKeyPair);

        return server.submitTransaction(transaction);
    })
    .then(function() {
        callback();
    })
    .catch(function(error) {
        callback(error);
    });
}



function createCounterOffer() {
    // create an offer
    server.loadAccount(test2Keys.publicKey())
    .then(function(sourceAccount) {
        // Start building the transaction.
        var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        // Create an offer to sell 1MM SkyToken in exchange for XLM
        .addOperation(StellarSdk.Operation.manageOffer({
            selling:  StellarSdk.Asset.native(),
            buying: SkyTokenAsset,
            amount: "10",
            price: "1"
        }))
        .build();

        // Sign the transaction to prove you are actually the person sending it.
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

// createCounterOffer();
// ico();

trustToken("SkyToken", SKIAKeyPair.public, test2Keys, function() {
    createCounterOffer();
});