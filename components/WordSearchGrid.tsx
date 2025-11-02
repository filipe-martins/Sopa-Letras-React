import React, { useState, useRef, useEffect } from 'react';
import type { Cell } from '../types';

interface WordSearchGridProps {
  grid: Cell[][];
  onWordFound: (word: string) => void;
  rotation: number;
}

interface Position {
  x: number;
  y: number;
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({ grid, onWordFound, rotation }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Position | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const getCellFromEvent = (e: React.MouseEvent | React.TouchEvent): Position | null => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.getAttribute('data-cell-pos')) {
      const [y, x] = element.getAttribute('data-cell-pos')!.split(',').map(Number);
      return { x, y };
    }
    return null;
  };

  const handleSelectionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos) {
      setIsSelecting(true);
      setStartCell(pos);
      setCurrentSelection([pos]);
    }
  };

  const handleSelectionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSelecting || !startCell) return;
    e.preventDefault();
    
    const pos = getCellFromEvent(e);
    if (pos) {
      const path = getPath(startCell, pos);
      setCurrentSelection(path);
    }
  };

  const handleSelectionEnd = () => {
    if (!isSelecting) return;
    
    let selectedWord = '';
    let reversedWord = '';
    
    currentSelection.forEach(pos => {
      selectedWord += grid[pos.y][pos.x].letter;
    });
    reversedWord = selectedWord.split('').reverse().join('');

    onWordFound(selectedWord);
    onWordFound(reversedWord);

    setIsSelecting(false);
    setStartCell(null);
    setCurrentSelection([]);
  };

  const getPath = (start: Position, end: Position): Position[] => {
    const path: Position[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    const x_inc = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const y_inc = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    
    let currentX = start.x;
    let currentY = start.y;

    if (Math.abs(dx) !== Math.abs(dy) && dx !== 0 && dy !== 0) {
        // Not a straight line (horizontal, vertical, or diagonal)
        return [start, end];
    }
    
    for (let i = 0; i <= steps; i++) {
        path.push({ x: Math.round(currentX), y: Math.round(currentY) });
        currentX += x_inc;
        currentY += y_inc;
    }
    return path;
  };
  
  const isCellSelected = (x: number, y: number): boolean => {
      return currentSelection.some(pos => pos.x === x && pos.y === y);
  }

  const foundColors = [
    'bg-yellow-400/80', 'bg-cyan-400/80', 'bg-lime-400/80', 'bg-rose-400/80',
    'bg-sky-400/80', 'bg-emerald-400/80', 'bg-fuchsia-400/80', 'bg-orange-400/80'
  ];

  useEffect(() => {
    // Add global listeners to handle mouse up/touch end outside the grid
    window.addEventListener('mouseup', handleSelectionEnd);
    window.addEventListener('touchend', handleSelectionEnd);

    return () => {
      window.removeEventListener('mouseup', handleSelectionEnd);
      window.removeEventListener('touchend', handleSelectionEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelecting, currentSelection]);

  return (
    <div
      ref={gridRef}
      id="word-search-grid"
      className="w-full h-full p-2 sm:p-4 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg grid select-none"
      style={{ 
        gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
        transform: `rotate(${rotation}deg)`
      }}
      onMouseDown={handleSelectionStart}
      onMouseMove={handleSelectionMove}
      onTouchStart={handleSelectionStart}
      onTouchMove={handleSelectionMove}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
            const isSelected = isCellSelected(x, y);
            
            let cellBgClass = 'bg-transparent';
            if (cell.foundWordIndex !== null) {
                 cellBgClass = foundColors[cell.foundWordIndex % foundColors.length];
            } else if (isSelected) {
                cellBgClass = 'bg-blue-500/50';
            }

            return (
              <div
                key={`${y}-${x}`}
                data-cell-pos={`${y},${x}`}
                className={`flex items-center justify-center aspect-square rounded-full text-2xl sm:text-3xl md:text-4xl font-bold uppercase transition-colors duration-150 ${cellBgClass}`}
              >
                {cell.letter}
              </div>
            );
        })
      )}
    </div>
  );
};