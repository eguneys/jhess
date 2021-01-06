import { valid, invalid, toValid } from './valid';


export function Uci(fromPos, toPos, promotion) {

  let from = fromPos.key,
      to = toPos.key;

  this.move = (situation) => {

    function findMove(from, to) {
      let fromMoves = situation.moves()[from];

      if (fromMoves) {
        return fromMoves.find(_ => _.dest.key === to);
      }
      return null;
    }

    let vActor = 
        toValid(situation.board.actors[from], `No piece on ${from}`);

    let _ = vActor.flatMap(actor => {
      return (actor.color === situation.color) ?
        valid(actor) :
        invalid("Not my piece on " + from);
    });


    let m1 = _.flatMap(actor => 
      toValid(findMove(from, to), 
              `Piece on ${from} cannot move to ${to}`)
    );

    return m1.flatMap(_ =>
      toValid(_.withPromotion(promotion), `Piece on ${from} cannot promote to ${promotion}`)
    );
  };
  
}
