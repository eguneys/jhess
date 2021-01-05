"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asWhite = asWhite;
exports.flip = flip;
exports.readShapes = readShapes;
exports.isFen = isFen;
exports.readFen = readFen;
exports.readMoves = readMoves;
exports.readPly = readPly;
exports.writeFen = writeFen;
exports.fPosToTranslateAbs = exports.white = exports.black = exports.key2pos = exports.pos2key = exports.allKeysFenOrder = exports.allKeys = exports.ranks = exports.files = void 0;

var _pos = require("./pos");

var _Array$prototype, _Array$prototype2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
exports.files = files;
var ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
exports.ranks = ranks;

var allKeys = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, _toConsumableArray(files.map(function (c) {
  return ranks.map(function (r) {
    return c + r;
  });
})));

exports.allKeys = allKeys;

var allKeysFenOrder = (_Array$prototype2 = Array.prototype).concat.apply(_Array$prototype2, _toConsumableArray(ranks.slice(0).reverse().map(function (r) {
  return files.map(function (c) {
    return c + r;
  });
})));

exports.allKeysFenOrder = allKeysFenOrder;

var pos2key = function pos2key(pos) {
  return allKeys[8 * pos[0] + pos[1]];
};

exports.pos2key = pos2key;

var key2pos = function key2pos(k) {
  return [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
};

exports.key2pos = key2pos;
var black = 'black',
    white = 'white';
exports.white = white;
exports.black = black;

function asWhite(color) {
  return color === white;
}

function flip(color) {
  return color === white ? black : white;
}

var colors = {
  'w': white,
  'b': black
};
var roles = {
  'k': 'king',
  'q': 'queen',
  'r': 'rook',
  'b': 'bishop',
  'n': 'knight',
  'p': 'pawn'
};

function readShapes(shapes) {
  if (!shapes) {
    return [];
  }

  var sShapes = shapes.split(' ');
  return sShapes.map(function (_) {
    var _$split = _.split('-'),
        _$split2 = _slicedToArray(_$split, 2),
        s1 = _$split2[0],
        s2 = _$split2[1];

    return {
      orig: function (_) {
        return _;
      }(s1),
      dest: function (_) {
        return _;
      }(s2)
    };
  });
}

function isFen(fen) {
  return fen.includes('/');
}

function readFen(fen) {
  var _fen$split = fen.split(' '),
      _fen$split2 = _slicedToArray(_fen$split, 4),
      sPieces = _fen$split2[0],
      sTurn = _fen$split2[1],
      sCastles = _fen$split2[2],
      sExtra = _fen$split2[3];

  var color = colors[sTurn];
  var pieces = {};
  sPieces.split('/').forEach(function (sRow, row) {
    row = 7 - row;
    var col = 0;

    var _iterator = _createForOfIteratorHelper(sRow),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _char = _step.value;

        var role = void 0,
            _color = void 0;

        if (role = roles[_char]) {
          _color = black;
        } else if (role = roles[_char.toLowerCase()]) {
          _color = white;
        }

        if (_color) {
          pieces[pos2key([col, row])] = {
            role: role,
            color: _color
          };
          col++;
        } else {
          col += parseInt(_char);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  return {
    pieces: pieces,
    color: color
  };
}

function readMoves(moves) {
  var blackMoveRegex = /^(\d*)\.\.\.$/;
  var whiteMoveRegex = /^(\d*)\.$/;
  var oneMove,
      ply,
      _moves = [];
  moves.split(' ').forEach(function (next) {
    var match;

    if (match = next.match(blackMoveRegex)) {
      ply = parseInt(match[0]) * 2;
      oneMove = [null];
    } else if (match = next.match(whiteMoveRegex)) {
      ply = parseInt(match[0]) * 2 - 1;
      oneMove = [];
    } else if (match = moveMatch(next)) {
      oneMove.push(_objectSpread({
        ply: ply
      }, match));
      ply++;

      if (oneMove.length === 2) {
        _moves.push(oneMove);

        oneMove = [];
      }
    }
  });

  if (oneMove.length === 1) {
    _moves.push(oneMove);
  }

  return {
    moves: _moves
  };
}

function readPly(sPly) {
  return parseInt(sPly);
}

function writeFen(_ref) {
  var pieces = _ref.pieces;
  var sPieces = '';

  for (var row = 7; row >= 0; row--) {
    var spaces = 0;

    for (var col = 0; col <= 7; col++) {
      var key = pos2key([col, row]);
      var piece = void 0;

      if (piece = pieces[key]) {
        if (spaces > 0) {
          sPieces += spaces;
          spaces = 0;
        }

        var role = _pos.Role.allByRole[piece.role];
        sPieces += piece.color === white ? role.forsyth.toUpperCase() : role.forsyth.toLowerCase();
      } else {
        spaces++;
      }
    }

    if (spaces > 0) {
      sPieces += spaces;
    }

    sPieces += '/';
  }

  return sPieces;
}

var posToTranslateBase = function posToTranslateBase(pos, asWhite, xFactor, yFactor) {
  return [(asWhite ? pos[0] : 7 - pos[0]) * xFactor, (asWhite ? 7 - pos[1] : pos[1]) * yFactor];
};

var fPosToTranslateAbs = function fPosToTranslateAbs(bounds) {
  var xFactor = bounds.width / 8,
      yFactor = bounds.height / 8;
  return function (pos, asWhite) {
    return posToTranslateBase(pos, asWhite, xFactor, yFactor);
  };
};

exports.fPosToTranslateAbs = fPosToTranslateAbs;