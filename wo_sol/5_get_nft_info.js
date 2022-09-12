console.clear();

require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TokenNftInfoQuery,
  NftId,
  TokenId,
} = require("@hashgraph/sdk");

const operatorId = AccountId.fromString(process.env.MAINNET_ID);
const operatorKey = PrivateKey.fromString(process.env.MAINNET_PVKEY);

const client = Client.forMainnet().setOperator(operatorId, operatorKey);

async function main() {
  //   const nftId = "0.0.48137732";
  const nftId = new NftId(TokenId.fromString("0.0.817591"), "1135");

  const nftInfos = await new TokenNftInfoQuery()
    .setNftId(nftId)
    .execute(client);

  console.log(JSON.stringify(nftInfos));
}

main();
