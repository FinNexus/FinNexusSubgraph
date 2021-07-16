const { createClient } = require('graphqurl');
const BN = require("bignumber.js");
var express = require('express');
var app = express();
//var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/34b6f08707964087bea0eb7571fdae41"));

//const sushuchef = new web3.eth.Contract(sushichefabi, sushichefaddress);
//npm i --save lokka lokka-transport-http
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
    transport: new Transport('https://api.thegraph.com/subgraphs/name/jeffqg123/phxoptions')
});

// type EntityPoolTLV @entity {
//     id: ID!
//     TimeStamp: BigInt
//     Token: Bytes
//     Amout: BigInt
//     UsdValue: BigInt
// }
client.query(`
    {
      entityPoolTLVs(first: 1000) {
        id
        TimeStamp
        Token
        Amout
        UsdValue
      }      
    }
`).then(result => {
   // console.log(result);
});

// type EntityNetWorth @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Pool: Bytes!
//         NetWorth: BigInt!
// }
client.query(`
    {
      entityNetWorths(first: 1000) {
        id
        TimeStamp
        Pool
        NetWorth
      }      
    }
`).then(result => {
    //console.log(result);
});

// type EntityActiveOption @entity {
//     id: ID! #token + timeid as id
//     TimeStamp: BigInt!
//         Underlying: BigInt!
//         CallAmount: BigInt!
//         CallUsdValue: BigInt!
//         PutAmount: BigInt!
//         PutUsdValue: BigInt!
// }

client.query(`
    {
      entityActiveOptions(first: 1000) {
        Underlying
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }      
    }
`).then(result => {
   // console.log(result);
});

// type EntityPremium @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Token: Bytes
//     CallAmount: BigInt
//     CallUsdValue: BigInt
//     PutAmount: BigInt
//     PutUsdValue: BigInt
// }
client.query(`
    {
      entityPremiums(first: 1000) {
        id
        TimeStamp
        Token
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }      
    }
`).then(result => {
    //console.log(result);
});

// type EntityFee @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Token: Bytes
//     CallAmount: BigInt
//     CallUsdValue: BigInt
//     PutAmount: BigInt
//     PutUsdValue: BigInt
// }
client.query(`
    {
      entityFees(first: 1000) {
        id
        TimeStamp
        Token
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }      
    }
`).then(result => {
    console.log(result);
});

/*
let basicUpPrices = new Map()
let basicDownPrices = new Map()
async function getBasicPriceData(networkname,timeBegin,timeEnd,poolAddress) {
    let querystr = `
    {
      leveragedTokenPriceEntities(first:1000,orderBy:timestamp, orderDirection:desc,where: {network:\"`
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

    let result = await client.query(querystr)
    let ltpes = result.leveragedTokenPriceEntities;
  //  console.log(result)
    for(let i=0;i<ltpes.length;i++) {
         let item = ltpes[i]
         basicUpPrices[item.timestamp] = item.uptokenprice.toString();
         basicDownPrices[item.timestamp] = item.downtokenprice.toString();
    }

    return {upprices:basicUpPrices,downprices:basicDownPrices}
}

async function getprices() {
    let res = await getBasicPriceData("rinkeby", 1620921600,1621222954, "0xb86ded607497fe38a36b26f7b5c3dfdca30ef955")
    //console.log(res)
    console.log("uptokenprice", res.upprices)
    console.log("-----------------------------------------")
    console.log("downtokenprice", res.downprices)
}
*/
//getprices()
// client.query(`
//     {
//       leveragedTokenPriceEntities(where: {network: "rinkeby"}) {
//         poolAddress
//         uptokenprice
//         downtokenprice
//         timestamp
//       }
//     }
// `).then(result => {
//     console.log(result);
// });


//exports.getBasicPriceData = getBasicPriceData

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
