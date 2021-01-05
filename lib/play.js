"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Play;

var _valid = require("./valid");

var _outil = require("./outil");

var md = _interopRequireWildcard(require("./md"));

var _util = require("./util");

var _board = _interopRequireDefault(require("./board"));

var _situation = _interopRequireDefault(require("./situation"));

var _parser = require("./parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Game(games) {
  var _this = this;

  var initialBoard, line, base;

  this.init = function (_initialBoard, _line, _base) {
    initialBoard = _initialBoard;
    line = _line;
    base = _base;
    _this.initialPlyAsSituation = initialBoard ? _situation["default"].apply(initialBoard) : null;
    _this.line = line;
    _this.base = base;
    _this.basePly = line[0] ? line[0].ply - 1 : 0;
    _this.moves = [];
    _this.plies = [];
    _this.elies = [];
    _this.playedOut = false;
  };

  this.ply = function (ply) {
    return _this.plies[ply];
  };

  this.move = function (ply) {
    return _this.moves[ply];
  };

  this.ely = function (ply) {
    return _this.elies[ply];
  }; // assumes base games has been played


  this.play = function () {
    if (_this.playedOut) {
      return;
    }

    if (_this.initialPlyAsSituation) {
      _this.plies[_this.basePly] = _this.initialPlyAsSituation;
    }

    if (line.length > 0) {
      if (!_this.initialPlyAsSituation) {
        _this.initialPlyAsSituation = games.ply(_this.base, _this.basePly);
        _this.plies[_this.basePly] = _this.initialPlyAsSituation;
      }

      line.forEach(function (_ref) {
        var ply = _ref.ply,
            move = _ref.move;

        var beforePly = _this.ply(ply - 1);

        if (beforePly) {
          move.move(beforePly).fold(function (_) {
            _this.plies[ply] = _.situationAfter();
            _this.moves[ply] = _;
          }, function (_) {
            _this.elies[ply] = _;
          });
        } else {
          _this.elies[ply] = "No Situation found";
        }
      });
    }

    _this.playedOut = true;
    _this.depth = _this.moves.length;
  };
}

function GameBuilder() {
  var initialBoard, base;
  var line = [];

  this.define = function (_initialBoard, _base) {
    initialBoard = _initialBoard;
    base = _base;
  };

  this.addLine = function (_line) {
    line.push(_line);
  };

  this.build = function (games) {
    line = line.flatMap(function (_) {
      return _.flat().flatMap(function (_) {
        return _ ? _.copyMap(function (_) {
          return [_];
        }).getOrElse(function (_) {
          return [];
        }) : [];
      });
    }).sort(function (a, b) {
      return a - b;
    });
    var game = new Game(games);
    game.init(initialBoard, line, base);
    return game;
  };
}

function Games(play) {
  var _this2 = this;

  var codes;
  var games = {};

  this.games = function () {
    return games;
  };

  this.playUptoBase = function (game) {
    if (game.base) {
      _this2.playUptoBase(games[game.base]);
    }

    game.play();
  };

  this.lineDepth = function (game) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (games[game].base) {
      return 1 + _this2.lineDepth(games[game].base);
    } else {
      return depth;
    }
  };

  this.variationsOfBase = function (game) {
    var res = [];

    for (var variation in games) {
      if (games[variation].base === game) {
        res.push(variation);
      }
    }

    return res;
  };

  this.maxDepth = function (game) {
    var vs = _this2.variationsOfBase(game);

    if (vs.length === 0) {
      return games[game].depth;
    } else {
      return _this2.maxDepth(vs[0]);
    }
  };

  this.initialPly = function (game) {
    return games[game].initialPlyAsSituation;
  };

  this.ply = function (game, ply) {
    return games[game].ply(ply);
  };

  this.move = function (game, ply) {
    return games[game].move(ply);
  };

  this.err = function (game, ply) {
    return games[game].ely(ply);
  };

  this.init = function (as) {
    codes = extractCodes(as);
    codes.forEach(function (_) {
      var variation = _.variation,
          base = _.base,
          line = _.line,
          board = _.board;

      if (board) {
        var _b = new GameBuilder();

        _b.define(board);

        games[variation] = _b;
        return;
      }

      if (games[variation]) {
        var _b2 = games[variation];

        _b2.addLine(line);

        return;
      }

      var b = new GameBuilder();
      games[variation] = b;
      b.define(null, base);
      b.addLine(line);
    });
    games = (0, _outil.objMap)(games, function (_, b) {
      return _defineProperty({}, _, b.build(_this2));
    });
    (0, _outil.objForeach)(games, function (_, g) {
      _this2.playUptoBase(g);
    });
  };
}

function Play(_md) {
  var games = new Games(this);
  this.games = games;
  var as = md.parseMdFull(_md);
  readLines(as);
  games.init(as);
  this.lineDepth = games.lineDepth;

  this["export"] = function () {
    return {
      fens: exportFens(),
      depths: exportDepths()
    };
  };

  function exportDepths() {
    return (0, _outil.objMap)(games.games(), function (variation, game) {
      var res = games.maxDepth(variation);
      return _defineProperty({}, variation, res);
    });
  }

  function exportFens() {
    var res = {};
    (0, _outil.objForeach)(games.games(), function (variation, game) {
      var moves = game.moves;
      moves.forEach(function (_, i) {
        if (!_) {
          return;
        }

        var fen = _.situationBefore().toFen();

        if (!res[fen]) {
          res[fen] = [];
        }

        res[fen].push({
          variation: variation,
          uci: _.uci,
          ply: i
        });
      });
    });
    return res;
  }

  ;

  this.vMove = function (variation, ply) {
    var err = games.err(variation, ply),
        move = games.move(variation, ply);

    if (err) {
      return (0, _valid.invalid)(err);
    } else {
      return (0, _valid.valid)(move);
    }
  };

  this.plyInitial = function (variation) {
    return games.initialPly(variation);
  };
}

function extractCodes(as) {
  return as.filter(function (_) {
    return _.type === md.Paragraph;
  }).flatMap(function (_) {
    return _.content;
  }).filter(function (_) {
    return _.type === md.Code;
  }).map(function (_) {
    return _.content;
  });
}

function readLines(as) {
  as.forEach(function (_) {
    switch (_.type) {
      case md.Paragraph:
        _.content.forEach(function (_) {
          switch (_.type) {
            case md.Code:
              if ((0, _util.isFen)(_.content.line)) {
                _.content.board = _board["default"].fromFen(_.content.line);
              } else {
                _.content.line = (0, _parser.parseLine)(_.content.line);
              }

              break;

            case md.Text:
              break;
          }

          return _;
        });

        break;

      case md.Heading:
        break;

      case md.Ply:
        break;
    }

    return _;
  });
}