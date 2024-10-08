// World

import { GunName } from "../guns/gun";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
  stats: WorldStatsState;
  recentEvents: RecentEventsListenerState;
};

export type WorldStatsState = {
  rage: number;
  kills: number;
  killsPerPlayer: Record<string, number>;
}

// Enemy

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  angle: number;
  physique: EnemyPhysiqueState;
  spawned: boolean;
  action: string;
};

export type EnemyPhysiqueState = {
  maxHealth: number;
  health: number;
  strength: number;
  speed: number;
  attackRange: number;
}

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
  facing: string;
  idle: boolean;
  playerArsenal: PlayerArsenalState;
};

export type PlayerArsenalState = {
  kills: number;
  currentGun: GunName;
}

export type PlayerRecentEvent = "shoot" | "receive_damage";


// Bullet

export type BulletGroupState = BulletState[];

export type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
  gunName: GunName;
};

// Recent events listener

export type RecentEventsListenerState = {
  playerRecentEvents: { [playerId: string]: PlayerRecentEvent[] };
};