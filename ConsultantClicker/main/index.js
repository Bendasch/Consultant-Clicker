import { initialize } from './utils/initialize.js'
import { render } from './render/main.js'
import { gameLogic } from './logic/main.js'
import { sleep, setTime } from './utils/utils.js'
import { saveGame } from './logic/infra.js'

// this is the main game loop
const main = (tick, start, cycle) => {  

  const saveCycles = 250
  const T_START = (new Date()).getTime()
  var delta = T_START - start

  // game logic cycle
  gameLogic(tick, cycle)
  setTime("update", T_START)

  // render cycle
  const T_PRE_RENDER = (new Date()).getTime()
  render()
  setTime("render", T_PRE_RENDER)

  // save the game every so many cycles
  if ((cycle % saveCycles) == 0) { saveGame() }

  // queue next cycle
  sleep(2 * tick - delta).then(() => main(tick, T_START, cycle + 1));
}

// on start-up, the game data is first prepared
// then the first game cycle is started
initialize().then( () => {
  const TICK = 20;
  setTime("tick", TICK);
  const d = new Date();
  main(TICK, d.getTime(), 0);
});