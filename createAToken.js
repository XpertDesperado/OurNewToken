// Stellar SDK which uses the test network
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();


// Get predefined account info
var config = require('./config.json');

// issuing key pair is just test account 1
var test1KeyPair = config.testAccount1;
var test2KeyPair = config.testAccount2;
var test3KeyPair = config.testAccount3;

var skyTokenIssuerPublicKey = config.skyToken.issuerPublicKey;


// Keys for accounts to issue and receive the new asset
var test1Keys = StellarSdk.Keypair.fromSecret(test1KeyPair.secret); // issuer for SkyToken
var test2Keys = StellarSdk.Keypair.fromSecret(test2KeyPair.secret);
var test3Keys = StellarSdk.Keypair.fromSecret(test3KeyPair.secret);

// Server
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Make it so that the receiving account "trusts" our custom asset
function trustToken(assetName, issuingAccountPublicKey, receivingAccountKeyPair, callback) {
    // Create an object to represent the new asset
    var skyToken = new StellarSdk.Asset(assetName, issuingAccountPublicKey);

    // First, the receiving account must trust the asset
    server.loadAccount(receivingAccountKeyPair.publicKey())
    .then(function(receiver) {
        var transaction = new StellarSdk.TransactionBuilder(receiver)

        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: skyToken,
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

// amount must be a string
function sendPayment(assetName, fromKeys, receivingKeyPair, amount, callback) {
    var asset;
    if (assetName == "Lumens" || assetName == "XLM") {
        asset = StellarSdk.Asset.native(); // Lumens.
    }
    else {
        if (config[assetName].issuerPublicKey == undefined) {
            console.log("Cannot handle payment with "+assetName+". Input their issuer public key into the config.json file");
            return;
        }
        asset = new StellarSdk.Asset(assetName, config[assetName].issuerPublicKey);
    }

    // Could be a custom asset
    // var asset = new StellarSdk.Asset(assetName, test1KeyPair.public);

    server.loadAccount(fromKeys.publicKey())
        .then(function(issuer) {
            var transaction = new StellarSdk.TransactionBuilder(issuer)
            .addOperation(StellarSdk.Operation.payment({
                destination: receivingKeyPair.public,
                asset: asset,
                amount: amount
            }))
            .build();

            transaction.sign(fromKeys);

            return server.submitTransaction(transaction);
        })
        .then(function() {
            callback();
        })
        .catch(function(error) {
            callback(error);
        });
}

// Issuing account for SkyToken = Test Account 1

// trustToken("SkyToken", test1KeyPair.public, test3Keys, function(error) {
//     if (error) { console.error('Error!', error); return; }

//     console.log("Sucessfully trusted.");
// });

sendPayment("SkyToken", test2Keys, test3KeyPair, "2", function(error) {
    if (error) { console.error('Error!'); console.log(JSON.stringify(error)); return; }

    console.log("Payment sent!")
});