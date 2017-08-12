// Get predefined account info
var config = require('./config.json');
var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;


// SDK which uses the test network
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

// use the test network
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

sendPayment(test1KeyPair.secret, test2KeyPair.public, "1000");

function sendPayment(amount) {
    // var sourceKeys = StellarSdk.Keypair.fromSecret(test1KeyPair.secret);
    // var destinationId = test2KeyPair.public;

    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server.loadAccount(test2KeyPair.public)
    // If the account is not found, surface a nicer error message for logging.
    .catch(StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
    })
    // If there was no error, load up-to-date information on your account.
    .then(function() {
        return server.loadAccount(testAccount1KeyPair.public);
    })
    // .then(function() {
    //     return 
    // })
    .then(function(sourceAccount) {

        // Start building the transaction.
        var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.payment({
            destination: test2KeyPair.public,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: amount
        }))
        .addOperation(StellarSdk.Operation.payment({
            destination: test3KeyPair.public,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: amount
        }))
        // A memo allows you to add your own metadata to a transaction. It's
        // optional and does not affect how Stellar treats the transaction.
        .addMemo(StellarSdk.Memo.text('Test Transaction'))
        .build();
        
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);

        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
    })
    .then(function(result) {
        console.log('Success! Results:', result);
    })
    .catch(function(error) {
        console.error('Something went wrong!', error);
    });
}

function buildTransaction(testAccount1KeyPair, testAccount2Public) {
    // StellarBase.Network.usePublicNetwork(); if this transaction is for the public network
    // Create an Account object from an address and sequence number.
    var account = new StellarSdk.Account("GD6WU64OEP5C4LRBH6NK3MHYIA2ADN6K6II6EXPNVUR3ERBXT4AN4ACD","2319149195853854");

    var transaction = new StellarBase.TransactionBuilder(account)
        // add a payment operation to the transaction
        .addOperation(StellarBase.Operation.payment({
            destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
            asset: StellarBase.Asset.native(),
            amount: "100.50"  // 100.50 XLM
        }))
        // add a set options operation to the transaction
        .addOperation(StellarBase.Operation.setOptions({
            signer: {
                ed25519PublicKey: secondAccountAddress,
                weight: 1
            }
        }))
        .build();
}