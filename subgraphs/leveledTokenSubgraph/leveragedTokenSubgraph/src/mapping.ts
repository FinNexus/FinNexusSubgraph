import { BigInt,ethereum,Address,log,dataSource} from "@graphprotocol/graph-ts"

import {
  BuyHedge,
  BuyLeverage,
  Liquidate,
  Rebalance,
  Redeem,
  SellHedge,
  SellLeverage,
  Swap
} from "../generated/templates/leveragePool/leveragePool"

import {
 leverageFactory as leverageFactorysc,
 CreateLeveragePool,
 CreateStakePool
} from "../generated/leverageFactory/leverageFactory"

import {
    leveragePool as leveragePoolTemplate,
    stakePool as stakePoolTemplate
} from "../generated/templates"

import {
    leveragePool
} from "../generated/templates/leveragePool/leveragePool"

import {
    stakePool
} from "../generated/templates/stakePool/stakePool"

import {
    phxoracle
} from "../generated/phxoracle/phxoracle"

import {
    erc20,
    Transfer,
} from "../generated/templates/erc20/erc20"

import {
    Borrow,
    Interest,
    Redeem,
    Repay,
    Stake,
    Unstake
} from "../generated/templates/stakePool/stakePool"

import {EntityLeveragePool,
        EntityLeverageFactory,
        EntityTradeItem,
        EntityTVL,
        EntityInterestAPY,
        EntityTradeVol,
        EntityFee,
        EntityStakePool,
        EntityTotalTVL,
        EntityPrice
} from "../generated/schema"

let ONE_DAY_SECONDS = 3600*24;
//let ONE_DAY_SECONDS = 1;
let FACTORY_ADDR = "0xe3f94b86ceadd68e1a5ba062100b89344b2e54b7";
let ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000");
let NATIVE_TK_NAME = "Matic";
export function handleCreateLeveragePool(event: CreateLeveragePool): void {
    //begin monitor pool event
    leveragePoolTemplate.create(event.params.leveragePool);
    log.info("created pool address,{}",[event.params.leveragePool.toHex()]);
    let factoryEntity = EntityLeverageFactory.load(event.address.toHex());
    if(factoryEntity==null) {
        factoryEntity = new EntityLeverageFactory(event.address.toHex());
        factoryEntity.save();
    }

    let poolEntity = EntityLeveragePool.load(event.params.leveragePool.toHex());
    if (poolEntity == null){
         let leveragesc = leveragePool.bind(event.params.leveragePool);
         poolEntity = new EntityLeveragePool(event.params.leveragePool.toHex());
         let tk = erc20.bind(event.params.tokenB);

         poolEntity.underlyingAddress = event.params.tokenB;
         if( poolEntity.underlyingAddress==ZERO_ADDRESS) {
             poolEntity.underlyingName = NATIVE_TK_NAME;
         } else {
             poolEntity.underlyingName = tk.symbol();
         }

         let info = leveragesc.getHedgeInfo();
         if(info.value2==ZERO_ADDRESS) {
             poolEntity.name = NATIVE_TK_NAME;
         } else {
             let rk = erc20.bind(info.value2);
             poolEntity.name = rk.name();
         }

         poolEntity.save();
    }

}

export function handleCreateStakePool(event: CreateStakePool): void {
    stakePoolTemplate.create(event.params.stakePool);

    let factoryEntity = EntityLeverageFactory.load(event.address.toHex());
    if(factoryEntity==null) {
        factoryEntity = new EntityLeverageFactory(event.address.toHex());
        factoryEntity.save();
    }

    let poolEntity = EntityStakePool.load(event.params.stakePool.toHex())
    if (poolEntity == null){
        poolEntity = new EntityStakePool(event.params.stakePool.toHex());
        poolEntity.underlyingAddress = event.params.token;
        if( event.params.token==ZERO_ADDRESS) {
            poolEntity.underlyingName = NATIVE_TK_NAME;
        } else {
            let tk = erc20.bind(event.params.token);
            poolEntity.underlyingName = tk.symbol();
        }
        poolEntity.interestrate = event.params.interestrate;
        poolEntity.save();
    }

}

