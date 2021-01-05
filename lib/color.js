"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promotablePawnRank = promotablePawnRank;
exports.colorToFen = colorToFen;

var _pos = require("./pos");

function promotablePawnRank(color) {
  if (color === 'white') {
    return _pos.Rank.Eight;
  } else {
    return _pos.Rank.First;
  }
}

function colorToFen(color) {
  return color === 'white' ? 'w' : 'b';
}