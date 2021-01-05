"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forsyth = void 0;
var white = 'white',
    black = 'black';
var allForsyth = {
  'pawn': 'p',
  'bishop': 'b',
  'king': 'k',
  'knight': 'n',
  'rook': 'r',
  'queen': 'q'
};

var forsyth = function forsyth(piece) {
  var res = allForsyth[piece.role];

  if (piece.color === white) {
    res = res.toUpperCase();
  }

  return res;
};

exports.forsyth = forsyth;