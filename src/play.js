import { valid, invalid } from './valid';
import { objMap, objForeach } from './outil';
import * as md from './md';
import { isFen } from './util';
import Board from './board';
import Situation from './situation';
import { parseLine } from './parser';

function Game(games) {

  let initialBoard,
      line,
      base;

  this.init = (_initialBoard, _line, _base) => {
    initialBoard = _initialBoard;
    line = _line;
    base = _base;

    this.initialPlyAsSituation = initialBoard ? Situation.apply(initialBoard) : null;
    this.line = line;
    this.base = base;

    this.basePly = line[0] ? line[0].ply - 1 : 0;

    this.moves = [];

    this.plies = [];

    this.elies = [];

    this.playedOut = false;
  };

  this.ply = (ply) => this.plies[ply];
  this.move = (ply) => this.moves[ply];
  this.ely = (ply) => this.elies[ply];

  // assumes base games has been played
  this.play = () => {

    if (this.playedOut) {
      return;
    }

    if (this.initialPlyAsSituation) {
      this.plies[this.basePly] = this.initialPlyAsSituation;
    }

    if (line.length > 0) {
      if (!this.initialPlyAsSituation) {
        this.initialPlyAsSituation = games.ply(this.base, this.basePly);
        this.plies[this.basePly] = this.initialPlyAsSituation;
      }

      line.forEach(({ ply, move }) => {
        let beforePly = this.ply(ply - 1);
        if (beforePly) {
          move.move(beforePly).fold(_ => {
            this.plies[ply] = _.situationAfter();
            this.moves[ply] = _;
          }, _ => {
            this.elies[ply] = _;
          });
        } else {
          this.elies[ply] = "No Situation found";
        }
      });
    }

    this.playedOut = true;
    this.depth = this.moves.length;
  };

}

function GameBuilder() {
  let initialBoard,
      base;
  let line = [];

  this.define = (_initialBoard, _base) => {
    initialBoard = _initialBoard;
    base = _base;
  };

  this.addLine = (_line) => {
    line.push(_line);
  };

  this.build = (games) => {
    line = line.flatMap(_ => 
      _.flat()
        .flatMap(_ => _ ? _.copyMap(_ => [_])
                 .getOrElse(_ => []): 
                 [])
    ).sort((a, b) => a - b);

    let game = new Game(games);

    game.init(initialBoard, line, base);

    return game;
  };
}

function Games(play) {

  let codes;
  let games = {};

  this.games = () => games;

  this.playUptoBase = (game) => {
    if (game.base) {
      this.playUptoBase(games[game.base]);
    }

    game.play();
  };

  this.lineDepth = (game, depth = 0) => {
    if (games[game].base) {
      return 1 + this.lineDepth(games[game].base);
    } else {
      return depth;
    }
  };

  this.variationsOfBase = game => {
    let res = [];
    for (let variation in games) {
      if (games[variation].base === game) {
        res.push(variation);
      }
    }
    return res;
  };

  this.maxDepth = (game) => {
    let vs = this.variationsOfBase(game);

    if (vs.length === 0) {
      return games[game].depth;
    } else {
      return this.maxDepth(vs[0]);
    }
  };

  this.initialPly = (game) => games[game].initialPlyAsSituation;
  this.ply = (game, ply) => games[game].ply(ply);
  this.move = (game, ply) => games[game].move(ply);
  this.err = (game, ply) => games[game].ely(ply);

  this.init = as => {
    codes = extractCodes(as);

    codes.forEach(_ => {
      let {variation, base, line, board } = _;

      if (board) {
        let b = new GameBuilder();

        b.define(board);

        games[variation] = b;
        return;
      }

      if (games[variation]) {
        let b = games[variation];

        b.addLine(line);
        return;
      }

      let b = new GameBuilder();
      games[variation] = b;

      b.define(null, base);
      b.addLine(line);

    });

    games = objMap(games, (_, b) => 
      ({ [_]: b.build(this) }));

    objForeach(games, (_, g) => {
      this.playUptoBase(g);
    });
  };
  
}

export default function Play(_md) {

  let games = new Games(this);
  this.games = games;

  let as = md.parseMdFull(_md);
  readLines(as);

  games.init(as);

  this.lineDepth = games.lineDepth;

  this.export = () => {
    return {
      fens: exportFens(),
      depths: exportDepths()
    };
  };

  function exportDepths() {

    return objMap(games.games(), (variation, game) => {
      let res = games.maxDepth(variation);
      return { [variation]: res };
    });
  }

  function exportFens() {
    let res = {};

    objForeach(games.games(), (variation, game) => {

      let moves = game.moves;

      moves.forEach((_, i) => {

        if (!_) {
          return;
        }

        let fen = _.situationBefore().toFen();

        if (!res[fen]) {
          res[fen] = [];
        }

        res[fen].push({
          variation,
          uci: _.uci,
          ply: i
        });
      });
    });
    return res;
  };

  this.vMove = (variation, ply) => {
    let err = games.err(variation, ply),
        move = games.move(variation, ply);

    if (err) {
      return invalid(err);
    } else {
      return valid(move);
    }
  };

  this.plyInitial = (variation) => {
    return games.initialPly(variation);
  };
}

function extractCodes(as) {
  return as.filter(_ => _.type === md.Paragraph)
    .flatMap(_ => _.content)
    .filter(_ => _.type === md.Code)
    .map(_ => _.content);
}

function readLines(as) {

  as.forEach(_ => {
    switch(_.type) {
    case md.Paragraph:
      _.content.forEach(_ => {
        switch (_.type) {
        case md.Code:

          if (isFen(_.content.line)) {
            _.content.board = Board.fromFen(_.content.line);
          } else {
            _.content.line = parseLine(_.content.line);
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
