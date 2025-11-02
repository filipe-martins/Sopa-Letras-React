import { WORD_LIST, PORTUGUESE_ALPHABET } from '../constants';
import type { Cell, Word } from '../types';

// Shuffle array utility
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const directions = [
  { x: 1, y: 0 },   // Horizontal
  { x: -1, y: 0 },  // Horizontal Reverse
  { x: 0, y: 1 },   // Vertical
  { x: 0, y: -1 },  // Vertical Reverse
  { x: 1, y: 1 },   // Diagonal Down-Right
  { x: -1, y: -1 }, // Diagonal Up-Left
  { x: 1, y: -1 },  // Diagonal Up-Right
  { x: -1, y: 1 },  // Diagonal Down-Left
];

export const generatePuzzle = (numWords: number, gridSize: number): { grid: Cell[][]; placedWords: Word[] } => {
  const grid: (Cell | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  
  const placedWords: Word[] = [];
  const wordsToPlace = shuffle(WORD_LIST)
    .filter(word => word.length <= gridSize)
    .slice(0, numWords);

  for (const word of wordsToPlace) {
    const shuffledDirections = shuffle(directions);
    let placed = false;
    for (const dir of shuffledDirections) {
      const startX = Math.floor(Math.random() * gridSize);
      const startY = Math.floor(Math.random() * gridSize);

      for (let i = 0; i < gridSize * gridSize; i++) {
        const x = (startX + Math.floor(i / gridSize)) % gridSize;
        const y = (startY + i) % gridSize;

        if (canPlaceWord(word, grid, x, y, dir)) {
          placeWord(word, grid, x, y, dir);
          placedWords.push({ 
            text: word, 
            found: false, 
            positions: getWordPositions(word, x, y, dir) 
          });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }

  const finalGrid: Cell[][] = grid.map(row =>
    row.map(cell => {
      if (cell) return cell;
      const randomLetter = PORTUGUESE_ALPHABET[Math.floor(Math.random() * PORTUGUESE_ALPHABET.length)];
      return { letter: randomLetter, foundWordIndex: null };
    })
  );

  return { grid: finalGrid, placedWords: placedWords.sort((a,b) => a.text.localeCompare(b.text)) };
};

const canPlaceWord = (word: string, grid: (Cell | null)[][], x: number, y: number, dir: { x: number; y: number }): boolean => {
  for (let i = 0; i < word.length; i++) {
    const newX = x + i * dir.x;
    const newY = y + i * dir.y;

    if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid.length) {
      return false; // Out of bounds
    }
    const cell = grid[newY][newX];
    if (cell && cell.letter !== word[i]) {
      return false; // Occupied by a different letter
    }
  }
  return true;
};

const placeWord = (word: string, grid: (Cell | null)[][], x: number, y: number, dir: { x: number; y: number }): void => {
  for (let i = 0; i < word.length; i++) {
    const newX = x + i * dir.x;
    const newY = y + i * dir.y;
    grid[newY][newX] = { letter: word[i], foundWordIndex: null };
  }
};

const getWordPositions = (word: string, x: number, y: number, dir: { x: number; y: number }): { x: number; y: number }[] => {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
        positions.push({ x: x + i * dir.x, y: y + i * dir.y });
    }
    return positions;
}