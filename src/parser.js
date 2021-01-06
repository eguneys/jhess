import { valid, invalid } from './valid';
import { Castle, Std } from './san';
import { KingSide, QueenSide } from './side';
import { Pos, Role, Pawn } from './pos';
import { Uci } from './uci';

export function parseUci(move) {

  if (!(move.length === 4 || move.length === 5)) {
    return invalid(`Invalid move.`);
  }
  
  let orig = Pos.fromKey(move.substring(0, 2)),
      dest = Pos.fromKey(move.substring(2, 4)),
      promotion = Role.forsyth(move[4]);

  if (!orig || !dest) {
    return invalid('invalid move.');
  }

  return valid(new Uci(orig, dest, promotion));
  
}

export function parseSan(san) {

  const moveRegex = /^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][1-8])(=?[NBQR]?)(\+?)(\#?)$/;
  
  if (san === 'O-O' || san === 'o-o' || san === '0-0') {
    return valid(new Castle(KingSide, san));
  }
  if (san === 'O-O-O' || san === 'o-o-o' || san === '0-0-0') {
    return valid(new Castle(QueenSide, san));
  }

  let match = san.match(moveRegex);

  if (!match) {
    return invalid({ err: `Couldn't parse`,
                     san });
  }

  let [_, role, file, rank, capture, pos, prom, check, mate] = match;

  let dest = Pos.fromKey(pos);

  prom = Role.forsyth(prom);

  if (pos) {
    return valid(new Std(
      dest,
      Role.forsyth(role) || Pawn,
      capture !== "",
      file,
      rank,
      prom,
      san
    ));
  }

  return invalid({ err: `Invalid move`, 
                   san });
}

export function parseLine(line) {
  const blackMoveRegex = /^(\d*)\.\.\.$/;
  const whiteMoveRegex = /^(\d*)\.$/;

  let oneMove,
      ply,
      _moves = [];

  line.split(' ').forEach(next => {
    let match;
    if ((match = next.match(blackMoveRegex))) {
      ply = parseInt(match[0]) * 2;
      oneMove = [null];
    } else if ((match = next.match(whiteMoveRegex))) {
      ply = parseInt(match[0]) * 2 - 1;
      oneMove = [];
    } else {

      if (!oneMove) {
        return;
      }

      let move = parseSan(next).map(_ => ({
        ply: ply++,
        move: _
      }));

      oneMove.push(move);

      if (oneMove.length === 2) {
        _moves.push(oneMove);
        oneMove = [];
      }
    }
  });

  if (oneMove && oneMove.length === 1) {
    _moves.push(oneMove);
  }
  
  return _moves;
}
