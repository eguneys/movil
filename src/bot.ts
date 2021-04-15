import { at } from 'apil';
import { tot } from 'tobil';
import { IMover } from './mover';

export default class Oper implements tot.PlayStateUpdate {

  stockfish: IMover
  book: IMover
  
  constructor(stockfish: IMover, book: IMover) {
    this.stockfish = stockfish;
    this.book = book;
  }

  async move(turn: at.Color, state: tot.PlayState) {
    if (turn === state.pov) {

      let fen = state.initialFen,
      moves = state.moves === ''?[] :state.moves.split(' ');
      
      let res = await this.book.move(fen, moves, state) || [];
      let hasMove = res.find(tot.isPlayStateMove);
      
      if (!hasMove) {
        let _res = await this.stockfish.move(fen, moves, state);
        if (_res) {
          return res.concat(_res);
        } else {
          return Promise.reject('No Stockfish move');
        }
      } else {
        return res;
      }
    } else {
      return Promise.resolve([]);
    }
  };

  async chat(_: at.ChatLine) {
    return this.book.chat(_);
  }

  async abort(_: at.GameStatus, state: tot.PlayState) {
    return Promise.all([this.book.abort(_, state),
                        this.stockfish.abort(_, state)]).then(() => {});
  }
}