export function handleBuyHedge(event: BuyHedge): void {

  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = EntityTradeItem.load(event.transaction.hash.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  if (entity == null) {
     let contract = leveragePool.bind(event.address);
     let info = contract.getLeverageInfo();

     entity = new EntityTradeItem(event.transaction.hash.toHex());
     entity.from = event.params.from;
     entity.timestamp = event.block.timestamp;
     entity.status = "Buying";
     entity.leveragetype = "Bear";
     entity.pool = event.address;

     entity.settlement = info.value0;
     entity.settlementAmount = event.params.payAmount;
     let wholevalue = event.params.hedgeAmount.times(event.params.tokenPrice)
     entity.settlementPrice =  wholevalue.div(event.params.payAmount);

     entity.leverageToken = info.value2;
     entity.price = event.params.tokenPrice;
     entity.amount = event.params.hedgeAmount;
     entity.value = wholevalue;
     entity.save();

     let trdid = event.params.Coin.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex().substr(2);
     let tradevolentity = EntityTradeVol.load(trdid);
     if(tradevolentity==null) {
        return;
     } else {
        tradevolentity.buyHedgeAmount = tradevolentity.buyHedgeAmount.plus(event.params.payAmount);
        tradevolentity.buyHedgeValue = tradevolentity.buyHedgeValue.plus(wholevalue);
        tradevolentity.save();
     }
  }

}

export function handleBuyLeverage(event: BuyLeverage): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.hash.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.hash.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Buying";
        entity.leveragetype = "Bull";
        entity.pool = event.address;
        entity.settlement = info.value0;

        entity.settlement = info.value0;
        entity.settlementAmount = event.params.payAmount;
        let wholevalue = event.params.leverageAmount.times(event.params.tokenPrice)
        entity.settlementPrice =  wholevalue.div(event.params.payAmount);

        entity.leverageToken = info.value2;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = wholevalue;
        entity.save();

        let trdid = event.params.Coin.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex().substr(2);
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.buyLeverAmount = tradevolentity.buyLeverAmount.plus(event.params.payAmount);
            tradevolentity.buyLeverValue = tradevolentity.buyLeverValue.plus(wholevalue);
            tradevolentity.save();
        }
    }

}

export function handleSellHedge(event: SellHedge): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.hash.toHex());
    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.hash.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bear";
        entity.pool = event.address;
        entity.settlement = info.value0;

        entity.settlementAmount = event.params.amount;
        let wholevalue = event.params.hedgeAmount.times(event.params.tokenPrice)
        entity.settlementPrice =  wholevalue.div(event.params.amount);

        entity.leverageToken = info.value2;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.hedgeAmount;
        entity.value = wholevalue;
        entity.save();

        let trdid = event.params.Coin.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex().substr(2);
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.sellHedgeAmount = tradevolentity.sellHedgeAmount.plus(event.params.amount);
            tradevolentity.sellHedgeValue = tradevolentity.sellHedgeValue.plus(wholevalue);
            tradevolentity.save();
        }
    }

}

export function handleSellLeverage(event: SellLeverage): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.hash.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.hash.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bull";
        entity.pool = event.address;
        entity.settlement = info.value0;

        entity.settlementAmount = event.params.amount;
        let wholevalue = event.params.leverageAmount.times(event.params.tokenPrice)
        entity.settlementPrice =  wholevalue.div(event.params.amount);

        entity.leverageToken = info.value2;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = wholevalue;
        entity.save();

        let trdid = event.params.Coin.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex().substr(2);
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.sellLeverAmount = tradevolentity.sellLeverAmount.plus(event.params.amount);
            tradevolentity.sellLeverValue = tradevolentity.sellLeverValue.plus(wholevalue);
            tradevolentity.save();
        }
    }

}

