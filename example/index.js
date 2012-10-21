var crypto = require('crypto');
var alice = crypto.getDiffieHellman('modp5');
var bob = crypto.getDiffieHellman('modp5');

alice.generateKeys();
bob.generateKeys();

var alice_secret = alice.computeSecret(bob.getPublicKey(), 'binary', 'hex');
var bob_secret = bob.computeSecret(alice.getPublicKey(), 'binary', 'hex');

/* alice_secret and bob_secret should be the same */
console.log(alice_secret.substring(0, 10))
console.log(bob_secret.substring(0, 10));


/* 
send:

{ id: ID
, key: KEY
, sig: SIG
, alg: [algorithms] //ordered list of supported algorithms in order of pref
}

signs the message,
and then you do a diffieHellman key exchange,
now you have a shared symetrical key...
*/

