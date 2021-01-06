import Play from './play';
import Board from './board';
import Situation from './situation';
import { parseUci } from './parser';

import * as fixtures from './fixtures';

export default () => {
  let play = new Play(fixtures.content);

  // console.log(play.export().fens);

  let situation = Situation.apply();

  // parseUci('e2e4').fold(_ => 
  //   _.move(situation).fold(console.log,
  //                          console.error)      
  //   ,console.error);


  situation = Situation.apply(Board.fromFen('rnbqk2r/ppppp1Pp/3pp3/3b1n2/1QB5/1N1BN3/PPPPPP1P/R3K2R w KQkq - 0 1'));

  // castles
  parseUci('e1g1').fold(_ => 
    _.move(situation).fold(_ => {
      console.log(_.uci);
    }, console.error)      
    ,console.error);


  // long castles
  parseUci('e1c1').fold(_ => 
    _.move(situation).fold(_ => {
      console.log(_.uci);
    }, console.error)      
    ,console.error);

  // promotion
  parseUci('g7h8n').fold(_ => 
    _.move(situation).fold(_ => {
      console.log(_.uci);      
    }, console.error)      
    ,console.error);


  // console.log(situation.move('e2e4'));

};
