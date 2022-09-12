console.clear();

import dotenv from "dotenv";
import {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  CustomRoyaltyFee,
  CustomFixedFee,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
  TokenMintTransaction,
  Hbar,
} from "@hashgraph/sdk";
import { promises } from "fs";

dotenv.config();
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const treasuryId = operatorId;

const adminKey = operatorKey;
const supplyKey = operatorKey;
const pauseKey = operatorKey;
const freezeKey = operatorKey;
const wipeKey = operatorKey;
const treasuryKey = operatorKey;

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // DEFINE CUSTOM FEE SCHEDULE
  let nftCustomFee = await new CustomRoyaltyFee()
    .setNumerator(5)
    .setDenominator(100)
    .setFeeCollectorAccountId(treasuryId)
    .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(5)));

  let CID = JSON.parse(await promises.readFile("cid.json"));

  let nftCreate = await new TokenCreateTransaction()
    .setTokenName("AP Collection 3")
    .setTokenSymbol("AP_NFT_3")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(CID.length)
    .setCustomFees([nftCustomFee])
    .setAdminKey(adminKey)
    .setSupplyKey(supplyKey)
    .setPauseKey(pauseKey)
    .setFreezeKey(freezeKey)
    .setWipeKey(wipeKey)
    .freezeWith(client)
    .sign(treasuryKey);

  let nftCreateTxSign = await nftCreate.sign(adminKey);
  let nftCreateSubmit = await nftCreateTxSign.execute(client);
  let nftCreateRx = await nftCreateSubmit.getReceipt(client);
  let tokenId = nftCreateRx.tokenId;

  console.log(`Created NFT with Token ID: ${tokenId} \n`);

  // TOKEN QUERY TO CHECK THAT THE CUSTOM FEE SCHEDULE IS ASSOCIATED WITH NFT
  var tokenInfo = await new TokenInfoQuery()
    .setTokenId(tokenId)
    .execute(client);
  console.table(tokenInfo.customFees[0]);

  // let nftLeaf = [];
  // for (var i = 0; i < CID.length; i++) {
  //   nftLeaf[i] = await tokenMinterFcn(CID[i], tokenId);
  //   console.log(
  //     `Created NFT ${tokenId} with serial: ${nftLeaf[i].serials[0].low}`
  //   );
  // }
}

async function tokenMinterFcn(CID, tokenId) {
  let mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata([Buffer.from(CID)])
    .freezeWith(client);
  let mintTxSign = await mintTx.sign(supplyKey);
  let mintTxSubmit = await mintTxSign.execute(client);
  let mintRx = await mintTxSubmit.getReceipt(client);
  return mintRx;
}
main();

// Output-

// ┌────────────────────────┬────────┬────────┬────────┬──────────┬─────────────────┬───────────┬────────────────────────┬──────────────────────┬─────────┬─────┬──────┬──────────┐
// │        (index)         │ shard  │ realm  │  num   │ aliasKey │ aliasEvmAddress │ _checksum │ _feeCollectorAccountId │ _denominatingTokenId │ _amount │ low │ high │ unsigned │
// ├────────────────────────┼────────┼────────┼────────┼──────────┼─────────────────┼───────────┼────────────────────────┼──────────────────────┼─────────┼─────┼──────┼──────────┤
// │ _feeCollectorAccountId │ [Long] │ [Long] │ [Long] │   null   │      null       │   null    │                        │                      │         │     │      │          │
// │      _fallbackFee      │        │        │        │          │                 │           │          null          │         null         │ [Long]  │     │      │          │
// │       _numerator       │        │        │        │          │                 │           │                        │                      │         │  5  │  0   │  false   │
// │      _denominator      │        │        │        │          │                 │           │                        │                      │         │ 100 │  0   │  false   │
// └────────────────────────┴────────┴────────┴────────┴──────────┴─────────────────┴───────────┴────────────────────────┴──────────────────────┴─────────┴─────┴──────┴──────────┘
// Created NFT 0.0.48143202 with serial: 1
// Created NFT 0.0.48143202 with serial: 2
// Created NFT 0.0.48143202 with serial: 3
// Created NFT 0.0.48143202 with serial: 4
// Created NFT 0.0.48143202 with serial: 5
