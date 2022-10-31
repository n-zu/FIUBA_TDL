import {Peer} from "peerjs";
import {HostMaster, Message} from "./hostMaster.js";


export type Action = {
  type: string;
  action: (arg?: any) => void;
};

export abstract class GameMaster {
  actions: Action[] = [];
  peer: Peer;

  protected constructor(peerId?: string) {
    console.log("GameMaster", this);
    this.peer = this.createPeer(peerId);
    console.log("createPeer")
    if (this instanceof HostMaster) {
      console.log("HostMaster")
      this.peer = new Peer("efoppiano");
    } else {
      console.log("GuestMaster")
      this.peer = new Peer();
    }
    this.peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });
  }

  public addAction(type: string, action: (arg?: any) => void) {
    this.actions.push({ type, action });
  }

  public abstract send(type: string, message: Message): void;

  createPeer(socketId?: string): Peer {
    console.log("createPeer")
    if (socketId) {
      return new Peer(socketId);
    } else {
      return new Peer();
    }
  }

  public abstract shouldSendSync(): boolean;

  public abstract broadcast(type: string, message: Message): void;
}
