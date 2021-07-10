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
    transport: new Transport('https://api.thegraph.com/subgraphs/name/jeffqg123/leveragedpoolsubgraph')
});

// type EntityLeveragePool @entity {
//     id: ID!
//         name: String
//     underlyingAddress: Bytes
//     underlyingName: String
// }
client.query(`
    {
      entityLeveragePools(first: 5) {
        id
        name
        underlyingAddress
        underlyingName
      }      
    }
`).then(result => {
    console.log(result);
});

// type EntityLeverageFactory @entity {
//     id: ID!
// }
client.query(`
    {
      entityLeverageFactories(first: 5) {
        id
      }      
    }
`).then(result => {
    console.log("query entityLeverageFactorys")
    console.log(result);
});

// type EntityTradeItem @entity {
//     id: ID!
//         from: Bytes!
//         timestamp: BigInt!
//         status: String!
//         underlying: Bytes!
//         leveragetype: String!
//         value: BigInt!
//         price: BigInt!
//         amount: BigInt!
// }
client.query(`
    {
      entityTradeItems(first: 5) {
        id
        from
        timestamp
        status
        underlying
        leveragetype
        value
        price
        amount
      }      
    }
`).then(result => {
    console.log("query entityTradeItems")
    console.log(result);
});
// type EntityTotalTVL @entity {
//     id: ID!
//         timestamp: BigInt!
//         value: BigInt!
// }
client.query(`
    {
      entityTotalTVLs(first: 5) {
        id
        timestamp
        value
      }      
    }
`).then(result => {
    console.log("query entityLeverageFactorys")
    console.log(result);
});

// type EntityTVL @entity {
//     id: ID!
//         timestamp: BigInt!
//         poolAddress: Bytes!
//         token: Bytes!
//         amount: BigInt!
//         value: BigInt!
// }
client.query(`
    {
      entityTVLs(first: 5) {
        id
        timestamp
        poolAddress
        token
        amount
        value
      }      
    }
`).then(result => {
    console.log("query entityTVLs")
    console.log(result);
});

// type EntityInterestAPY @entity {
//     id: ID!
//         timestamp: BigInt!
//         poolAddress: Bytes
//     token:  Bytes
//     apy:  BigInt
// }

client.query(`
    {
      entityInterestAPYs(first: 5) {
        id
        timestamp
        poolAddress
        token
        apy
      }      
    }
`).then(result => {
    console.log("query entityInterestAPYs")
    console.log(result);
});

// type EntityTradeVol @entity {
//     id: ID!
//         timestamp: BigInt!
//         pool: Bytes!
//         buyLeverAmount: BigInt
//     buyLeverValue: BigInt
//     sellLeverAmount: BigInt
//     sellLeverValue: BigInt
//     buyHedgeAmount: BigInt
//     buyHedgeValue: BigInt
//     sellHedgeAmount: BigInt
//     sellHedgeValue: BigInt
// }
client.query(`
    {
      entityTradeVols(first: 5) {
        id
        timestamp
        pool
        buyLeverAmount
        buyLeverValue
        sellLeverAmount
        sellLeverValue
        buyHedgeAmount
        buyHedgeValue
        sellHedgeAmount
        sellHedgeValue
      }      
    }
`).then(result => {
    console.log("query entityTradeVols")
    console.log(result);
});
// type EntityStakePool @entity {
//     id: ID!
//         underlyingAddress: Bytes!
//         underlyingName: String!
//         interestrate: BigInt!
// }
client.query(`
    {
      entityStakePools(first: 5) {
        id
        underlyingAddress
        underlyingName
        interestrate
      }      
    }
`).then(result => {
    console.log("query entityStakePools")
    console.log(result);
});

// type EntityFee @entity {
//     id: ID!
//         timestamp: BigInt!
//         token: Bytes!
//         amount: BigInt!
//         value: BigInt!
// }
client.query(`
    {
      entityFees(first: 5) {
        id
        timestamp
        token
        amount
        value
      }      
    }
`).then(result => {
    console.log("query entityFees")
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
