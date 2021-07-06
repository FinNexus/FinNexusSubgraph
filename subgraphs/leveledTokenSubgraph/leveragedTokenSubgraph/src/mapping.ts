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
 leverageFactory,
 CreateLeveragePool,
 CreateStakePool
} from "../generated/leverageFactory/leverageFactory"

import {
    leveragePool as leveragePoolTemplate,
    stakePool as stakePoolTemplate
} from "../generated/templates"

import {
    leveragePool as leveragePoolSc,
} from "../generated/templates/leveragePool/leveragePool"

import {
    stakePool as stakePoolSc,
} from "../generated/templates/stakePool/stakePool"

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

import {
    fnxoracle
}  from "../generated/fnxoracle/fnxoracle"

import {LeveragedTokenPriceEntity,
        leveragePool,
        leverageFactory,
        TradeItem,
        TVL,
        InterestAPY,
        TradeVol,
        Fee,
        stakePool
} from "../generated/schema"

export function handleCreateLeveragePool(event: CreateLeveragePool): void {
    // Store Dynamically generated contracts
    let factoryEntity = leverageFactory.load(event.address.toHex())
    if(factoryEntity==null) {
        factoryEntity = new leverageFactory(event.address.toHex())
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
    let factoryEntity = leverageFactory.load(event.address.toHex());
    if(factoryEntity==null) {
        factoryEntity = new leverageFactory(event.address.toHex());
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
     entity.timestamp = event.block.timestamp;
     entity.status = "Buying";
     entity.leveragetype = "Bear";
     entity.undetlying = info[0];
     entity.price = event.params.tokenPrice;
     entity.amount = event.params.hedgeAmount;
     entity.value = entity.price.times(entity.amount);
     entity.save()
  }
}

export function handleBuyLeverage(event: BuyLeverage): void {}

export function handleLiquidate(event: Liquidate): void {}

export function handleOperatorTransferred(event: OperatorTransferred): void {}

export function handleOriginTransferred(event: OriginTransferred): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRebalance(event: Rebalance): void {}

export function handleRedeem(event: Redeem): void {}

export function handleSellHedge(event: SellHedge): void {}

export function handleSellLeverage(event: SellLeverage): void {}

export function handleSwap(event: Swap): void {}

let INTERVALSECONDS = BigInt.fromI32(600);
let POOL_ADDRESSES:Array<string>=["0xb86ded607497fe38a36b26f7b5c3dfdca30ef955",
                                  "0x91c7edbebde88fbc6f4aa2480f9f4e261ba6c6ea"
                                 ]

let ORACEL_ADDRESS = '0xdae742f9675b5dfa932ce4b1cd0a9f0d089b7b4d';
let WBTC_ADDRESS = '0xb4b84C26D25b65A6d8c3cf1196634fC9302722Ae';
let WETH_ADDRESS = '0xB469E9048eB0304B3479a526cAF442EC779e1e07';

export function handleBlock(block: ethereum.Block): void {
        let blktime = block.timestamp
        let curtime = blktime.div(INTERVALSECONDS).times(INTERVALSECONDS);

        for(let i=0;i<POOL_ADDRESSES.length;i++) {
            let poolAddress = POOL_ADDRESSES[i]
            let key = (poolAddress.toString() + curtime.toString())
            let entity = LeveragedTokenPriceEntity.load(key)
            log.info('load entity to check:{}', [poolAddress])

            if (entity == null) {
                let poolContract = leveragedpool.bind(Address.fromString(poolAddress))
                let oracleContract = fnxoracle.bind(Address.fromString(ORACEL_ADDRESS))
                log.info('create entity {}', [block.number.toHex()])
                entity = new LeveragedTokenPriceEntity(key)
                entity.network = "rinkeby"
                entity.timestamp = curtime
                log.info('1',[])
                let prices = poolContract.getTokenNetworths()
                log.info('2',[])
                entity.uptokenprice  = prices.value0
                entity.downtokenprice = prices.value1

                entity.poolAddress = Address.fromString(poolAddress)
                log.info('3',[])

                entity.save()

            }
        }

}

export function handleTransfer(event: Transfer): void {}