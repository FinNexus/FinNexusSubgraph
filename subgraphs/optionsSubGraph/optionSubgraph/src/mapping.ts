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
        entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    }
    //OptionPrice: BigInt  #buyInfoMap[optionid]/100000000,
    entityBuyOptionItem.OptionPrice = event.params.optionPrice;
    entityBuyOptionItem.CreatedTime = event.block.timestamp;
    entityBuyOptionItem.save();
}

export function handleCreateOption(event: CreateOption): void {
   let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
   if(entityBuyOptionItem==null){
      entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
   }

   let entityidhash = EntityBuyOptionHashId.load(event.params.optionID.toHex());
   if(entityidhash==null) {
       let entityidhash = new EntityBuyOptionHashId(event.params.optionID.toHex());
       entityidhash.BuyHash = event.transaction.hash.toHex();
       entityidhash.save();
   }

   entityBuyOptionItem.Optionid = event.params.optionID;
   entityBuyOptionItem.Owner = event.params.owner;
   entityBuyOptionItem.OptType = event.params.optType;
   entityBuyOptionItem.Underlying = event.params.underlying;
   entityBuyOptionItem.Expiration = event.params.expiration;
   entityBuyOptionItem.Amount = event.params.amount;
   entityBuyOptionItem.StrikePrice = event.params.strikePrice;
   entityBuyOptionItem.save();

}

export function handleAddFee(event: AddFee): void {
    let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    if(entityBuyOptionItem==null){
        entityBuyOptionItem = new EntityBuyOptionItem(event.transaction.hash.toHex());
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
       let oraclesc = null;

       for (let i=0;i<OPTION_MANAGERS.length;i++) {
         let managersc = OptionManager.bind(Address.fromString(OPTION_MANAGERS[i]));
         let optionPoolAssress = OptionManager.getCollateralPoolAddress();
         let optionpoolsc = OptionPool.bind(optionPoolAssress);
         let colPoolAddress = OptionManager.getCollateralPoolAddress();
         let colpoolsc = CollateralPool.bind(colPoolAddress);
         let oracleAddress = managersc.getOracleAddress();
         oraclesc = OptionOracle.bind(oracleAddress);

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
            //token address + id as key
            let entityPoolTLV = EntityPoolTLV.load(tokens[i]+id.substr(2));
            if(entityPoolTLV==null) {
                entityPoolTLV = new EntityPoolTLV(tokens[i] + id.substr(2));
                entityPoolTLV.TimeStamp = block.timestamp;
                entityPoolTLV.Token = tokens[i];
            }
            entityPoolTLV.Amout = entityPoolTLV.Amout.plus(colpoolsc.getCollateralBalance(tokens[i]));
            let tkprice = oraclesc.getPrice(tokens[i]);
            entityPoolTLV.UsdValue = entityPoolTLV.UsdValue.plus(entityPoolTLV.Amout.times(tkprice));
            entityPoolTLV.save();

            let entityFee = EntityFee.load(tokens[i]+id.substr(2));
            if(entityFee==null) {
                entityFee = new EntityFee(tokens[i] + id.substr(2));
                entityFee.TimeStamp = block.timestamp;
                entityFee.Token = tokens[i];
                entityFee.save();
            }

            let entityPremium = EntityPremium.load(tokens[i]+id.substr(2));
            if(entityPremium==null) {
                entityPremium = new EntityPremium(tokens[i] + id.substr(2));
                entityPremium.TimeStamp = block.timestamp;
                entityPremium.Token = tokens[i];
                entityPremium.save();
            }

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
             if(optinfo.value4.gt(block.timestamp)) {
                 //underlying+id as key
                 let entityActiveOption = EntityActiveOption.load(optinfo.value3.toHex() + id.substr(2));
                 if (entityActiveOption == null) {
                     entityActiveOption = new EntityActiveOption(optinfo.value3.toHex() + id.substr(2));
                 }
                 entityActiveOption.Underlying = optinfo.value3;
                 entityActiveOption.TimeStamp = block.timestamp;
                 let usdvalue = optinfo.value6.times(extrainfo.value3);
                 //accumulate amount in one day
                 if (optinfo.value4.lt(dayEnd) &&
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

             let entityoption = EntityOptionItem.load(i)
             if(entityoption==null) {
                 let entityBuyIdHash = EntityBuyOptionHashId.load(i);
                 if (entityBuyIdHash == null) {
                     continue;
                 }
                 let entityBuyOptionItem = EntityBuyOptionItem.load(entityBuyIdHash.BuyHash);
                 if (entityBuyOptionItem == null) {
                     continue;
                 }

                 entityBuyOptionItem.Settlement = extrainfo.value0;
                 entityBuyOptionItem.UnderLyingPrice = extrainfo.value2;
                 entityBuyOptionItem.CurrentWorth = entityBuyOptionItem.Amount.times(entityBuyOptionItem.OptionPrice);

                 entityBuyOptionItem.save();

                 let entityexcercisehash = EntityExcerciseOptionHashId.load(i);
                 let entityexcerciseitem = EntityExcerciseOptionItem.load(entityexcercisehash.id)

                 let entityOptionItem = EntityOptionItem.load(i);
                 if(entityOptionItem==null) {
                     entityOptionItem = new EntityOptionItem(i);
                 }
                 entityOptionItem.Date = entityBuyOptionItem.CreatedTime;
                 entityOptionItem.Amount = optinfo.value6;//amount
                 entityOptionItem.UnderlyingAssets = entityBuyOptionItem.Underlying
                 entityOptionItem.Type = entityBuyOptionItem.OptType;
                 entityOptionItem.UsdValue = entityBuyOptionItem.CurrentWorth;
                 entityOptionItem.StrikePrice = entityBuyOptionItem.StrikePrice;
                 let optionpayusd = entityBuyOptionItem.OptionPrice.times(entityBuyOptionItem.Amount);
                 let feeusd = entityBuyOptionItem.Fee.times(extrainfo.value1);
                 entityOptionItem.Premium = optionpayusd.plus(feeusd);
                 //Status: String!
                 if(entityOptionItem.Amount.equals(BigInt.fromI32(0))) {
                     entityOptionItem.Status = "Excercised";
                     if(entityexcerciseitem!=null) {
                         entityOptionItem.PL = entityexcerciseitem.ExerciseBack.minus(entityOptionItem.Premium);
                     } else {
                         entityOptionItem.PL = BigInt.fromI32(0)
                     }
                 } else {
                     if(entityexcerciseitem==null) {
                         if (optinfo.value4.ge(block.timestamp)) {
                             entityOptionItem.Status = "Active";
                         } else {
                             entityOptionItem.Status = "Expired";
                         }
                         entityOptionItem.PL = BigInt.fromI32(0).minus(entityOptionItem.Premium);
                     } else {
                         entityOptionItem.PL = entityexcerciseitem.ExerciseBack.minus(entityOptionItem.Premium);
                     }
                 }

                 entityOptionItem.save();

             } else {
                 break;
             }

         }//for option length

       }

       entityTotalTLV.save();
   }
}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleAddCollateral(event: AddCollateral): void {}

export function handleRedeemCollateral(event: RedeemCollateral): void {}

export function handleSellOption(event: SellOption): void {}

export function handleBurnOption(event: BurnOption): void {}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}