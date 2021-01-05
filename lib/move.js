"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Move;

var util = _interopRequireWildcard(require("./util"));

var _situation = _interopRequireDefault(require("./situation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Move(_ref) {
  var _this = this;

  var piece = _ref.piece,
      orig = _ref.orig,
      dest = _ref.dest,
      situationBefore = _ref.situationBefore,
      after = _ref.after,
      capture = _ref.capture,
      promotion = _ref.promotion,
      castle = _ref.castle,
      enpassant = _ref.enpassant;
  this.piece = piece;
  this.orig = orig;
  this.dest = dest;
  this.color = piece.color;
  this.uci = this.orig.key + this.dest.key;

  this.situationBefore = function () {
    return situationBefore;
  };

  this.after = function () {
    return after;
  };

  this.before = function () {
    return situationBefore.board;
  };

  this.situationAfter = function () {
    return new _situation["default"](finalizeAfter(), util.flip(piece.color));
  };

  function finalizeAfter() {
    return after;
  }

  ;

  this.withPromotion = function (op) {
    return _this;
  };

  this.copy = function (data) {
    if (data.after) {
      after = data.after;
    }

    if (data.promotion) {
      promotion = data.promotion;
    }

    return _this;
  };
}