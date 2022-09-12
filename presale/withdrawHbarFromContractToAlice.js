console.clear();
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
const bobId = AccountId.fromString(process.env.BOB_ID);
const bobKey = PrivateKey.fromString(process.env.BOB_PVKEY);

// const contractId = "0.0.48195199";
const aliceClient = Client.forTestnet().setOperator(aliceId, aliceKey);
const bobClient = Client.forTestnet().setOperator(bobId, bobKey);

const contractId = "0.0.48195226";
const gasLimit = 50000;

async function main() {
  // Checking Contract Balance Before Withdrawing
  await contractCallQueryFcn(contractId, gasLimit, "getBalance");

  const payableAmt = 0;
  const moveAmt = 20;

  console.log(`- Contract TRANSFERS ${moveAmt} ℏ to Alice...`);
  const tParams = await contractParamsBuilderFcn(bobId, moveAmt, 3, []);
  const tRx = await contractExecuteFcn(
    contractId,
    gasLimit,
    "transferHbar",
    tParams,
    payableAmt
  );

  // Checking Contract Balance After Withdrawing
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

async function contractExecuteFcn(cId, gasLim, fcnName, params, amountHbar) {
  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(cId)
    .setGas(gasLim)
    .setFunction(fcnName, params)
    .setPayableAmount(amountHbar);
  const contractExecuteSubmit = await contractExecuteTx.execute(bobClient);
  const contractExecuteRx = await contractExecuteSubmit.getReceipt(bobClient);
  return contractExecuteRx;
}

async function contractParamsBuilderFcn(aId, amountHbar, section, tId) {
  let builtParams = [];
  if (section === 2) {
    builtParams = new ContractFunctionParameters()
      .addAddress(aId.toSolidityAddress())
      .addAddress(tId.toSolidityAddress());
  } else if (section === 3) {
    builtParams = new ContractFunctionParameters()
      .addAddress(aId.toSolidityAddress())
      .addUint256(amountHbar * 1e8);
  } else {
  }
  return builtParams;
}
