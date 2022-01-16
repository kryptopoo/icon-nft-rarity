const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const get_all_traits = (nft_arr) => {
  let all_traits = {};
  let attr_count = {}; //track attribute count of each nft
  //   console.log(nft_arr.length);
  for (let i = 0; i < nft_arr.length; i++) {
    let nft = nft_arr[i];
    if (nft) {
      let attributes = nft.attributes;
      if (attr_count[attributes.length]) {
        attr_count[attributes.length] = attr_count[attributes.length] + 1;
      } else {
        attr_count[attributes.length] = 1;
      }
      for (let j = 0; j < attributes.length; j++) {
        let trait_type = attributes[j].key;
        let value = attributes[j].value;

        if (trait_type && value) {
          if (all_traits[trait_type]) {
            // trait exists
            all_traits[trait_type].sum++;
            if (all_traits[trait_type][value]) {
              // trait exists, value exists
              all_traits[trait_type][value]++;
            } else {
              // trait exists, value doesn't
              all_traits[trait_type][value] = 1;
            }
          } else {
            // trait or value don't exist
            all_traits[trait_type] = { [value]: 1, sum: 1 };
          }
        }
      }
    }
  }
  return { all_traits, attr_count };
};

const calculate_attribute_rarity = (nft, all_traits, attr_count) => {
  let attributes = nft.attributes;
  let sumoftraits = all_traits["Type"].sum;
  nft["trait_count"] = {
    count: attributes.length,
    percentile: attr_count[attributes.length] / sumoftraits,
    rarity_score: 1 / (attr_count[attributes.length] / sumoftraits),
  };
};

const calculate_nft_rarity = (nft, all_traits) => {
  let { attributes, missing_traits } = nft;
  nft["rarity_score"] = 0;
  for (let i = 0; i < attributes.length; i++) {
    nft["rarity_score"] += attributes[i]["rarity_score"];
  }

  for (let i = 0; i < missing_traits.length; i++) {
    nft["rarity_score"] += missing_traits[i]["rarity_score"];
  }
  nft["rarity_score"] += nft["trait_count"]["rarity_score"];
};

const set_trait_rarity = (nft, all_traits) => {
  if (nft) {
    let attributes = nft.attributes;
    let missing_traits = Object.keys(all_traits);
    for (let i = 0; i < attributes.length; i++) {
      let attribute = attributes[i];
      if (attribute) {
        let trait_type = attributes[i].key;
        let value = attributes[i].value;
        if (trait_type && value) {
          attribute["count"] = all_traits[trait_type][value];
          // remove traits that are present
          missing_traits = missing_traits.filter(
            (trait) => trait !== trait_type
          );
        }
      }
    }
    set_missing_traits(nft, missing_traits, all_traits);
  }
};

const get_trait_rarity_score = (trait_type, all_traits) => {
  return all_traits[trait_type].sum;
};

const set_missing_traits = (nft, missing_traits, all_traits) => {
  let totaltraits = all_traits["Type"].sum;
  nft["missing_traits"] = [];
  for (let i = 0; i < missing_traits.length; i++) {
    let missing_trait = missing_traits[i];
    let rarity_count = get_trait_rarity_score(missing_trait, all_traits);
    let missing_count = totaltraits - rarity_count;
    let percentile = missing_count / totaltraits;
    let rarity_score = 1 / percentile;

    nft["missing_traits"].push({
      trait_type: missing_trait,
      rarity_score,
      count: missing_count,
      percentile,
    });
  }
};

const set_nft_rarity = (nft, all_traits) => {
  let sumoftraits = all_traits["Type"].sum;
  if (nft) {
    let attributes = nft.attributes;
    for (let i = 0; i < attributes.length; i++) {
      let attribute = attributes[i];
      attribute["percentile"] = attribute["count"] / sumoftraits;
      attribute["rarity_score"] = 1 / (attribute["count"] / sumoftraits);
    }
  }
};

const analyzeNFT = (collectionName, id) => {
  const db = new JsonDB(
    new Config(`./data/${collectionName}`, true, true, "/")
  );
  let nfts = db.getData("/items");
  let nftIndex = db.getIndex("/items", id, "id");
  let { all_traits, attr_count } = get_all_traits(nfts);
  let nft = nfts[nftIndex];
  if (nft) {
    //filter_nft_attributes(nft);
    set_trait_rarity(nft, all_traits);
    set_nft_rarity(nft, all_traits);
    calculate_attribute_rarity(nft, all_traits, attr_count);
    calculate_nft_rarity(nft, all_traits, attr_count);
    return { ...nft };
  }
};

module.exports = {
  analyzeNFT: analyzeNFT,
};
