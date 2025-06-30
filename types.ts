
export enum GameState {
  Setup = 'SETUP',
  Ready = 'READY',
  Playing = 'PLAYING',
  Finished = 'FINISHED',
}

export interface Rung {
  y: number;
  leftCol: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Path {
  points: Point[];
  endIndex: number;
}
