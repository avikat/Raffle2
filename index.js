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

async function main() {
  // STEP 1 ===================================
  console.log(`STEP 1 ===================================`);
  // Reading the contents of binary file containing the bytecode
  const bytecode = fs.readFileSync(
    "./Mint_Associate_Transfer_sol_MintAssoTransHTS.bin"
  );
  console.log(`- Done \n`);

  // STEP 2 ===================================
  console.log(`STEP 2 ===================================`);
  //Create a fungible token
  const tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("AmanCoin2") // Name of your Token
    .setTokenSymbol("APC2") // Token Symbols
    .setDecimals(0) // Set Decimal we chose no decimals
    .setInitialSupply(100) // Initial Supply
    .setTreasuryAccountId(treasuryId) //
    .setAdminKey(treasuryKey) // If admin key is not set then the token becomes immutable
    .setSupplyKey(treasuryKey) // Initially Supply Key Will be the treasuary
    .freezeWith(client) // Freeze the transaction with the client and making this ready for signing
    .sign(treasuryKey); // Sign the transaction

  const tokenCreateSubmit = await tokenCreateTx.execute(client); // Submitting the transaction
  const tokenCreateRx = await tokenCreateSubmit.getReceipt(client); // Getting Recipt of fthe transaction

  // Fetching the created token ID
  const tokenId = tokenCreateRx.tokenId;
  const tokenAddressSol = tokenId.toSolidityAddress();

  console.log(`- Token ID: ${tokenId}`);
  console.log(`- Token ID in Solidity format: ${tokenAddressSol}`);

  // Token query
  const tokenInfo1 = await tQueryFcn(tokenId); // Using token query helper function
  console.log(`- Initial token supply: ${tokenInfo1.totalSupply.low} \n`); // The will fetch us some informations

  //Create a file on Hedera and store the contract bytecode
  const fileCreateTx = new FileCreateTransaction() // Creating File Like Before on Hedera Net
    .setKeys([treasuryKey])
    .freezeWith(client);

  const fileCreateSign = await fileCreateTx.sign(treasuryKey); // Signing the transaction
  const fileCreateSubmit = await fileCreateSign.execute(client); // Execute the bytecode
  const fileCreateRx = await fileCreateSubmit.getReceipt(client); // Getting the reciept
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The smart contract bytecode file ID is ${bytecodeFileId}`);
  // After executing we will get an error of max file size so we need to solve this using file append transaction

  // Append contents to the file
  const fileAppendTx = new FileAppendTransaction()
    .setFileId(bytecodeFileId)
    .setContents(bytecode)
    .setMaxChunks(10) // Every transaction on hedera network is limited to 6 kB so we need to make chunks of the bytecode depending on its size
    .freezeWith(client); // Freeze for signing using client

  const fileAppendSign = await fileAppendTx.sign(treasuryKey);
  const fileAppendSubmit = await fileAppendSign.execute(client);
  const fileAppendRx = await fileAppendSubmit.getReceipt(client);

  // Conformation Message From Reciept
  console.log(`- Content added: ${fileAppendRx.status} \n`);

  // STEP 3 ===================================
  console.log(`STEP 3 ===================================`);
  // Create the smart contract
  const contractInstantiateTx = new ContractCreateTransaction() // Creating Instance of the class of the bytecode
    .setBytecodeFileId(bytecodeFileId)
    .setGas(3000000)
    .setConstructorParameters(
      new ContractFunctionParameters().addAddress(tokenAddressSol)
    );

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  // Token query 2.1
  const tokenInfo2p1 = await tQueryFcn(tokenId);
  console.log(`- Token supply key: ${tokenInfo2p1.supplyKey.toString()}`);

  // Update the fungible so the smart contract manages the supply
  const tokenUpdateTx = await new TokenUpdateTransaction() // Updating the token properties
    .setTokenId(tokenId)
    .setSupplyKey(contractId) // Setting the contract id as the supply key
    .freezeWith(client)
    .sign(treasuryKey);
  const tokenUpdateSubmit = await tokenUpdateTx.execute(client);
  const tokenUpdateRx = await tokenUpdateSubmit.getReceipt(client);
  console.log(`- Token update status: ${tokenUpdateRx.status}`);

  // Token query 2.2
  const tokenInfo2p2 = await tQueryFcn(tokenId);
  console.log(`- Token supply key: ${tokenInfo2p2.supplyKey.toString()} \n`);
  // Now the supply is managed by the contract

  // STEP 4 ===================================
  console.log(`STEP 4 ===================================`);
  //Execute a contract function (mint)
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

  //Execute a contract function (associate)
  const contractExecTx1 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "tokenAssociate",
      new ContractFunctionParameters().addAddress(aliceId.toSolidityAddress())
    )
    .freezeWith(client);
  const contractExecSign1 = await contractExecTx1.sign(aliceyKey);
  const contractExecSubmit1 = await contractExecSign1.execute(client);
  const contractExecRx1 = await contractExecSubmit1.getReceipt(client);
  console.log(
    `- Token association with Alice's account: ${contractExecRx1.status.toString()} \n`
  );

  //Execute a contract function (transfer)
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

  console.log(
    `- Token transfer from Treasury to Alice: ${contractExecRx2.status.toString()}`
  );

  const tB = await bCheckerFcn(treasuryId);
  const aB = await bCheckerFcn(aliceId);
  console.log(`- Treasury balance: ${tB} units of token ${tokenId}`);
  console.log(`- Alice balance: ${aB} units of token ${tokenId} \n`);

  // ========================================
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

// Successful Output
// STEP 1 ===================================
// - Done

// STEP 2 ===================================
// - Token ID: 0.0.47995974
// - Token ID in Solidity format: 0000000000000000000000000000000002dc5c46
// - Initial token supply: 100

// - The smart contract bytecode file ID is 0.0.47995975
// - Content added: SUCCESS

// STEP 3 ===================================
// - The smart contract ID is: 0.0.47995976
// - The smart contract ID in Solidity format is: 0000000000000000000000000000000002dc5c48

// - Token supply key: 302a300506032b657003210023e5b5cc9f147b2a704768a5702ed2383a11e52324cf79bdd11afc47ace1426f
// - Token update status: SUCCESS
// - Token supply key: 0.0.47995976

// STEP 4 ===================================
// - New tokens minted: SUCCESS
// - New token supply: 250

// - Token association with Alice's account: SUCCESS

// - Token transfer from Treasury to Alice: SUCCESS
// - Treasury balance: 200 units of token 0.0.47995974
// - Alice balance: 50 units of token 0.0.47995974
