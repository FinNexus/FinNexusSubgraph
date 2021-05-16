const { createClient } = require('graphqurl');
const BN = require("bignumber.js");
var express = require('express');
var app = express();
//var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/34b6f08707964087bea0eb7571fdae41"));

//const sushuchef = new web3.eth.Contract(sushichefabi, sushichefaddress);

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
    transport: new Transport('https://api.thegraph.com/subgraphs/name/jeffqg123/leveragedpoolsubgraph')
});

client.query(`
    {
      leveragedTokenPriceEntities(where: {network: "rinkeby"}) {
        poolAddress
        uptokenprice
        downtokenprice
        timestamp
      }
    }
`).then(result => {
   // console.log(result);
});

let networkname = "rinkeby"
let timeBegin = 1620921600
let timeEnd = 1621008000
//let poolAddress = "0xb86ded607497fe38a36b26f7b5c3dfdca30ef955";
let poolAddress = "0x91c7edbebde88fbc6f4aa2480f9f4e261ba6c6ea"

let querystr = `
    {
      leveragedTokenPriceEntities(where: {network:\"`
        + networkname
        + `\",timestamp_gte:\"` + timeBegin + '\"'
        + `,timestamp_lt:\"` + timeEnd + `\"`
        +`,poolAddress:\"` + poolAddress +`\"`
        +`}) {
        poolAddress
        uptokenprice
        downtokenprice
        timestamp
      }
    }`

console.log(querystr)

client.query(querystr).then(result => {
    //console.log(result);
});

let basicUpPrices = new Map()
let basicDownPrices = new Map()
async function getBasicPriceData(networkname,timeBegin,timeEnd,poolAddress) {

    let querystr = `
    {
      leveragedTokenPriceEntities(where: {network:\"`
        + networkname
        + `\",timestamp_gte:\"` + timeBegin + '\"'
        + `,timestamp_lt:\"` + timeEnd + `\"`
        +`,poolAddress:\"` + poolAddress +`\"`
        +`}) {
        poolAddress
        uptokenprice
        downtokenprice
        timestamp
      }
    }`

    let result = await client.query(querystr)
    let ltpes = result.leveragedTokenPriceEntities;
    for(let i=0;i<ltpes.length;i++) {
         let item = ltpes[i]
         basicUpPrices[item.timestamp] = item.uptokenprice;
         basicDownPrices[item.timestamp] = item.downtokenprice;
    }

    return {upprices:basicDownPrices,downprices:basicDownPrices}
}

async function getprices() {
    let res = await getBasicPriceData("rinkeby", 1620921600, 1621008000, "0xb86ded607497fe38a36b26f7b5c3dfdca30ef955")
    //console.log(res)
     console.log("uptokenprice", res.upprices)
     console.log("-----------------------------------------")
     console.log("downtokenprice", res.downprices)
}

getprices()

exports.getBasicPriceData = getBasicPriceData

// client.query(querystr).then(result => {
//     let ltpes = result.leveragedTokenPriceEntities;
//     for(let i=0;i<ltpes.length;i++) {
//         let item = ltpes[i]
//         basicUpPrices[item.timestamp] = item.uptokenprice;
//         basicDownPrices[item.timestamp] = item.downtokenprice;
//     }
//
//     return {upprices:basicDownPrices,downprices:basicDownPrices}
// });
