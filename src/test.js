import Play from './play';
import Board from './board';
import Situation from './situation';

import * as fixtures from './fixtures';

export default () => {
  let play = new Play(fixtures.content);

  console.log(play.export().depths);

  let situation = Situation.apply();

  // console.log(situation.move('e2e4'));

};
