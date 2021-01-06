"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUci = parseUci;
exports.parseSan = parseSan;
exports.parseLine = parseLine;

var _valid = require("./valid");

var _san = require("./san");

var _side = require("./side");

var _pos = require("./pos");

var _uci = require("./uci");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function parseUci(move) {
  if (!(move.length === 4 || move.length === 5)) {
    return (0, _valid.invalid)("Invalid move.");
  }

  var orig = _pos.Pos.fromKey(move.substring(0, 2)),
      dest = _pos.Pos.fromKey(move.substring(2, 4)),
      promotion = _pos.Role.forsyth(move[4]);

  if (!orig || !dest) {
    return (0, _valid.invalid)('invalid move.');
  }

  return (0, _valid.valid)(new _uci.Uci(orig, dest, promotion));
}

function parseSan(san) {
  var moveRegex = /^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][1-8])(=?[NBQR]?)(\+?)(\#?)$/;

  if (san === 'O-O' || san === 'o-o' || san === '0-0') {
    return (0, _valid.valid)(new _san.Castle(_side.KingSide, san));
  }

  if (san === 'O-O-O' || san === 'o-o-o' || san === '0-0-0') {
    return (0, _valid.valid)(new _san.Castle(_side.QueenSide, san));
  }

  var match = san.match(moveRegex);

  if (!match) {
    return (0, _valid.invalid)({
      err: "Couldn't parse",
      san: san
    });
  }

  var _match = _slicedToArray(match, 9),
      _ = _match[0],
      role = _match[1],
      file = _match[2],
      rank = _match[3],
      capture = _match[4],
      pos = _match[5],
      prom = _match[6],
      check = _match[7],
      mate = _match[8];

  var dest = _pos.Pos.fromKey(pos);

  prom = _pos.Role.forsyth(prom);

  if (pos) {
    return (0, _valid.valid)(new _san.Std(dest, _pos.Role.forsyth(role) || _pos.Pawn, capture !== "", file, rank, prom, san));
  }

  return (0, _valid.invalid)({
    err: "Invalid move",
    san: san
  });
}

function parseLine(line) {
  var blackMoveRegex = /^(\d*)\.\.\.$/;
  var whiteMoveRegex = /^(\d*)\.$/;
  var oneMove,
      ply,
      _moves = [];
  line.split(' ').forEach(function (next) {
    var match;

    if (match = next.match(blackMoveRegex)) {
      ply = parseInt(match[0]) * 2;
      oneMove = [null];
    } else if (match = next.match(whiteMoveRegex)) {
      ply = parseInt(match[0]) * 2 - 1;
      oneMove = [];
    } else {
      if (!oneMove) {
        return;
      }

      var move = parseSan(next).map(function (_) {
        return {
          ply: ply++,
          move: _
        };
      });
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