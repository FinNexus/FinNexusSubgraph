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
} from "../generated/templates/OptionManager/OptionManager"

import {
    OptionPool,
    BurnOption,
    CreateOption,
    DebugEvent,
    OwnershipTransferred
} from "../generated/templates/OptionPool/OptionPool"

import {
    CollateralPool,
    AddFee,
    OwnershipTransferred,
} from "../generated/templates/CollateralPool/CollateralPool"

import {
    OptionManager as OptionManagerTemplate,
    OptionPool as OPtionPoolTemplate,
    CollateralPool as CollateralPoolTemplate
} from "../generated/templates"

import {
    OptionFactory,
    CreateOptionsManager,
} from "../generated/OptionFactory/OptionFactory"

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
    EntityCollateralPool,
    EntityActiveOption
} from "../generated/schema"

let ONE_DAY_SECONDS = BigInt.fromI32(3600*24);

//let ONE_DAY_SECONDS = BigInt.fromI32(10);

function createTemplateBind(): void {
    //for test, resturn immediately
   // return;

    let managerAddr = "0xaF33Bda2DA6c29104c528c26dcA8b5BCE86EE56F";
    let colAddr = "0x356EBBbAaceb72Ca35EeB9f11a13529909e6C6c7";
    let optionpool = "0xd36E2d1D6b63C65b1D6FB9fcf5c0159117F3D619";
    //let 0xfb60e1D2942ecA114BAC41B49cC7c637A153Fa48
    let entityOptionManager = EntityOptionManager.load(managerAddr);
    if (entityOptionManager == null) {
        entityOptionManager = new EntityOptionManager(managerAddr);
        entityOptionManager.save();
        OptionManagerTemplate.create(Address.fromString(managerAddr));
    }

    let entityOptionPool = EntityOptionPool.load(optionpool);
    if(entityOptionPool==null) {
        entityOptionPool = new EntityOptionPool(optionpool);
        entityOptionPool.save();
        OPtionPoolTemplate.create(Address.fromString(optionpool));
    }

    let entityCollateralPool = EntityCollateralPool.load(colAddr);
    if(entityCollateralPool==null) {
        entityCollateralPool = new EntityCollateralPool(colAddr);
        entityCollateralPool.save();
        CollateralPoolTemplate.create(Address.fromString(colAddr));
    }

}

export function handleCreateOptionsManager(event: CreateOptionsManager): void {
/*
    let entityOptionManager = EntityOptionManager.load(event.params.optionsManager.toHex());
    if (entityOptionManager == null) {
        entityOptionManager = new EntityOptionManager(event.params.optionsManager.toHex());
        entityOptionManager.save();
        OptionManagerTemplate.create(event.params.optionsManager);
    }

    let entityOptionPool = EntityOptionPool.load(event.params.optionsPool.toHex());
    if(entityOptionPool==null) {
        entityOptionPool = new EntityOptionPool(event.params.optionsPool.toHex());
        entityOptionPool.save();
        OPtionPoolTemplate.create(event.params.optionsPool);
    }

    let entityCollateralPool = EntityCollateralPool.load(event.params.collateralPool.toHex());
    if(entityCollateralPool==null) {
        entityCollateralPool = new EntityCollateralPool(event.params.collateralPool.toHex());
        entityCollateralPool.save();
        CollateralPoolTemplate.create(event.params.collateralPool);
    }
*/
}

export function handleBuyOption(event: BuyOption): void {

    let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    if(entityBuyOptionItem==null){
        entityBuyOptionItem = new EntityBuyOptionItem(event.transaction.hash.toHex());
        entityBuyOptionItem.Fee = BigInt.fromI32(0);
    }
    //OptionPrice: BigInt  #buyInfoMap[optionid]/100000000,
    entityBuyOptionItem.OptionPrice = event.params.optionPrice;
    entityBuyOptionItem.Amount = event.params.optionAmount;
    entityBuyOptionItem.CreatedTime = event.block.timestamp;
    entityBuyOptionItem.save();

}

