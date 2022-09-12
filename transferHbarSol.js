console.clear();
require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  FileCreateTransaction,
  FileAppendTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  TokenUpdateTransaction,
  ContractExecuteTransaction,
  TokenInfoQuery,
  AccountBalanceQuery,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Testnet Credentials
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceyKey = PrivateKey.fromString(process.env.ALICE_PVKEY);

// Connecting to hedera testnet
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
tokenId = "0.0.47995974";
contractId = "0.0.47995976";
async function main() {
  const bytecode = fs.readFileSync(
    "./Mint_Associate_Transfer_sol_MintAssoTransHTS.bin"
  );
  console.log(`- Done \n`);

  const contractExecTx2 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "tokenTransfer",
      new ContractFunctionParameters()
        .addAddress(treasuryId.toSolidityAddress())
        .addAddress(aliceId.toSolidityAddress())
        .addInt64(50)
    )
    .freezeWith(client);
  const contractExecSign2 = await contractExecTx2.sign(treasuryKey);
  const contractExecSubmit2 = await contractExecSign2.execute(client);
  const contractExecRx2 = await contractExecSubmit2.getReceipt(client);
}
main();
