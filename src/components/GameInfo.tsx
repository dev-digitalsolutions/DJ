import React from 'react';
import { PieceColor, Move } from '../types/chess';
import { Crown, Swords, RotateCcw, Trophy } from 'lucide-react';

interface GameInfoProps {
  currentPlayer: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  moveHistory: Move[];
  onReset: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  currentPlayer, 
  isCheck, 
  isCheckmate, 
  moveHistory,
  onReset 
}) => {
  return (
    <div className="space-y-6">
      {/* Statut du jeu */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-xl border-2 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Statut
          </h2>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            Nouvelle Partie
          </button>
        </div>
        
        {isCheckmate ? (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <Trophy className="w-8 h-8" />
            <div>
              <p className="font-bold text-lg">Échec et Mat !</p>
              <p className="text-sm">
                {currentPlayer === 'white' ? 'Les Noirs' : 'Les Blancs'} gagnent !
              </p>
            </div>
          </div>
        ) : isCheck ? (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <Swords className="w-8 h-8" />
            <div>
              <p className="font-bold text-lg">Échec !</p>
              <p className="text-sm">Le roi {currentPlayer === 'white' ? 'blanc' : 'noir'} est en danger</p>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            currentPlayer === 'white' 
              ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900' 
              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
          }`}>
            <Crown className="w-8 h-8" />
            <div>
              <p className="font-bold text-lg">Tour des {currentPlayer === 'white' ? 'Blancs' : 'Noirs'}</p>
              <p className="text-sm opacity-80">Sélectionnez une pièce pour jouer</p>
            </div>
          </div>
        )}
      </div>

      {/* Historique des coups */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-xl border-2 border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Swords className="w-5 h-5" />
          Historique ({moveHistory.length} coups)
        </h3>
        <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {moveHistory.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Aucun coup joué</p>
          ) : (
            moveHistory.map((move, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center gap-3 ${
                  move.piece.color === 'white'
                    ? 'bg-white border-2 border-slate-200'
                    : 'bg-slate-800 text-white border-2 border-slate-700'
                }`}
              >
                <span className="font-bold text-sm bg-slate-200 text-slate-900 px-2 py-1 rounded">
                  {index + 1}
                </span>
                <span className="capitalize font-medium">
                  {move.piece.type}
                </span>
                <span className="text-sm opacity-70">
                  {String.fromCharCode(97 + move.from.col)}{8 - move.from.row}
                  {' → '}
                  {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                </span>
                {move.captured && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded">
                    Capture
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
