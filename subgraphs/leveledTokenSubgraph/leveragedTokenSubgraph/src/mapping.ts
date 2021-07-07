import { BigInt,ethereum,Address,log} from "@graphprotocol/graph-ts"
import {
  BuyHedge,
  BuyLeverage,
  Liquidate,
  OperatorTransferred,
  OriginTransferred,
  OwnershipTransferred,
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
    leveragePool as leveragePoolSc
} from "../generated/templates/leveragePool/leveragePool"

import {
    stakePool as stakePoolSc
} from "../generated/templates/stakePool/stakePool"

import {
    phxoracle as phxoraclesc
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

import {LeveragedTokenPriceEntity,
        leveragePool,
        LeverageFactory,
        TradeItem,
        TVL,
        InterestAPY,
        TradeVol,
        Fee,
        stakePool,
        TotalTVL,
} from "../generated/schema"

let ONE_DAY_SECONDS = 3600*24;
//need to modify according to production
let FACTORY_ADDRESS = "0xdb6136017fe722044a332df2f2ffee7c26b06d75";
export function handleCreateLeveragePool(event: CreateLeveragePool): void {
    // Store Dynamically generated contracts
    let factoryEntity = LeverageFactory.load(event.address.toHex());
    if(factoryEntity==null) {
        factoryEntity = new LeverageFactory(event.address.toHex())
        factoryEntity.save();
    }

    let poolEntity = leveragePool.load(event.params.leveragePool.toHex())
    if (poolEntity == null){
        let leveragesc = leveragePoolSc.bind(event.params.leveragePool);
        poolEntity = new leveragePool(event.params.leveragePool.toHex());
        let tk = erc20.bind(event.params.tokenB);
        poolEntity.underlyingAddress = event.params.tokenB
        poolEntity.underlyingName = tk.symbol();

        let info = leveragesc.getHedgeInfo();
        let rk = erc20.bind(info[2]);
        poolEntity.name = rk.name();
        poolEntity.save();

        //begin monitor pool event
        leveragePoolTemplate.create(event.params.leveragePool);
    }
}

export function handleCreateStakePool(event: CreateStakePool): void {
    let factoryEntity = LeverageFactory.load(event.address.toHex());
    if(factoryEntity==null) {
        factoryEntity = new LeverageFactory(event.address.toHex());
        factoryEntity.save();
    }

    let poolEntity = stakePool.load(event.params.stakePool.toHex())
    if (poolEntity == null){
        poolEntity = new stakePool(event.params.stakePool.toHex());
        poolEntity.underlyingAddress = event.params.token;
        let tk = erc20.bind(event.params.token);
        poolEntity.underlyingName = tk.symbol();
        poolEntity.interestrate = event.params.interestrate;
        poolEntity.save();

        stakePoolTemplate.create(event.params.stakePool)
    }

}

export function handleBuyHedge(event: BuyHedge): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = TradeItem.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  if (entity == null) {
     let contract = leveragePool.bind(event.address);
     let info = contract.getLeverageInfo();

     entity = new TradeItem(event.transaction.from.toHex());
     entity.from = event.params.from;
     entity.timestamp = event.block.timestamp;
     entity.status = "Buying";
     entity.leveragetype = "Bear";
     entity.underlying = info[0];
     entity.price = event.params.tokenPrice;
     entity.amount = event.params.hedgeAmount;
     entity.value = entity.price.times(entity.amount);
     entity.save();

     let trdid = event.address + event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
     let tradevolentity = TradeVol.load(trdid);
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
    let entity = TradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new TradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Buying";
        entity.leveragetype = "Bull";
        entity.underlying = info[0];
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();

        let trdid = event.address + event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
        let tradevolentity = TradeVol.load(trdid);
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
    let entity = TradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new TradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bear";
        entity.underlying = info[0];
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.hedgeAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();

        let trdid = event.address + event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
        let tradevolentity = TradeVol.load(trdid);
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
    let entity = TradeItem.load(event.transaction.from.toHex());

    // // Entities only exist after they have been saved to the store;
    // // `null` checks allow to create entities on demand
    if (entity == null) {
        let contract = leveragePool.bind(event.address);
        let info = contract.getLeverageInfo();
        entity = new TradeItem(event.transaction.from.toHex());
        entity.from = event.params.from;
        entity.timestamp = event.block.timestamp;

        entity.status = "Selling";
        entity.leveragetype = "Bull";
        entity.underlying = info[0];
        entity.price = event.params.tokenPrice;
        entity.amount = event.params.leverageAmount;
        entity.value = entity.price.times(entity.amount);
        entity.save();


        let trdid = event.address + event.block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
        let tradevolentity = TradeVol.load(trdid);
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
    let apyentity;
    let tradevolentity;
    let feeentity;
    let tvlentity;
    let totalTvlentity = TotalTVL.load(id.toHex())
    if(totalTvlentity==null){
        let factorysc = leverageFactorysc.bind(Address.fromString(FACTORY_ADDRESS));
        let oracleaddr = factorysc.phxOracle();
        let oracelsc = phxoraclesc.bind(oracleaddr);

        totalTvlentity = new TotalTVL(id.toHex());
        totalTvlentity.timestamp = block.timestamp;

        let stakepools = factorysc.getAllStakePool();
        for (var pool in stakepools) {
            let stkpool = stakePoolSc.bind(Address.fromString(pool))

            tvlentity = new TVL(pool + id.toHex());
            tvlentity.timestamp = block.timestamp;
            tvlentity.amount = stkpool.totalSupply();
            tvlentity.poolAddress = Address.fromString(pool);
            tvlentity.token = stkpool.poolToken();
            let tkprice = oracelsc.getPrice(tvlentity.token);
            tvlentity.value = tvlentity.amount.times(tkprice);
            tvlentity.save();

            totalTvlentity.value = totalTvlentity.value.plus(tvlentity.value);

            apyentity = new InterestAPY(pool + id.toHex());
            apyentity.timestamp = block.timestamp;
            apyentity.apy = stkpool.poolInterest().times(BigInt.fromI32(365));
            apyentity.token = stkpool.poolToken();
            apyentity.save();
        }

        totalTvlentity.save()

        let leveragepools = factorysc.getAllLeveragePool();
        for (var pool in leveragepools) {
            tradevolentity = TradeVol.load(pool+id);
            if(tradevolentity==null) {
              tradevolentity = new TradeVol(pool+id);
              tradevolentity.timestamp = block.timestamp;
              tradevolentity.pool = pool;
              tradevolentity.save();
            }

            let lpsc = leveragePoolSc.bind(Address.fromString(pool));
            let leverinfo = lpsc.getLeverageInfo();
            let feeToken = leverinfo[0];
            let feeid = feeToken+id;
            let prefeeid = feeToken + id.minus(BigInt.fromI32(1));
            //index 0,token position
            feeentity = Fee.load(feeid);
            let prefeeentity = Fee.load(prefeeid);
            if(feeentity==null) {
                feeentity = new Fee(feeid);
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
            }

            let hedgeinfo = lpsc.getHedgeInfo();
            feeToken = hedgeinfo[0];
            feeid = feeToken+id;
            prefeeid = feeToken + id.minus(BigInt.fromI32(1));
            //index 0,token position
            feeentity = Fee.load(feeid);
            prefeeentity = Fee.load(prefeeid);
            if(feeentity==null) {
                feeentity = new Fee(feeid);
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
            }
        }
    }
}

export function handleLiquidate(event: Liquidate): void {}

export function handleRebalance(event: Rebalance): void {}

export function handleRedeem(event: Redeem): void {}

export function handleSwap(event: Swap): void {}

export function handleTransfer(event: Transfer): void {}