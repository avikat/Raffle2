const data = [
  {
    nftId: {
      tokenId: {
        shard: { low: 0, high: 0, unsigned: false },
        realm: { low: 0, high: 0, unsigned: false },
        num: { low: 817591, high: 0, unsigned: false },
        _checksum: null,
      },
      serial: { low: 1135, high: 0, unsigned: false },
    },
    accountId: {
      shard: { low: 0, high: 0, unsigned: false },
      realm: { low: 0, high: 0, unsigned: false },
      num: { low: 644576, high: 0, unsigned: false },
      aliasKey: null,
      aliasEvmAddress: null,
      _checksum: null,
    },
    creationTime: {
      seconds: { low: 1650421348, high: 0, unsigned: false },
      nanos: { low: 383713000, high: 0, unsigned: false },
    },
    metadata: {
      type: "Buffer",
      data: [
        105, 112, 102, 115, 58, 47, 47, 98, 97, 102, 121, 114, 101, 105, 103,
        112, 116, 53, 55, 97, 104, 114, 113, 119, 107, 112, 114, 101, 107, 51,
        51, 54, 112, 55, 54, 98, 120, 52, 53, 112, 97, 97, 50, 51, 106, 107, 54,
        108, 98, 97, 119, 107, 101, 52, 121, 98, 108, 110, 104, 109, 119, 52,
        114, 55, 50, 101, 47, 109, 101, 116, 97, 100, 97, 116, 97, 46, 106, 115,
        111, 110,
      ],
    },
    ledgerId: { _ledgerId: { type: "Buffer", data: [0] } },
    allowanceSpenderAccountId: {
      shard: { low: 0, high: 0, unsigned: false },
      realm: { low: 0, high: 0, unsigned: false },
      num: { low: 0, high: 0, unsigned: false },
      aliasKey: null,
      aliasEvmAddress: null,
      _checksum: null,
    },
  },
];
const buf = Buffer.from(
  [
    105, 112, 102, 115, 58, 47, 47, 98, 97, 102, 121, 114, 101, 105, 103, 112,
    116, 53, 55, 97, 104, 114, 113, 119, 107, 112, 114, 101, 107, 51, 51, 54,
    112, 55, 54, 98, 120, 52, 53, 112, 97, 97, 50, 51, 106, 107, 54, 108, 98,
    97, 119, 107, 101, 52, 121, 98, 108, 110, 104, 109, 119, 52, 114, 55, 50,
    101, 47, 109, 101, 116, 97, 100, 97, 116, 97, 46, 106, 115, 111, 110,
  ],
  "utf8"
);

console.log(buf.toString());

// Output - ipfs://bafyreigpt57ahrqwkprek336p76bx45paa23jk6lbawke4yblnhmw4r72e/metadata.json
