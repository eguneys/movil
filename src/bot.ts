import { at } from 'apil';
import { tot } from 'tobil';
import { IMover } from './mover';

export default function Oper(defaultMover: IMover) {

  async function move(turn: at.Color, state: tot.PlayState) {
    if (turn === state.pov) {
      let move = await defaultMover.move(state.initialFen, state.moves.split(' '));

      if (move) {
        return [
          move
        ];
      }
    }
    return [];
  };

  async function chat(_: at.ChatLine) {
    return [];
  }

  return {
    move,
    chat
  };
}
