"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Board;

var _outil = require("./outil");

var util = _interopRequireWildcard(require("./util"));

var _pos = require("./pos");

var _actor = _interopRequireDefault(require("./actor"));

var _piece = require("./piece");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function Board(pieces) {
  var _this = this;

  this.take = function (pos) {
    var _pieces = (0, _outil.objCopy)(pieces);

    delete _pieces[pos.key];
    return new Board(_pieces);
  };

  this.place = function (piece, to) {
    var _pieces = (0, _outil.objCopy)(pieces);

    _pieces[to.key] = piece;
    return new Board(_pieces);
  };

  this.move = function (from, to) {
    var _pieces = (0, _outil.objCopy)(pieces);

    _pieces[to.key] = _pieces[from.key];
    delete _pieces[from.key];
    return new Board(_pieces);
  };

  this.taking = function (from, to) {
    var _pieces = (0, _outil.objCopy)(pieces);

    _pieces[to.key] = _pieces[from.key];
    delete _pieces[from.key];
    return new Board(_pieces);
  };

  this.promote = function (pos) {
    var _pawn = pieces[pos.key];

    if (!_pawn) {
      return null;
    }

    if (_pawn.role !== 'pawn') {
      return null;
    }

    var b2 = _this.take(pos),
        b3 = _this.place({
      color: _pawn.color,
      role: 'queen'
    }, pos);

    return b3;
  };

  this.actorsOf = function () {
    var _partition = (0, _outil.partition)(Object.values(_this.actors), function (_) {
      return _.color === 'white';
    }),
        _partition2 = _slicedToArray(_partition, 2),
        white = _partition2[0],
        black = _partition2[1];

    return {
      white: white,
      black: black
    };
  };

  this.kingPosOf = function (color) {
    var res = Object.keys(pieces).find(function (_) {
      var piece = pieces[_];
      return piece.color === color && piece.role === 'king';
    });
    return _pos.Pos.fromKey(res);
  };

  this.actorAt = function (pos) {
    return _this.actors[pos];
  };

  this.pieces = pieces;
  this.actors = (0, _outil.objMap)(pieces, function (pos, piece) {
    return _defineProperty({}, pos, new _actor["default"](piece, _pos.Pos.fromKey(pos), _this));
  });

  this.apply = function (pos) {
    return pieces[pos];
  };

  this.toFen = function () {
    var res = '';

    for (var i = 0; i < 8; i++) {
      var spaces = 0;

      for (var j = 0; j < 8; j++) {
        var pos = util.allKeysFenOrder[i * 8 + j];

        var piece = _this.apply(pos);

        if (!piece) {
          spaces++;
          continue;
        }

        if (spaces > 0) {
          res += spaces;
          spaces = 0;
        }

        res += (0, _piece.forsyth)(piece);
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

Board.init = function () {
  return Board.fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
};

Board.fromFen = function (fen) {
  var _util$readFen = util.readFen(fen),
      pieces = _util$readFen.pieces,
      color = _util$readFen.color;

  return new Board(pieces, color);
};