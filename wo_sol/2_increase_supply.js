console.clear();

require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TokenInfoQuery,
  TokenMintTransaction,
} = require("@hashgraph/sdk");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const tokenId = "0.0.48110167"; // Sample Token ID
const supplyKey = treasuryKey; // Setting Supply Key

async function main() {
  const transaction = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(1000)
    .freezeWith(client);

  const signTx = await transaction.sign(supplyKey);

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status " + transactionStatus.toString()
  );
  const tokenInfo1 = await tQueryFcn(tokenId); // Using token query helper function
  console.log(`- New supply: ${tokenInfo1.totalSupply.low} \n`); // The will fetch us some informations

  async function tQueryFcn(tId) {
    let info = await new TokenInfoQuery().setTokenId(tId).execute(client);
    return info;
  }
}

main();

// Output -
// The transaction consensus status SUCCESS
// - New supply: 2000
