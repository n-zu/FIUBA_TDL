import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import { Player } from "../objects/player";
import MovementDirection from "../../../common/controls/direction";
import { UnitVector } from "../../../common/types/direction";
import { numToGunName } from "../../../common/guns";

let lasShot = 0;
const diagonalFactor = Math.sqrt(2) / 2;

interface LetterKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export class PlayerControls {
  cursorKeys: CursorKeys;
  letterKeys: LetterKeys;
  player: Player;

  constructor(player: Player) {
    this.cursorKeys = player.scene.input.keyboard.createCursorKeys();
    this.letterKeys = player.scene.input.keyboard.addKeys(
      "W,A,S,D"
    ) as LetterKeys;
    this.player = player;

    player.scene.input.keyboard.on("keydown", (event: any) => {
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        const num = event.keyCode - 49;
        const name = numToGunName(num);
        this.player.setGun(name);
      }
    });
  }

  public down(): boolean {
    return this.cursorKeys.down.isDown || this.letterKeys.S.isDown;
  }

  public up(): boolean {
    return this.cursorKeys.up.isDown || this.letterKeys.W.isDown;
  }

  public left(): boolean {
    return this.cursorKeys.left.isDown || this.letterKeys.A.isDown;
  }

  public right(): boolean {
    return this.cursorKeys.right.isDown || this.letterKeys.D.isDown;
  }

  private getKeysDirection(): UnitVector {
    if (!document.hasFocus()) return [0, 0];

    let horizontal = +this.right() - +this.left();
    let vertical = +this.down() - +this.up();
    if (horizontal && vertical) {
      horizontal *= diagonalFactor;
      vertical *= diagonalFactor;
    }
    return [horizontal, vertical];
  }

  update() {
    this.player.moveTo(this.getKeysDirection());
    const reloadTime = this.player.getShootReloadTime();

    if (this.cursorKeys.space.isDown) {
      if (Date.now() - lasShot > reloadTime) {
        lasShot = Date.now();
        this.player.shoot();
      }
    }

    // if mouse click
    if (this.player.scene.input.activePointer.isDown) {
      const now = Date.now();
      if (now - lasShot > reloadTime) {
        lasShot = now;
        this.player.shoot(true);
      }
    }
  }
}
