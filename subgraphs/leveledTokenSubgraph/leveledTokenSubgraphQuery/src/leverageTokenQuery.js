const { createClient } = require('graphqurl');

const BN = require("bn.js");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));

var { abi } = require('./erc20token.json');
var tokenabi = abi;

//npm i --save lokka lokka-transport-http
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
    transport: new Transport('https://api.thegraph.com/subgraphs/name/jeffqg123/leveragedpoolsubgraph')
});

const PRICE_DECIMAL = new BN("1000000");
const EIGHTEEN_DECIMAL = new BN("1000000000000000000");
const EIGHT_DECIMAL = new BN("100000000");
const NETWORTH_DECIMAL = new BN("100000000");

const underLying = ["", "btc", "eth", "mkr", "snx", "link"];
const optype = ["call", "put"];

function getDecimalBN(decimal) {
    var decimalBN = "1";
    for(var i=0;i<decimal;i++) {
        decimalBN = decimalBN + "0";
    }

    let tokenDecimal = new BN(decimalBN);
    let priceDecimal = EIGHTEEN_DECIMAL.div(tokenDecimal).mul(EIGHT_DECIMAL);

    //let allDecimal = priceDecimal.mul(tokenDecimal);
    //console.log(decimal,decimalBN,priceDecimal.toString(10));

    return priceDecimal;
}

