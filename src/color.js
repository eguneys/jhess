import { Rank } from './pos';

export function promotablePawnRank(color) {
  
  if (color === 'white') {
    return Rank.Eight;
  } else {
    return Rank.First;
  }
  
}

export function colorToFen(color) {
  return (color === 'white') ? 'w' : 'b';
}
