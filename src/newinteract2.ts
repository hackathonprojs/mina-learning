/**
 * interact with local blockchain
 * the following code comes from mina tutorial series #4 https://www.youtube.com/watch?v=nxM7VmJqoU4
 */ 

import {
    AccountUpdate,
    Mina,
    PrivateKey,
    PublicKey,
    fetchAccount,
} from 'o1js';

import { Add } from './Add.js';

const Local = Mina.LocalBlockchain({ proofsEnabled: true });
Mina.setActiveInstance(Local);

// deployerAcct --> deploy the smart contract
// senderAcct --> interact with the smart contract
// zkAppAcct --> the actual zkApp 

const {privateKey: deployerKey, publicKey: deployerAccount} = Local.testAccounts[0];
const {privateKey: senderKey, publicKey: senderAccount} = Local.testAccounts[1];

let zkAppPrivateKey = PrivateKey.random();
const zkAppAccount = zkAppPrivateKey.toPublicKey();
const zkApp = new Add(zkAppAccount);

console.log('compiling...');
await Add.compile();

const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkApp.deploy();
})

await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();


let num = zkApp.num.get();

console.log(num.toString());

const txn = await Mina.transaction(senderAccount, () => {
    zkApp.update();
})

console.log('proving...');
await txn.prove();
await txn.sign([senderKey]).send();

num = zkApp.num.get();
console.log('updated state:', num.toString());