export function handleBlock(block: ethereum.Block): void {

    let id = block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))
    let apyentity = EntityInterestAPY.load(id.toHex());
    let tradevolentity = EntityTradeVol.load(id.toHex());
    let feeentity = EntityFee.load(id.toHex());
    let tvlentity = EntityTVL.load(id.toHex());
    let totalTvlentity = EntityTotalTVL.load(id.toHex());
   // log.error("step 1",[]);

    if(totalTvlentity==null){
        let factorysc = leverageFactorysc.bind(dataSource.address());
        //let factorysc = leverageFactorysc.bind(Address.fromString(FACTORY_ADDR));
        let oracleaddr = factorysc.phxOracle();
        if (oracleaddr==Address.fromString("0x0000000000000000000000000000000000000000")) {
            return;
        }
        let oracelsc = phxoracle.bind(oracleaddr);

        totalTvlentity = new EntityTotalTVL(id.toHex());
        totalTvlentity.timestamp = block.timestamp;
        totalTvlentity.value = BigInt.fromI32(0)

        let stakepools = factorysc.getAllStakePool();

        for (let i=0;i<stakepools.length;i++) {
            let pool = stakepools[i];
            let stkpool = stakePool.bind(pool);
            let token = stkpool.poolToken();
            tvlentity =  EntityTVL.load(token.toHex() + id.toHex().substr(2));
            if(tvlentity==null) {
                tvlentity = new EntityTVL(token.toHex() + id.toHex().substr(2));
                tvlentity.amount = BigInt.fromI32(0);
                tvlentity.value = BigInt.fromI32(0);
            }
            let amount = stkpool.totalSupply();
            tvlentity.timestamp = block.timestamp;
            tvlentity.amount = tvlentity.amount.plus(amount);
            //tvlentity.poolAddress = pool;

            tvlentity.token = stkpool.poolToken();
            let tkprice = oracelsc.getPrice(stkpool.poolToken());
            tvlentity.value =tvlentity.value.plus(amount.times(tkprice));
            tvlentity.save();

            totalTvlentity.value = totalTvlentity.value.plus(tvlentity.value);
            totalTvlentity.save();

            apyentity = new EntityInterestAPY(pool.toHex() + id.toHex().substr(2));
            apyentity.timestamp = block.timestamp;
            apyentity.pool = pool;
            apyentity.apy = stkpool.poolInterest().times(BigInt.fromI32(365));
            apyentity.token = stkpool.poolToken();
            apyentity.save();

            tradevolentity = EntityTradeVol.load( token.toHex()+id.toHex().substr(2));
            if(tradevolentity==null) {
                tradevolentity = new EntityTradeVol(token.toHex()+id.toHex().substr(2));
                tradevolentity.timestamp = block.timestamp;
                tradevolentity.token = token;
                tradevolentity.save();
            }

        }



        let leveragepools = factorysc.getAllLeveragePool();
        for (let i=0;i<leveragepools.length;i++) {
            let pool = leveragepools[i];

            let lpsc = leveragePool.bind(pool);
            let leverinfo = lpsc.getLeverageInfo();

            let feeToken = leverinfo.value0;
            let feeid = feeToken.toHex() + id.toHex().substr(2);
            let prefeeid = feeToken.toHex() + id.minus(BigInt.fromI32(1)).toHex().substr(2);
            //index 0,token position
            feeentity = EntityFee.load(feeid);
            let prefeeentity = EntityFee.load(prefeeid);
            if(feeentity==null) {
                feeentity = new EntityFee(feeid);
                feeentity.timestamp = block.timestamp;
                feeentity.token = feeToken;
                feeentity.feeReciever = lpsc.feeAddress();
                feeentity.save();

                if(prefeeentity!=null)  {
                    let tkprice = oracelsc.getPrice(feeToken);
                    prefeeentity.value = prefeeentity.amount.times(tkprice);
                    prefeeentity.save();
                }

            }

            let hedgeinfo = lpsc.getHedgeInfo();
            feeToken = hedgeinfo.value0;
            feeid = feeToken.toHex() + id.toHex().substr(2);
            prefeeid = feeToken.toHex() + id.minus(BigInt.fromI32(1)).toHex().substr(2);
            //index 0,token position
            feeentity = EntityFee.load(feeid);
            prefeeentity = EntityFee.load(prefeeid);
            if(feeentity==null) {
                feeentity = new EntityFee(feeid);
                feeentity.timestamp = block.timestamp;
                feeentity.token = feeToken;
                feeentity.feeReciever = lpsc.feeAddress();
                feeentity.save();

                if(prefeeentity!=null)  {
                    let tkprice = oracelsc.getPrice(feeToken);
                    prefeeentity.value = prefeeentity.amount.times(tkprice);
                    prefeeentity.save();
                }

            }
            //already in usd
            let prices = lpsc.buyPrices();
            let priceEntity = new EntityPrice(pool.toHex()+id.toHex().substr(2));
            priceEntity.timestamp = block.timestamp;
            priceEntity.pool = pool;
           // BigInt.fromI32(1);//
            let tkprice = oracelsc.getPrice(leverinfo.value0);
            priceEntity.leverSettlement = leverinfo.value0;
            priceEntity.leverageprice = prices.value0.times(tkprice);

            tkprice = oracelsc.getPrice(hedgeinfo.value0);
            priceEntity.hedgeSettlement = hedgeinfo.value0;
            priceEntity.hedgeprice = prices.value1.times(tkprice);
            priceEntity.save();
        }

    }
}

export function handleRedeem(event: Redeem): void {
    let id = event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
    let token = event.params.token;
    let reciever = event.params.recieptor;

    let feeid = token.toHex() + id.toHex().substr(2);
    let feeentity = EntityFee.load(feeid);
    if(feeentity!=null&&feeentity.feeReciever==reciever) {
        feeentity.amount = feeentity.amount.plus(event.params.amount);
        feeentity.save();
    }
}

export function handleBorrow(event: Borrow): void {}
export function handleLiquidate(event: Liquidate): void {}

export function handleRebalance(event: Rebalance): void {}



export function handleSwap(event: Swap): void {}

export function oracleHandleBlock(block: ethereum.Block): void {}

export function handleInterest(event: Interest): void {}

export function handleRepay(event: Repay): void {}

export function handleStake(event: Stake): void {}

export function handleUnstake(event: Unstake): void {}