import React, { useState, useCallback } from 'react';
import { Board, Position, PieceColor } from '../types/chess';
import { isValidMove, getPossibleMoves, isKingInCheck, isCheckmate } from '../utils/chessLogic';
import ChessPiece from './ChessPiece';
import { Sparkles } from 'lucide-react';

interface ChessBoardProps {
  board: Board;
  onMove: (from: Position, to: Position) => void;
  currentPlayer: PieceColor;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, onMove, currentPlayer }) => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    const clickedPiece = board[row][col];
    
    if (selectedSquare) {
      // Tentative de déplacement
      if (isValidMove(board, selectedSquare, { row, col }, currentPlayer)) {
        onMove(selectedSquare, { row, col });
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else if (clickedPiece && clickedPiece.color === currentPlayer) {
        // Sélection d'une nouvelle pièce
        setSelectedSquare({ row, col });
        setPossibleMoves(getPossibleMoves(board, { row, col }));
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
      // Sélection d'une pièce
      setSelectedSquare({ row, col });
      setPossibleMoves(getPossibleMoves(board, { row, col }));
    }
  }, [board, selectedSquare, currentPlayer, onMove]);

  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  const isSquarePossibleMove = (row: number, col: number) => {
    return possibleMoves.some(move => move.row === row && move.col === col);
  };

  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    
    if (isSquareSelected(row, col)) {
      return 'bg-yellow-400 shadow-lg shadow-yellow-500/50';
    }
    
    if (isSquarePossibleMove(row, col)) {
      return isLight 
        ? 'bg-emerald-300 hover:bg-emerald-400' 
        : 'bg-emerald-500 hover:bg-emerald-600';
    }
    
    return isLight 
      ? 'bg-amber-100 hover:bg-amber-200' 
      : 'bg-amber-800 hover:bg-amber-900';
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-0 border-8 border-amber-900 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              className={`
                aspect-square flex items-center justify-center cursor-pointer
                transition-all duration-200 relative
                ${getSquareColor(rowIndex, colIndex)}
              `}
            >
              {piece && <ChessPiece piece={piece} size={48} />}
              
              {isSquarePossibleMove(rowIndex, colIndex) && !piece && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-600 rounded-full opacity-60 animate-pulse" />
                </div>
              )}
              
              {isSquarePossibleMove(rowIndex, colIndex) && piece && (
                <div className="absolute inset-0 border-4 border-red-500 rounded-lg animate-pulse" />
              )}
            </div>
          ))
        ))}
      </div>
      
      {/* Coordonnées */}
      <div className="absolute -left-8 top-0 h-full flex flex-col justify-around text-amber-900 font-bold">
        {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
          <div key={num} className="text-lg">{num}</div>
        ))}
      </div>
      <div className="absolute -bottom-8 left-0 w-full flex justify-around text-amber-900 font-bold">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="text-lg">{letter}</div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
