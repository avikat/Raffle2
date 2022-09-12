// console.clear();
import dotenv from "dotenv";
import { AccountId, PrivateKey, Client } from "@hashgraph/sdk";
import { readFileSync } from "fs";
dotenv.config();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);

const someId = AccountId.fromString("0.0.48201952");
async function main() {
  console.log("Solidity Address -", someId.toSolidityAddress());
}

main();
