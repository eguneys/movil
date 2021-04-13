import { Engine } from 'node-uci';
import { IMover } from './mover';

export default class EngineMover implements IMover {

  engine: Engine
  ready: boolean = false
  queue: Promise<string|undefined>
  
  constructor(path: string) {

    this.engine = new Engine(path);

    this.queue = Promise.resolve('');
  }

  async init() {
    await this.engine.init();
    await this.engine.isready();

    this.ready = true;
  }

  private async quit() {
    await this.engine.quit();
    this.ready = false;
  }

  private async baseMove(position: string, moves: Array<string>) {

    if (!this.ready) {
      await this.init();
    }

    await this.engine.position(position, moves);
    return this.engine.go({depth: 8}).then(_ => {
      return _.bestmove;
    });
  }

  async move(position: string, moves: Array<string>) {
    this.queue = this.queue.then(() =>
      this.baseMove(position, moves));

    return this.queue;
  }
  
}
