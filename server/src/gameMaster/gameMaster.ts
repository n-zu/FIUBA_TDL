import geckos, {
  GeckosServer,
  iceServers,
  ServerChannel,
} from "@geckos.io/server";
import http from "http";
import {
  Action,
  Message,
  UpdateType,
  UpdateFor,
  ActionFnFor,
} from "../../../common/types/messages.js";

export abstract class GameMaster {
  actions: Action[] = [];
  io: GeckosServer;
  channels: ServerChannel[] = [];

  protected constructor(server: http.Server) {
    this.io = geckos({
      iceServers: iceServers,
    });
    this.io.addServer(server);

    this.io.onConnection((channel: ServerChannel) => {
      console.log("new connection");
      this.channels.push(channel);

      channel.on("msg", (msg: any) => {
        const message = msg as Message;
        this.actions
          .find((action) => action.type === message.type)
          ?.action(message.payload);
      });
    });
  }

  public addAction<T extends UpdateType>(type: T, action: ActionFnFor<T>) {
    this.actions.push({ type, action });
  }

  public abstract broadcast<T extends UpdateType>(
    type: T,
    payload: UpdateFor<T>
  ): void;
}