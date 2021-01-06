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

  this.moves = function () {
    var res = {};
    actors.forEach(function (_) {
      var moves = _.pseudoValidMoves();

      if (moves.length > 0) {
        res[_.pos.key] = moves;
      }
    });
    return res;
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