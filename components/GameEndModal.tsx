
import React from 'react';

interface GameEndModalProps {
  onNewGame: () => void;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({ onNewGame }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 text-center max-w-sm w-full animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-500 mb-4">Parabéns!</h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6">Você encontrou todas as palavras!</p>
        <button
          onClick={onNewGame}
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-transform transform active:scale-95"
        >
          Jogar Novamente
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
   