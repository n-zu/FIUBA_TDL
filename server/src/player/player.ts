import "@geckos.io/phaser-on-nodejs";
import { GunName } from "../../../common/guns/gun.js";
import PlayerModel from "../../../common/playerModel.js";
import { EncodedDirection, PlayerUpdate } from "../../../common/types/messages.js";
import { PlayerState } from "../../../common/types/state.js";
import PlayerArsenal from "./playerArsenal.js";
import { Direction as DirectionProto, DirectionEnum as DirectionEnumProto } from "../../../common/generated/utils/direction.js";
import { Player as PlayerProto } from "../../../common/generated/player/player.js";
import { PlayerUpdate as PlayerUpdateProto } from "../../../common/generated/messages/playerUpdate.js";
import { Direction, directionToProto, protoToDirection } from "../../../common/types/direction.js";

import { Buffer } from "buffer";
import { gunTypeToGunName } from "../../../common/utils.js";

export class Player extends PlayerModel {
    lastUpdate = Date.now();

    public getState(): PlayerState {
        return {
            id: this.id,
            position: {
                x: this.x,
                y: this.y
            },
            facing: this.facing,
            idle: this.idle,
            health: this.health,
            arsenal: (this.arsenal as PlayerArsenal).getState(),
        };
    }

    public handleMessage(message: PlayerUpdateProto) {
        this.lastUpdate = Date.now();
        if (message.movement) {
            this.move(message.movement.direction?.direction);
        } else if (message.shoot) {
            this.shoot();
        } else if (message.switchGun) {
            this.switchGun(gunTypeToGunName(message.switchGun.gunType));
        } else if (message.stop) {
            this.move();
        } else if (message.ping === undefined) {
            console.error("function: handleMessage | action: unknown message type | message: ", message);
        }
    }

    private directionToProto(direction: Direction): DirectionEnumProto {
        switch (direction) {
            case Direction.Up:
                return DirectionEnumProto.Up;
            case Direction.Down:
                return DirectionEnumProto.Down;
            case Direction.Left:
                return DirectionEnumProto.Left;
            case Direction.Right:
                return DirectionEnumProto.Right;
            case Direction.UpLeft:
                return DirectionEnumProto.UpLeft;
            case Direction.UpRight:
                return DirectionEnumProto.UpRight;
            case Direction.DownLeft:
                return DirectionEnumProto.DownLeft;
            case Direction.DownRight:
                return DirectionEnumProto.DownRight;
        }
    }

}
