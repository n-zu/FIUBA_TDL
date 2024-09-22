// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.6.1
// source: messages/switchGunMessage.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { GunType, gunTypeFromJSON, gunTypeToJSON } from "../player/playerArsenal.js";

export const protobufPackage = "messages.v1";

export interface SwitchGunMessage {
  gunType: GunType;
}

function createBaseSwitchGunMessage(): SwitchGunMessage {
  return { gunType: 0 };
}

export const SwitchGunMessage: MessageFns<SwitchGunMessage> = {
  encode(message: SwitchGunMessage, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.gunType !== 0) {
      writer.uint32(8).int32(message.gunType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SwitchGunMessage {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwitchGunMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.gunType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwitchGunMessage {
    return { gunType: isSet(object.gunType) ? gunTypeFromJSON(object.gunType) : 0 };
  },

  toJSON(message: SwitchGunMessage): unknown {
    const obj: any = {};
    if (message.gunType !== 0) {
      obj.gunType = gunTypeToJSON(message.gunType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwitchGunMessage>, I>>(base?: I): SwitchGunMessage {
    return SwitchGunMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwitchGunMessage>, I>>(object: I): SwitchGunMessage {
    const message = createBaseSwitchGunMessage();
    message.gunType = object.gunType ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
