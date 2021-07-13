// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class EntityOptionManager extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityOptionManager entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityOptionManager entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityOptionManager", id.toString(), this);
  }

  static load(id: string): EntityOptionManager | null {
    return store.get("EntityOptionManager", id) as EntityOptionManager | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class EntityOptionPool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityOptionPool entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityOptionPool entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityOptionPool", id.toString(), this);
  }

  static load(id: string): EntityOptionPool | null {
    return store.get("EntityOptionPool", id) as EntityOptionPool | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class EntityBuyOptionHashId extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save EntityBuyOptionHashId entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityBuyOptionHashId entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityBuyOptionHashId", id.toString(), this);
  }

  static load(id: string): EntityBuyOptionHashId | null {
    return store.get(
      "EntityBuyOptionHashId",
      id
    ) as EntityBuyOptionHashId | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get BuyHash(): string {
    let value = this.get("BuyHash");
    return value.toString();
  }

  set BuyHash(value: string) {
    this.set("BuyHash", Value.fromString(value));
  }
}

export class EntityBuyOptionItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityBuyOptionItem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityBuyOptionItem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityBuyOptionItem", id.toString(), this);
  }

  static load(id: string): EntityBuyOptionItem | null {
    return store.get("EntityBuyOptionItem", id) as EntityBuyOptionItem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get Optionid(): i32 {
    let value = this.get("Optionid");
    return value.toI32();
  }

  set Optionid(value: i32) {
    this.set("Optionid", Value.fromI32(value));
  }

  get Owner(): Bytes {
    let value = this.get("Owner");
    return value.toBytes();
  }

  set Owner(value: Bytes) {
    this.set("Owner", Value.fromBytes(value));
  }

  get OptType(): i32 {
    let value = this.get("OptType");
    return value.toI32();
  }

  set OptType(value: i32) {
    this.set("OptType", Value.fromI32(value));
  }

  get Underlying(): BigInt | null {
    let value = this.get("Underlying");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Underlying(value: BigInt | null) {
    if (value === null) {
      this.unset("Underlying");
    } else {
      this.set("Underlying", Value.fromBigInt(value as BigInt));
    }
  }

  get OptionPrice(): BigInt | null {
    let value = this.get("OptionPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set OptionPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("OptionPrice");
    } else {
      this.set("OptionPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get Settlement(): Bytes | null {
    let value = this.get("Settlement");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set Settlement(value: Bytes | null) {
    if (value === null) {
      this.unset("Settlement");
    } else {
      this.set("Settlement", Value.fromBytes(value as Bytes));
    }
  }

  get Expiration(): BigInt | null {
    let value = this.get("Expiration");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Expiration(value: BigInt | null) {
    if (value === null) {
      this.unset("Expiration");
    } else {
      this.set("Expiration", Value.fromBigInt(value as BigInt));
    }
  }

  get Amount(): BigInt | null {
    let value = this.get("Amount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Amount(value: BigInt | null) {
    if (value === null) {
      this.unset("Amount");
    } else {
      this.set("Amount", Value.fromBigInt(value as BigInt));
    }
  }

  get StrikePrice(): BigInt | null {
    let value = this.get("StrikePrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set StrikePrice(value: BigInt | null) {
    if (value === null) {
      this.unset("StrikePrice");
    } else {
      this.set("StrikePrice", Value.fromBigInt(value as BigInt));
    }
  }

  get UnderLyingPrice(): BigInt | null {
    let value = this.get("UnderLyingPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set UnderLyingPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("UnderLyingPrice");
    } else {
      this.set("UnderLyingPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get CreatedTime(): BigInt | null {
    let value = this.get("CreatedTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set CreatedTime(value: BigInt | null) {
    if (value === null) {
      this.unset("CreatedTime");
    } else {
      this.set("CreatedTime", Value.fromBigInt(value as BigInt));
    }
  }

  get CurrentWorth(): BigInt | null {
    let value = this.get("CurrentWorth");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set CurrentWorth(value: BigInt | null) {
    if (value === null) {
      this.unset("CurrentWorth");
    } else {
      this.set("CurrentWorth", Value.fromBigInt(value as BigInt));
    }
  }

  get Fee(): BigInt | null {
    let value = this.get("Fee");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Fee(value: BigInt | null) {
    if (value === null) {
      this.unset("Fee");
    } else {
      this.set("Fee", Value.fromBigInt(value as BigInt));
    }
  }
}

export class EntityExcerciseOptionHashId extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save EntityExcerciseOptionHashId entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityExcerciseOptionHashId entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityExcerciseOptionHashId", id.toString(), this);
  }

  static load(id: string): EntityExcerciseOptionHashId | null {
    return store.get(
      "EntityExcerciseOptionHashId",
      id
    ) as EntityExcerciseOptionHashId | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get BuyHash(): string {
    let value = this.get("BuyHash");
    return value.toString();
  }

  set BuyHash(value: string) {
    this.set("BuyHash", Value.fromString(value));
  }
}

export class EntityExcerciseOptionItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save EntityExcerciseOptionItem entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityExcerciseOptionItem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityExcerciseOptionItem", id.toString(), this);
  }

  static load(id: string): EntityExcerciseOptionItem | null {
    return store.get(
      "EntityExcerciseOptionItem",
      id
    ) as EntityExcerciseOptionItem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get Optionid(): i32 {
    let value = this.get("Optionid");
    return value.toI32();
  }

  set Optionid(value: i32) {
    this.set("Optionid", Value.fromI32(value));
  }

  get ExerciseAmount(): BigInt {
    let value = this.get("ExerciseAmount");
    return value.toBigInt();
  }

  set ExerciseAmount(value: BigInt) {
    this.set("ExerciseAmount", Value.fromBigInt(value));
  }

  get ExerciseBack(): BigInt {
    let value = this.get("ExerciseBack");
    return value.toBigInt();
  }

  set ExerciseBack(value: BigInt) {
    this.set("ExerciseBack", Value.fromBigInt(value));
  }

  get BuyPay(): BigInt {
    let value = this.get("BuyPay");
    return value.toBigInt();
  }

  set BuyPay(value: BigInt) {
    this.set("BuyPay", Value.fromBigInt(value));
  }
}

export class EntityOptionItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityOptionItem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityOptionItem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityOptionItem", id.toString(), this);
  }

  static load(id: string): EntityOptionItem | null {
    return store.get("EntityOptionItem", id) as EntityOptionItem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get Date(): BigInt {
    let value = this.get("Date");
    return value.toBigInt();
  }

  set Date(value: BigInt) {
    this.set("Date", Value.fromBigInt(value));
  }

  get Status(): string | null {
    let value = this.get("Status");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set Status(value: string | null) {
    if (value === null) {
      this.unset("Status");
    } else {
      this.set("Status", Value.fromString(value as string));
    }
  }

  get UnderlyingAssets(): string | null {
    let value = this.get("UnderlyingAssets");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set UnderlyingAssets(value: string | null) {
    if (value === null) {
      this.unset("UnderlyingAssets");
    } else {
      this.set("UnderlyingAssets", Value.fromString(value as string));
    }
  }

  get Type(): string | null {
    let value = this.get("Type");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set Type(value: string | null) {
    if (value === null) {
      this.unset("Type");
    } else {
      this.set("Type", Value.fromString(value as string));
    }
  }

  get Amount(): BigInt | null {
    let value = this.get("Amount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Amount(value: BigInt | null) {
    if (value === null) {
      this.unset("Amount");
    } else {
      this.set("Amount", Value.fromBigInt(value as BigInt));
    }
  }

  get UsdValue(): BigInt | null {
    let value = this.get("UsdValue");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set UsdValue(value: BigInt | null) {
    if (value === null) {
      this.unset("UsdValue");
    } else {
      this.set("UsdValue", Value.fromBigInt(value as BigInt));
    }
  }

  get StrikePrice(): BigInt | null {
    let value = this.get("StrikePrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set StrikePrice(value: BigInt | null) {
    if (value === null) {
      this.unset("StrikePrice");
    } else {
      this.set("StrikePrice", Value.fromBigInt(value as BigInt));
    }
  }

  get Premium(): BigInt | null {
    let value = this.get("Premium");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Premium(value: BigInt | null) {
    if (value === null) {
      this.unset("Premium");
    } else {
      this.set("Premium", Value.fromBigInt(value as BigInt));
    }
  }

  get PL(): BigInt | null {
    let value = this.get("PL");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set PL(value: BigInt | null) {
    if (value === null) {
      this.unset("PL");
    } else {
      this.set("PL", Value.fromBigInt(value as BigInt));
    }
  }
}

export class EntityTotalTLV extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityTotalTLV entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityTotalTLV entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityTotalTLV", id.toString(), this);
  }

  static load(id: string): EntityTotalTLV | null {
    return store.get("EntityTotalTLV", id) as EntityTotalTLV | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get TotalUsdValue(): BigInt {
    let value = this.get("TotalUsdValue");
    return value.toBigInt();
  }

  set TotalUsdValue(value: BigInt) {
    this.set("TotalUsdValue", Value.fromBigInt(value));
  }
}

export class EntityPoolTLV extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityPoolTLV entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityPoolTLV entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityPoolTLV", id.toString(), this);
  }

  static load(id: string): EntityPoolTLV | null {
    return store.get("EntityPoolTLV", id) as EntityPoolTLV | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get Pool(): Bytes {
    let value = this.get("Pool");
    return value.toBytes();
  }

  set Pool(value: Bytes) {
    this.set("Pool", Value.fromBytes(value));
  }

  get Token(): Bytes {
    let value = this.get("Token");
    return value.toBytes();
  }

  set Token(value: Bytes) {
    this.set("Token", Value.fromBytes(value));
  }

  get Amout(): BigInt {
    let value = this.get("Amout");
    return value.toBigInt();
  }

  set Amout(value: BigInt) {
    this.set("Amout", Value.fromBigInt(value));
  }

  get UsdValue(): BigInt {
    let value = this.get("UsdValue");
    return value.toBigInt();
  }

  set UsdValue(value: BigInt) {
    this.set("UsdValue", Value.fromBigInt(value));
  }
}

export class EntityNetWorth extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityNetWorth entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityNetWorth entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityNetWorth", id.toString(), this);
  }

  static load(id: string): EntityNetWorth | null {
    return store.get("EntityNetWorth", id) as EntityNetWorth | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get Pool(): Bytes {
    let value = this.get("Pool");
    return value.toBytes();
  }

  set Pool(value: Bytes) {
    this.set("Pool", Value.fromBytes(value));
  }

  get NetWorth(): BigInt {
    let value = this.get("NetWorth");
    return value.toBigInt();
  }

  set NetWorth(value: BigInt) {
    this.set("NetWorth", Value.fromBigInt(value));
  }
}

export class EntityActiveOption extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityActiveOption entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityActiveOption entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityActiveOption", id.toString(), this);
  }

  static load(id: string): EntityActiveOption | null {
    return store.get("EntityActiveOption", id) as EntityActiveOption | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get Underlying(): BigInt {
    let value = this.get("Underlying");
    return value.toBigInt();
  }

  set Underlying(value: BigInt) {
    this.set("Underlying", Value.fromBigInt(value));
  }

  get CallAmount(): BigInt {
    let value = this.get("CallAmount");
    return value.toBigInt();
  }

  set CallAmount(value: BigInt) {
    this.set("CallAmount", Value.fromBigInt(value));
  }

  get CallUsdValue(): BigInt {
    let value = this.get("CallUsdValue");
    return value.toBigInt();
  }

  set CallUsdValue(value: BigInt) {
    this.set("CallUsdValue", Value.fromBigInt(value));
  }

  get PutAmount(): BigInt {
    let value = this.get("PutAmount");
    return value.toBigInt();
  }

  set PutAmount(value: BigInt) {
    this.set("PutAmount", Value.fromBigInt(value));
  }

  get PutUsdValue(): BigInt {
    let value = this.get("PutUsdValue");
    return value.toBigInt();
  }

  set PutUsdValue(value: BigInt) {
    this.set("PutUsdValue", Value.fromBigInt(value));
  }
}

export class EntityPremium extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityPremium entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityPremium entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityPremium", id.toString(), this);
  }

  static load(id: string): EntityPremium | null {
    return store.get("EntityPremium", id) as EntityPremium | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get Token(): Bytes | null {
    let value = this.get("Token");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set Token(value: Bytes | null) {
    if (value === null) {
      this.unset("Token");
    } else {
      this.set("Token", Value.fromBytes(value as Bytes));
    }
  }

  get Amount(): BigInt | null {
    let value = this.get("Amount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Amount(value: BigInt | null) {
    if (value === null) {
      this.unset("Amount");
    } else {
      this.set("Amount", Value.fromBigInt(value as BigInt));
    }
  }

  get UsdValue(): BigInt | null {
    let value = this.get("UsdValue");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set UsdValue(value: BigInt | null) {
    if (value === null) {
      this.unset("UsdValue");
    } else {
      this.set("UsdValue", Value.fromBigInt(value as BigInt));
    }
  }
}

export class EntityFee extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EntityFee entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EntityFee entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EntityFee", id.toString(), this);
  }

  static load(id: string): EntityFee | null {
    return store.get("EntityFee", id) as EntityFee | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get TimeStamp(): BigInt {
    let value = this.get("TimeStamp");
    return value.toBigInt();
  }

  set TimeStamp(value: BigInt) {
    this.set("TimeStamp", Value.fromBigInt(value));
  }

  get Token(): Bytes | null {
    let value = this.get("Token");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set Token(value: Bytes | null) {
    if (value === null) {
      this.unset("Token");
    } else {
      this.set("Token", Value.fromBytes(value as Bytes));
    }
  }

  get Amount(): BigInt | null {
    let value = this.get("Amount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set Amount(value: BigInt | null) {
    if (value === null) {
      this.unset("Amount");
    } else {
      this.set("Amount", Value.fromBigInt(value as BigInt));
    }
  }

  get UsdValue(): BigInt | null {
    let value = this.get("UsdValue");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set UsdValue(value: BigInt | null) {
    if (value === null) {
      this.unset("UsdValue");
    } else {
      this.set("UsdValue", Value.fromBigInt(value as BigInt));
    }
  }
}
