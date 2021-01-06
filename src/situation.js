import { valid, invalid, toValid } from './valid';
import Board from './board';
import Actor from './actor';
import { colorToFen } from './color';

export default function Situation(board, color) {

  this.board = board;
  this.color = color;
      
  let actors = board.actorsOf()[color];

  this.moves = () => {
    let res = {};

    actors.forEach(_ => {
      let moves = _.pseudoValidMoves();
      if (moves.length > 0) {
        res[_.pos.key] = moves;
      }
    });
    return res;
  };

  this.toFen = () => {
    let res = [
      board.toFen(),
      colorToFen(color)
    ].join(' ');

    return res;
  };
}

Situation.apply = (board = Board.init(), color = 'white') =>
new Situation(board, color);
