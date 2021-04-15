import { tot } from 'tobil';
import { at } from 'apil';

export interface IMover {
  greeting: string,
  init(): Promise<void>;
  move(position: string, moves: Array<string>, state: tot.PlayState): Promise<Array<tot.PlayStateAction> | undefined>
  chat(chat: at.ChatLine): Promise<Array<tot.PlayStateAction>>
  abort(status: at.GameStatus, state: tot.PlayState): Promise<void>
}

class NonMover implements IMover {
  greeting = '';

  constructor() {}
  
  async init() { }
  async move() { return undefined }
  async chat() { return [] }
  async abort() { }
}

export const nonMover = new NonMover();
