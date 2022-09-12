console.clear();
import dotenv from "dotenv";

import {
  AccountId,
  PrivateKey,
  Client,
  TokenInfoQuery,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TokenGrantKycTransaction,
} from "@hashgraph/sdk";

dotenv.config();

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const treasuryId = operatorId;
const treasuryKey = operatorKey;
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);
const bobId = AccountId.fromString(process.env.BOB_ID);
const bobKey = PrivateKey.fromString(process.env.BOB_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const client2 = Client.forTestnet().setOperator(aliceId, aliceKey);

// const supplyKey = PrivateKey.generate();
const supplyKey = operatorKey;
const adminKey = operatorKey;
const kycKey = operatorKey;
const newKycKey = operatorKey;
const pauseKey = operatorKey;
const freezeKey = operatorKey;
const wipeKey = operatorKey;

async function main() {
  let tokenId = "0.0.48143202";
  let nftSerialId = 4;
  // MANUAL ASSOCIATION FOR ALICE'S ACCOUNT
  //   let associateAliceTx = await new TokenAssociateTransaction()
  //     .setAccountId(aliceId)
  //     .setTokenIds([tokenId])
  //     .freezeWith(client)
  //     .sign(aliceKey);
  //   let associateAliceTxSubmit = await associateAliceTx.execute(client);
  //   let associateAliceRx = await associateAliceTxSubmit.getReceipt(client);
  //   console.log(`\n- Alice NFT manual association: ${associateAliceRx.status}`);

  // QUERY TO CHECK CHANGE IN KYC KEY
  //   var tokenInfo = await tQueryFcn();
  //   console.log(`- KYC key for the NFT is: \n${tokenInfo.kycKey.toString()}`);

  // BALANCE CHECK 1
  let oB = await bCheckerFcn(treasuryId);
  let aB = await bCheckerFcn(aliceId);

  console.log(
    `- Treasury balance: ${oB[0]} NFTs of ID: ${tokenId} and ${oB[1]}`
  );
  console.log(`- Alice balance: ${aB[0]} NFTs of ID: ${tokenId} and ${aB[1]}`);

  // 1st TRANSFER NFT TREASURY -> ALICE against HBAR
  let tokenTransferTx = await new TransferTransaction()
    .addHbarTransfer(aliceId, -100)
    .addHbarTransfer(treasuryId, 100)
    .addNftTransfer(tokenId, nftSerialId, treasuryId, aliceId)
    .freezeWith(client)
    .sign(treasuryKey);

  let tokenTransferTx2Sign = await tokenTransferTx.sign(aliceKey);

  let tokenTransferSubmit = await tokenTransferTx2Sign.execute(client2);
  let tokenTransferRx = await tokenTransferSubmit.getReceipt(client2);
  console.log(
    `\n NFT transfer Treasury -> Alice status: ${tokenTransferRx.status} \n`
  );

  // BALANCE CHECK 2
  oB = await bCheckerFcn(treasuryId);
  aB = await bCheckerFcn(aliceId);

  console.log(
    `- Treasury balance: ${oB[0]} NFTs of ID: ${tokenId} and ${oB[1]}`
  );
  console.log(`- Alice balance: ${aB[0]} NFTs of ID: ${tokenId} and ${aB[1]}`);

  // TOKEN MINTER FUNCTION ==========================================
  async function tokenMinterFcn(CID) {
    mintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(CID)])
      .freezeWith(client);
    let mintTxSign = await mintTx.sign(supplyKey);
    let mintTxSubmit = await mintTxSign.execute(client);
    let mintRx = await mintTxSubmit.getReceipt(client);
    return mintRx;
  }

  // BALANCE CHECKER FUNCTION ==========================================
  async function bCheckerFcn(id) {
    let balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(id)
      .execute(client);
    return [
      balanceCheckTx.tokens._map.get(tokenId.toString()),
      balanceCheckTx.hbars,
    ];
  }
  // KYC ENABLE FUNCTION ==========================================
  async function kycEnableFcn(id) {
    let kycEnableTx = await new TokenGrantKycTransaction()
      .setAccountId(id)
      .setTokenId(tokenId)
      .freezeWithS(client)
      .sign(kycKey);
    let kycSubmitTx = await kycEnableTx.execute(client);
    let kycRx = await kycSubmitTx.getReceipt(client);
    return kycRx;
  }

  // TOKEN QUERY FUNCTION ==========================================
  async function tQueryFcn() {
    var tokenInfo = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .execute(client);
    return tokenInfo;
  }
}
main();

// Output -

// - Treasury balance: 4 NFTs of ID: 0.0.48143202 and 9953.76076905 ℏ
// - Alice balance: 1 NFTs of ID: 0.0.48143202 and 9900 ℏ

//  NFT transfer Treasury -> Alice status: SUCCESS

// - Treasury balance: 3 NFTs of ID: 0.0.48143202 and 10053.74119088 ℏ
// - Alice balance: 2 NFTs of ID: 0.0.48143202 and 9800 ℏ
