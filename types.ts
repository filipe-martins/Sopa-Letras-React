
export interface Cell {
  letter: string;
  foundWordIndex: number | null;
}

export interface Word {
  text: string;
  found: boolean;
  positions?: { x: number; y: number }[];
}

export type Direction = 'horizontal' | 'vertical' | 'diagonalUp' | 'diagonalDown';