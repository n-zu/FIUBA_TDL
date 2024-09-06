import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { BulletState } from "../../../common/types/state.js";
import Observer from "../../../common/observer/observer.js";
import { polarToCartesian } from "../../../common/utils.js";
import Gun from "../../../common/guns/gun.js";
import PlayerModel from "../../../common/playerModel.js";
import { GameEvents } from "../../../common/types/events.js";
import { EnemyModel } from "../../../common/enemy/enemyModel.js";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  playerId = "none";
  origin?: Gun;
  shooter?: PlayerModel;
  observer: Observer<GameEvents>;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene, 0, 0, "");
    this.setActive(false);
    this.setVisible(false);
    this.setPosition(0, 0);

    this.observer = observer;
  }

  public fire(
    x: number,
    y: number,
    rotation: number,
    shooter: PlayerModel,
    origin: Gun
  ) {
    const velocity = polarToCartesian(rotation, origin.getBulledSpeed());

    this.setScale(0.5);
    this.setAlpha(0.3);
    this.setBodySize(70, 70);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(velocity[0]);
    this.setVelocityY(velocity[1]);
    this.setActive(true);
    this.setVisible(true);

    this.origin = origin;
    this.body.enable = true;
    this.shooter = shooter;

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      }
    });
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }

  // We should use an interface for this
  public collideWith(enemy: EnemyModel) {
    if (this.origin && this.shooter) {
      enemy.receiveDamage(this.origin.getDamage(), this.shooter);
      this.die();  
    }
  }

  public getState(): BulletState {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
      gunName: this.origin?.getGunName() || "rifle",
    };
  }
}
