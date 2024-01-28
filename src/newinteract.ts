
// the followign code comes from mina tutorial series #2
// https://www.youtube.com/watch?v=B5mniTExWaY&t
import { Mina, PrivateKey, PublicKey, fetchAccount } from 'o1js';

import { Add } from './Add.js';

const Network = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Network);

const appKey = PublicKey.fromBase58('B62qqGDWtquw5VwS4p9NJ4QWhvCAWWK914LZpNoRmPHbcFoVZN8hCMW');

const zkApp = new Add(appKey);
await fetchAccount({ publicKey: appKey });
console.log(zkApp.num.get().toString());

//
// the below comes from mina tutorial series #3
// https://www.youtube.com/watch?v=VaewbDp28jU&t=62s
//

// {
//     privateKey: 'EKExcsSyUzohxwTGUaFHH6bvLtpSmpUfGvksiZTDSdH9YWjegLhp',
//     publicKey: 'B62qoZURWp7M7nQM4icMUDL98tzjyTVS7H3f9E1PDDon2z3SkCnocSz'
// }
const accountPrivateKey = PrivateKey.fromBase58('EKExcsSyUzohxwTGUaFHH6bvLtpSmpUfGvksiZTDSdH9YWjegLhp');
const accountPublicKey = accountPrivateKey.toPublicKey();

console.log(accountPublicKey.toBase58());

console.log('\n compiling...');
await Add.compile();

const tx = await Mina.transaction(
    { sender: accountPublicKey, fee: 0.1e9 },
    () => {
        zkApp.update();
    }
);

console.log('.\n proving...');
await tx.prove();

const sentTx = await tx.sign([accountPrivateKey]).send();

console.log('https://berkeley.minaexplorer.com/transaction/' + sentTx.hash());