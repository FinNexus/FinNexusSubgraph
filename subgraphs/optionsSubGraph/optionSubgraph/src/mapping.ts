import { BigInt,
        ethereum,
        Address,
        log,
        dataSource} from "@graphprotocol/graph-ts"
import {
    OptionOracle
} from "../generated/optionOracle/OptionOracle"

import {
  OptionManager,
  AddCollateral,
  BuyOption,
  DebugEvent,
  ExerciseOption,
  OwnershipTransferred,
  RedeemCollateral,
  SellOption
} from "../generated/templates/OptionManager"

import {
    OptionPool,
    BurnOption,
    CreateOption,
    DebugEvent,
    OwnershipTransferred
} from "../generated/templates/OptionPool"

import {
    CollateralPool,
    AddFee,
    OwnershipTransferred,
    RedeemFee,
    TransferPayback
} from "../generated/templates/CollateralPool"

import {
    OptionManager as OptionManagerTemplate,
    OptionPool as OPtionPoolTemplate
} from "../generated/templates"

import {
    EntityActiveOption,
    EntityBuyOptionHashId,
    EntityBuyOptionItem,
    EntityExcerciseOptionHashId,
    EntityExcerciseOptionItem,
    EntityFee,
    EntityNetWorth,
    EntityOptionItem,
    EntityPoolTLV,
    EntityPremium,
    EntityTotalTLV,
    EntityOptionManager,
    EntityOptionPool,
    EntityActiveOption
} from "../generated/schema"

let ONE_DAY_SECONDS = 3600*24;
//let ONE_DAY_SECONDS = 1;
let OPTION_MANAGERS = ["0xfdf252995da6d6c54c03fc993e7aa6b593a57b8d",
                       "0x120f18f5b8edcaa3c083f9464c57c11d81a9e549"];

export function handleBuyOption(event: BuyOption): void {
    let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    if(entityBuyOptionItem==null){
        let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    }
    //OptionPrice: BigInt  #buyInfoMap[optionid]/100000000,
    entityBuyOptionItem.OptionPrice = event.params.optionPrice;
     entityBuyOptionItem.CreatedTime = event.block.timestamp;
    entityBuyOptionItem.save();
}

export function handleCreateOption(event: CreateOption): void {
   let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
   if(entityBuyOptionItem==null){
      let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
      let entityidhash = new EntityBuyOptionHashId(event.params.optionID.toHex());
   }
    // Optionid: Int
    entityBuyOptionItem.Optionid = event.params.optionID;
    // Owner: Bytes!
    entityBuyOptionItem.Owner = event.params.owner;
    // OptType: String       #0 for call, 1 for put
    entityBuyOptionItem.OptType = event.params.optType;
    //     Underlying: BigInt    #underlying ID, 1 for BTC,2 for ETH
    entityBuyOptionItem.Underlying = event.params.underlying;

    //     Expiration: BigInt    #getDate(option[4]), //
    entityBuyOptionItem.Expiration = event.params.expiration;

    //     Amount: BigInt        #web3.utils.fromWei(new BN(option[6])),
    entityBuyOptionItem.Amount = event.params.amount;

    //     StrikePrice: BigInt     #option[5]/100000000,   //  strike price
    entityBuyOptionItem.StrikePrice = event.params.strikePrice;
    entityBuyOptionItem.save();

    //     Settlement: Bytes     #settle[optionextra[0].toLowerCase()],    //user's settlement paying for option.
    //     UnderLyingPrice: BigInt #optionextra[2]/100000000,
    //     CurrentWorth: BigInt    #web3.utils.fromWei(new BN(worth))/100000000 +"(USD)"

}

export function handleAddFee(event: AddFee): void {
    let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    if(entityBuyOptionItem==null){
        let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    }
    entityBuyOptionItem.Fee = event.params.payback;
    entityBuyOptionItem.Settlement = event.params.settlement;
    entityBuyOptionItem.save();
}

export function handleExerciseOption(event: ExerciseOption): void {
    let entityExcerciseOptionItem = EntityExcerciseOptionItem.load(event.transaction.hash.toHex());
    if(entityExcerciseOptionItem==null) {
        entityExcerciseOptionItem = new EntityExcerciseOptionItem(event.transaction.hash.toHex());
    }

    entityExcerciseOptionItem.Optionid = event.params.optionId;
    entityExcerciseOptionItem.ExerciseAmount = event.params.amount;
    entityExcerciseOptionItem.ExerciseBack = event.params.sellValue;
}


