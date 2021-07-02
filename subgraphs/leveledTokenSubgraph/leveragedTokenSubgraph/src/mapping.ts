import { BigInt,ethereum,Address,log} from "@graphprotocol/graph-ts"
import {
  leveragedpool,
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
} from "../generated/leveragedpool/leveragedpool"

import {
    fnxoracle
}  from "../generated/fnxoracle/fnxoracle"
import {LeveragedTokenPriceEntity} from "../generated/schema"

export function handleBuyHedge(event: BuyHedge): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())
  //
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())
  //
  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }
  //
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)
  //
  // // Entity fields can be set based on event parameters
  // entity.from = event.params.from
  // entity.Coin = event.params.Coin
  //
  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.buyFee(...)log
  // - contract.buyPrices(...)
  // - contract.defaultLeverageRatio(...)
  // - contract.defaultRebalanceWorth(...)
  // - contract.feeAddress(...)
  // - contract.getCurrentLeverageRate(...)
  // - contract.getEnableRebalanceAndLiquidate(...)
  // - contract.getHedgeInfo(...)
  // - contract.getLeverageFee(...)
  // - contract.getLeverageInfo(...)
  // - contract.getLeverageRebase(...)
  // - contract.getOperator(...)
  // - contract.getOracleAddress(...)
  // - contract.getTokenNetworths(...)
  // - contract.getTotalworths(...)
  // - contract.implementationVersion(...)
  // - contract.isOwner(...)
  // - contract.liquidateThreshold(...)
  // - contract.owner(...)
  // - contract.rebalanceFee(...)
  // - contract.rebalancePrices(...)
  // - contract.rebaseThreshold(...)
  // - contract.sellFee(...)
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

