import { BigInt,
        ethereum,
        Address,
        log,
        dataSource} from "@graphprotocol/graph-ts"

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
    EntityBuyOptionItem,
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

export function handleAddCollateral(event: AddCollateral): void {}

export function handleBuyOption(event: BuyOption): void {}

export function handleBlock(block: ethereum.Block): void {

   let id = block.timestamp.div(BigInt.fromI32(ONE_DAY_SECONDS)).toHex();
   let entityTotalTLV = EntityTotalTLV.load(id);
   if (entityTotalTLV == null) {
       entityTotalTLV = new EntityTotalTLV(id);
       entityTotalTLV.TotalUsdValue = BigInt.fromI32(0);
       for (let i=0;i<OPTION_MANAGERS.length;i++) {
         let managersc = OptionManager.bind(Address.fromString(OPTION_MANAGERS[i]));
         let optionPoolAssress = OptionManager.getCollateralPoolAddress();
         let optionpoolsc = OptionPool.bind(optionPoolAssress);
         let colPoolAddress = OptionManager.getCollateralPoolAddress();
         let colpoolsc = CollateralPool.bind(colPoolAddress);

         let entityOptionManager = EntityOptionManager.load(OPTION_MANAGERS[i]);
         if (entityOptionManager == null) {
             entityOptionManager = new EntityOptionManager(OPTION_MANAGERS[i]);
             entityOptionManager.save();
             OptionManagerTemplate.create(Address.fromString(OPTION_MANAGERS[i]));
             let entityOptionPool = new EntityOptionPool(OPTION_POOLS[i]);
             entityOptionPool.save();
             OPtionPoolTemplate.create(Address.fromString(OPTION_POOLS[i]));
         }

         let tokens = managersc.getWhiteList();
         for (let i=0;i<tokens.length;i++) {
            let entityPoolTLV = new EntityPoolTLV(tokens[i]+id.substr(2));
            entityPoolTLV.Pool = Address.fromString(optionPoolAssress[i]);
            entityPoolTLV.Token = tokens[i];
            entityPoolTLV.Amout = colpoolsc.getCollateralBalance(tokens[i]);
            entityPoolTLV.UsdValue = optionpoolsc.getNetWrothLatestWorth(tokens[i])
            entityPoolTLV.save();
         }

         let entityNetWorth = new EntityNetWorth(id);
         entityNetWorth.save();

           let entityActiveOption = new EntityActiveOption(id);
           entityActiveOption.save();

           let entityPremium = new EntityPremium(id);
           entityPremium.save();

           let entityFee = new EntityFee(id);
           entityFee.save();
       }

       entityTotalTLV.save();
   }
}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleExerciseOption(event: ExerciseOption): void {}

export function handleRedeemCollateral(event: RedeemCollateral): void {}

export function handleSellOption(event: SellOption): void {}

export function handleBurnOption(event: BurnOption): void {

}

export function handleCreateOption(event: CreateOption): void {}

export function handleDebugEvent(event: DebugEvent): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}