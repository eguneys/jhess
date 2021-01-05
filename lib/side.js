"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueenSide = exports.KingSide = void 0;

var _pos = require("./pos");

var KingSide = {
  name: 'king',
  castledKingFile: _pos.File.G,
  castledRookFile: _pos.File.F,
  tripToRook: function tripToRook(kingPos, board) {
    return kingPos.righte(function (_) {
      return board.pieces[_.key];
    });
  }
};
exports.KingSide = KingSide;
var QueenSide = {
  name: 'queen',
  castledKingFile: _pos.File.C,
  castledRookFile: _pos.File.D,
  tripToRook: function tripToRook(kingPos, board) {
    return kingPos.lefte(function (_) {
      return board.pieces[_.key];
    });
  }
};
exports.QueenSide = QueenSide;