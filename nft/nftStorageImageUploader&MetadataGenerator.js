console.clear();
// No Edge Case Handling
import { NFTStorage, File } from "nft.storage";
import { filesFromPath } from "files-from-path";
import path from "path";
import fs from "fs";

const NFT_STORAGE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY1OTg0YzgxYjhjMDM3ZjE0QTVFMzVBNTE5NDk4YzkyYjY5RjhhMTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTkwOTU3NjAwNywibmFtZSI6IkhlZGVyYSBUZXN0bmV0In0.VzBe0r5l9mygV-oEpFw9tm3Ya7t68jUoqaY3NSoxAzU";

const token = NFT_STORAGE_API_KEY;
const directoryPath = "nft/test_assets";
const metaDataJson = "nft/test_metadata/_metadata.json";

async function main() {
  // const files = filesFromPath(directoryPath, {
  //   pathPrefix: path.resolve(directoryPath),
  //   hidden: true,
  // });

  // console.log("Files From Path Output--->", files);

  // const storage = new NFTStorage({ token });

  // console.log(`storing file(s) from ${directoryPath}`);

  // const cid = await storage.storeDirectory(files);

  // console.log({ cid });

  // const status = await storage.status(cid);

  // console.log(status);

  const metaData = JSON.parse(await fs.promises.readFile(metaDataJson));

  // console.log("Initial Metadata--->", metaData);

  metadataUpdater(metaData).then(async (updatedMetadata) => {
    console.log("Final CID--->", updatedMetadata);
    await fs.promises.writeFile("cid.json", JSON.stringify(updatedMetadata));

    // const cids = [];
    // await cidGenerator(updatedMetadata, cids);
    // console.log("Final CID's List->", cids);
  });
}

const metadataUpdater = async (data) => {
  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

  return new Promise(async (resolve, reject) => {
    const res = [];
    data.forEach(async (element, index) => {
      // console.log(index);
      const imgData = await fs.promises.readFile(
        `${directoryPath}/${index + 1}.png`
      );
      data[index].image = new File([imgData], `${index + 1}.png`, {
        type: "image/png",
      });
      // data[index].image = element.image.replace(
      //   "LinkIsRepleacedWhenUploadingWithTurtleMoonTools",
      //   cid
      // );
      const metadataIPFSLink = await client.store({
        ...element,
        image: new File([imgData], `${index + 1}.png`, {
          type: "image/png",
        }),
      });

      // XXXXXXXXXXXXXX RES is not getting formed in sorted manner XXXXXXXXXXXXXXXX
      res.push(metadataIPFSLink.url);
      if (res.length === data.length) resolve(res);
    });
  });
};

// const cidGenerator = async (metadata, cids) => {
//   return new Promise(async (resolve, reject) => {
//     metadata.forEach(async (element, index) => {
//       console.log(element.image);
//       const metadataIPFSLink = await client.store(element);
//       console.log("Metadata IPFS->", metadataIPFSLink);
//       console.log(`Metadata URI: `, metadataIPFSLink.url);

//       cids[index] = metadataIPFSLink.url;

//       if (index === metadata.length - 1) resolve();
//     });
//   });
// };
main();
