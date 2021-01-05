"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Std = Std;
exports.Castle = Castle;

var _valid = require("./valid");

var _outil = require("./outil");

var _pos = require("./pos");

var _actor = _interopRequireDefault(require("./actor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Std(dest, role, capture, file, rank, promotion, san) {
  this.san = san;
  this.dest = dest;
  this.role = role;
  this.capture = capture;
  this.file = file;
  this.rank = rank;
  this.promotion = promotion;

  this.move = function (situation) {
    var res = null;
    (0, _outil.objForeach)(situation.board.pieces, function (pos, piece) {
      if (res) {
        return;
      }

      if (piece.color === situation.color && piece.role === role.roleString && compare(file, _pos.Pos.fromKey(pos).file["char"]) && compare(rank, _pos.Pos.fromKey(pos).rank["char"])) {
        var a = new _actor["default"](piece, _pos.Pos.fromKey(pos), situation.board);
        res = a.pseudoValidMoves().find(function (m) {
          return m.dest.key === dest.key;
        });
      }
    });

    if (!res) {
      return (0, _valid.invalid)("No move found: ".concat(san));
    }

    return (0, _valid.toValid)(res.withPromotion(promotion), "Wrong promotion");
  };

  function compare(a, b) {
    return !a || a === b;
  }
}

function Castle(side, san) {
  this.san = san;
  this.side = side;

  this.move = function (situation) {
    return (0, _valid.toValid)(situation.board.kingPosOf(situation.color), "No king found").flatMap(function (kingPos) {
      return (0, _valid.toValid)(situation.board.actorAt(kingPos.key), "No Actor found").flatMap(function (actor) {
        return (0, _valid.toValid)(actor.castleOn(side)[0], "Cannot castle");
      });
    });
  };
}