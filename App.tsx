import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordSearchGrid } from './components/WordSearchGrid';
import { WordList } from './components/WordList';
import { Controls } from './components/Controls';
import { GameEndModal } from './components/GameEndModal';
import { useWakeLock } from './hooks/useWakeLock';
import { generatePuzzle } from './services/gameLogic';
import type { Cell, Word } from './types';
import { GRID_SIZE, WORDS_PER_GAME } from './constants';
import { playSound } from './services/audio';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [rotation, setRotation] = useState(0);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridRenderSize, setGridRenderSize] = useState(0);

  useWakeLock();

  const startNewGame = useCallback(() => {
    const { grid: newGrid, placedWords } = generatePuzzle(WORDS_PER_GAME, GRID_SIZE);
    setGrid(newGrid);
    setWords(placedWords.map(word => ({ ...word, found: false })));
    setIsGameWon(false);
    setRotation(0);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setGridRenderSize(Math.min(width, height));
      }
    });

    const currentRef = gridContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleWordFound = (word: string) => {
    const wordIndex = words.findIndex(w => w.text === word && !w.found);
    if (wordIndex > -1) {
      playSound('correct');
      
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      const foundWord = words[wordIndex];
      
      if (foundWord.positions) {
          for (const pos of foundWord.positions) {
              newGrid[pos.y][pos.x].foundWordIndex = wordIndex;
          }
      }
      setGrid(newGrid);

      const newWords = [...words];
      newWords[wordIndex].found = true;
      setWords(newWords);
    }
  };

  useEffect(() => {
    if (words.length > 0 && words.every(w => w.found)) {
      setIsGameWon(true);
      playSound('win');
    }
  }, [words]);

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen font-sans p-2 sm:p-4 overflow-hidden">
      <header className="flex-shrink-0 mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-sky-600 dark:text-sky-400">Sopa de Letras</h1>
      </header>
      
      <main ref={gridContainerRef} className="flex-grow flex items-center justify-center min-h-0 w-full">
        {grid.length > 0 && gridRenderSize > 0 && (
            <div style={{ width: gridRenderSize, height: gridRenderSize }}>
                <WordSearchGrid grid={grid} onWordFound={handleWordFound} rotation={rotation} />
            </div>
        )}
      </main>

      <footer className="flex-shrink-0 mt-2 sm:mt-4 space-y-2 sm:space-y-4">
        <WordList words={words} />
        <Controls onNewGame={startNewGame} onRotate={handleRotate} />
      </footer>

      {isGameWon && <GameEndModal onNewGame={startNewGame} />}
    </div>
  );
};

export default App;