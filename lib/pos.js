"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Role = exports.King = exports.Queen = exports.Rook = exports.Bishop = exports.Knight = exports.Pawn = exports.Pos = exports.Rank = exports.File = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function FileKlass(index) {
  this.index = index;
  this["char"] = String.fromCharCode(97 + index);
}

;

function RankKlass(index) {
  this.index = index;
  this["char"] = String.fromCharCode(49 + index);
}

;
var File = {
  A: new FileKlass(0),
  B: new FileKlass(1),
  C: new FileKlass(2),
  D: new FileKlass(3),
  E: new FileKlass(4),
  F: new FileKlass(5),
  G: new FileKlass(6),
  H: new FileKlass(7),
  of: function of(pos) {
    return new FileKlass(pos.index & 0x7);
  }
};
exports.File = File;
var Rank = {
  of: function of(pos) {
    return new RankKlass(pos.index >> 3);
  },
  Eight: new RankKlass(7),
  First: new RankKlass(0)
};
exports.Rank = Rank;

function PosKlass(index) {
  var _this = this;

  this.index = index;
  var file = File.of(this);
  var rank = Rank.of(this);
  this.file = file;
  this.rank = rank;
  this.key = file["char"] + rank["char"];

  this.hore = function (stop, dir) {
    var p = dir(_this);

    if (!p) {
      return [];
    }

    return [p].concat(_toConsumableArray(stop(p) ? [] : p.hore(stop, dir)));
  };

  this.righte = function (stop) {
    return _this.hore(stop, function (_) {
      return _.right();
    });
  };

  this.lefte = function (stop) {
    return _this.hore(stop, function (_) {
      return _.left();
    });
  };

  this.down = function () {
    return Pos.at(file.index, rank.index - 1);
  };

  this.left = function () {
    return Pos.at(file.index - 1, rank.index);
  };

  this.downLeft = function () {
    return Pos.at(file.index - 1, rank.index - 1);
  };

  this.downRight = function () {
    return Pos.at(file.index + 1, rank.index - 1);
  };

  this.up = function () {
    return Pos.at(file.index, rank.index + 1);
  };

  this.right = function () {
    return Pos.at(file.index + 1, rank.index);
  };

  this.upLeft = function () {
    return Pos.at(file.index - 1, rank.index + 1);
  };

  this.upRight = function () {
    return Pos.at(file.index + 1, rank.index + 1);
  };
}

;
var Pos = {
  apply: function apply(index) {
    return new PosKlass(index);
  },
  atfr: function atfr(file, rank) {
    return new PosKlass(file.index + 8 * rank.index);
  },
  at: function at(x, y) {
    if (0 <= x && x < 8 && 0 <= y && y < 8) return new PosKlass(x + 8 * y);else return null;
  }
};
exports.Pos = Pos;
var allIndexes = [];

for (var i = 0; i < 64; i++) {
  allIndexes.push(i);
}

Pos.all = allIndexes.map(function (_) {
  return new PosKlass(_);
}), Pos.allKeys = {};
Pos.all.forEach(function (pos) {
  return Pos.allKeys[pos.key] = pos;
});

Pos.fromKey = function (_) {
  return Pos.allKeys[_];
};

Pos.A1 = new PosKlass(0);
Pos.B1 = new PosKlass(1);
Pos.C1 = new PosKlass(2);
var Pawn = {
  forsyth: 'p',
  roleString: 'pawn'
};
exports.Pawn = Pawn;
var Knight = {
  color: function color(_color) {
    return {
      role: 'knight',
      color: _color
    };
  },
  forsyth: 'n',
  roleString: 'knight',
  dirs: [function (_) {
    return Pos.at(_.file.index - 1, _.rank.index + 2);
  }, function (_) {
    return Pos.at(_.file.index - 1, _.rank.index - 2);
  }, function (_) {
    return Pos.at(_.file.index + 1, _.rank.index + 2);
  }, function (_) {
    return Pos.at(_.file.index + 1, _.rank.index - 2);
  }, function (_) {
    return Pos.at(_.file.index - 2, _.rank.index + 1);
  }, function (_) {
    return Pos.at(_.file.index - 2, _.rank.index - 1);
  }, function (_) {
    return Pos.at(_.file.index + 2, _.rank.index + 1);
  }, function (_) {
    return Pos.at(_.file.index + 2, _.rank.index - 1);
  }]
};
exports.Knight = Knight;
var Bishop = {
  color: function color(_color2) {
    return {
      role: 'bishop',
      color: _color2
    };
  },
  forsyth: 'b',
  roleString: 'bishop',
  dirs: [function (_) {
    return _.upLeft();
  }, function (_) {
    return _.upRight();
  }, function (_) {
    return _.downLeft();
  }, function (_) {
    return _.downRight();
  }]
};
exports.Bishop = Bishop;
var Rook = {
  color: function color(_color3) {
    return {
      role: 'rook',
      color: _color3
    };
  },
  forsyth: 'r',
  roleString: 'rook',
  dirs: [function (_) {
    return _.up();
  }, function (_) {
    return _.down();
  }, function (_) {
    return _.left();
  }, function (_) {
    return _.right();
  }]
};
exports.Rook = Rook;
var Queen = {
  color: function color(_color4) {
    return {
      role: 'queen',
      color: _color4
    };
  },
  forsyth: 'q',
  roleString: 'queen',
  dirs: [Rook.dirs, Bishop.dirs].flat()
};
exports.Queen = Queen;
var King = {
  color: function color(_color5) {
    return {
      role: 'king',
      color: _color5
    };
  },
  forsyth: 'k',
  roleString: 'king',
  dirs: Queen.dirs
};
exports.King = King;
var Role = {
  all: [King, Queen, Bishop, Rook, Pawn, Knight]
};
exports.Role = Role;
Role.allByRole = {};
Role.all.forEach(function (role) {
  return Role.allByRole[role.roleString] = role;
});
Role.allByForsyth = {};
Role.all.forEach(function (role) {
  return Role.allByForsyth[role.forsyth] = role;
});

Role.forsyth = function (_) {
  return Role.allByForsyth[_];
};