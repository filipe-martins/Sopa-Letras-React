import React from 'react';
import type { Word } from '../types';

interface WordListProps {
  words: Word[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  const wordsToFind = words.filter(w => !w.found);

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md">
      <div className="overflow-x-auto whitespace-nowrap py-1 scrollbar-hide">
        <ul className="flex items-center justify-start sm:justify-center gap-x-4 sm:gap-x-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 px-4">
          {wordsToFind.length > 0 ? (
            wordsToFind.map((word) => (
              <li
                key={word.text}
                className="font-semibold"
              >
                {word.text}
              </li>
            ))
          ) : (
             <li className="w-full text-center font-semibold text-green-500">Parabéns, encontrou tudo!</li>
          )}
        </ul>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};
