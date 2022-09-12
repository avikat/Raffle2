import {
  Client,
  PrivateKey,
  ContractCreateTransaction,
  FileCreateTransaction,
  AccountId,
  Hbar,
  ContractExecuteTransaction,
  ContractCallQuery,
  Provider,
  Signer,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";
import * as fs from "fs";
import Web3 from "web3";

dotenv.config();

let abi;
const constructMessage = "Hello Hedera";
const web3 = new Web3();
// Testnet Credentials
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceyKey = PrivateKey.fromString(process.env.ALICE_PVKEY);

// Connecting to hedera testnet
const client = Client.forTestnet().setOperator(aliceId, aliceyKey);

async function main() {
  abi = JSON.parse(fs.readFileSync("events/contracts/abi.json", "utf8"));
  const contractId = "0.0.48208832"; //without asssociate
  // const contractId = "0.0.48206529" //with associate
  // const contractId = "0.0.48207994" //associate moved down after mint
  await getEventsFromRecord(contractId);
}

async function getEventsFromRecord(contractId) {
  console.log(`\nGetting event(s) from record`);

  console.log(`Calling mint to trigger new event`);
  const contractExecTx2 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction("mint")
    .setPayableAmount("2")
    .setGas(3000000)
    .setTransactionMemo("Hello world 1------andkaefa")
    .freezeWith(client);
  const contractExecSign2 = await contractExecTx2.sign(aliceyKey);
  const contractExecSubmit2 = await contractExecSign2.execute(client);
  const record = await contractExecSubmit2.getReceipt(client);

  console.log(
    "Records--->",
    record.contractFunctionResult.logs,
    contractExecSubmit2
  );
  // await queryGetMessage(contractId);

  record.contractFunctionResult.logs.forEach((log) => {
    let logStringHex = "0x".concat(Buffer.from(log.data).toString("hex"));

    let logTopics = [];
    log.topics.forEach((topic) => {
      logTopics.push("0x".concat(Buffer.from(topic).toString("hex")));
    });

    const event = decodeEvent("InputData", logStringHex, logTopics.slice(1));

    // const event2 = decodeEvent("InputData", logStringHex, logTopics.slice(2));

    console.log(event);

    // console.log(
    //   `Record event: from '${AccountId.fromSolidityAddress(
    //     event.from
    //   ).toString()}' update to '${event.message}'`
    // );
  });
}

function encodeFunctionCall(functionName, parameters) {
  const functionAbi = abi.find(
    (func) => func.name === functionName && func.type === "function"
  );
  const encodedParametersHex = web3.eth.abi
    .encodeFunctionCall(functionAbi, parameters)
    .slice(2);
  return Buffer.from(encodedParametersHex, "hex");
}

function decodeEvent(eventName, log, topics) {
  const eventAbi = abi.find(
    (event) => event.name === eventName && event.type === "event"
  );
  const decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
  return decodedLog;
}

void main();
