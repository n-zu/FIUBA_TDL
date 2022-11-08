import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Player } from "./player";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Direction } from "../../../common/types/direction.js";
import { EnemyState } from "../../../common/types/state.js";
import { EnemyUpdate } from "../../../common/types/messages";
const SPEED = 50;
const HEALTH = 100;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  id: number;
  health = HEALTH;
  facing: Direction = Direction.Down;
  gameMaster: GameMaster;
  cooldown = Math.random() * 100;
  cooldownCount = this.cooldown;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameMaster: GameMaster,
    id: number
  ) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.75;
    this.setBodySize(80, 180);

    this.visible = false;
    this.active = false;

    this.gameMaster = gameMaster;
    this.id = id;
  }

  public update(players: Player[]) {
    // This allows random movement and improves performance by not updating
    // the enemy every frame. We should consider the consequences of using
    // randomness, because the guest will calculate a different path. Maybe
    // we should use a seed
    if (!this.body.enable) return;
    if (this.health <= 0) {
      this.die();
      return;
    }

    if (this.cooldownCount > 0) {
      this.cooldownCount--;
      return;
    }
    if (players.length === 0) return;

    this.cooldownCount = this.cooldown;
    const closestPlayer = this.getClosestPlayer(players);
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      closestPlayer.x,
      closestPlayer.y
    );
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      closestPlayer.x,
      closestPlayer.y
    );
    const isFar = distance > 70 ? 1 : 0;
    let xUnit = Math.cos(angle);
    let yUnit = Math.sin(angle);

    xUnit = Math.abs(xUnit) < 0.3 ? 0 : xUnit;
    yUnit = Math.abs(yUnit) < 0.3 ? 0 : yUnit;

    const velocityX = xUnit * SPEED;
    const velocityY = yUnit * SPEED;

    this.setVelocityX(velocityX * isFar);
    this.setVelocityY(velocityY * isFar);

    const direction = this.getMovementDirection(velocityX, velocityY);

    if (direction) {
      this.facing = direction;
    }
    this.setDepth(this.y);
  }

  public getState(): EnemyState {
    return {
      position: {
        x: this.x,
        y: this.y,
      },
      health: this.health,
      active: this.active,
      visible: this.visible,
      bodyEnabled: this.body.enable,
    };
  }

  public receiveDamage(damage: number) {
    if (this.health <= 0) return;

    this.health -= damage;
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.health = HEALTH;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  public handleMessage(payload: EnemyUpdate) {
    if (payload.type === "die") {
      this.die();
    }
  }

  private getMovementDirection(
    xMovement: number,
    yMovement: number
  ): Direction {
    if (xMovement > 0 && yMovement > 0) {
      return Direction.DownRight;
    }
    if (xMovement > 0 && yMovement < 0) {
      return Direction.UpRight;
    }
    if (xMovement < 0 && yMovement > 0) {
      return Direction.DownLeft;
    }
    if (xMovement < 0 && yMovement < 0) {
      return Direction.UpLeft;
    }
    if (xMovement > 0) {
      return Direction.Right;
    }
    if (xMovement < 0) {
      return Direction.Left;
    }
    if (yMovement > 0) {
      return Direction.Down;
    }
    if (yMovement < 0) {
      return Direction.Up;
    }
    return Direction.Down;
  }

  private getClosestPlayer(players: Player[]): Player {
    let closestPlayer: Player = players[0];
    let distanceToClosestPlayer: number | null = null;
    for (const player of players) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        player.x,
        player.y
      );
      if (
        distanceToClosestPlayer === null ||
        distance < distanceToClosestPlayer
      ) {
        closestPlayer = player;
        distanceToClosestPlayer = distance;
      }
    }
    return closestPlayer;
  }

  private die() {
    this.health = 0;
    this.setVelocity(0, 0);
    this.setDepth(this.y - 100);
    this.body.enable = false;
    this.gameMaster.broadcast("enemy", {
      id: this.id,
      type: "die",
    });

    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}