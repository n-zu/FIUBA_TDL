import { BulletGroupModel } from "../../../common/bulletGroupModel.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../../../common/types/events.js";
import { BulletGroupState } from "../../../common/types/state.js";
import { Bullet } from "../objects/bullet.js";

export class BulletGroup extends BulletGroupModel {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene, observer, (scene, observer) => new Bullet(scene, observer));
  }

  public getState(): BulletGroupState {
    return this.children.entries.map((bullet) => {
      const b = bullet as Bullet;
      return b.getState();
    });
  }
}
