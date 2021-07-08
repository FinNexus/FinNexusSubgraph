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
} from "../generated/schema"

//let ONE_DAY_SECONDS = 3600*24;
let ONE_DAY_SECONDS = 3600;

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
         poolEntity.underlyingName = tk.symbol();

         let info = leveragesc.getHedgeInfo();
         let rk = erc20.bind(info.value2);
         poolEntity.name = rk.name();

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
        let tk = erc20.bind(event.params.token);
        poolEntity.underlyingName = tk.symbol();
        poolEntity.interestrate = event.params.interestrate;
        poolEntity.save();
    }

}

export function handleBuyHedge(event: BuyHedge): void {

  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = EntityTradeItem.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  if (entity == null) {
     let contract = leveragePool.bind(event.address);
     let info = contract.getLeverageInfo();

     entity = new EntityTradeItem(event.transaction.from.toHex());
     entity.from = event.params.from;
     entity.timestamp = event.block.timestamp;
     entity.status = "Buying";
     entity.leveragetype = "Bear";
     entity.underlying = info.value0;
     entity.price = event.params.tokenPrice;
     entity.amount = event.params.hedgeAmount;
     entity.value = entity.price.times(entity.amount);
     entity.save();

     let trdid = event.address.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex();
     let tradevolentity = EntityTradeVol.load(trdid);
     if(tradevolentity==null) {
        return;
     } else {
        tradevolentity.buyHedgeAmount = tradevolentity.buyHedgeAmount.plus(entity.amount);
        tradevolentity.buyHedgeValue = tradevolentity.buyHedgeValue.plus(entity.value);
        tradevolentity.save();
     }
  }
}

export function handleBuyLeverage(event: BuyLeverage): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Buying";
        entity.leveragetype = "Bull";
        entity.underlying = info.value0;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();

        let trdid = event.address.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex();
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.buyLeverAmount = tradevolentity.buyLeverAmount.plus(entity.amount);
            tradevolentity.buyLeverValue = tradevolentity.buyLeverValue.plus(entity.value);
            tradevolentity.save();
        }
    }

}

export function handleSellHedge(event: SellHedge): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bear";
        entity.underlying = info.value0;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.hedgeAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();

        let trdid = event.address.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex();
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.sellHedgeAmount = tradevolentity.sellHedgeAmount.plus(entity.amount);
            tradevolentity.sellHedgeValue = tradevolentity.sellHedgeValue.plus(entity.value);
            tradevolentity.save();
        }
    }

}

export function handleSellLeverage(event: SellLeverage): void {

    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = EntityTradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new EntityTradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bull";
        entity.underlying = info.value0;
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();


        let trdid = event.address.toHex() + (event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS))).toHex();
        let tradevolentity = EntityTradeVol.load(trdid);
        if(tradevolentity==null) {
            return;
        } else {
            tradevolentity.sellLeverAmount = tradevolentity.sellLeverAmount.plus(entity.amount);
            tradevolentity.sellLeverValue = tradevolentity.sellLeverValue.plus(entity.value);
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

            tvlentity = new EntityTVL(pool.toHex() + id.toHex().substr(2));
            tvlentity.timestamp = block.timestamp;

            tvlentity.amount = stkpool.totalSupply();
            tvlentity.poolAddress = pool;

            tvlentity.token = stkpool.poolToken();
            let tkprice = oracelsc.getPrice(stkpool.poolToken());
            tvlentity.value = tvlentity.amount.times(tkprice);
            tvlentity.save();

            totalTvlentity.value = totalTvlentity.value.plus(tvlentity.value);

            apyentity = new EntityInterestAPY(pool.toHex() + id.toHex().substr(2));
            apyentity.timestamp = block.timestamp;
            apyentity.poolAddress = pool;
            apyentity.apy = stkpool.poolInterest().times(BigInt.fromI32(365));
            apyentity.token = stkpool.poolToken();
            apyentity.save();

            totalTvlentity.save();

        }

        let leveragepools = factorysc.getAllLeveragePool();
        for (let i=0;i<leveragepools.length;i++) {
            let pool = leveragepools[i];
            tradevolentity = EntityTradeVol.load(pool.toHex()+id.toHex().substr(2));
            if(tradevolentity==null) {
              tradevolentity = new EntityTradeVol(pool.toHex()+id.toHex().substr(2));
              tradevolentity.timestamp = block.timestamp;
              tradevolentity.pool = pool;
              tradevolentity.save();
            }

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
                let tk = erc20.bind(feeToken);
                let feercvr = lpsc.feeAddress();
                feeentity.amount = tk.balanceOf(feercvr);
                if(prefeeentity!=null)  {
                  let diff = tk.balanceOf(feercvr).minus(prefeeentity.amount);
                  if(diff.gt(BigInt.fromI32(0))) {
                      //get today's fee income
                      feeentity.amount = diff;
                  }
                }

                let tkprice = oracelsc.getPrice(feeToken);
                feeentity.value = feeentity.amount.times(tkprice);
                feeentity.save();
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
                let tk = erc20.bind(feeToken);
                let feercvr = lpsc.feeAddress();
                feeentity.amount = tk.balanceOf(feercvr);
                if(prefeeentity!=null)  {
                    let diff = tk.balanceOf(feercvr).minus(prefeeentity.amount);
                    if(diff.gt(BigInt.fromI32(0))) {
                        //get today's fee income
                        feeentity.amount = diff;
                    }
                }
                let tkprice = oracelsc.getPrice(feeToken);
                feeentity.value = feeentity.amount.times(tkprice);
                feeentity.save();
            }

        }

    }
}

export function handleLiquidate(event: Liquidate): void {}

export function handleRebalance(event: Rebalance): void {}

export function handleRedeem(event: Redeem): void {}

export function handleSwap(event: Swap): void {}

export function oracleHandleBlock(block: ethereum.Block): void {}