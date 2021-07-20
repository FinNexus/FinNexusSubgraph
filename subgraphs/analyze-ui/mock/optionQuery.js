const { createClient } = require('graphqurl');
const Decimal = require("decimal.js");
const BN = require("bn.js");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));
//var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/75c431806c0d49ee9868d4fdcef025bd"));

var { abi } = require('./erc20token.json');
var tokenabi = abi;
var levertool = require('./leverageTokenQuery');
//npm i --save lokka lokka-transport-http
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
const client = new Lokka({
    transport: new Transport('https://api.thegraph.com/subgraphs/name/jeffqg123/phxoptions')
});

const PRICE_DECIMAL = new BN("100000000");
const EIGHTEEN_DECIMAL = new BN("1000000000000000000");
const NETWORTH_DECIMAL = new BN("100000000");
const underLying = ["", "btc", "eth", "mkr", "snx", "link"];
const optype = ["call", "put"];

var getDate = levertool.getDate;
var getValueOrZero = levertool.GetValueOrZero;
var getDecimalBN = levertool.getDecimalBN;
var getPriceDecimalBN = levertool.getPriceDecimalBN;

// function getDate(unixtime) {
//     var a = new Date(unixtime * 1000);
//     var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();
//     date=date>=10?""+date:"0"+date;
//
//     var hour = a.getHours();
//     hour=hour>=10?""+hour:"0"+hour;
//
//     var min = a.getMinutes()
//     min=min>=10?""+min:"0"+min;
//
//     var sec = a.getSeconds();
//     sec=sec>=10?""+sec:"0"+sec;
//
//     var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
//     return time;
// };

// type EntityPoolTLV @entity {
//     id: ID!
//     TimeStamp: BigInt
//     Token: Bytes
//     Amout: BigInt
//     UsdValue: BigInt
// }
/*
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
*/

export async function getTvls() {
    let querystr = `
    {
       entityPoolTLVs(first: 1000, orderBy: TimeStamp, orderDirection: asc) {
            id
            TimeStamp
            Token
            Amout
            UsdValue
      } 
    }`
    let result = await client.query(querystr)
    let tvls = result.entityPoolTLVs;
    console.log(tvls)
    let alltvls = new Map();
    for(let i=0;i<tvls.length;i++) {
        let item = tvls[i];
        let tk = new web3.eth.Contract(tokenabi,item.Token);
        let name = await tk.methods.symbol().call();
        let decimal = await tk.methods.decimals().call();
        let tokenDecimal = new Decimal(getDecimalBN(decimal).toString(10));
        let priceDecimal = new Decimal(getPriceDecimalBN(decimal).toString(10));

        let tvl = {
            Token: name,
            Date:getDate(item.TimeStamp),
            Amount: getValueOrZero(item.Amount,tokenDecimal),
            UsdValue: getValueOrZero(item.Amount,priceDecimal)
        }

        if(alltvls[name]==undefined) {
            alltvls[name] = [];
        }

        alltvls[name].push(tvl);
     }
    //console.log(alltvls);
    return alltvls
}

//getTvls();
//return;

// type EntityNetWorth @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Pool: Bytes!
//         NetWorth: BigInt!
// }
// client.query(`
//     {
//       entityNetWorths(first: 1000) {
//         id
//         TimeStamp
//         Pool
//         NetWorth
//       }
//     }
// `).then(result => {
//     //console.log(result);
// });

export async function getNetWorths() {
    let querystr = `
    {
      entityNetWorths(first: 1000,orderby: TimeStamp,orderDirection: asc) {
        id
        TimeStamp
        Pool
        NetWorth
      } 
    }`

    let result = await client.query(querystr)
    let networths = result.entityNetWorths;
    //console.log(tvls)
    let allNetWorths = new Map();
    for(let i=0;i<networths.length;i++) {
        let item = networths[i];
        //console.log(name,decimal)
        let wrth = {
            Pool: item.Pool,
            Date: getDate(item.TimeStamp),
            NetWorth: (new Decimal(item.NetWorth).div(new Decimal(NETWORTH_DECIMAL.toString()))).toNumber().toFixed(2),
        }

        if(allNetWorths[item.Pool]==undefined) {
            allNetWorths[item.Pool] = [];
        }

        allNetWorths[item.Pool].push(wrth);
    }

    console.log(allNetWorths);

    return allNetWorths
}

