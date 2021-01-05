"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Situation;

var _valid = require("./valid");

var _board = _interopRequireDefault(require("./board"));

var _actor = _interopRequireDefault(require("./actor"));

var _color = require("./color");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Situation(board, color) {
  this.board = board;
  this.color = color;
  var actors = board.actorsOf()[color];

  this.move = function (from, to) {
    if (!to) {
      to = from.substring(2, 4);
      from = from.substring(0, 2);
    }

    var actor = board.actorAt(from);
    return (0, _valid.toValid)(actor, "No piece at ".concat(from)).flatMap(function (_) {
      return (0, _valid.toValid)(_.pseudoValidMoves().find(function (_) {
        return _.dest.key === to;
      }), "Piece cannot move to ".concat(to));
    });
  };

  this.toFen = function () {
    var res = [board.toFen(), (0, _color.colorToFen)(color)].join(' ');
    return res;
  };
}

Situation.apply = function () {
  var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _board["default"].init();
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'white';
  return new Situation(board, color);
};