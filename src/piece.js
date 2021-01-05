const white = 'white',
      black = 'black';

const allForsyth = {
  'pawn': 'p',
  'bishop': 'b',
  'king': 'k',
  'knight': 'n',
  'rook': 'r',
  'queen': 'q'
};

export const forsyth = (piece) => {
  let res = allForsyth[piece.role];

  if (piece.color === white) {
    res = res.toUpperCase();
  }

  return res;
};
