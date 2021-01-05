import { objCopy, objMap, partition } from './outil';
import * as util from './util';
import { Pos } from './pos';
import Actor from './actor';
import { forsyth } from './piece';

export default function Board(pieces) {

  this.take = pos => {
    let _pieces = objCopy(pieces);

    delete _pieces[pos.key];
    return new Board(_pieces);
  };

  this.place = (piece, to) => {
    let _pieces = objCopy(pieces);

    _pieces[to.key] = piece;

    return new Board(_pieces);
  };

  this.move = (from, to) => {
    let _pieces = objCopy(pieces);

    _pieces[to.key] = _pieces[from.key];
    delete _pieces[from.key];

    return new Board(_pieces);
  };

  this.taking = (from, to) => {
    let _pieces = objCopy(pieces);

    _pieces[to.key] = _pieces[from.key];
    delete _pieces[from.key];

    return new Board(_pieces);    
  };

  this.promote = pos => {
    let _pawn = pieces[pos.key];

    if (!_pawn) {
      return null;
    }
    if (_pawn.role !== 'pawn') {
      return null;
    }

    let b2 = this.take(pos),
        b3 = this.place({ color: _pawn.color, role: 'queen' }, pos);

    return b3;
  };

  this.actorsOf = () => {
    let [white, black] = 
        partition(
          Object.values(this.actors),
          _ => _.color === 'white');

    return {
      white,
      black
    };
  };

  this.kingPosOf = (color) => {
    let res = Object.keys(pieces)
    .find(_ => {
      let piece = pieces[_];
      return piece.color === color &&
        piece.role === 'king';
    });
    return Pos.fromKey(res);
  };

  this.actorAt = pos => this.actors[pos];

  this.pieces = pieces;

  this.actors = objMap(pieces, (pos, piece) => ({
    [pos]: new Actor(piece, Pos.fromKey(pos), this)
  }));

  this.apply = pos => pieces[pos];

  this.toFen = () => {

    let res = '';
    for (let i = 0; i < 8; i++) {
      let spaces = 0;
      for (let j = 0; j < 8; j++) {
        let pos = util.allKeysFenOrder[i * 8 + j];

        let piece = this.apply(pos);

        if (!piece) {
          spaces++;
          continue;
        }

        if (spaces > 0) {
          res += spaces;
          spaces = 0;
        }
        res += forsyth(piece);
      }
      if (spaces > 0) {
        res += spaces;
        spaces = 0;
      }
      if (i < 7) res += '/';
    }

    return res;
  };
}

Board.init = () => {
  return Board.fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
};

Board.fromFen = (fen) => {
  let { pieces, color } = util.readFen(fen);
  return new Board(pieces, color);
};
