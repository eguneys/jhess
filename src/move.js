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

  this.uci = this.orig.key + this.dest.key;
  
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
