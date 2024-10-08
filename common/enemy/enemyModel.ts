import config from "../config.js";
import Observer from "../observer/observer.js";
import PlayerModel from "../playerModel.js";
import { GameEvents } from "../types/events.js";
import { getPrng } from "../utils.js";
import EnemyBrain from "./enemyBrain.js";
import EnemyPhysiqueModel from "./enemyPhysiqueModel.js";

const prng = getPrng(42);

export class EnemyModel extends Phaser.Physics.Arcade.Sprite {
  id: number;
  physique: EnemyPhysiqueModel;

  angle: number = 0;
  observer: Observer<GameEvents>;
  brain: EnemyBrain;

  constructor(
    id: number,
    scene: Phaser.Scene,
    position: { x: number; y: number },
    observer: Observer<GameEvents>,
    physique: EnemyPhysiqueModel,
    sprite: string = ""
  ) {
    super(scene, position.x, position.y, sprite);
    this.addToScene();

    this.id = id;
    this.observer = observer;
    this.brain = new EnemyBrain(prng() * 100);
    this.physique = physique;
  }

  private addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBodySize(config.misc.enemySize.width, config.misc.enemySize.height);

    this.visible = false;
    this.active = false;
  }

  public async update(players: PlayerModel[]) {
    this.brain.update(this, players);
  }

  public turn(angle: number) {
    this.angle = angle;
    this.physique.setVelocityOf(this);
    this.observer.notify("enemyMoved", this);
  }

  public receiveDamage(damage: number, damager?: PlayerModel) {
    if (this.physique.isDead()) return;

    this.physique.receiveDamage(damage);
    this.observer.notify("enemyReceivedDamage", this);
    if (this.physique.isDead() && damager) {
      this.die(damager);
    }
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.physique.resetHealth();
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  public die(killer?: PlayerModel) {
    this.setVelocity(0, 0);
    this.body.enable = false;
    if (killer) {
      this.observer.notify("playerKill", killer);
    }

    this.setRotation(prng() * 0.4 - 0.2);
    this.setDepth(this.y - 100);
    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
    this.observer.notify("enemyDied", this);
  }
}
