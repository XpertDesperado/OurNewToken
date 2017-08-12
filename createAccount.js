
function CreateKeyPair() {
    // create a completely new and unique pair of keys
    var pair = StellarSdk.Keypair.random();
    // see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html

    pair.secret();
    // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
    pair.publicKey();
    // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
}