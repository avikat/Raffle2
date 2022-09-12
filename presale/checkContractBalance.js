// console.clear();
import dotenv from "dotenv";
import {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  TransferTransaction,
  ContractInfoQuery,
  ContractCreateFlow,
  Hbar,
  AccountCreateTransaction,
} from "@hashgraph/sdk";
import { readFileSync } from "fs";
dotenv.config();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);

// const contractId = "0.0.48195199";

const contractId = "0.0.48195235";
const gasLimit = 50000;

async function main() {
  await contractCallQueryFcn(contractId, gasLimit, "getBalance");
}

main();

async function contractCallQueryFcn(cId, gasLim, fcnName) {
  const contractQueryTx = new ContractCallQuery()
    .setContractId(cId)
    .setGas(gasLim)
    .setFunction(fcnName);
  const contractQuerySubmit = await contractQueryTx.execute(client);
  const contractQueryResult = contractQuerySubmit.getUint256(0);
  console.log(
    `- Contract balance (getBalance fcn): ${contractQueryResult * 1e-8} ℏ`
  );
}