//getNetWorths();

//return;

// type EntityActiveOption @entity {
//     id: ID! #token + timeid as id
//     TimeStamp: BigInt!
//         Underlying: BigInt!
//         CallAmount: BigInt!
//         CallUsdValue: BigInt!
//         PutAmount: BigInt!
//         PutUsdValue: BigInt!
// }

// client.query(`
//     {
//       entityActiveOptions(first: 1000) {
//         Underlying
//         CallAmount
//         CallUsdValue
//         PutAmount
//         PutUsdValue
//       }
//     }
// `).then(result => {
//    // console.log(result);
// });

export async function getActiveOptions() {
    let querystr = `
    {
      entityActiveOptions(first: 1000) {
        Underlying
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }        
    }`
    let result = await client.query(querystr);
    let activeOptions = result.entityActiveOptions;
    //console.log(activeOptions)
    let allActiveOptions = new Map();
    for(let i=0;i<activeOptions.length;i++) {
        let item = activeOptions[i];
        //console.log(name,decimal)
        let underLyingName = underLying[parseInt(item.Underlying)]
        let activeopt = {
            Underlying: underLyingName,
            CallAmount: getValueOrZero(item.CallAmount,EIGHTEEN_DECIMAL),
            CallUsdValue: getValueOrZero(item.CallUsdValue,getPriceDecimalBN(18)),
            PutAmount: getValueOrZero(item.PutAmount,EIGHTEEN_DECIMAL),
            PutUsdValue: getValueOrZero(item.PutUsdValue,getPriceDecimalBN(18)),
        }

        if(allActiveOptions[underLyingName]==undefined) {
            allActiveOptions[underLyingName] = [];
        }

        allActiveOptions[underLyingName].push(activeopt);
    }

    console.log(allActiveOptions);

    return allActiveOptions;
}

//getActiveOptions();

//return;

// type EntityPremium @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Token: Bytes
//     CallAmount: BigInt
//     CallUsdValue: BigInt
//     PutAmount: BigInt
//     PutUsdValue: BigInt
// }
// client.query(`
//     {
//       entityPremiums(first: 1000) {
//         id
//         TimeStamp
//         Token
//         CallAmount
//         CallUsdValue
//         PutAmount
//         PutUsdValue
//       }
//     }
// `).then(result => {
//     //console.log(result);
// });

export async function getEntityPremiums() {
    let querystr = `
    {
      entityPremiums(first: 1000,orderby: TimeStamp, orderDirection: asc) {
        id
        TimeStamp
        Token
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }       
    }`
    let result = await client.query(querystr);
    let premiums = result.entityPremiums;
    //console.log(premiums)
    let allPremiums = new Map();
    for(let i=0;i<premiums.length;i++) {
        let item = premiums[i];
        let tk = new web3.eth.Contract(tokenabi,item.Token);
        let name = await tk.methods.symbol().call();
        let decimal = await tk.methods.decimals().call();

        let premium = {
            TokenName: name,
            Date: getDate(item.TimeStamp),
            CallAmount: getValueOrZero(item.CallAmount,getDecimalBN(decimal)),
            CallUsdValue: getValueOrZero(item.CallUsdValue,getPriceDecimalBN(decimal)),
            PutAmount: getValueOrZero(item.PutAmount,getDecimalBN(decimal)),
            PutUsdValue: getValueOrZero(item.PutUsdValue,getPriceDecimalBN(decimal)),
        }

        if(allPremiums[name]==undefined) {
            allPremiums[name] = [];
        }

        allPremiums[name].push(premium);
    }
    console.log(allPremiums);

    return allPremiums;
}
//getEntityPremiums();
//return;

