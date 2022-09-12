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

async function main() {
  // const contractBytecode = readFileSync("presale/sendBar2Contract.bin");
  // const contractBytecode = readFileSync("presale/withdrawHbar2Address.bin");
  // const contractBytecode = readFileSync(
  //   "presale/presale_presale_sol_Presale.bin"
  // );
  const contractBytecode = readFileSync(
    "presale/presale_presale_sol_Raffle.bin"
  );

  // Deploy the smart contract on Hedera
  console.log(`\n- Deploying contract...`);
  let gasLimit = 1000000;

  const [contractId, contractAddress] = await contractDeployFcn(
    contractBytecode,
    gasLimit
  );
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress}`
  );

  // const tokenId = AccountId.fromString("0.0.47931765");
  // console.log(`\n- Token ID (for association with contract later): ${tokenId}`);
}

main();

async function contractDeployFcn(bytecode, gasLim) {
  const contractCreateTx = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(gasLim);
  const contractCreateSubmit = await contractCreateTx.execute(client);
  const contractCreateRx = await contractCreateSubmit.getReceipt(client);
  const contractId = contractCreateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  return [contractId, contractAddress];
}

// - Created Treasury account 0.0.48195197 that has a balance of 100 ℏ
// - Created Alice's account 0.0.47995973 that has a balance of ℏ

// - Deploying contract...
// - The smart contract ID is: 0.0.48195199
// - The smart contract ID in Solidity format is: 0000000000000000000000000000000002df667f

// - Token ID (for association with contract later): 0.0.47931765
// - Caller (Operator) PAYS 10 ℏ to contract (fallback/receive)...
// - Contract balance (getBalance fcn): 10 ℏ

// - Caller (Operator) PAYS 21 ℏ to contract (payable function)...
// - Contract balance (getBalance fcn): 31 ℏ

// With Specific Address

// - Deploying contract...
// - The smart contract ID is: 0.0.48195226
// - The smart contract ID in Solidity format is: 0000000000000000000000000000000002df669a
