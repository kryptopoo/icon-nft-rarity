# ICON Nft Rarity
ICON Nft Rarity is the tool to find out how rare an ICON NFT is. 

## Features
- Built on [ICON blockchain](https://iconrepublic.org)
- Listing ranking collections from [Craft Network](https://craft.network/). 
- Filtering NFTs by traits
- Sorting NFTs by Rank and ID
- NFTs data analysis: create collection data by crawling NFT metadata, analyze NFTs rarity score (Rarity Score is based on [the article](https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c))

### Video Demo

[![ICON Metaverse Gallery Demo](https://img.youtube.com/vi/JSGkd-aRbyw/0.jpg)](https://www.youtube.com/watch?v=JSGkd-aRbyw)

### Live Demo
https://icon-nft-rarity-app.herokuapp.com

### Screenshots

<img src="https://user-images.githubusercontent.com/44108463/150624586-365b637c-7a11-4c26-b5d2-9009f39e2212.png" width="800"/>


<img src="https://user-images.githubusercontent.com/44108463/150624597-054ce67b-319e-4c11-95e0-0c824dd2e437.png" width="800"/>



## Getting Started
1. Install node modules
2. Init collection data
- Create collection raw data in `data` folder
    ```
    cd api
    node data-tool.js create --contract <collection-contract-address>
    ```
    params: `--fromId` `--toId` is optional
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
    



