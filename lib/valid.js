"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toValid = toValid;
exports.valid = valid;
exports.invalid = invalid;

function toValid(value, _invalid) {
  return value ? valid(value) : invalid(_invalid);
}

;

function valid(value) {
  return new Validation(null, value);
}

;

function invalid(invalid) {
  return new Validation(invalid);
}

;

function Validation(a_invalid, a_valid) {
  var _this = this;

  this.invalid = a_invalid;
  this.valid = a_valid;

  var makeInvalid = function makeInvalid(_invalid) {
    a_valid = null;
    a_invalid = _invalid;
    _this.invalid = a_invalid;
    _this.valid = a_valid;
  };

  var makeValid = function makeValid(_valid) {
    a_valid = _valid;
    a_invalid = null;
    _this.valid = a_valid;
    _this.invalid = a_invalid;
  };

  this.flatMap = function (fvalid) {
    var finvalid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_) {
      return invalid(_);
    };
    return _this.valid ? fvalid(_this.valid) : finvalid(_this.invalid);
  };

  this.fold = function (fvalid) {
    var finvalid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_) {
      return _;
    };
    return _this.valid ? fvalid(_this.valid) : finvalid(_this.invalid);
  };

  this.rawMap = function (fvalid) {
    if (_this.valid) {
      makeValid(fvalid(_this.valid));
    }

    return _this;
  };

  this.map = function (fvalid) {
    return _this.copy().rawMap(fvalid);
  };

  this.check = function (ftest, _invalid) {
    if (_this.valid && ftest(_this.valid)) {
      makeInvalid(_invalid);
    }

    return _this;
  };

  this.checkOr = function (ftest1, ftest2, _invalid) {
    if (_this.valid && !(ftest1(_this.valid) || ftest2(_this.valid))) {
      makeInvalid(_invalid);
    }

    return _this;
  };

  this.getOrElse = function (_) {
    return _this.valid ? _this.valid : _();
  };

  this.copy = function () {
    return new Validation(_this.invalid, _this.valid);
  };

  this.copyMap = function (fvalid) {
    return _this.copy().map(fvalid);
  };
}