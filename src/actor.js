import { Pos, 
         King,
         Queen,
         Bishop,
         Knight,
         Pawn,
         Rook } from './pos';

import { KingSide, QueenSide } from './side';

import { promotablePawnRank } from './color';

import Situation from './situation';
import Move from './move';

export default function Actor(piece, pos, board) {
  let color = piece.color;

  this.color = color;
  this.pos = pos;
  this.pseudoValidMoves = pseudoValidMoves;

  function pseudoValidMoves() {
    let res = [];

    switch (piece.role) {
    case 'pawn':
      let next = pawnDir()(pos);
      let fwd = !board.pieces[next.key] && next;
      function capture(horizontal) {
        let p = horizontal(next);
        if (!p) {
          return null;
        }

        if (!board.pieces[p.key] ||
            board.pieces[p.key].color === color) {
          return null;
        }
        let b = board.taking(pos, p);

        let res = move(p, b, { capture: p });

        return maybePromote(res);
      }
      function forward(p) {
        let _ = board.move(pos, p);
        if (_) {
          let res = move(p, _);
          return maybePromote(res);
        }
        return null;
      }
      function maybePromote(m) {

        if (m.dest.rank.index === promotablePawnRank(m.color).index) {

          let b2 = m.after().promote(m.dest);

          if (b2) {
            return m.copy({ after: b2, promotion: Queen });
          }

        }

        return m;

      }

      let p2 = fwd && pawnDir()(fwd);
      let m2 = [];

      if (p2) {
        let b = board.move(pos, p2);
        m2 = move(p2, b);
      }

      res.push([
        fwd && forward(fwd) || [],
        m2,
        capture(_ => _.left()) || [],
        capture(_ => _.right()) || [],
      ].flat());
      break;
    case 'king':
      res.push(shortRange(King.dirs));

      // hack, avoid castle if king is on the edge
      if (!pos.right() || !pos.left()) {
      } else {
        res.push(castle());
      }
      break;
    case 'knight':
      res.push(shortRange(Knight.dirs));
      break;
    case 'bishop':
      res.push(longRange(Bishop.dirs));
      break;
    case 'rook':
      res.push(longRange(Rook.dirs));
      break;
    case 'queen':
      res.push(longRange(Queen.dirs));
      break;
    }

    return res.flatMap(_ =>
      _
    );
  }

  const castle = () => 
        castleOn(KingSide)
        .concat(castleOn(QueenSide));
  
  this.castleOn = castleOn;

  function castleOn(side) {
    
    let kingPos = board.kingPosOf(color);

    if (!kingPos) {
      return [];
    }

    let tr = side.tripToRook(kingPos, board);
    let rookPos = tr[tr.length - 1];

    let newKingPos = Pos.atfr(side.castledKingFile, kingPos.rank);
    let newRookPos = Pos.atfr(side.castledRookFile, rookPos.rank);

    let castle = {
      king: { [kingPos.key]: newKingPos },
      rook: { [rookPos.key]: newRookPos },
      side: side.name
    };

    let b1 = board.take(kingPos),
        b2 = b1.take(rookPos),
        b3 = b2.place(King.color(color), newKingPos),
        b4 = b3.place(Rook.color(color), newRookPos),
        b5 = b4;    

    return [move(kingPos, b5, { castle })];
  }

  function pawnDir() {
    return pawnDirOf(piece.color);
  }

  function pawnDirOf(color) {
    return color === 'white' ? _ => _.up(): _ => _.down();
  }

  function shortRange(dirs) {
    return dirs.flatMap(_ => _(pos) || []).flatMap(to => {
      let _ = board.move(pos, to);
      if (_) {
        return [move(to, _)];
      } else {
        return [];
      }
    });
  }

  function longRange(dirs) {
    let res = [];

    function addAll(p, dir) {
      let to;
      if ((to = dir(p))) {

        let piece = board.pieces[to.key];

        if (piece) {
          if (piece.color !== color) {
            let _ = board.taking(pos, to);
            res.push(move(to, _, {
              capture: to
            }));
          }
        } else {
          let _ = board.move(pos, to);
          if (_) { 
            res.push(move(to, _));
          }
          addAll(to, dir);
        }
      }
    }

    dirs.forEach(_ => addAll(pos, _));

    return res;
  };


  function move(dest,
                after, extra) {

    let capture,
        promotion,
        castle,
        enpassant;

    if (extra) {
      capture = extra.capture;
      castle = extra.castle;
      promotion = extra.promotion;
      enpassant = extra.enpassant;
    }
    
    return new Move({
      piece,
      orig: pos,
      dest,
      situationBefore: new Situation(board, piece.color),
      after,
      capture,
      castle,
      promotion,
      enpassant
    });
  }
}
