
import { LevelConfig } from './types';

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 600;

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "The Guard Post",
    projectileCount: 3,
    structures: [
      { x: 800, y: 500, width: 20, height: 100, type: 'wood' },
      { x: 900, y: 500, width: 20, height: 100, type: 'wood' },
      { x: 850, y: 440, width: 140, height: 20, type: 'wood' },
    ],
    enemies: [
      { x: 850, y: 420, radius: 15, type: 'minion' }
    ]
  },
  {
    id: 2,
    name: "Double Trouble",
    projectileCount: 3,
    structures: [
      { x: 750, y: 500, width: 20, height: 120, type: 'stone' },
      { x: 850, y: 500, width: 20, height: 120, type: 'stone' },
      { x: 800, y: 430, width: 140, height: 20, type: 'wood' },
      { x: 950, y: 500, width: 20, height: 120, type: 'stone' },
      { x: 1050, y: 500, width: 20, height: 120, type: 'stone' },
      { x: 1000, y: 430, width: 140, height: 20, type: 'wood' },
    ],
    enemies: [
      { x: 800, y: 410, radius: 15, type: 'minion' },
      { x: 1000, y: 410, radius: 15, type: 'minion' }
    ]
  },
  {
    id: 3,
    name: "The Tower of Glass",
    projectileCount: 4,
    structures: [
      { x: 800, y: 500, width: 20, height: 150, type: 'glass' },
      { x: 950, y: 500, width: 20, height: 150, type: 'glass' },
      { x: 875, y: 415, width: 180, height: 20, type: 'glass' },
      { x: 875, y: 350, width: 100, height: 100, type: 'stone' },
    ],
    enemies: [
      { x: 875, y: 280, radius: 25, type: 'boss' }
    ]
  }
];
