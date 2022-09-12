console.clear();

require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenInfoQuery,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  const tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("AmanCoinWOSupplyKey") // Name of your Token
    .setTokenSymbol("APC_WOSK") // Token Symbols
    .setDecimals(0) // Set Decimal we chose no decimals
    .setInitialSupply(1000) // Initial Supply
    .setTreasuryAccountId(treasuryId) //
    .setAdminKey(treasuryKey) // If admin key is not set then the token becomes immutable
    .setSupplyKey(treasuryKey) // Initially Supply Key Will be the treasuary
    .freezeWith(client) // Freeze the transaction with the client and making this ready for signing
    .sign(treasuryKey); // Sign the transaction

  const tokenCreateSubmit = await tokenCreateTx.execute(client); // Submitting the transaction
  const tokenCreateRx = await tokenCreateSubmit.getReceipt(client); // Getting Recipt of fthe transaction

  const tokenId = tokenCreateRx.tokenId;
  const tokenAddressSol = tokenId.toSolidityAddress();
  console.log(`- Token ID: ${tokenId}`);
  console.log(`- Token ID in Solidity format: ${tokenAddressSol}`);

  const tokenInfo1 = await tQueryFcn(tokenId); // Using token query helper function
  console.log(`- Initial token supply: ${tokenInfo1.totalSupply.low} \n`); // The will fetch us some informations

  async function tQueryFcn(tId) {
    let info = await new TokenInfoQuery().setTokenId(tId).execute(client);
    return info;
  }

  async function bCheckerFcn(aId) {
    let balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(aId)
      .execute(client);
    return balanceCheckTx.tokens._map.get(tokenId.toString());
  }
}

main();

// Output -

// - Token ID: 0.0.48110167
// - Token ID in Solidity format: 0000000000000000000000000000000002de1a57
// - Initial token supply: 1000
