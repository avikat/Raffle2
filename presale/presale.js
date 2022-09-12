// console.clear();
import dotenv from "dotenv";
import {
  AccountId,
  PrivateKey,
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
  Hbar,
} from "@hashgraph/sdk";
import { readFileSync } from "fs";
import Web3 from "web3";

dotenv.config();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);

const aliceClient = Client.forTestnet().setOperator(aliceId, aliceKey);

const contractId = "0.0.48205163";
let abi;
const web3 = new Web3();

async function main() {
  abi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "x",
          type: "string",
        },
      ],
      name: "Start",
      type: "event",
    },
    {
      inputs: [],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const presale = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(10000000)
    .setFunction(
      "mint"
      //   new ContractFunctionParameters().addAddress(
      //     // operatorId.toSolidityAddress()
      //   ) // Token address
    )
    .freezeWith(client)
    .sign(operatorKey);
  const transferTokenTx = await presale.execute(client);
  const transferTokenRx = await transferTokenTx.getReceipt(client);

  await getEventsFromRecord(contractId);

  console.log(`Contract status: ${transferTokenRx.status} \n`);
}

async function getEventsFromRecord(contractId) {
  console.log(`\nGetting event(s) from record`);

  // calling "set_message" with the current date/time to generate a new event
  //   const newMessage = new Date().toLocaleString();
  // generate function call with function name and parameters
  const functionCallAsUint8Array = encodeFunctionCall("mint", []);

  console.log(`Calling set_message to trigger new event`);
  // execute the transaction calling the set_message contract function
  const transaction = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunctionParameters(functionCallAsUint8Array)
    .setGas(100000)
    .execute(client);

  // a record contains the output of the function
  // as well as events, let's get events for this transaction
  const record = await transaction.getRecord(client);

  // query the contract's mint function to witness update
  await queryGetMessage(contractId);

  // the events from the function call are in record.contractFunctionResult.logs.data
  // let's parse the logs using web3.js
  // there may be several log entries
  record.contractFunctionResult.logs.forEach((log) => {
    // convert the log.data (uint8Array) to a string
    let logStringHex = "0x".concat(Buffer.from(log.data).toString("hex"));

    // get topics from log
    let logTopics = [];
    log.topics.forEach((topic) => {
      logTopics.push("0x".concat(Buffer.from(topic).toString("hex")));
    });

    // decode the event data
    const event = decodeEvent("Start", logStringHex, logTopics.slice(1));

    // output the from address stored in the event
    console.log(
      `Record event: from '${AccountId.fromSolidityAddress(
        event.from
      ).toString()}' update to '${event.message}'`
    );
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

async function queryGetMessage(contractId) {
  console.log(`\nmint Query`);
  // generate function call with function name and parameters
  const functionCallAsUint8Array = encodeFunctionCall("mint", []);

  // query the contract
  const contractCall = await new ContractCallQuery()
    .setContractId(contractId)
    .setFunctionParameters(functionCallAsUint8Array)
    .setQueryPayment(new Hbar(2))
    .setGas(100000)
    .execute(client);

  let results = decodeFunctionResult("mint", contractCall.bytes);
  console.log(results);
}
main();
