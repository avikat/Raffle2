import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.OPERATOR_ID;
  const myPrivateKey = process.env.OPERATOR_PVKEY;

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create new keys
  const newAccountPrivateKey = await PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  console.log("Private Key--> " + newAccountPrivateKey);

  //Create a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  console.log("The new account ID is: " + newAccountId);

  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log(
    "The new account balance is: " +
      accountBalance.hbars.toTinybars() +
      " tinybar."
  );
}
main();

// Outputs ->
// Private Key--> 302e020100300506032b657004220420036f564e5c829607b28078bb07d7a4c083bf613577ba2254d2a70e909b885bf4
// The new account ID is: 0.0.48148732
// The new account balance is: 1000 tinybar.
