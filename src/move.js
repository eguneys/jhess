import * as util from './util';
import Situation from './situation';

export default function Move({
  piece,
  orig,
  dest,
  situationBefore,
  after,
  capture,
  promotion,
  castle,
  enpassant
}) {

  this.piece = piece;
  this.orig = orig;
  this.dest = dest;

  this.color = piece.color;

  this.promotion = promotion;

  if (promotion) {
  } else {
    this.uci = this.orig.key + this.dest.key;
  }
  
  this.situationBefore = () => situationBefore;
  this.after = () => after;
  this.before = () => situationBefore.board;
  this.situationAfter = () => 
  new Situation(finalizeAfter(), 
                util.flip(piece.color));

  function finalizeAfter() {
    return after;
  };


  this.withPromotion = op => {

    if (!op) {
      return this;
    }

    let b2 = after.take(dest),
        b3 = b2.place(op.color(this.color), dest);

    after = b3;
    promotion = this.promotion = op;

    this.uci += op.forsyth;

    return this;
  };

  this.copy = (data) => {
    if (data.after) {
      after = data.after;
    }

    if (data.promotion) {
      promotion = data.promotion;
    }

    return this;
  };
  

}
