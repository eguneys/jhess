"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Actor;

var _pos = require("./pos");

var _side = require("./side");

var _color = require("./color");

var _situation = _interopRequireDefault(require("./situation"));

var _move = _interopRequireDefault(require("./move"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Actor(piece, pos, board) {
  var color = piece.color;
  this.color = color;
  this.pos = pos;
  this.pseudoValidMoves = pseudoValidMoves;

  function pseudoValidMoves() {
    var res = [];

    switch (piece.role) {
      case 'pawn':
        var next = pawnDir()(pos);
        var fwd = !board.pieces[next.key] && next;

        var capture = function capture(horizontal) {
          var p = horizontal(next);

          if (!p) {
            return null;
          }

          if (!board.pieces[p.key] || board.pieces[p.key].color === color) {
            return null;
          }

          var b = board.taking(pos, p);
          var res = move(p, b, {
            capture: p
          });
          return maybePromote(res);
        };

        var forward = function forward(p) {
          var _ = board.move(pos, p);

          if (_) {
            var _res = move(p, _);

            return maybePromote(_res);
          }

          return null;
        };

        var maybePromote = function maybePromote(m) {
          if (m.dest.rank.index === (0, _color.promotablePawnRank)(m.color).index) {
            var b2 = m.after().promote(m.dest);

            if (b2) {
              return m.copy({
                after: b2,
                promotion: _pos.Queen
              });
            }
          }

          return m;
        };

        var p2 = fwd && pawnDir()(fwd);
        var m2 = [];

        if (p2) {
          var b = board.move(pos, p2);
          m2 = move(p2, b);
        }

        res.push([fwd && forward(fwd) || [], m2, capture(function (_) {
          return _.left();
        }) || [], capture(function (_) {
          return _.right();
        }) || []].flat());
        break;

      case 'king':
        res.push(shortRange(_pos.King.dirs)); // hack, avoid castle if king is on the edge

        if (!pos.right() || !pos.left()) {} else {
          res.push(castle());
        }

        break;

      case 'knight':
        res.push(shortRange(_pos.Knight.dirs));
        break;

      case 'bishop':
        res.push(longRange(_pos.Bishop.dirs));
        break;

      case 'rook':
        res.push(longRange(_pos.Rook.dirs));
        break;

      case 'queen':
        res.push(longRange(_pos.Queen.dirs));
        break;
    }

    return res.flatMap(function (_) {
      return _;
    });
  }

  var castle = function castle() {
    return castleOn(_side.KingSide).concat(castleOn(_side.QueenSide));
  };

  this.castleOn = castleOn;

  function castleOn(side) {
    var kingPos = board.kingPosOf(color);

    if (!kingPos) {
      return [];
    }

    var tr = side.tripToRook(kingPos, board);
    var rookPos = tr[tr.length - 1];

    var newKingPos = _pos.Pos.atfr(side.castledKingFile, kingPos.rank);

    var newRookPos = _pos.Pos.atfr(side.castledRookFile, rookPos.rank);

    var castle = {
      king: _defineProperty({}, kingPos.key, newKingPos),
      rook: _defineProperty({}, rookPos.key, newRookPos),
      side: side.name
    };
    var b1 = board.take(kingPos),
        b2 = b1.take(rookPos),
        b3 = b2.place(_pos.King.color(color), newKingPos),
        b4 = b3.place(_pos.Rook.color(color), newRookPos),
        b5 = b4;
    return [move(kingPos, b5, {
      castle: castle
    })];
  }

  function pawnDir() {
    return pawnDirOf(piece.color);
  }

  function pawnDirOf(color) {
    return color === 'white' ? function (_) {
      return _.up();
    } : function (_) {
      return _.down();
    };
  }

  function shortRange(dirs) {
    return dirs.flatMap(function (_) {
      return _(pos) || [];
    }).flatMap(function (to) {
      var _ = board.move(pos, to);

      if (_) {
        return [move(to, _)];
      } else {
        return [];
      }
    });
  }

  function longRange(dirs) {
    var res = [];

    function addAll(p, dir) {
      var to;

      if (to = dir(p)) {
        var _piece = board.pieces[to.key];

        if (_piece) {
          if (_piece.color !== color) {
            var _ = board.taking(pos, to);

            res.push(move(to, _, {
              capture: to
            }));
          }
        } else {
          var _2 = board.move(pos, to);

          if (_2) {
            res.push(move(to, _2));
          }

          addAll(to, dir);
        }
      }
    }

    dirs.forEach(function (_) {
      return addAll(pos, _);
    });
    return res;
  }

  ;

  function move(dest, after, extra) {
    var capture, promotion, castle, enpassant;

    if (extra) {
      capture = extra.capture;
      castle = extra.castle;
      promotion = extra.promotion;
      enpassant = extra.enpassant;
    }

    return new _move["default"]({
      piece: piece,
      orig: pos,
      dest: dest,
      situationBefore: new _situation["default"](board, piece.color),
      after: after,
      capture: capture,
      castle: castle,
      promotion: promotion,
      enpassant: enpassant
    });
  }
}