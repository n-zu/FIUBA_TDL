// World

import { EncodedMovementDirection } from "../controls/direction";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
  rage: number;
  kills: number;
};

// Enemy

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  movementDirection: EncodedMovementDirection;
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
  action: string;
};

export type EnemyGroupState = {
  enemies: EnemyState[];
  timeUntilNextHorde: number;
  spawnPoints: SpawnPoint[];
};

export type SpawnPoint = {
  x: number;
  y: number;
};

// Player

export type PlayerState = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  health: number;
  movementDirection: EncodedMovementDirection;
};

// Bullet

export type BulletGroupState = BulletState[];

export type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
};