export function handleCreateOption(event: CreateOption): void {

   let entityidhash = EntityBuyOptionHashId.load(event.address.toHex() + event.params.optionID.toHex());
   if(entityidhash==null) {
        let entityidhash = new EntityBuyOptionHashId(event.address.toHex() + event.params.optionID.toHex());
        entityidhash.BuyHash = event.transaction.hash.toHex();
        entityidhash.save();
   }

   let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
   if(entityBuyOptionItem==null){
      entityBuyOptionItem = new EntityBuyOptionItem(event.transaction.hash.toHex());
      entityBuyOptionItem.Fee = BigInt.fromI32(0);
   }

   entityBuyOptionItem.Optionid = event.params.optionID;
   entityBuyOptionItem.Owner = event.params.owner;
   entityBuyOptionItem.OptType = BigInt.fromI32(event.params.optType);
   entityBuyOptionItem.Underlying = event.params.underlying;
   entityBuyOptionItem.Expiration = event.params.expiration;
   entityBuyOptionItem.Amount = event.params.amount;
   entityBuyOptionItem.StrikePrice = event.params.strikePrice;
   entityBuyOptionItem.CreatedTime = event.block.timestamp;

   entityBuyOptionItem.save();

}

export function handleAddFee(event: AddFee): void {

    let entityBuyOptionItem = EntityBuyOptionItem.load(event.transaction.hash.toHex());
    if(entityBuyOptionItem==null){
        entityBuyOptionItem = new EntityBuyOptionItem(event.transaction.hash.toHex());
        entityBuyOptionItem.CreatedTime =event.block.timestamp;
        entityBuyOptionItem.Amount = BigInt.fromI32(0);
    }

    entityBuyOptionItem.Fee = event.params.payback;
    entityBuyOptionItem.Settlement = event.params.settlement;
    entityBuyOptionItem.save();

}

export function handleExerciseOption(event: ExerciseOption): void {

    let entityExcerciseOptionHashId = EntityExcerciseOptionHashId.load(event.address.toHex()+event.params.optionId.toHex())
    if(entityExcerciseOptionHashId == null) {
        entityExcerciseOptionHashId = new EntityExcerciseOptionHashId(event.address.toHex()+event.params.optionId.toHex())
        entityExcerciseOptionHashId.ExcerciseHash = event.transaction.hash.toHex();
    }

    let entityExcerciseOptionItem = EntityExcerciseOptionItem.load(event.transaction.hash.toHex());
    if(entityExcerciseOptionItem==null) {
        entityExcerciseOptionItem = new EntityExcerciseOptionItem(event.transaction.hash.toHex());
    }
    entityExcerciseOptionItem.Optionid = event.params.optionId;
    entityExcerciseOptionItem.ExerciseAmount = event.params.amount;
    entityExcerciseOptionItem.ExerciseBack = event.params.sellValue;


    entityExcerciseOptionItem.save();

}

