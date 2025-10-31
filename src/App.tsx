import React, { useState, useCallback, useEffect } from 'react';
import { Board, Move, PieceColor, Position } from './types/chess';
import { createInitialBoard, isKingInCheck, isCheckmate } from './utils/chessLogic';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import { Crown, Sparkles } from 'lucide-react';

function App() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const checkStatus = isKingInCheck(board, currentPlayer);
    const checkmateStatus = isCheckmate(board, currentPlayer);
    
    setIsCheck(checkStatus);
    setIsGameOver(checkmateStatus);
  }, [board, currentPlayer]);

  const handleMove = useCallback((from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    const capturedPiece = newBoard[to.row][to.col];
    
    if (!piece) return;
    
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
    
    const move: Move = {
      from,
      to,
      piece,
      captured: capturedPiece || undefined,
    };
    
    setBoard(newBoard);
    setMoveHistory(prev => [...prev, move]);
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
  }, [board]);

  const handleReset = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setMoveHistory([]);
    setIsCheck(false);
    setIsGameOver(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 relative overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl mb-4">
            <Crown className="w-10 h-10" />
            <h1 className="text-5xl font-bold tracking-tight">Jeu d'Échecs Royal</h1>
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>
          <p className="text-amber-200 text-lg font-medium">
            Un jeu d'échecs élégant et entièrement fonctionnel
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 max-w-7xl mx-auto">
          {/* Plateau de jeu */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 p-8 rounded-3xl shadow-2xl">
                <ChessBoard
                  board={board}
                  onMove={handleMove}
                  currentPlayer={currentPlayer}
                />
              </div>
            </div>
          </div>

          {/* Informations de jeu */}
          <div className="flex items-start">
            <GameInfo
              currentPlayer={currentPlayer}
              isCheck={isCheck}
              isCheckmate={isGameOver}
              moveHistory={moveHistory}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Légende */}
        <div className="mt-12 max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Comment jouer</h3>
          <div className="grid md:grid-cols-2 gap-4 text-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <p>Cliquez sur une pièce de votre couleur pour la sélectionner</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <p>Les cases vertes indiquent les mouvements possibles</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <p>Cliquez sur une case verte pour déplacer la pièce</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">4</div>
              <p>Mettez le roi adverse en échec et mat pour gagner !</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;