export function handleBlock(block: ethereum.Block): void {
   let intid = block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS));
   let dayStart = intid.times(ONE_DAY_SECONDS);
   let dayEnd = (intid.plus(BigInt.fromI32(1))).times(ONE_DAY_SECONDS);
   let id = intid.toHex();
   let entityTotalTLV = EntityTotalTLV.load(id);
   if (entityTotalTLV == null) {
       entityTotalTLV = new EntityTotalTLV(id);
       entityTotalTLV.TimeStamp = block.timestamp;
       entityTotalTLV.TotalUsdValue = BigInt.fromI32(0);
       for (let i=0;i<OPTION_MANAGERS.length;i++) {
         let managersc = OptionManager.bind(Address.fromString(OPTION_MANAGERS[i]));
         let optionPoolAssress = OptionManager.getCollateralPoolAddress();
         let optionpoolsc = OptionPool.bind(optionPoolAssress);
         let colPoolAddress = OptionManager.getCollateralPoolAddress();
         let colpoolsc = CollateralPool.bind(colPoolAddress);
         let oracleAddress = managersc.getOracleAddress();
         let oraclesc = OptionOracle.bind(oracleAddress);

         let entityOptionManager = EntityOptionManager.load(OPTION_MANAGERS[i]);
         if (entityOptionManager == null) {
             entityOptionManager = new EntityOptionManager(OPTION_MANAGERS[i]);
             entityOptionManager.save();
             OptionManagerTemplate.create(Address.fromString(OPTION_MANAGERS[i]));
             let entityOptionPool = new EntityOptionPool(optionPoolAssress);
             entityOptionPool.save();
             OPtionPoolTemplate.create(Address.fromString(optionPoolAssress));
         }

         let tokens = managersc.getWhiteList();
         for (let i=0;i<tokens.length;i++) {
            let entityPoolTLV = new EntityPoolTLV(tokens[i]+id.substr(2));
            entityPoolTLV.TimeStamp = block.timestamp;
            entityPoolTLV.Pool = Address.fromString(optionPoolAssress[i]);
            entityPoolTLV.Token = tokens[i];
            entityPoolTLV.Amout = colpoolsc.getCollateralBalance(tokens[i]);
            entityPoolTLV.UsdValue = optionpoolsc.getNetWrothLatestWorth(tokens[i])
            entityPoolTLV.save();

            let entityFee = new EntityFee(tokens[i]+id.substr(2));
            entityFee.TimeStamp = block.timestamp;
            entityFee.save();

             let entityPremium = new EntityPremium(tokens[i]+id.substr(2));
             entityPremium.TimeStamp = block.timestamp;
             entityPremium.save();
         }

         entityTotalTLV.TotalUsdValue = entityTotalTLV.TotalUsdValue.plus(colpoolsc.getRealBalance(tokens));

         let entityNetWorth = new EntityNetWorth(id);
         entityNetWorth.TimeStamp = block.timestamp;
         entityNetWorth.Pool = colPoolAddress;
         entityNetWorth.NetWorth = managersc.getTokenNetworth();
         entityNetWorth.save();

         let optionlen = optionpoolsc.getOptionInfoLength()
         for(let i=optionlen-1;i>0;i--) {
             //(optionsId 0,info.owner 1,info.optType 2,info.underlying 3
             // info.createTime+info.expiration 4
             // info.strikePrice 5,info.amount 6)
             let optinfo = optionpoolsc.getOptionsById(i);
             // 0 info.settlement
             // 1 info.settlePrice,
             // 2 (info.strikePrice*info.priceRate)>>28,
             // 3 info.optionsPrice,
             // 4 info.iv)
             let extrainfo = optionpoolsc.getOptionsExtraById(i);
             if(optinfo.value4.lt(block.timestamp)) {
                 break;
             }
             //underlying+id as key
             let entityActiveOption = EntityActiveOption.load(optinfo.value3.toHex()+id.substr(2));
             if(entityActiveOption==null) {
                 entityActiveOption =  new  EntityActiveOption(optinfo.value3.toHex()+id.substr(2));
             }
             entityActiveOption.Underlying = optinfo.value3;
             entityActiveOption.TimeStamp = block.timestamp;
             let usdvalue = optinfo.value6.times(extrainfo.value3);
             //accumulate amount in one day
             if(optinfo.value4.lt(dayEnd)&&
                optinfo.value4.ge(dayStart)) {
                 if (optinfo.value2 == 0) {
                     entityActiveOption.CallAmount = entityActiveOption.CallAmount.plus(optinfo.value6);
                     entityActiveOption.CallUsdValue = entityActiveOption.CallUsdValue.plus(usdvalue);
                 } else {
                     entityActiveOption.PutAmount = entityActiveOption.PutAmount.plus(optinfo.value6);
                     entityActiveOption.PutUsdValue = entityActiveOption.PutUsdValue.plus(usdvalue);
                 }
             }
             entityActiveOption.save();
         }

       }

       entityTotalTLV.save();
   }
}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleAddCollateral(event: AddCollateral): void {}

export function handleRedeemCollateral(event: RedeemCollateral): void {}

export function handleSellOption(event: SellOption): void {}

export function handleBurnOption(event: BurnOption): void {

}



export function handleDebugEvent(event: DebugEvent): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}