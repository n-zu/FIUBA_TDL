import Sprite = Phaser.Physics.Arcade.Sprite;
import { Enemy } from "./enemy";
import DirectionVector from "../controls/direction";

export type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
};

const SPEED = 2000;

export class Bullet extends Sprite {
  damage = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
  }

  public fire(x: number, y: number, direction: DirectionVector) {
    const [velocityX, velocityY] = direction.getSpeed(SPEED);
    const rotation = Math.atan2(velocityY, velocityX);

    this.setScale(0.5);
    this.setAlpha(0.3);
    this.setBodySize(70, 70);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      },
    });
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }

  // We should use an interface for this
  public collideWith(enemy: Enemy) {
    enemy.receiveDamage(this.damage);
    this.die();
  }

  public getState(): BulletState {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
    };
  }

  public sync(bulletState: BulletState) {
    this.setPosition(bulletState.x, bulletState.y);
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);
  }

  private getVelocity([x, y]: [number, number], speed: number) {
    return [x * speed, y * speed];
  }
}
