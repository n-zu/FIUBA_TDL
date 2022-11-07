import { Direction } from "../../../common/types/direction";
import { BulletGroupState } from "../../../common/types/state";
import { Bullet } from "../objects/bullet";

export class BulletGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);

    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  public shootBullet(x: number, y: number, direction: Direction) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, direction);
    }
  }

  public sync(bulletGroupState: BulletGroupState) {
    bulletGroupState.forEach((bulletState, i) => {
      const bullet = this.children.entries[i] as Bullet;
      bullet.setDepth(bulletState.y);
      bullet.setPosition(bulletState.x, bulletState.y);
      bullet.setRotation(bulletState.rotation);
      bullet.setActive(bulletState.active);
      bullet.setVisible(bulletState.visible);
    });
  }
}
