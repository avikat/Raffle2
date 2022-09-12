console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID); // Wallet/Account Address // Hedera Module
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY); // Hedera Module

// Setting the credentials to connect to hedera testnet
const client = Client.forTestnet().setOperator(operatorId, operatorKey); // Hedera Module

async function main() {
  // Step 1 for deplyoing a smart contract into hedera account
  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "LookupContract_sol_LookupContract.bin"
  );

  // Step 2
  // Create a file on Hedera and store the bytecode
  const fileCreateTx = new FileCreateTransaction() // Hedera Module
    .setContents(contractBytecode) // Using the above bytecode from previous step
    .setKeys([operatorKey]) // Using Private Key in array ...this will be used to manage the file on hedera network
    // .setMaxTransactionFee(new Hbar(1)) // We can also set max transacrion fee to be catious of how much hbar we are spending
    // We are setting to 3/4 th of a HBAR
    .freezeWith(client); // Freeze the transaction with the client and making this ready for signing

  const fileCreateSign = await fileCreateTx.sign(operatorKey); // Signing the transaction done on the previous step with our hedera testnet private key

  const fileCreateSubmit = await fileCreateSign.execute(client); // Executing the above sign on our client ie hedera testnet here

  const fileCreateRx = await fileCreateSubmit.getReceipt(client); // Fetching the reciept for our transaction

  // Filtering data from the reciept like file Id
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

  // Step 3
  // Instantiate the smart contract
  // Instantiate means create an instance/object of a class
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId) // Using the file id we got in reciept in previous step
    .setGas(100000) // 100k GAS(GAS is the unit)
    // Gas is used to pay for Hedera Smart Contract Service transactions like creating a contract, calling a smart contract function, or returning contract values.
    // Gas reflects the cost necessary to pay for the computational resources used to process transactions.
    // https://docs.hedera.com/guides/core-concepts/smart-contracts/gas-and-fees
    .setConstructorParameters(
      // Using the inbuilt constructor of the solidity contract using this hedera sdk function
      new ContractFunctionParameters().addString("Alice").addUint256(111111) // Alice string is first input and 11111 is phone number
    );

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client); // Now we submit this transaction using our client

  // Fetching receipt of our transaction
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );

  const contractId = contractInstantiateRx.contractId; // Fetching Contract ID from our reciept
  const contractAddress = contractId.toSolidityAddress(); // Fetching Contract Address from our reciept [ID in solidty format]

  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  // Step 4
  // Query the contract to check changes in state variable
  // Calling our smart contract
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId) // Using the smart contract id to call the function
    .setGas(100000) // Fixing the gas for our transaction
    .setFunction(
      // Calling the getMobileNumber Function
      "getMobileNumber",
      new ContractFunctionParameters().addString("Alice") // getMobileNumber requires one input passing the input as folowing
    );
  // .setMaxQueryPayment(0.00000001); // Setting Max Query Payment to minimum HBar which is 7 0's followed by 1

  const contractQuerySubmit = await contractQueryTx.execute(client); // Submitting the above query to our client

  const contractQueryResult = contractQuerySubmit.getUint256(0); // Fetching our contract result and we are expecting a Uint256 from the function

  console.log(
    `- Here's the phone number that you asked for: ${contractQueryResult} \n`
  );

  // Sub Step 1
  // Call contract function to update the state variable
  const contractExecuteTx = new ContractExecuteTransaction() // Here we are using a different module
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      "setMobileNumber", // Calling See
      new ContractFunctionParameters().addString("Bob").addUint256(222222)
    );
  const contractExecuteSubmit = await contractExecuteTx.execute(client);
  const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
  console.log(
    `- Contract function call status: ${contractExecuteRx.status} \n`
  );

  // Sub Step 2 Same as Step 4
  // Query the contract to check changes in state variable
  const contractQueryTx1 = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      "getMobileNumber",
      new ContractFunctionParameters().addString("Bob")
    );
  const contractQuerySubmit1 = await contractQueryTx1.execute(client);
  const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
  console.log(
    `- Here's the phone number that you asked for: ${contractQueryResult1} \n`
  );
}
main();

// Watch All The Steps Here
// https://hashscan.io/#/testnet/account/0.0.47672314
