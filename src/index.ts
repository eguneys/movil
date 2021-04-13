import { Bot, psu } from 'tobil';
import Oper from './bot';
import { config } from './conf';
import fs from 'fs';
import path from 'path';
import { IMover } from './mover';
import EngineMover from './engine';

export default async function app() {

  let { token,
        botId,
        acceptOptions,
        timeout,
        enginePath } = config;

  let defaultMover: IMover;

  try {
    enginePath = path.join(__dirname, enginePath);
    if (!fs.existsSync(enginePath)) {
      throw new Error('Engine not found ' + enginePath);
    }
    defaultMover = new EngineMover(enginePath);
    await defaultMover.init();
  } catch (e) {
    console.log(`Fail Engine ${e}`);
    process.exit(1);
  }
  
  
  let _psu = psu.playStateUpdate(botId, Oper(defaultMover));

  let bot = new Bot(token, _psu);

  function step() {
    console.log(`Listening challenges..`);
    bot
      .acceptChallenges(acceptOptions, timeout)
      .then(() => step)
      .catch(e => {
        console.error(`[Fail accept challenges] ${e}`);
        process.exit(1);
      });
  }

  step();
  
};
