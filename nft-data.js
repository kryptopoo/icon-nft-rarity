const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const fs = require('fs');

const axios = require('axios');

const IconSdk = require('icon-sdk-js');
const IconService = IconSdk.default;

const provider = new IconService.HttpProvider('https://ctz.solidwallet.io/api/v3');
const iconService = new IconService(provider);

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const callMethod = (from, to, method, params, callback) => {
    let txObj = new IconService.IconBuilder.CallBuilder();
    if (from !== '') txObj.from(from);
    txObj.to(to).method(method).params(params);
    let call = txObj.build();
    iconService
        .call(call)
        .execute()
        .then((txRs) => {
            callback(txRs);
        });
};

const fletchCollection = (name, description, contract, fromId = 0, toId = 0) => {
    // get total
    this.callMethod('', contract, 'get_nft_count', {}, async (txRs) => {
        var total = IconService.IconConverter.toNumber(txRs);
        console.log('total nft', IconService.IconConverter.toNumber(txRs));

        var db = new JsonDB(new Config(`./data/${name}`, true, true, '/'));
        db.push('/name', name, true);
        db.push('/description', description, true);
        db.push('/total', total, true);
        //db.push("/items", [], false);

        if (!db.exists('/items')) db.push('/items', [], true);

        if (toId == 0) toId = total;
        for (let i = fromId; i <= toId; i++) {
            // get metadata
            this.callMethod('', contract, 'tokenURI', { _id: IconService.IconConverter.toHex(i) }, (txRs) => {
                console.log(`tokenURI ${i} ${txRs}`);
                axios.get(txRs).then((res) => {
                    if (db.getIndex('/items', i, 'id') == -1) db.push(`/items[]`, res.data, true);
                });
            });

            await this.sleep(200);
        }

        await this.sleep(1000);
        console.log(`total items ${db.count('/items')}`);
    });
};

const getCollections = (callback) => {
    let collections = [];
    fs.readdir('./data', (err, files) => {
        console.log(err, files);
        files.forEach((fileName) => {
            var db = new JsonDB(new Config(`./data/${fileName}`, true, true, '/'));
            collections.push({
                name: db.getData(`/name`),
                description: db.getData(`/description`),
                total: db.getData(`/total`)
            });
        });
        callback(collections);
    });
};

module.exports = {
    // callMethod: callMethod,
    // sleep: sleep,
    fletchCollection: fletchCollection,
    getCollections: getCollections
};
