import { Board, Piece, PieceColor, PieceType, Position } from '../types/chess';

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Pions
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // Pièces noires
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][3] = { type: 'queen', color: 'black' };
  board[0][4] = { type: 'king', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  
  // Pièces blanches
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][3] = { type: 'queen', color: 'white' };
  board[7][4] = { type: 'king', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };
  
  return board;
};

export const isValidMove = (
  board: Board,
  from: Position,
  to: Position,
  currentPlayer: PieceColor
): boolean => {
  const piece = board[from.row][from.col];
  
  if (!piece || piece.color !== currentPlayer) return false;
  if (from.row === to.row && from.col === to.col) return false;
  
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  const possibleMoves = getPossibleMoves(board, from);
  return possibleMoves.some(move => move.row === to.row && move.col === to.col);
};

export const getPossibleMoves = (board: Board, from: Position): Position[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, from, piece.color);
    case 'rook':
      return getRookMoves(board, from, piece.color);
    case 'knight':
      return getKnightMoves(board, from, piece.color);
    case 'bishop':
      return getBishopMoves(board, from, piece.color);
    case 'queen':
      return getQueenMoves(board, from, piece.color);
    case 'king':
      return getKingMoves(board, from, piece.color);
    default:
      return [];
  }
};

const getPawnMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Avancer d'une case
  const oneStep = { row: from.row + direction, col: from.col };
  if (isInBounds(oneStep) && !board[oneStep.row][oneStep.col]) {
    moves.push(oneStep);
    
    // Avancer de deux cases depuis la position initiale
    if (from.row === startRow) {
      const twoSteps = { row: from.row + direction * 2, col: from.col };
      if (!board[twoSteps.row][twoSteps.col]) {
        moves.push(twoSteps);
      }
    }
  }
  
  // Captures diagonales
  const captures = [
    { row: from.row + direction, col: from.col - 1 },
    { row: from.row + direction, col: from.col + 1 }
  ];
  
  captures.forEach(pos => {
    if (isInBounds(pos) && board[pos.row][pos.col] && board[pos.row][pos.col]!.color !== color) {
      moves.push(pos);
    }
  });
  
  return moves;
};

const getRookMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
  directions.forEach(([dRow, dCol]) => {
    let row = from.row + dRow;
    let col = from.col + dCol;
    
    while (isInBounds({ row, col })) {
      const targetPiece = board[row][col];
      if (!targetPiece) {
        moves.push({ row, col });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row, col });
        }
        break;
      }
      row += dRow;
      col += dCol;
    }
  });
  
  return moves;
};

const getKnightMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  offsets.forEach(([dRow, dCol]) => {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isInBounds(pos)) {
      const targetPiece = board[pos.row][pos.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(pos);
      }
    }
  });
  
  return moves;
};

const getBishopMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
  directions.forEach(([dRow, dCol]) => {
    let row = from.row + dRow;
    let col = from.col + dCol;
    
    while (isInBounds({ row, col })) {
      const targetPiece = board[row][col];
      if (!targetPiece) {
        moves.push({ row, col });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row, col });
        }
        break;
      }
      row += dRow;
      col += dCol;
    }
  });
  
  return moves;
};

const getQueenMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  return [...getRookMoves(board, from, color), ...getBishopMoves(board, from, color)];
};

const getKingMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  
  offsets.forEach(([dRow, dCol]) => {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isInBounds(pos)) {
      const targetPiece = board[pos.row][pos.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(pos);
      }
    }
  });
  
  return moves;
};

const isInBounds = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const isKingInCheck = (board: Board, kingColor: PieceColor): boolean => {
  // Trouver la position du roi
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  // Vérifier si une pièce adverse peut capturer le roi
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        const moves = getPossibleMoves(board, { row, col });
        if (moves.some(move => move.row === kingPos!.row && move.col === kingPos!.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export const isCheckmate = (board: Board, kingColor: PieceColor): boolean => {
  if (!isKingInCheck(board, kingColor)) return false;
  
  // Vérifier si le roi peut bouger
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === kingColor) {
        const moves = getPossibleMoves(board, { row, col });
        for (const move of moves) {
          // Simuler le mouvement
          const newBoard = board.map(r => [...r]);
          newBoard[move.row][move.col] = newBoard[row][col];
          newBoard[row][col] = null;
          
          if (!isKingInCheck(newBoard, kingColor)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
};
