import { valid, invalid, toValid } from './valid';
import Board from './board';
import Actor from './actor';
import { colorToFen } from './color';

export default function Situation(board, color) {

  this.board = board;
  this.color = color;
      
  let actors = board.actorsOf()[color];

  this.move = (from, to) => {
    if (!to) {
      to = from.substring(2, 4);
      from = from.substring(0, 2);
    }

    let actor = board.actorAt(from);

    return toValid(actor, `No piece at ${from}`).flatMap(_ =>
      toValid(_.pseudoValidMoves().find(_ =>
        _.dest.key === to
      ), `Piece cannot move to ${to}`)
    );
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
