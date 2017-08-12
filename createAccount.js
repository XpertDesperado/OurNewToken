function CreateKeyPair() {
    // create a completely new and unique pair of keys
    var pair = StellarSdk.Keypair.random();
    // see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html

    return { secret: pair.secret(), publicKey: pair.publicKey() };
}