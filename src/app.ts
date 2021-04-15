import { Bot, psu } from 'tobil';
import Oper from './bot';
import fs from 'fs';
import path from 'path';
import { IMover, nonMover } from './mover';
import EngineMover from './engine';

export default async function app(config: any, book: IMover = nonMover) {

  let { token,
        botId,
        acceptOptions,
        timeout,
        enginePath } = config;

  let stockfish: IMover;
  
  try {
    enginePath = path.join(__dirname, enginePath);
    if (!fs.existsSync(enginePath)) {
      throw new Error('Engine not found ' + enginePath);
    }
    stockfish = new EngineMover(enginePath);
    await stockfish.init();
  } catch (e) {
    console.log(`Failed loading default engine ${e}`);
    process.exit(1);
  }

  let _psu = psu.playStateUpdate(botId, new Oper(stockfish, book));

  let bot = new Bot(token, _psu);

  function step() {
    console.log(`Listening challenges..`);
    bot
      .acceptChallenges(acceptOptions, timeout)
      .then(step)
      .catch(e => {
        console.error(`[Fail accept challenges] ${e}`);
        process.exit(1);
      });
  }

  step();
  
};
