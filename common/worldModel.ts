import { BulletGroupModel } from "./bulletGroupModel";
import { BulletModel } from "./bulletModel";
import { EnemyModel } from "./enemy/enemyModel";
import { Difficulty, EnemyGroupModel } from "./enemyGroupModel.js";
import Observer from "./observer/observer";
import PlayerModel from "./playerModel";
import { GameEvents } from "./types/events";
import { SpawnPoint } from "./types/state";
import { getPrng } from "./utils.js";

const prng = getPrng(42);

export abstract class WorldModel {
    players: PlayerModel[];
    enemies: EnemyGroupModel;
    observer: Observer<GameEvents>;
    bullets: BulletGroupModel;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
        this.scene = scene;
        this.enemies = this.newEnemyGroup(scene, observer, Difficulty.Hard, this.getSpawnPoints());
        this.observer = observer;
        this.bullets = this.newBulletGroup(scene, observer);
        this.players = [];

        this.setupCollisions();
    }

    public setupCollisions() {
        this.scene.physics.add.overlap(this.enemies, this.bullets, (e, b) => {
            const bullet = b as BulletModel;
            const enemy = e as EnemyModel;
            if (bullet.active && enemy.active) {
                bullet.collideWith(enemy);
            }
        });

        // Enemies repel each other
        this.scene.physics.add.collider(this.enemies, this.enemies);
    }

    protected abstract newBulletGroup(scene: Phaser.Scene, observer: Observer<GameEvents>): BulletGroupModel;

    protected abstract newEnemyGroup(scene: Phaser.Scene, observer: Observer<GameEvents>, difficulty: Difficulty, spawnPoints: SpawnPoint[]): EnemyGroupModel;

    protected abstract newPlayer(id: string,
        scene: Phaser.Scene,
        observer: Observer<GameEvents>,
        position: { x: number; y: number },
        bullets: BulletGroupModel): PlayerModel;

    public update() {
        this.players.forEach((player) => player.update());
        this.enemies.update(this.players);
    }

    private getSpawnPoints(): { x: number; y: number }[] {
        const center = { x: 0, y: 0 };
        const radius = 1000;
        const spawnPoints = [];
        for (let i = 0; i < 30; i++) {
            const angle = prng() * 2 * Math.PI;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            spawnPoints.push({ x, y });
        }
        return spawnPoints;
    }

    public playerExists(id: string): boolean {
        return this.players.some((p) => p.id === id);
    }
}