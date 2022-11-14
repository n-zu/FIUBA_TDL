import geckos, { ClientChannel } from "@geckos.io/client";
import { Action, Message } from "../../../common/types/messages";
import {
  ClientPacket,
  ClientPacketType,
  PayloadFor,
  ServerPacket,
  ServerPacketType,
} from "../../../common/types/packet";

const SERVER_PORT = 9208;

export type CallbackFnFor<T extends ServerPacketType> = (
  arg: PayloadFor<T>
) => boolean; // false to remove callback

export type CallbackFor<T extends ServerPacketType> = {
  type: T;
  callback: CallbackFnFor<T>;
};
export type Callback = CallbackFor<ServerPacketType>;

export class GuestMaster {
  callbacks: Callback[] = [];
  actions: Action[] = [];
  channel: ClientChannel;
  gameId: string = "";
  gameHandler?: (msg: Message) => void;

  constructor() {
    this.channel = geckos({
      url: process.env.SERVER_URL,
      port: SERVER_PORT,
    });
    this.addHandlerCallback();

    this.channel.onConnect((error) => {
      if (error) console.error(error.message);

      this.channel.on("msg", (p: any) => {
        const packet = p as ServerPacket;
        if (packet.payload?.gameId) this.gameId = packet.payload.gameId;

        console.log("callbacks", this.callbacks);
        this.callbacks = this.callbacks.filter(
          (c) => c.type !== packet.type || c.callback(packet.payload)
        );
      });
    });
  }

  public setGameHandler(handler: (msg: Message) => void) {
    this.gameHandler = handler;
  }

  private addHandlerCallback() {
    this.addCallback("gameInfo", (payload) => {
      this.gameHandler?.(payload.payload);
      return true;
    });
  }

  public addCallback<T extends ServerPacketType>(
    type: T,
    callback: CallbackFnFor<T>
  ) {
    this.callbacks.push({ type, callback });
  }

  public send<T extends ClientPacketType>(
    type: T,
    payload: PayloadFor<T>,
    reliable: boolean = true
  ) {
    const msg = {
      type,
      payload,
    };

    this.send_async(msg, reliable);
  }

  private async send_async(msg: ClientPacket, reliable: boolean = true) {
    this.channel.emit("msg", msg, { reliable });
  }
}