function getDate(unixtime) {
    var a = new Date(unixtime * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    date=date>=10?""+date:"0"+date;

    var hour = a.getHours();
    hour=hour>=10?""+hour:"0"+hour;

    var min = a.getMinutes()
    min=min>=10?""+min:"0"+min;

    var sec = a.getSeconds();
    sec=sec>=10?""+sec:"0"+sec;

    var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
};

// type EntityLeveragePool @entity {
//     id: ID!
//         name: String
//     underlyingAddress: Bytes
//     underlyingName: String
// }
// client.query(`
//     {
//       entityLeveragePools(first: 5) {
//         id
//         name
//         underlyingAddress
//         underlyingName
//       }
//     }
// `).then(result => {
//     console.log(result);
// });

async function getLeveragePools() {
    let querystr = `
    {
      entityLeveragePools(first: 50) {
        id
        name
        underlyingAddress
        underlyingName
      }
    }`
    let result = await client.query(querystr)
    let leveragePools = result.entityLeveragePools;
    //console.log(tvls)
    let allLeveragePools = new Map();
    for(let i=0;i<leveragePools.length;i++) {
        let item = leveragePools[i];
        //console.log(name,decimal)
        let pool = {
            Underlying: item.underlyingAddress,
            PoolName: item.name,
            UnderlyingName: item.underlyingName
        }

        allLeveragePools[item.id] = pool;
    }
    console.log(allLeveragePools);
    return allLeveragePools;
}

//
// getLeveragePools()
// return;

// type EntityLeverageFactory @entity {
//     id: ID!
// }
// client.query(`
//     {
//       entityLeverageFactories(first: 5) {
//         id
//       }
//     }
// `).then(result => {
//     console.log("query entityLeverageFactorys")
//     console.log(result);
// });


// type EntityTradeItem @entity {
//     id: ID!
//     pool: Bytes!
//     from: Bytes!
//     timestamp: BigInt!
//     status: String
//     settlement: Bytes
//     leverageToken: Bytes
//     leveragetype: String
//     value: BigInt!
//     price: BigInt!
//     amount: BigInt!
// }
// client.query(`
//     {
//       entityTradeItems(first: 5) {
//         id
//         pool
//         from
//         timestamp
//         status
//         settlement
//         leverageToken
//         leveragetype
//         value
//         price
//         amount
//       }
//     }
// `).then(result => {
//     console.log("query entityTradeItems")
//     console.log(result);
// });

async function getEntityTradeItems() {
    let pools = await getLeveragePools();
    let querystr = `
    {
      entityTradeItems(first: 1000, orderBy: timestamp, orderDirection: asc) {
        id
        pool
        from
        timestamp
        status
        settlement
        leverageToken
        leveragetype
        value
        price
        amount
      }
    }`
    let result = await client.query(querystr)
    let tradeItems = result.entityTradeItems;
    console.log(tradeItems);
    let allTradeItems = new Map();
    for(let i=0;i<tradeItems.length;i++) {
        let item = tradeItems[i];
        let tk = new web3.eth.Contract(tokenabi,item.settlement);
        let settleName = await tk.methods.symbol().call();

        let tradeitem = {
            Date: getDate(item.TimeStamp),
            Owner: item.from,
            Status: item.status,
            Settlement: settleName,
            Underlying: pools[item.pool].UnderlyingName,
            Leveragetype: item.leveragetype,
            Amount: new BN(item.amount).div(EIGHTEEN_DECIMAL),
            Value: new BN(item.value).div(EIGHTEEN_DECIMAL.mul(PRICE_DECIMAL)),
            Price: new BN(item.price).div(PRICE_DECIMAL)
        }
        allTradeItems[item.id].push(tradeitem);
    }
    //console.log(alltvls);
    return allTradeItems
}

//getEntityTradeItems();
//return;

// type EntityTotalTVL @entity {
//     id: ID!
//         timestamp: BigInt!
//         value: BigInt!
// }

// client.query(`
//     {
//       entityTotalTVLs(first: 5) {
//         id
//         timestamp
//         value
//       }
//     }
// `).then(result => {
//     console.log("query entityLeverageFactorys")
//     console.log(result);
// });

// type EntityTVL @entity {
//     id: ID!
//         timestamp: BigInt!
//         token: Bytes!
//         amount: BigInt!
//         value: BigInt!
// }
// client.query(`
//     {
//       entityTVLs(first: 5) {
//         id
//         timestamp
//         token
//         amount
//         value
//       }
//     }
// `).then(result => {
//     console.log("query entityTVLs")
//     console.log(result);
// });

async function getTvls() {
    let querystr = `
    {
       entityTVLs(first: 1000, orderBy: TimeStamp, orderDirection: asc) {
            id
            timestamp
            token
            amount
            value
      } 
    }`
    let result = await client.query(querystr)
    let tvls = result.entityPoolTLVs;
    //console.log(tvls)
    let alltvls = new Map();
    for(let i=0;i<tvls.length;i++) {
        let item = tvls[i];
        let tk = new web3.eth.Contract(tokenabi,item.Token);
        let name = await tk.methods.symbol().call();
        let decimal = await tk.methods.decimals().call();
        //console.log(name,decimal)
        let tvl = {
            Date:getDate(item.timestamp),
            Amount: new BN(item.amount).div(new BN(decimal)),
            UsdValue: new BN(item.value).div(new BN(decimal).mul(PRICE_DECIMAL))
        }

        if(alltvls[name]==undefined) {
            alltvls[name] = [];
        }
        alltvls[name].push(tvl);
    }
    console.log(alltvls);
    return alltvls
}

// type EntityInterestAPY @entity {
//     id: ID!
//         timestamp: BigInt!
//         poolAddress: Bytes
//     token:  Bytes
//     apy:  BigInt
// }
// client.query(`
//     {
//       entityInterestAPYs(first: 5) {
//         id
//         timestamp
//         poolAddress
//         token
//         apy
//       }
//     }
// `).then(result => {
//     console.log("query entityInterestAPYs")
//     console.log(result);
// });

async function getApys() {
    let querystr = `
    {
       entityInterestAPYs(first: 1000, orderBy: timestamp, orderDirection: asc) {
            id
            timestamp
            pool
            token
            apy
      } 
    }`
    let result = await client.query(querystr)
    let apys = result.entityInterestAPYs;
    console.log(apys);

    let allapys = new Map();
    for(let i=0;i<apys.length;i++) {
        let item = apys[i];
        let tk = new web3.eth.Contract(tokenabi,item.token);
        let name = await tk.methods.symbol().call();

        let apy = {
            Date:getDate(item.timestamp),
            Token: name,
            Apy: new BN(item.apy).div(new BN("10000"))
        }
        if(allapys[name]==undefined) {
            allapys[name] = [];
        }
        allapys[name].push(apy);
    }

    console.log(allapys);
    return allapys
}

//getApys();
//return;


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

// client.query(`
//     {
//       entityTradeVols(first: 5) {
//         id
//         timestamp
//         token
//         buyLeverAmount
//         buyLeverValue
//         sellLeverAmount
//         sellLeverValue
//         buyHedgeAmount
//         buyHedgeValue
//         sellHedgeAmount
//         sellHedgeValue
//       }
//     }
// `).then(result => {
//     console.log("query entityTradeVols")
//     console.log(result);
// });

async function getTradeVol() {
    let querystr = `
    {
       entityTradeVols(first: 1000, orderBy: timestamp, orderDirection: asc) {
        id
        timestamp
        token
        buyLeverAmount
        buyLeverValue
        sellLeverAmount
        sellLeverValue
        buyHedgeAmount
        buyHedgeValue
        sellHedgeAmount
        sellHedgeValue
      } 
    }`
    let result = await client.query(querystr)
    let vols = result.entityTradeVols;
    console.log(vols);

    let allvols = new Map();
    for(let i=0;i<vols.length;i++) {
        let item = vols[i];
        let tk = new web3.eth.Contract(tokenabi,item.token);
        let name = await tk.methods.symbol().call();
        let vol = {
            TimeStamp: item.timestamp,
            BuyLeverAmount: item.buyLeverAmount,
            BuyLeverValue: item.buyLeverValue,
            SellLeverAmount: sellLeverAmount,
            SellLeverValue: sellLeverValue,
            BuyHedgeAmount: buyHedgeAmount,
            BuyHedgeValue: buyHedgeValue,
            SellHedgeAmount: sellHedgeAmount,
            SellHedgeValue: sellHedgeValue,
        }

        if(allvols[name]==undefined) {
            allvols[name] = [];
        }
        allvols[name].push(vol);
    }

    console.log(allvols);
    return allvols
}


// type EntityStakePool @entity {
//     id: ID!
//         underlyingAddress: Bytes!
//         underlyingName: String!
//         interestrate: BigInt!
// }
// client.query(`
//     {
//       entityStakePools(first: 5) {
//         id
//         underlyingAddress
//         underlyingName
//         interestrate
//       }
//     }
// `).then(result => {
//     console.log("query entityStakePools")
//     console.log(result);
// });

// type EntityFee @entity {
//     id: ID!
//         timestamp: BigInt!
//         token: Bytes!
//         amount: BigInt!
//         value: BigInt!
// }
// client.query(`
//     {
//       entityFees(first: 5) {
//         id
//         timestamp
//         token
//         amount
//         value
//       }
//     }
// `).then(result => {
//     console.log("query entityFees")
//     console.log(result);
// });

async function getTradeFee() {
    let querystr = `
    {
       entityFees(first: 1000, orderBy: timestamp, orderDirection: asc) {
        id
        timestamp
        token
        amount
        value
      } 
    }`
    let result = await client.query(querystr)
    let fees = result.entityFees;
    //console.log(fees);
    let allfees = new Map();
    for(let i=0;i<fees.length;i++) {
        let item = fees[i];
        let tk = new web3.eth.Contract(tokenabi,item.token);
        let name = await tk.methods.symbol().call();
        let fee = {
            TimeStamp: item.timestamp,
            Token: name,
            Amount: item.amount,
            Value: item.value
        }
        if(allfees[name]==undefined) {
            allfees[name] = [];
        }
        allfees[name].push(fee);
    }

    console.log(allfees);
    return allfees
}

// type EntityPrice @entity {
// id: ID!
//     timestamp: BigInt
// pool: Bytes!
//     leverSettlement: Bytes!
//     leverageprice: BigInt!
//     hedgeSettlement: Bytes!
//     hedgeprice: BigInt!
// }

async function getLeverHedgeTokenPrice() {
    let pools = await getLeveragePools();
    let querystr = `
    {
       entityPrices(first: 1000, orderBy: timestamp, orderDirection: asc) {
            id
            timestamp
            pool
            leverSettlement
            leverageprice
            hedgeSettlement
            hedgeprice
      } 
    }`
    let result = await client.query(querystr)
    let prices = result.entityPrices;
    console.log(prices);
    let allprices = new Map();
    for(let i=0;i<prices.length;i++) {
        let item = prices[i];
        let name = pools[item.pool].PoolName;
        let tk = new web3.eth.Contract(tokenabi,item.leverSettlement);
        let leverdecimal = await tk.methods.decimals().call();
        leverdecimal = getDecimalBN(leverdecimal)

        tk = new web3.eth.Contract(tokenabi,item.hedgeSettlement);
        let hedgedecimal = await tk.methods.decimals().call();
        hedgedecimal = getDecimalBN(hedgedecimal);

        let price = {
            TimeStamp: item.timestamp,
            Leverageprice: (new BN(item.leverageprice).div(PRICE_DECIMAL)).div(leverdecimal).toNumber().toFixed(2),
            Hedgeprice: (new BN(item.hedgeprice).div(PRICE_DECIMAL)).div(leverdecimal).toNumber().toFixed(2)
        }
        if(allprices[name]==undefined) {
            allprices[name] = [];
        }
        allprices[name].push(price);
    }

    console.log(allprices);
    return allprices;
}

//getLeverHedgeTokenPrice();


//////////////////////////////////////////////////////////////////////////////
const Decimal = require("decimal");

function getDecimalBN(decimal) {
    var decimalBN = "1";
    for(var i=0;i<decimal;i++) {
        decimalBN = decimalBN + "0";
    }
    return new BN(decimalBN);
}

function getPriceDecimalBN(decimal) {
    var decimalBN = "1";
    for(var i=0;i<decimal;i++) {
        decimalBN = decimalBN + "0";
    }

    let tokenDecimal = new BN(decimalBN);
    let priceDecimal = EIGHTEEN_DECIMAL.div(tokenDecimal).mul(EIGHT_DECIMAL);

    //let allDecimal = priceDecimal.mul(tokenDecimal);
    //console.log(decimal,decimalBN,priceDecimal.toString(10));

    return priceDecimal;
}

function getDate(unixtime) {
    var a = new Date(unixtime * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    date=date>=10?""+date:"0"+date;

    var hour = a.getHours();
    hour=hour>=10?""+hour:"0"+hour;

    var min = a.getMinutes()
    min=min>=10?""+min:"0"+min;

    var sec = a.getSeconds();
    sec=sec>=10?""+sec:"0"+sec;

    var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
};

function GetValueOrZero(val,decim) {
    val = val==null? new BN(0).toString(10): val.toString(10);
    console.log(val);
    console.log(decim.toString(10));

    val = (new Decimal(val).div(new Decimal(decim.toString(10)))).toNumber().toFixed(3)
    return val;
}

async function getEntityTradeItem(txhash) {
    let querystr = `
    {
        entityTradeItems(first: 10,where:{id:"`+ txhash + `"}) {
            id
            pool
            from
            timestamp
            status
            settlement
            settlementAmount
            settlementPrice
            leverageToken
            leveragetype
            value
            price
            amount
        }
    }`

    console.log(querystr);

    let result = await client.query(querystr);
    let item = result.entityTradeItems[0];
    console.log(item);

    let tk = new web3.eth.Contract(tokenabi,item.settlement);
    let settleName = await tk.methods.symbol().call();
    let decimal = await tk.methods.decimals().call();

    let tokenDecimal = getDecimalBN(decimal);
    let priceDecimal = getPriceDecimalBN(decimal);

    let wholedec = priceDecimal.mul(tokenDecimal);
    console.log(wholedec.toString(10))

    console.log(getDecimalBN(decimal).toString(10),getPriceDecimalBN(decimal).toString(10))

    let val = GetValueOrZero(new BN(item.value),priceDecimal);
    val = GetValueOrZero(val,tokenDecimal);

    let tradeitem = {
        Settlement: settleName,
        Value: val,
        SettlementAmount: GetValueOrZero(item.settlementAmount,tokenDecimal)
    }

    console.log(tradeitem)
}

let testid = "0xc776b393a4ca3ffee13956d2a1e0ad7e48af91df109ef7b09e525d00e8cb10e8";
getEntityTradeItem(testid);








