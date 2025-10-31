import React from 'react';
import { Crown, Castle, Swords, Church, Shield, Flame } from 'lucide-react';
import { Piece } from '../types/chess';

interface ChessPieceProps {
  piece: Piece;
  size?: number;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, size = 40 }) => {
  const color = piece.color === 'white' ? 'text-gray-100' : 'text-gray-900';
  const strokeColor = piece.color === 'white' ? 'stroke-gray-800' : 'stroke-gray-100';
  
  const iconProps = {
    size,
    className: `${color} ${strokeColor} drop-shadow-lg`,
    strokeWidth: 1.5,
  };
  
  switch (piece.type) {
    case 'king':
      return <Crown {...iconProps} fill="currentColor" />;
    case 'queen':
      return <Flame {...iconProps} fill="currentColor" />;
    case 'rook':
      return <Castle {...iconProps} fill="currentColor" />;
    case 'bishop':
      return <Church {...iconProps} fill="currentColor" />;
    case 'knight':
      return <Shield {...iconProps} fill="currentColor" />;
    case 'pawn':
      return <Swords {...iconProps} fill="currentColor" />;
    default:
      return null;
  }
};

export default ChessPiece;
