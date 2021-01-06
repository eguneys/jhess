"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _play = _interopRequireDefault(require("./play"));

var _board = _interopRequireDefault(require("./board"));

var _situation = _interopRequireDefault(require("./situation"));

var _parser = require("./parser");

var fixtures = _interopRequireWildcard(require("./fixtures"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default() {
  var play = new _play["default"](fixtures.content); // console.log(play.export().fens);

  var situation = _situation["default"].apply(); // parseUci('e2e4').fold(_ => 
  //   _.move(situation).fold(console.log,
  //                          console.error)      
  //   ,console.error);


  situation = _situation["default"].apply(_board["default"].fromFen('rnbqk2r/ppppp1Pp/3pp3/3b1n2/1QB5/1N1BN3/PPPPPP1P/R3K2R w KQkq - 0 1')); // castles

  (0, _parser.parseUci)('e1g1').fold(function (_) {
    return _.move(situation).fold(function (_) {
      console.log(_.uci);
    }, console.error);
  }, console.error); // long castles

  (0, _parser.parseUci)('e1c1').fold(function (_) {
    return _.move(situation).fold(function (_) {
      console.log(_.uci);
    }, console.error);
  }, console.error); // promotion

  (0, _parser.parseUci)('g7h8n').fold(function (_) {
    return _.move(situation).fold(function (_) {
      console.log(_.uci);
    }, console.error);
  }, console.error); // console.log(situation.move('e2e4'));
};

exports["default"] = _default;