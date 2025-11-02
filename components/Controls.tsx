
import React from 'react';

interface ControlsProps {
  onNewGame: () => void;
  onRotate: () => void;
}

const ControlButton: React.FC<{onClick: () => void; children: React.ReactNode; className?: string}> = ({ onClick, children, className = '' }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-base sm:text-lg font-semibold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 transition-transform transform active:scale-95 ${className}`}
    >
      {children}
    </button>
);


export const Controls: React.FC<ControlsProps> = ({ onNewGame, onRotate }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <ControlButton onClick={onNewGame} className="bg-green-500 hover:bg-green-600 focus:ring-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
          <span>Novo Jogo</span>
        </ControlButton>
        <ControlButton onClick={onRotate} className="bg-sky-500 hover:bg-sky-600 focus:ring-sky-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /> </svg>
          <span>Rodar</span>
        </ControlButton>
    </div>
  );
};
   