export function handleBlock(block: ethereum.Block): void {

   createTemplateBind();

   let intid = block.timestamp.div(ONE_DAY_SECONDS);
   let dayStart = intid.times(ONE_DAY_SECONDS);
   let dayEnd = (intid.plus(BigInt.fromI32(1))).times(ONE_DAY_SECONDS);
   let id = intid.toHex();
   let entityTotalTLV = EntityTotalTLV.load(id);

   if (entityTotalTLV == null) {
       entityTotalTLV = new EntityTotalTLV(id);
       entityTotalTLV.TimeStamp = block.timestamp;
       entityTotalTLV.TotalUsdValue = BigInt.fromI32(0);
       let oraclesc : OptionOracle;

       let factorysc = OptionFactory.bind(dataSource.address());
       let managerlen =factorysc.getOptionsMangerLength();

       for (let i=0;i<managerlen.toI32();i++) {
             let alladdress = factorysc.getOptionsMangerAddress(BigInt.fromI32(i))
             let managerAddess = alladdress.value0;
             let managersc = OptionManager.bind(managerAddess);

             let colPoolAddress = alladdress.value1;
             let colpoolsc = CollateralPool.bind(colPoolAddress);

             let optionPoolAssress = alladdress.value2;
             let optionpoolsc = OptionPool.bind(optionPoolAssress);

             let oracleAddress = managersc.getOracleAddress();
             oraclesc = OptionOracle.bind(oracleAddress);
             log.debug("optionmanager={},optionPool{},colPool{}",
                       [managerAddess.toHex(),optionPoolAssress.toHex(),colPoolAddress.toHex()]);
             let tokens = managersc.getCollateralWhiteList();
             for (let i=0;i<tokens.length;i++) {
                log.debug("token[i{}]={}",[BigInt.fromI32(i).toString(),tokens[i].toHex()])
                // token address + timeid as key
                let pooltokenid = tokens[i].toHex()+id;
                let entityPoolTLV = EntityPoolTLV.load(pooltokenid);
                if(entityPoolTLV==null) {
                    entityPoolTLV = new EntityPoolTLV(pooltokenid);
                    entityPoolTLV.TimeStamp = block.timestamp;
                    entityPoolTLV.Token = tokens[i];
                }
                log.debug("token step2",[]);
                entityPoolTLV.Amout = entityPoolTLV.Amout.plus(colpoolsc.getCollateralBalance(tokens[i]));
                let tkprice = oraclesc.getPrice(tokens[i]);
                entityPoolTLV.UsdValue = entityPoolTLV.UsdValue.plus(entityPoolTLV.Amout.times(tkprice));
                entityPoolTLV.save();

                let entityFee = EntityFee.load(tokens[i].toHex()+id);
                if(entityFee==null) {
                    entityFee = new EntityFee(tokens[i].toHex()+id);
                    entityFee.TimeStamp = block.timestamp;
                    entityFee.Token = tokens[i];
                    entityFee.save();
                }
                 log.debug("token step3",[]);
                let entityPremium = EntityPremium.load(tokens[i].toHex()+id);
                if(entityPremium==null) {
                    entityPremium = new EntityPremium(tokens[i].toHex() + id);
                    entityPremium.TimeStamp = block.timestamp;
                    entityPremium.Token = tokens[i];
                    entityPremium.save();
                }
             }//whitelist token[] end

            entityTotalTLV.TotalUsdValue = entityTotalTLV.TotalUsdValue.plus(colpoolsc.getRealBalance(tokens[i]));
            entityTotalTLV.save();

            let entityNetWorth = new EntityNetWorth(id);
            entityNetWorth.TimeStamp = block.timestamp;
            entityNetWorth.Pool = managerAddess;
            entityNetWorth.NetWorth = managersc.getTokenNetworth();
            entityNetWorth.save();

            //no option,not test
            let optionlen = optionpoolsc.getOptionInfoLength().toI32();
            for(let j=optionlen;j>0;j--) {
                let k = BigInt.fromI32(j);
                let pooloptionid = BigInt.fromI32(i).toHex() +k.toHex();
                //(optionsId 0,info.owner 1,
                // info.optType 2,
                // info.underlying 3
                // info.createTime+info.expiration 4
                // info.strikePrice 5,info.amount 6)
                let optinfo = optionpoolsc.getOptionsById(k);
                // 0 info.settlement
                // 1 info.settlePrice,
                // 2 (info.strikePrice*info.priceRate)>>28,
                // 3 info.optionsPrice,
                // 4 info.iv)
                let extrainfo = optionpoolsc.getOptionsExtraById(k);
                if(optinfo.value4.gt(block.timestamp)) {
                    //poolid+optionid as key
                    let entityActiveOption = EntityActiveOption.load(pooloptionid);
                    if (entityActiveOption == null) {
                        entityActiveOption = new EntityActiveOption(pooloptionid);
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

                }//active option caculation


                //poolid+optionid as key
                let entityoption = EntityOptionItem.load(pooloptionid);

                if(entityoption==null) {
                    let entityBuyIdHash = EntityBuyOptionHashId.load(optionPoolAssress.toHex()+k.toHex());
                    if (entityBuyIdHash == null) {
                        continue;
                    }
                    let entityBuyOptionItem = EntityBuyOptionItem.load(entityBuyIdHash.BuyHash);
                    if (entityBuyOptionItem == null) {
                        continue;
                    }
                    //supplement missing field value from event
                    entityBuyOptionItem.Settlement = extrainfo.value0;
                    entityBuyOptionItem.UnderLyingPrice = extrainfo.value2;
                    entityBuyOptionItem.CurrentWorth = entityBuyOptionItem.Amount.times(extrainfo.value3);
                    entityBuyOptionItem.save();

                    let entityexcercisehash = EntityExcerciseOptionHashId.load(managerAddess.toHex()+k.toHex());
                    let entityexcerciseitem:EntityExcerciseOptionItem;

                    if(entityexcercisehash!=null) {
                        entityexcerciseitem = <EntityExcerciseOptionItem>(EntityExcerciseOptionItem.load(entityexcercisehash.ExcerciseHash));
                        entityexcerciseitem.BuyPay = extrainfo.value3.times(entityexcerciseitem.ExerciseAmount);
                        entityexcerciseitem.save();
                    } else {
                        entityexcerciseitem = null;
                    }

                    let entityOptionItem = EntityOptionItem.load(pooloptionid);
                    if(entityOptionItem==null) {
                        entityOptionItem = new EntityOptionItem(pooloptionid);
                    }

                    entityOptionItem.Date = entityBuyOptionItem.CreatedTime;
                    entityOptionItem.Amount = optinfo.value6;//amount
                    entityOptionItem.UnderlyingAssets = optinfo.value3 //underlying
                    entityOptionItem.Type = BigInt.fromI32(optinfo.value2);
                    entityOptionItem.UsdValue = entityBuyOptionItem.CurrentWorth;
                    entityOptionItem.StrikePrice = entityBuyOptionItem.StrikePrice;
                    let optionpayusd = entityBuyOptionItem.OptionPrice.times(entityBuyOptionItem.Amount);
                    let feeusd = entityBuyOptionItem.Fee.times(extrainfo.value1);
                    let premium = optionpayusd.plus(feeusd);
                    entityOptionItem.Premium = premium;
                    //Status: String!
                    if(entityOptionItem.Amount.equals(BigInt.fromI32(0))) {
                        entityOptionItem.Status = "Excercised";
                        if(entityexcerciseitem!=null) {
                            entityOptionItem.PL = entityexcerciseitem.ExerciseBack.minus(premium);
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
                            entityOptionItem.PL = BigInt.fromI32(0).minus(premium);
                        } else {
                            entityOptionItem.PL = entityexcerciseitem.ExerciseBack.minus(premium);
                        }
                    }

                    entityOptionItem.save();


                    let entityPremium = EntityPremium.load(extrainfo.value0.toHex()+id);

                    if(entityPremium!=null) {
                        if (optinfo.value2 == 0) {
                            entityPremium.CallUsdValue = entityPremium.CallUsdValue.plus(premium);
                            let settleAmount = entityOptionItem.Premium.div(extrainfo.value1)
                            entityPremium.CallAmount = entityPremium.CallAmount.plus(settleAmount);
                        } else {
                            entityPremium.PutUsdValue = entityPremium.PutUsdValue.plus(premium);
                            let settleAmount = entityOptionItem.Premium.div(extrainfo.value1)
                            entityPremium.PutAmount = entityPremium.PutAmount.plus(settleAmount);
                        }

                        entityPremium.save();
                    }


                    let entityFee = EntityFee.load(extrainfo.value0.toHex()+id);

                    if(entityFee!=null) {
                        if (optinfo.value2 == 0) {
                            entityFee.CallUsdValue = entityFee.CallUsdValue.plus(feeusd);
                            entityFee.CallAmount = entityFee.CallAmount.plus(entityBuyOptionItem.Fee);
                        } else {
                            entityFee.PutUsdValue = entityFee.PutUsdValue.plus(feeusd);
                            entityFee.PutAmount = entityFee.PutAmount.plus(entityBuyOptionItem.Fee);
                        }

                        entityFee.save();
                    }


                } else {
                    break;
                }



            }//for option length

        }//for manager length

   }//end if (entityTotalTLV == null)

}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleAddCollateral(event: AddCollateral): void {}

export function handleRedeemCollateral(event: RedeemCollateral): void {}

export function handleSellOption(event: SellOption): void {}

export function handleBurnOption(event: BurnOption): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}