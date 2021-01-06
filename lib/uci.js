"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uci = Uci;

var _valid = require("./valid");

function Uci(fromPos, toPos, promotion) {
  var from = fromPos.key,
      to = toPos.key;

  this.move = function (situation) {
    function findMove(from, to) {
      var fromMoves = situation.moves()[from];

      if (fromMoves) {
        return fromMoves.find(function (_) {
          return _.dest.key === to;
        });
      }

      return null;
    }

    var vActor = (0, _valid.toValid)(situation.board.actors[from], "No piece on ".concat(from));

    var _ = vActor.flatMap(function (actor) {
      return actor.color === situation.color ? (0, _valid.valid)(actor) : (0, _valid.invalid)("Not my piece on " + from);
    });

    var m1 = _.flatMap(function (actor) {
      return (0, _valid.toValid)(findMove(from, to), "Piece on ".concat(from, " cannot move to ").concat(to));
    });

    return m1.flatMap(function (_) {
      return (0, _valid.toValid)(_.withPromotion(promotion), "Piece on ".concat(from, " cannot promote to ").concat(promotion));
    });
  };
}