import Sprite = Phaser.Physics.Arcade.Sprite;
import { Player } from "./player";

const SPEED = 50;

export type EnemyState = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  rotation: number;
  animation?: {
    key: string;
    frame: number;
  };
};

export class Enemy extends Sprite {
  id: string;
  health = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, id?: string) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.8;
    this.setBodySize(80, 180);

    if (id) {
      this.id = id;
    } else {
      this.id = Phaser.Math.RND.uuid();
    }
  }

  public update(players: Player[]) {
    // This allows random movement and improves performance by not updating
    // the enemy every frame. We should consider the consequences of using
    // randomness, because the guest will calculate a different path. Maybe
    // we should use a seed
    if (Math.random() < 0.95) return;

    if (this.health <= 0) {
      this.setVelocity(0, 0);
      return;
    }

    const closestPlayer = this.getClosesPlayer(players);
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
    const velocityX = Math.cos(angle) * SPEED;
    const velocityY = Math.sin(angle) * SPEED;

    this.setVelocityX(velocityX * isFar);
    this.setVelocityY(velocityY * isFar);

    let yMovement = "idle";
    let xMovement = "idle";

    if (velocityY < 0) {
      yMovement = "up";
    } else if (velocityY > 0) {
      yMovement = "down";
    }
    if (velocityX < 0) {
      xMovement = "left";
    } else if (velocityX > 0) {
      xMovement = "right";
    }

    const suffix = isFar ? "" : "-atk";

    // I do this to avoid the diagonal animations when little movement is happening in the x or y-axis
    if (
      yMovement !== "idle" &&
      xMovement !== "idle" &&
      Math.abs(velocityX) > 15 &&
      Math.abs(velocityY) > 15
    ) {
      this.anims.play(`zombie-${yMovement}-${xMovement}${suffix}`, true);
    } else if (
      yMovement !== "idle" &&
      Math.abs(velocityY) > Math.abs(velocityX)
    ) {
      this.anims.play(`zombie-${yMovement}${suffix}`, true);
    } else if (
      xMovement !== "idle" &&
      Math.abs(velocityX) > Math.abs(velocityY)
    ) {
      this.anims.play(`zombie-${xMovement}${suffix}`, true);
    }

    this.setDepth(this.y);
  }

  public sync(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    this.setDepth(this.y);
    if (state.animation) {
      this.anims.play(state.animation.key, true);
    }
  }

  public getState(): EnemyState {
    let currentAnimation: { key: string; frame: number } | undefined;
    if (this.anims.currentAnim && this.anims.currentFrame) {
      currentAnimation = {
        key: this.anims.currentAnim.key,
        frame: this.anims.currentFrame.index,
      };
    }
    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y,
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y,
      },
      rotation: this.rotation,
      animation: currentAnimation,
    };
  }

  private getClosesPlayer(players: Player[]): Player {
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

  public receiveDamage(damage: number, onDeath: () => void) {
    if (this.health <= 0) return;

    this.health -= damage;

    // paint red for a second
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this && this.clearTint();
    });

    if (this.health <= 0) this.die(onDeath);
  }

  private die(onDeath: () => void) {
    const directions: string[] = [];

    if (this.body.velocity.y > 0) directions.push("down");
    else if (this.body.velocity.y < 0) directions.push("up");

    if (this.body.velocity.x > 0) directions.push("right");
    else if (this.body.velocity.x < 0) directions.push("left");

    const direction = directions.join("-") || "down";

    this.setVelocity(0, 0);
    this.setImmovable(true);
    this.setBodySize(1, 1);

    this.anims.play(`zombie-${direction}-die`, true);
    this.scene.time.delayedCall(3000, () => {
      onDeath();
    });
  }
}
