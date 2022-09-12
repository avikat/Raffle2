console.clear();
require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  TokenInfoQuery,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Testnet Credentials
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);

// Connecting to hedera testnet
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  tokenId = "0.0.47995974";
  contractId = "0.0.47995976";
  const tokenInfo2p1 = await tQueryFcn(tokenId);
  console.log(`- Token supply key: ${tokenInfo2p1.supplyKey.toString()}`);

  const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "mintFungibleToken", // Calling the mint function from smart contract
      new ContractFunctionParameters().addUint64(150) // Initial supply was 100 but we are trying to mint 150 token
    );
  const contractExecSubmit = await contractExecTx.execute(client);
  const contractExecRx = await contractExecSubmit.getReceipt(client);
  console.log(`- New tokens minted: ${contractExecRx.status.toString()}`);

  // Token query 3
  const tokenInfo3 = await tQueryFcn(tokenId);
  console.log(`- New token supply: ${tokenInfo3.totalSupply.low} \n`);

  // FUNCTIONS
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
// Footer;