// type EntityFee @entity {
//     id: ID!
//         TimeStamp: BigInt!
//         Token: Bytes
//     CallAmount: BigInt
//     CallUsdValue: BigInt
//     PutAmount: BigInt
//     PutUsdValue: BigInt
// }
// client.query(`
//     {
//       entityFees(first: 1000) {
//         id
//         TimeStamp
//         Token
//         CallAmount
//         CallUsdValue
//         PutAmount
//         PutUsdValue
//       }
//     }
// `).then(result => {
//     //console.log(result);
// });

export async function getEntityFees() {
    let querystr = `
    {
      entityFees(first: 1000,orderby: TimeStamp, orderDirection: asc) {
        id
        TimeStamp
        Token
        CallAmount
        CallUsdValue
        PutAmount
        PutUsdValue
      }       
    }`
    let result = await client.query(querystr);
    let fees = result.entityFees;
    //console.log(premiums)
    let allFees = new Map();
    for(let i=0;i<fees.length;i++) {
        let item = fees[i];
        let tk = new web3.eth.Contract(tokenabi,item.Token);
        let name = await tk.methods.symbol().call();
        let decimal = await tk.methods.decimals().call();
        let fee = {
            TokenName: name,
            Date: getDate(item.TimeStamp),
            CallAmount: getValueOrZero(item.CallAmount,getDecimalBN(decimal)),
            CallUsdValue: getValueOrZero(item.CallUsdValue,getPriceDecimalBN(decimal)),
            PutAmount: getValueOrZero(item.PutAmount,getDecimalBN(decimal)),
            PutUsdValue: getValueOrZero(item.PutUsdValue,getPriceDecimalBN(decimal)),
        }

        if(allFees[name]==undefined) {
            allFees[name] = [];
        }
        allFees[name].push(fee);
    }

    console.log(allFees);
    return allFees;
}

//getEntityFees()
//return;

// type EntityOptionItem @entity {
//     id: ID!
//         Date: BigInt!
//         Status: String!
//         UnderlyingAssets: BigInt!
//         Type: BigInt!
//         Amount: BigInt
//     UsdValue: BigInt
//     StrikePrice: BigInt
//     Premium: BigInt
//     PL: BigInt
// }

// client.query(`
//     {
//       entityOptionItems(first: 1000) {
//         id
//         Date
//         Status
//         UnderlyingAssets
//         Type
//         Amount
//         UsdValue
//         StrikePrice
//         Premium
//         PL
//       }
//     }
// `).then(result => {
//     console.log(result);
// });

export async function getEntityOptionItems() {
    let querystr = `
    {
       entityOptionItems(first: 1000,orderby: id, orderDirection: asc) {
            id
            Date
            Status
            UnderlyingAssets
            Type
            Amount
            UsdValue
            StrikePrice
            Premium
            PL
      }
    }`
    let result = await client.query(querystr);
    let optionItems = result.entityOptionItems;
    //console.log(premiums)
    let allOptionItems = new Map();

    for(let i=0;i<optionItems.length;i++) {
        let item = optionItems[i];
        let name = underLying[parseInt(item.UnderlyingAssets)];
        let option = {
            OptionId:item.id,
            Date: getDate(item.TimeStamp),
            Status: item.Status,
            Underlying: name,
            Type: optype[parseInt(item.Type)],
            Amount: getValueOrZero(item.Amount,EIGHTEEN_DECIMAL),
            UsdValue: getValueOrZero(item.UsdValue,EIGHTEEN_DECIMAL),
            StrikePrice: getValueOrZero(item.StrikePrice,PRICE_DECIMAL),
            Premium: getValueOrZero(item.Premium,PRICE_DECIMAL),
            PL: getValueOrZero(item.Premium,PRICE_DECIMAL)
        }

        if(allOptionItems[name]==undefined) {
            allOptionItems[name] = [];
        }
        allOptionItems[name].push(option);
    }

    console.log(allOptionItems);
    return allOptionItems;
}

//getEntityOptionItems();


