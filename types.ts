
export interface LevelConfig {
  id: number;
  name: string;
  structures: BlockConfig[];
  enemies: EnemyConfig[];
  projectileCount: number;
}

export interface BlockConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'wood' | 'stone' | 'glass';
}

export interface EnemyConfig {
  x: number;
  y: number;
  radius: number;
  type: 'minion' | 'boss';
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
}
