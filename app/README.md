# ICON Nft Rarity
ICON Nft Rarity is the tool to find out how rare an ICON NFT is. 

## Features
- Listing ranking collections from [Craft Network](https://craft.network/). 
- Filtering NFTs by traits
- Sorting NFTs by Rank and ID
- NFTs data analysis: create collection data by crawling NFT metadata, analyze NFTs rarity scrore (Rarity Score is based on [the article](https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c))


## Getting Started
1. Install node modules
2. Init collection data
- Create collection raw data in `data` folder
    ```
    cd api
    node data-tool.js create --contract <collection-contract-address>
    ```
- Analyze to transform collection raw data to rarity data in `data` folder
    ```
    cd api
    node data-tool.js analyze --contract <collection-contract-address>
    ```
3. Start API server side 
    ```
    cd api
    npm start
    ```

4. Start App client side
    ```
    cd app
    npm start
    ```
    



