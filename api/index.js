const nftData = require("./nft-data");
const nftAnalyzer = require("./nft-analyzer");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("NFT Rarity app running...");
});

app.get("/collection", (req, res) => {
  nftData.getCollections((collections) => {
    res.send(collections);
  });
});

app.get("/nft/:collection/:id", (req, res) => {
  var nft = nftAnalyzer.analyzeNFT(
    req.params.collection,
    parseInt(req.params.id)
  );
  res.send(nft);
});

app.listen(port, () => {
  console.log(`NFT Rarity app listening at http://localhost:${port}`);
});
